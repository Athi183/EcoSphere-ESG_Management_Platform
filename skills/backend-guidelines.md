# Backend Guidelines

## Framework

FastAPI with Python 3.11+.

---

## Directory Structure

```
backend/
├── app/
│   ├── main.py              # App entry, CORS, router registration
│   ├── database.py          # Engine, SessionLocal, Base
│   ├── core/
│   │   ├── config.py        # Settings from .env (Pydantic BaseSettings)
│   │   ├── security.py      # JWT create/verify, password hashing (bcrypt)
│   │   └── dependencies.py  # get_db, get_current_user, require_role
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── department.py
│   │   ├── category.py
│   │   ├── environmental.py  # EmissionFactor, CarbonTransaction, EnvironmentalGoal
│   │   ├── social.py         # CSRActivity, EmployeeParticipation
│   │   ├── governance.py     # ESGPolicy, PolicyAcknowledgement, Audit, ComplianceIssue
│   │   ├── gamification.py   # Challenge, ChallengeParticipation, Badge, Reward
│   │   └── scoring.py        # DepartmentScore
│   ├── schemas/
│   │   ├── user.py
│   │   ├── department.py
│   │   ├── environmental.py
│   │   ├── social.py
│   │   ├── governance.py
│   │   ├── gamification.py
│   │   ├── scoring.py
│   │   └── reports.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── departments.py
│   │   ├── categories.py
│   │   ├── environmental.py
│   │   ├── social.py
│   │   ├── governance.py
│   │   ├── gamification.py
│   │   ├── reports.py
│   │   └── settings.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── department_service.py
│   │   ├── environmental_service.py
│   │   ├── social_service.py
│   │   ├── governance_service.py
│   │   ├── gamification_service.py
│   │   ├── scoring_service.py
│   │   ├── notification_service.py
│   │   └── report_service.py
│   ├── crud/
│   │   ├── base.py           # Generic CRUD base class
│   │   ├── user.py
│   │   ├── department.py
│   │   ├── environmental.py
│   │   ├── social.py
│   │   ├── governance.py
│   │   └── gamification.py
│   └── utils/
│       ├── email.py
│       ├── file_upload.py
│       ├── pdf_generator.py
│       └── excel_generator.py
├── alembic/
│   ├── env.py
│   └── versions/
├── alembic.ini
├── requirements.txt
└── .env
```

---

## Every Feature Must Have

1. **Model** — SQLAlchemy table definition in `models/`.
2. **Schema** — Pydantic `Create`, `Update`, and `Response` schemas in `schemas/`.
3. **CRUD** — Database access functions in `crud/`.
4. **Service** — Business logic in `services/`.
5. **Router** — API endpoints in `routers/`.

---

## Key Conventions

### Models (SQLAlchemy)
- Use `declarative_base()` from `database.py`.
- All tables have `id` (Integer, primary key, auto-increment), `created_at` (DateTime, server default), `updated_at` (DateTime, onupdate).
- Use `relationship()` for ORM joins.
- Use `Enum` for status fields.

```python
class CarbonTransaction(Base):
    __tablename__ = "carbon_transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    emission_factor_id = Column(Integer, ForeignKey("emission_factors.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    calculated_co2 = Column(Float, nullable=False)
    source_type = Column(String, nullable=True)
    source_reference = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    department = relationship("Department", back_populates="carbon_transactions")
    emission_factor = relationship("EmissionFactor")
```

### Schemas (Pydantic)
- Use `model_config = ConfigDict(from_attributes=True)` for ORM mode.
- Separate input and output schemas.

```python
class CarbonTransactionCreate(BaseModel):
    date: date
    department_id: int
    emission_factor_id: int
    quantity: float
    source_type: str | None = None
    source_reference: str | None = None

class CarbonTransactionResponse(BaseModel):
    id: int
    date: date
    department_id: int
    emission_factor_id: int
    quantity: float
    calculated_co2: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
```

### Routers
- Keep thin. Parse request → call service → return response.
- Use dependency injection for DB session and current user.
- Use `status_code` properly: 201 for creation, 204 for deletion.

```python
@router.post("/", response_model=CarbonTransactionResponse, status_code=201)
def create_carbon_transaction(
    data: CarbonTransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return environmental_service.create_carbon_transaction(db, data, current_user)
```

### Services
- All business logic lives here.
- Validate rules before CRUD calls.
- Trigger side effects (notifications, score recalc, badge checks).

### CRUD
- Pure data layer. No business logic.
- Use a generic base where possible.

```python
class CRUDBase:
    def __init__(self, model):
        self.model = model

    def get(self, db: Session, id: int):
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in):
        db_obj = self.model(**obj_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
```

---

## Response Format

All endpoints return consistent JSON:

```json
{
  "success": true,
  "data": { ... },
  "message": "Resource created successfully"
}
```

For lists:

```json
{
  "success": true,
  "data": [ ... ],
  "total": 42,
  "page": 1,
  "page_size": 20
}
```

For errors:

```json
{
  "success": false,
  "error": "Validation failed",
  "detail": [ ... ]
}
```

---

## Authentication

- JWT Bearer tokens in `Authorization` header.
- Access tokens expire in 30 minutes.
- Refresh tokens expire in 7 days.
- Passwords hashed with bcrypt.
- Role-based access via dependency: `Depends(require_role(["admin", "manager"]))`.

---

## Database

- PostgreSQL via SQLAlchemy async or sync sessions.
- Migrations managed with Alembic.
- All migrations are auto-generated from model changes.
- Connection string from `.env` via `config.py`.

---

## Environment Variables (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/ecosphere
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
```
