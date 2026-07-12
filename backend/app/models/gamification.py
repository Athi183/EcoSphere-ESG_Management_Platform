import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class ApprovalStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class Badge(Base):
    __tablename__ = "badges"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    icon = Column(String, nullable=True)

class UserStat(Base):
    __tablename__ = "user_stats"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    department = Column(String, nullable=True)
    total_xp = Column(Integer, default=0)
    
    user = relationship("User")

class CSRParticipation(Base):
    __tablename__ = "csr_participations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("csr_activities.id"), nullable=False)
    proof_url = Column(String, nullable=True)
    points_awarded = Column(Integer, default=0)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User")
    activity = relationship("CSRActivity")

class ChallengeParticipation(Base):
    __tablename__ = "challenge_participations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    proof_url = Column(String, nullable=True)
    points_awarded = Column(Integer, default=0)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User")
    challenge = relationship("Challenge")
