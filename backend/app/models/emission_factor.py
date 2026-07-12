import enum
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
from app.database.database import Base

class EmissionFactorStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"

class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String, unique=True, index=True, nullable=False)
    unit = Column(String, nullable=False)
    emission_factor = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    status = Column(Enum(EmissionFactorStatus), default=EmissionFactorStatus.ACTIVE, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
