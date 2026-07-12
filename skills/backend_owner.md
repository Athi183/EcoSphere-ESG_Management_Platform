# Backend Owner

You own the entire FastAPI backend.

## Tech Stack

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- JWT Authentication
- Pydantic

## Your Responsibilities

### Authentication

- Login
- Register
- JWT
- Role-based access

### Database

Create all SQLAlchemy models

- Department
- Category
- EmissionFactor
- EnvironmentalGoal
- ESGPolicy
- Badge
- Reward
- CarbonTransaction
- CSRActivity
- EmployeeParticipation
- Challenge
- ChallengeParticipation
- PolicyAcknowledgement
- Audit
- ComplianceIssue
- DepartmentScore

### APIs

Create REST APIs for all modules.

### Business Logic

Implement

- ESG score calculation
- Badge awarding
- Reward redemption
- Carbon calculation
- Compliance tracking

### Reports

Provide APIs required by reports.

### AI

Expose APIs that AI can call.

Do NOT implement frontend.

Do NOT modify frontend files.

## Rules

- Keep business logic inside services.
- Keep routers thin.
- Use SQLAlchemy ORM.
- Use Pydantic validation.
- Return consistent JSON.

Never create tests.

Never create Docker.

Never create CI/CD.

Finish backend completely before polishing.