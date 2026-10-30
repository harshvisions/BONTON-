from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import require_admin
from app.models import Discount, Item, User
from app.schemas import DiscountCreate, DiscountResponse, DiscountUpdate

router = APIRouter(prefix="/discounts", tags=["Discounts CRUD"])


@router.get("", response_model=List[DiscountResponse])
def list_discounts(
    active_only: bool = Query(False, description="Filter for currently active and non-expired discounts"),
    item_id: Optional[int] = Query(None, description="Filter discounts associated with specific item"),
    db: Session = Depends(get_db),
):
    """Retrieve all discounts registered in the Discount Engine."""
    query = db.query(Discount)

    if item_id:
        query = query.filter(Discount.item_id == item_id)

    if active_only:
        now = datetime.utcnow()
        query = query.filter(Discount.is_active == True, Discount.expiration > now)

    discounts = query.order_by(Discount.id.desc()).all()
    return [
        DiscountResponse(
            id=d.id,
            item_id=d.item_id,
            discount_value=d.discount_value,
            discount_type=d.discount_type,
            expiration=d.expiration,
            min_order=d.min_order,
            max_discount=d.max_discount,
            is_active=d.is_active,
            is_currently_valid=d.is_currently_valid,
            created_at=d.created_at,
        )
        for d in discounts
    ]


@router.get("/{discount_id}", response_model=DiscountResponse)
def get_discount(discount_id: int, db: Session = Depends(get_db)):
    """Retrieve discount specification by its ID."""
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discount with ID {discount_id} not found"
        )
    return DiscountResponse(
        id=discount.id,
        item_id=discount.item_id,
        discount_value=discount.discount_value,
        discount_type=discount.discount_type,
        expiration=discount.expiration,
        min_order=discount.min_order,
        max_discount=discount.max_discount,
        is_active=discount.is_active,
        is_currently_valid=discount.is_currently_valid,
        created_at=discount.created_at,
    )


@router.post("", response_model=DiscountResponse, status_code=status.HTTP_201_CREATED)
def create_discount(
    discount_in: DiscountCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Create a new discount rule for an item (Admin privileges required)."""
    # Verify that the target Item exists in database
    target_item = db.query(Item).filter(Item.id == discount_in.item_id).first()
    if not target_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cannot attach discount: Item with ID {discount_in.item_id} does not exist in catalog"
        )

    # Validate expiration is in future
    now = datetime.now(discount_in.expiration.tzinfo) if discount_in.expiration.tzinfo else datetime.utcnow()
    if discount_in.expiration <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Discount expiration timestamp must be in the future"
        )

    new_discount = Discount(
        item_id=discount_in.item_id,
        discount_value=discount_in.discount_value,
        discount_type=discount_in.discount_type.lower().strip(),
        expiration=discount_in.expiration,
        min_order=discount_in.min_order,
        max_discount=discount_in.max_discount,
        is_active=discount_in.is_active,
    )

    db.add(new_discount)
    db.commit()
    db.refresh(new_discount)

    return DiscountResponse(
        id=new_discount.id,
        item_id=new_discount.item_id,
        discount_value=new_discount.discount_value,
        discount_type=new_discount.discount_type,
        expiration=new_discount.expiration,
        min_order=new_discount.min_order,
        max_discount=new_discount.max_discount,
        is_active=new_discount.is_active,
        is_currently_valid=new_discount.is_currently_valid,
        created_at=new_discount.created_at,
    )


@router.put("/{discount_id}", response_model=DiscountResponse)
def update_discount(
    discount_id: int,
    discount_in: DiscountUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Update existing discount parameters (Admin privileges required)."""
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discount with ID {discount_id} not found"
        )

    update_data = discount_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(discount, field, value)

    db.commit()
    db.refresh(discount)

    return DiscountResponse(
        id=discount.id,
        item_id=discount.item_id,
        discount_value=discount.discount_value,
        discount_type=discount.discount_type,
        expiration=discount.expiration,
        min_order=discount.min_order,
        max_discount=discount.max_discount,
        is_active=discount.is_active,
        is_currently_valid=discount.is_currently_valid,
        created_at=discount.created_at,
    )


@router.delete("/{discount_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_discount(
    discount_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Permanently delete discount rule (Admin privileges required)."""
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discount with ID {discount_id} not found"
        )

    db.delete(discount)
    db.commit()
    return None
