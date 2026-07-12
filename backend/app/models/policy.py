import enum
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum
from sqlalchemy.sql import func
from app.database.database import Base

class PolicyStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"

class ESGPolicy(Base):
    __tablename__ = "esg_policies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    version = Column(String, nullable=False)
    effective_date = Column(Date, nullable=True)
    status = Column(Enum(PolicyStatus), default=PolicyStatus.DRAFT, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
