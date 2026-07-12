from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database.database import get_db
from app.routers.auth import get_current_user
from app.models.gamification import Badge, UserStat, CSRParticipation, ApprovalStatus
from app.models.user import User

router = APIRouter(
    prefix="/gamification", 
    tags=["gamification"], 
    dependencies=[Depends(get_current_user)]
)

# --- Schemas ---

class BadgeResponse(BaseModel):
    id: int
    name: str
    icon: Optional[str] = None
    model_config = {"from_attributes": True}

class LeaderboardResponse(BaseModel):
    user_id: int
    full_name: str
    department: Optional[str] = None
    total_xp: int
    rank: int

class ParticipationCreate(BaseModel):
    activity_id: int
    proof_url: Optional[str] = None

class ParticipationResponse(BaseModel):
    id: int
    user_name: str
    activity_title: str
    proof_url: Optional[str]
    points_awarded: int
    status: ApprovalStatus
    created_at: datetime
    model_config = {"from_attributes": True}

# --- Routes ---

@router.get("/badges", response_model=List[BadgeResponse])
def get_badges(db: Session = Depends(get_db)):
    return db.query(Badge).all()

@router.get("/leaderboard", response_model=List[LeaderboardResponse])
def get_leaderboard(db: Session = Depends(get_db)):
    stats = db.query(UserStat, User).join(User, UserStat.user_id == User.id).order_by(desc(UserStat.total_xp)).limit(10).all()
    
    leaderboard = []
    for idx, (stat, user) in enumerate(stats):
        leaderboard.append(LeaderboardResponse(
            user_id=user.id,
            full_name=user.full_name,
            department=stat.department or "General",
            total_xp=stat.total_xp,
            rank=idx + 1
        ))
    return leaderboard

@router.post("/participate")
def join_activity(data: ParticipationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(CSRParticipation).filter(
        CSRParticipation.user_id == current_user.id,
        CSRParticipation.activity_id == data.activity_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already joined this activity.")

    part = CSRParticipation(
        user_id=current_user.id,
        activity_id=data.activity_id,
        proof_url=data.proof_url
    )
    db.add(part)
    db.commit()
    return {"success": True, "message": "Joined activity successfully!"}

@router.get("/participations", response_model=List[ParticipationResponse])
def get_participations(db: Session = Depends(get_db)):
    parts = db.query(CSRParticipation).order_by(desc(CSRParticipation.created_at)).all()
    res = []
    for p in parts:
        res.append(ParticipationResponse(
            id=p.id,
            user_name=p.user.full_name if p.user else "Unknown",
            activity_title=p.activity.title if p.activity else "Unknown",
            proof_url=p.proof_url,
            points_awarded=p.points_awarded,
            status=p.status,
            created_at=p.created_at
        ))
    return res

@router.post("/participations/{part_id}/approve")
def approve_participation(part_id: int, points: int = 50, db: Session = Depends(get_db)):
    part = db.query(CSRParticipation).filter(CSRParticipation.id == part_id).first()
    if not part:
        return {"success": False, "message": "Participation not found"}
    
    part.status = ApprovalStatus.APPROVED
    part.points_awarded = points
    
    # Add XP to user
    stat = db.query(UserStat).filter(UserStat.user_id == part.user_id).first()
    if not stat:
        stat = UserStat(user_id=part.user_id, total_xp=points, department="General")
        db.add(stat)
    else:
        stat.total_xp += points
        
    db.commit()
    return {"success": True, "message": "Approved!"}

class ChallengeParticipationCreate(BaseModel):
    challenge_id: int
    proof_url: Optional[str] = None

@router.post("/challenges/participate")
def join_challenge(data: ChallengeParticipationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.gamification import ChallengeParticipation
    
    existing = db.query(ChallengeParticipation).filter(
        ChallengeParticipation.user_id == current_user.id,
        ChallengeParticipation.challenge_id == data.challenge_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already joined this challenge.")

    part = ChallengeParticipation(
        user_id=current_user.id,
        challenge_id=data.challenge_id,
        proof_url=data.proof_url
    )
    db.add(part)
    db.commit()
    return {"success": True, "message": "Joined challenge successfully!"}

class ChallengeParticipationResponse(BaseModel):
    id: int
    user_name: str
    challenge_title: str
    proof_url: Optional[str]
    points_awarded: int
    status: ApprovalStatus
    created_at: datetime
    model_config = {"from_attributes": True}

@router.get("/challenges/participations", response_model=List[ChallengeParticipationResponse])
def get_challenge_participations(db: Session = Depends(get_db)):
    from app.models.gamification import ChallengeParticipation
    parts = db.query(ChallengeParticipation).order_by(desc(ChallengeParticipation.created_at)).all()
    res = []
    for p in parts:
        res.append(ChallengeParticipationResponse(
            id=p.id,
            user_name=p.user.full_name if p.user else "Unknown",
            challenge_title=p.challenge.title if p.challenge else "Unknown",
            proof_url=p.proof_url,
            points_awarded=p.points_awarded,
            status=p.status,
            created_at=p.created_at
        ))
    return res

@router.post("/challenges/participations/{part_id}/approve")
def approve_challenge_participation(part_id: int, points: int = 50, db: Session = Depends(get_db)):
    from app.models.gamification import ChallengeParticipation
    part = db.query(ChallengeParticipation).filter(ChallengeParticipation.id == part_id).first()
    if not part:
        return {"success": False, "message": "Participation not found"}
    
    part.status = ApprovalStatus.APPROVED
    part.points_awarded = points
    
    stat = db.query(UserStat).filter(UserStat.user_id == part.user_id).first()
    if not stat:
        stat = UserStat(user_id=part.user_id, total_xp=points, department="General")
        db.add(stat)
    else:
        stat.total_xp += points
        
    db.commit()
    return {"success": True, "message": "Approved!"}
