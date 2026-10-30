from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class UserRole:
    ADMIN = "admin"
    CUSTOMER = "customer"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=True)
    phone = Column(String(30), nullable=True)
    role = Column(String(20), nullable=False, default=UserRole.CUSTOMER, index=True)
    sweet_credits = Column(Integer, default=450)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    orders = relationship("Order", back_populates="user")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    image_url = Column(Text, nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=True)
    stock = Column(Integer, default=20, nullable=False)
    is_eggless = Column(Boolean, default=True, nullable=False)
    prep_time = Column(String(50), default="Ready in 2 Hours")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    discounts = relationship("Discount", back_populates="item", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="item")


class Discount(Base):
    __tablename__ = "discounts"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id", ondelete="CASCADE"), nullable=False, index=True)
    discount_value = Column(Numeric(10, 2), nullable=False)  # e.g., 20.00 for 20% or flat Rs 150
    discount_type = Column(String(20), default="percentage", nullable=False)  # "percentage" or "flat"
    expiration = Column(DateTime(timezone=True), nullable=False)
    min_order = Column(Numeric(10, 2), default=0.00)
    max_discount = Column(Numeric(10, 2), default=500.00)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    item = relationship("Item", back_populates="discounts")

    @property
    def is_currently_valid(self) -> bool:
        """Helper to verify if discount is active and not expired."""
        if not self.is_active:
            return False
        # Treat naive / aware comparisons safely
        now = datetime.now(self.expiration.tzinfo) if self.expiration.tzinfo else datetime.utcnow()
        return self.expiration > now


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    customer_name = Column(String(150), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    customer_email = Column(String(150), nullable=True)
    delivery_address = Column(Text, nullable=False)
    delivery_slot = Column(String(100), default="Standard (4:00 PM - 7:00 PM)")

    # Secure calculated totals from backend
    subtotal = Column(Numeric(10, 2), nullable=False)
    discount_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    tax_amount = Column(Numeric(10, 2), nullable=False, default=0.00)  # 5% GST
    delivery_fee = Column(Numeric(10, 2), nullable=False, default=0.00)
    total_price = Column(Numeric(10, 2), nullable=False)

    fulfillment_status = Column(String(50), default="Baking in Oven")
    payment_status = Column(String(50), default="Paid")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id", ondelete="RESTRICT"), nullable=False)
    item_name = Column(String(150), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)  # Verified DB price at checkout
    discount_applied = Column(Numeric(10, 2), nullable=False, default=0.00)
    final_price = Column(Numeric(10, 2), nullable=False)  # (unit_price * quantity) - discount
    custom_message = Column(String(200), nullable=True)

    # Relationships
    order = relationship("Order", back_populates="items")
    item = relationship("Item", back_populates="order_items")
