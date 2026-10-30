from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import require_admin
from app.models import Item, User
from app.schemas import ItemCreate, ItemResponse, ItemUpdate

router = APIRouter(prefix="/items", tags=["Items CRUD"])


@router.get("", response_model=List[ItemResponse])
def list_items(
    category: Optional[str] = Query(None, description="Filter by category e.g. cakes, pastries"),
    search: Optional[str] = Query(None, description="Search term matching item name or description"),
    is_eggless: Optional[bool] = Query(None, description="Filter eggless creations"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Retrieve all available atelier confection items with optional filtering (Public endpoint)."""
    query = db.query(Item).filter(Item.is_active == True)

    if category and category.lower() != "all":
        query = query.filter(Item.category.ilike(category))

    if is_eggless is not None:
        query = query.filter(Item.is_eggless == is_eggless)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter((Item.name.ilike(term)) | (Item.description.ilike(term)))

    items = query.order_by(Item.id.desc()).offset(skip).limit(limit).all()
    return [ItemResponse.model_validate(item) for item in items]


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Retrieve single confection item by its ID (Public endpoint)."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found"
        )
    return ItemResponse.model_validate(item)


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    item_in: ItemCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Create a new confection item (Admin privileges required)."""
    new_item = Item(
        name=item_in.name.strip(),
        image_url=item_in.image_url.strip(),
        base_price=item_in.base_price,
        category=item_in.category.strip().lower(),
        description=item_in.description,
        stock=item_in.stock,
        is_eggless=item_in.is_eggless,
        prep_time=item_in.prep_time,
        is_active=item_in.is_active,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return ItemResponse.model_validate(new_item)


@router.put("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    item_in: ItemUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Update confection item details and pricing (Admin privileges required)."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found"
        )

    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return ItemResponse.model_validate(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Permanently delete confection item from catalog (Admin privileges required)."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found"
        )

    db.delete(item)
    db.commit()
    return None
