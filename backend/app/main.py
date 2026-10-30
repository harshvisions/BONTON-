import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from decimal import Decimal
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, SessionLocal, engine
from app.models import Discount, Item, User, UserRole
from app.routers import auth, discounts, items, orders
from app.security import hash_password


def seed_initial_data():
    """Seed initial luxury items, active discount, and default Admin user if DB is fresh."""
    db = SessionLocal()
    try:
        # 1. Seed Admin User
        admin_email = "admin@bontonbakery.in"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin_user = User(
                email=admin_email,
                hashed_password=hash_password("Admin@12345"),
                full_name="Master Baker (Bon Ton Bakery)",
                phone="+91 98111 00000",
                role=UserRole.ADMIN,
                sweet_credits=5000,
                is_active=True,
            )
            db.add(admin_user)
            db.commit()

        # 2. Seed Customer User
        customer_email = "patron@bontonbakery.in"
        existing_customer = db.query(User).filter(User.email == customer_email).first()
        if not existing_customer:
            customer_user = User(
                email=customer_email,
                hashed_password=hash_password("Patron@12345"),
                full_name="Lady Genevieve",
                phone="+91 98765 43210",
                role=UserRole.CUSTOMER,
                sweet_credits=450,
                is_active=True,
            )
            db.add(customer_user)
            db.commit()

        # 3. Seed Initial Confection Items
        if db.query(Item).count() == 0:
            sample_items = [
                Item(
                    name="Belgian Truffle Noir Cake",
                    image_url="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
                    base_price=Decimal("899.00"),
                    category="cakes",
                    description="54% Callebaut dark chocolate ganache, moist Dutch cocoa sponge, edible 24k gold leaf.",
                    stock=25,
                    is_eggless=True,
                    prep_time="Ready in 2 Hours",
                ),
                Item(
                    name="Wild Berry Mascarpone Naked Cake",
                    image_url="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=80",
                    base_price=Decimal("999.00"),
                    category="cakes",
                    description="Vanilla bean chiffon, fresh blackberry-raspberry compote, whipped Italian mascarpone.",
                    stock=18,
                    is_eggless=True,
                    prep_time="Ready in 3 Hours",
                ),
                Item(
                    name="Lotus Biscoff Baked Cheesecake",
                    image_url="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80",
                    base_price=Decimal("1049.00"),
                    category="cakes",
                    description="Slow-baked New York style cheesecake, speculoos crust, melted cookie butter glaze.",
                    stock=15,
                    is_eggless=True,
                    prep_time="Ready in 2 Hours",
                ),
                Item(
                    name="Parisian Raspberry & Frangipane Tart",
                    image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
                    base_price=Decimal("280.00"),
                    category="pastries",
                    description="French butter sablé crust, California almond frangipane, glazed fresh imported raspberries.",
                    stock=30,
                    is_eggless=True,
                    prep_time="Instant Delivery",
                ),
                Item(
                    name="Artisan Country Sourdough Boule",
                    image_url="https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1000&q=80",
                    base_price=Decimal("260.00"),
                    category="breads",
                    description="Naturally leavened using 6-year mother starter, 48-hr slow cold fermentation, blistered crust.",
                    stock=20,
                    is_eggless=True,
                    prep_time="Fresh Baked Today",
                ),
                Item(
                    name="Signature Macaron Jewel Box (12 Pcs)",
                    image_url="https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=1000&q=80",
                    base_price=Decimal("899.00"),
                    category="cupcakes",
                    description="Assorted Parisian macarons in luxury velvet drawer gift box with satin ribbon.",
                    stock=40,
                    is_eggless=True,
                    prep_time="Ready in 1 Hour",
                ),
            ]
            db.add_all(sample_items)
            db.commit()

            # 4. Seed Sample Discount for Belgian Truffle Noir Cake (20% OFF)
            first_item = db.query(Item).first()
            if first_item:
                sample_discount = Discount(
                    item_id=first_item.id,
                    discount_value=Decimal("20.00"),
                    discount_type="percentage",
                    expiration=datetime.utcnow() + timedelta(days=60),
                    min_order=Decimal("799.00"),
                    max_discount=Decimal("500.00"),
                    is_active=True,
                )
                db.add(sample_discount)
                db.commit()

    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed default data
    Base.metadata.create_all(bind=engine)
    seed_initial_data()
    yield


app = FastAPI(
    title="Bon Ton Bakery API",
    description="Backend API supporting the Bon Ton Bakery Next.js e-commerce storefront and admin dashboard with PostgreSQL, SQLAlchemy, Bcrypt, JWT auth, and secure cart calculation.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration for Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(items.router, prefix="/api/v1")
app.include_router(discounts.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")


@app.get("/", tags=["Health Check"])
def root():
    return {
        "atelier": "Bon Ton Bakery Bulandshahr",
        "status": "operational",
        "documentation": "/docs",
        "version": "1.0.0",
    }


@app.get("/api/v1/health", tags=["Health Check"])
def health_check():
    return {
        "status": "healthy",
        "service": "bonton-backend",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat(),
    }
