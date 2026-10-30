import random
from datetime import datetime
from decimal import Decimal
from typing import List, Optional, Tuple
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import get_current_user, get_optional_current_user, require_admin
from app.models import Discount, Item, Order, OrderItem, User, UserRole
from app.schemas import (
    CalculatedItemOut,
    CartItemIn,
    OrderCalculateRequest,
    OrderCalculationResponse,
    OrderCreateRequest,
    OrderResponse,
)

router = APIRouter(prefix="/orders", tags=["Order Processing & Calculation"])

FREE_DELIVERY_THRESHOLD = Decimal("799.00")
STANDARD_DELIVERY_FEE = Decimal("99.00")
GST_RATE = Decimal("0.05")  # 5% Patisserie GST


def _compute_cart_from_db(
    items_in: List[CartItemIn],
    promo_code: Optional[str],
    db: Session,
) -> Tuple[List[CalculatedItemOut], Decimal, Decimal, Decimal, Decimal, Decimal]:
    """
    Secure server-side engine that queries real item prices and active discounts
    directly from PostgreSQL, completely ignoring any untrusted client calculations.
    """
    if not items_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty. Please provide at least one confection item.",
        )

    now = datetime.utcnow()
    calculated_items: List[CalculatedItemOut] = []
    subtotal = Decimal("0.00")
    total_item_discounts = Decimal("0.00")

    for cart_item in items_in:
        # 1. Fetch item from database by ID
        item = db.query(Item).filter(Item.id == cart_item.item_id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item ID {cart_item.item_id} not found in database.",
            )

        if not item.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Item '{item.name}' is currently unavailable.",
            )

        # 2. Check stock availability
        if item.stock < cart_item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{item.name}'. Available: {item.stock}, requested: {cart_item.quantity}.",
            )

        unit_price = Decimal(str(item.base_price))
        line_base = unit_price * Decimal(cart_item.quantity)
        subtotal += line_base

        # 3. Query active, valid discounts directly from database for this specific item
        active_discount = (
            db.query(Discount)
            .filter(
                Discount.item_id == item.id,
                Discount.is_active == True,
                Discount.expiration > now,
            )
            .order_by(Discount.discount_value.desc())
            .first()
        )

        item_discount = Decimal("0.00")
        if active_discount:
            disc_val = Decimal(str(active_discount.discount_value))
            if active_discount.discount_type == "percentage":
                # Percentage of unit price * quantity
                calculated_disc = (line_base * disc_val) / Decimal("100.00")
            else:
                # Flat discount per item line
                calculated_disc = disc_val

            # Cap discount at configured maximum discount
            max_cap = Decimal(str(active_discount.max_discount))
            item_discount = min(calculated_disc, max_cap, line_base)

        total_item_discounts += item_discount
        final_line = max(Decimal("0.00"), line_base - item_discount)

        calculated_items.append(
            CalculatedItemOut(
                item_id=item.id,
                item_name=item.name,
                quantity=cart_item.quantity,
                unit_base_price=round(unit_price, 2),
                item_discount_applied=round(item_discount, 2),
                final_line_price=round(final_line, 2),
                custom_message=cart_item.custom_message,
            )
        )

    # 4. Optional Global Promo Code Evaluation (e.g. BONTON20, SWEET10)
    promo_discount = Decimal("0.00")
    if promo_code:
        code_upper = promo_code.strip().upper()
        if code_upper in ("BONTON20", "ANTIGRAVITY20"):
            if subtotal >= Decimal("799.00"):
                promo_discount = min((subtotal * Decimal("20.00")) / Decimal("100.00"), Decimal("500.00"))
        elif code_upper == "SWEET10":
            if subtotal >= Decimal("399.00"):
                promo_discount = min((subtotal * Decimal("10.00")) / Decimal("100.00"), Decimal("300.00"))
        elif code_upper == "FIRSTSWEET":
            if subtotal >= Decimal("499.00"):
                promo_discount = min((subtotal * Decimal("15.00")) / Decimal("100.00"), Decimal("400.00"))

    # Cumulative discount (item-level discounts + validated promo code)
    total_discount = min(subtotal, total_item_discounts + promo_discount)
    net_taxable = max(Decimal("0.00"), subtotal - total_discount)

    # 5. Delivery Fee Calculation (Free above threshold)
    delivery_fee = Decimal("0.00") if subtotal >= FREE_DELIVERY_THRESHOLD else STANDARD_DELIVERY_FEE

    # 6. Taxes (5% GST on net taxable food amount)
    tax_amount = round(net_taxable * GST_RATE, 2)

    # 7. Final Grand Total Calculation
    total_price = round(net_taxable + delivery_fee + tax_amount, 2)

    return (
        calculated_items,
        round(subtotal, 2),
        round(total_discount, 2),
        round(tax_amount, 2),
        round(delivery_fee, 2),
        round(total_price, 2),
    )


@router.post("/calculate", response_model=OrderCalculationResponse)
def calculate_cart_price(
    calc_in: OrderCalculateRequest,
    db: Session = Depends(get_db),
):
    """
    Securely calculate cart subtotal, database discounts, delivery, GST, and total.
    Frontend math is strictly ignored in favor of database verification.
    """
    (
        calc_items,
        subtotal,
        discount_amount,
        tax_amount,
        delivery_fee,
        total_price,
    ) = _compute_cart_from_db(
        items_in=calc_in.items,
        promo_code=calc_in.promo_code,
        db=db,
    )

    return OrderCalculationResponse(
        items=calc_items,
        subtotal=subtotal,
        discount_amount=discount_amount,
        tax_amount=tax_amount,
        delivery_fee=delivery_fee,
        total_price=total_price,
        free_delivery_eligible=subtotal >= FREE_DELIVERY_THRESHOLD,
    )


@router.post("/checkout", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def process_order_checkout(
    order_in: OrderCreateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """
    Process and record an order securely:
    1. Validates real item base prices from PostgreSQL.
    2. Applies valid, unexpired database discounts.
    3. Decrements inventory stock.
    4. Writes Order and OrderItem records in a single database transaction.
    """
    (
        calc_items,
        subtotal,
        discount_amount,
        tax_amount,
        delivery_fee,
        total_price,
    ) = _compute_cart_from_db(
        items_in=order_in.items,
        promo_code=order_in.promo_code,
        db=db,
    )

    order_number = f"AG-{random.randint(100000, 999999)}"

    new_order = Order(
        order_number=order_number,
        user_id=current_user.id if current_user else None,
        customer_name=order_in.customer_name.strip(),
        customer_phone=order_in.customer_phone.strip(),
        customer_email=order_in.customer_email,
        delivery_address=order_in.delivery_address.strip(),
        delivery_slot=order_in.delivery_slot,
        subtotal=subtotal,
        discount_amount=discount_amount,
        tax_amount=tax_amount,
        delivery_fee=delivery_fee,
        total_price=total_price,
        fulfillment_status="Baking in Oven",
        payment_status="Paid",
        notes=order_in.notes,
    )

    db.add(new_order)
    db.flush()  # Generate new_order.id

    # Create OrderItems & decrement item inventory stock
    for c_item in calc_items:
        order_item = OrderItem(
            order_id=new_order.id,
            item_id=c_item.item_id,
            item_name=c_item.item_name,
            quantity=c_item.quantity,
            unit_price=c_item.unit_base_price,
            discount_applied=c_item.item_discount_applied,
            final_price=c_item.final_line_price,
            custom_message=c_item.custom_message,
        )
        db.add(order_item)

        # Decrement stock in database
        db_item = db.query(Item).filter(Item.id == c_item.item_id).first()
        if db_item:
            db_item.stock = max(0, db_item.stock - c_item.quantity)

    # Award Sweet Credits loyalty reward to authenticated patrons
    if current_user:
        earned_credits = int(total_price * Decimal("0.05"))
        current_user.sweet_credits += earned_credits

    db.commit()
    db.refresh(new_order)

    return OrderResponse.model_validate(new_order)


@router.get("", response_model=List[OrderResponse])
def list_orders(
    status_filter: Optional[str] = Query(None, description="Filter by fulfillment status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List orders. Customers view their own orders; Admins can view all orders.
    """
    query = db.query(Order)
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Order.user_id == current_user.id)

    if status_filter:
        query = query.filter(Order.fulfillment_status == status_filter)

    orders = query.order_by(Order.id.desc()).all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve full order details by ID."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found",
        )

    # Check permission: admin or order owner
    if current_user.role != UserRole.ADMIN and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You cannot view orders placed by other patrons",
        )

    return OrderResponse.model_validate(order)


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_fulfillment_status(
    order_id: int,
    new_status: str = Query(..., description="e.g. 'Ready for Dispatch', 'Out for Chilled Delivery', 'Delivered'"),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Advance or update order fulfillment status (Admin privileges required)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found",
        )

    order.fulfillment_status = new_status
    db.commit()
    db.refresh(order)
    return OrderResponse.model_validate(order)
