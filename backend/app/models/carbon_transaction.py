from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import datetime
from app.database.database import Base

class CarbonTransaction(Base):
    __tablename__ = "carbon_transactions"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    emission_factor_id = Column(Integer, ForeignKey("emission_factors.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    calculated_emission = Column(Float, nullable=False)
    transaction_date = Column(DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
    remarks = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    department = relationship("Department", back_populates="transactions")
    emission_factor = relationship("EmissionFactor", back_populates="transactions")
