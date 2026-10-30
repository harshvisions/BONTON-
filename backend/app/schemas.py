from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# -------------------------------------------------------------
# User & Authentication Schemas
# -------------------------------------------------------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=6, description="Password must be at least 6 characters")
    role: Optional[str] = Field(default="customer", description="'admin' or 'customer'")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: str
    sweet_credits: int
    is_active: bool
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None  # user id or email
    role: Optional[str] = None
    exp: Optional[int] = None


# -------------------------------------------------------------
# Item Schemas (CRUD)
# -------------------------------------------------------------
class ItemBase(BaseModel):
    name: str = Field(min_length=3, max_length=150)
    image_url: str
    base_price: Decimal = Field(gt=0, decimal_places=2)
    category: str = Field(min_length=2, max_length=50)
    description: Optional[str] = None
    stock: int = Field(default=20, ge=0)
    is_eggless: bool = True
    prep_time: str = "Ready in 2 Hours"
    is_active: bool = True


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    image_url: Optional[str] = None
    base_price: Optional[Decimal] = None
    category: Optional[str] = None
    description: Optional[str] = None
    stock: Optional[int] = None
    is_eggless: Optional[bool] = None
    prep_time: Optional[str] = None
    is_active: Optional[bool] = None


class ItemResponse(ItemBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------
# Discount Schemas (CRUD)
# -------------------------------------------------------------
class DiscountBase(BaseModel):
    item_id: int
    discount_value: Decimal = Field(gt=0, decimal_places=2, description="Percentage or flat value")
    discount_type: str = Field(default="percentage", description="'percentage' or 'flat'")
    expiration: datetime
    min_order: Decimal = Field(default=Decimal("0.00"), ge=0)
    max_discount: Decimal = Field(default=Decimal("500.00"), gt=0)
    is_active: bool = True


class DiscountCreate(DiscountBase):
    pass


class DiscountUpdate(BaseModel):
    discount_value: Optional[Decimal] = None
    discount_type: Optional[str] = None
    expiration: Optional[datetime] = None
    min_order: Optional[Decimal] = None
    max_discount: Optional[Decimal] = None
    is_active: Optional[bool] = None


class DiscountResponse(DiscountBase):
    id: int
    is_currently_valid: bool
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------
# Order Processing & Cart Calculation Schemas
# -------------------------------------------------------------
class CartItemIn(BaseModel):
    item_id: int
    quantity: int = Field(default=1, ge=1)
    custom_message: Optional[str] = Field(default=None, max_length=200)


class CalculatedItemOut(BaseModel):
    item_id: int
    item_name: str
    quantity: int
    unit_base_price: Decimal
    item_discount_applied: Decimal
    final_line_price: Decimal
    custom_message: Optional[str] = None


class OrderCalculateRequest(BaseModel):
    items: List[CartItemIn]
    promo_code: Optional[str] = None


class OrderCalculationResponse(BaseModel):
    items: List[CalculatedItemOut]
    subtotal: Decimal
    discount_amount: Decimal
    tax_amount: Decimal  # 5% GST
    delivery_fee: Decimal  # Free above 799
    total_price: Decimal
    free_delivery_eligible: bool


class OrderCreateRequest(BaseModel):
    items: List[CartItemIn]
    promo_code: Optional[str] = None
    customer_name: str
    customer_phone: str
    customer_email: Optional[EmailStr] = None
    delivery_address: str
    delivery_slot: str = "Standard (4:00 PM - 7:00 PM)"
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    item_id: int
    item_name: str
    quantity: int
    unit_price: Decimal
    discount_applied: Decimal
    final_price: Decimal
    custom_message: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    delivery_address: str
    delivery_slot: str
    subtotal: Decimal
    discount_amount: Decimal
    tax_amount: Decimal
    delivery_fee: Decimal
    total_price: Decimal
    fulfillment_status: str
    payment_status: str
    notes: Optional[str] = None
    items: List[OrderItemResponse]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
