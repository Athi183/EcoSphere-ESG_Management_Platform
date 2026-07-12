import enum
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class CSRActivityStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class CSRActivity(Base):
    __tablename__ = "csr_activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    description = Column(String, nullable=True)
    location = Column(String, nullable=True)
    activity_date = Column(Date, nullable=False)
    status = Column(Enum(CSRActivityStatus), default=CSRActivityStatus.PLANNED, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="csr_activities")
