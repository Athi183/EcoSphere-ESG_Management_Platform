import enum
from sqlalchemy import Column, Integer, String, DateTime, Enum, UniqueConstraint
from sqlalchemy.sql import func
from app.database.database import Base

class CategoryType(str, enum.Enum):
    CSR_ACTIVITY = "CSR_ACTIVITY"
    CHALLENGE = "CHALLENGE"

class CategoryStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(Enum(CategoryType), nullable=False)
    status = Column(Enum(CategoryStatus), default=CategoryStatus.ACTIVE, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint('name', 'type', name='uq_category_name_type'),
    )
