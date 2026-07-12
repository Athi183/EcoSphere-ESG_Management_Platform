from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from app.models.challenge import ChallengeDifficulty, ChallengeStatus

class ChallengeNestedCategory(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}

class ChallengeBase(BaseModel):
    title: str = Field(..., min_length=1, description="Title of the Challenge")
    category_id: int
    description: Optional[str] = None
    xp: int = Field(..., gt=0, description="XP points awarded for completing the challenge")
    difficulty: ChallengeDifficulty
    deadline: date
    status: Optional[ChallengeStatus] = ChallengeStatus.DRAFT

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    category_id: Optional[int] = None
    description: Optional[str] = None
    xp: Optional[int] = Field(None, gt=0)
    difficulty: Optional[ChallengeDifficulty] = None
    deadline: Optional[date] = None
    status: Optional[ChallengeStatus] = None

class ChallengeResponse(BaseModel):
    id: int
    title: str
    category: ChallengeNestedCategory
    description: Optional[str] = None
    xp: int
    difficulty: ChallengeDifficulty
    deadline: date
    status: ChallengeStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
