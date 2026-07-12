# Architecture

## System Architecture

```
┌─────────────────────────────────────────┐
│           React SPA (Frontend)          │
│  Components → Pages → Layouts           │
│  Axios → React Query → API Services    │
└─────────────────┬───────────────────────┘
                  │  REST / JSON / JWT
                  ↓
┌─────────────────────────────────────────┐
│         FastAPI (Backend)               │
│                                         │
│  ┌───────────┐                          │
│  │  Routers  │  ← Thin HTTP handlers   │
│  └─────┬─────┘                          │
│        ↓                                │
│  ┌───────────┐                          │
│  │  Schemas  │  ← Pydantic validation  │
│  └─────┬─────┘                          │
│        ↓                                │
│  ┌───────────┐                          │
│  │ Services  │  ← Business logic       │
│  └─────┬─────┘                          │
│        ↓                                │
│  ┌───────────┐                          │
│  │   CRUD    │  ← Database operations  │
│  └─────┬─────┘                          │
│        ↓                                │
│  ┌───────────┐                          │
│  │  Models   │  ← SQLAlchemy ORM       │
│  └───────────┘                          │
│                                         │
│  core/  ← Config, auth, dependencies   │
│  utils/ ← Email, files, helpers        │
└─────────────────┬───────────────────────┘
                  │  SQLAlchemy
                  ↓
┌─────────────────────────────────────────┐
│           PostgreSQL Database           │
└─────────────────────────────────────────┘
```

---

## Backend Layer Responsibilities

### `routers/`
- Define API endpoints using FastAPI `APIRouter`.
- Handle HTTP concerns only: parse request, call service, return response.
- **Never** contain business logic.
- One file per feature module (e.g., `environmental.py`, `social.py`, `governance.py`, `gamification.py`, `reports.py`, `auth.py`, `settings.py`).

### `schemas/`
- Pydantic models for request validation and response serialization.
- Separate `Create`, `Update`, and `Response` schemas per entity.
- Example: `DepartmentCreate`, `DepartmentUpdate`, `DepartmentResponse`.

### `services/`
- **All business logic lives here.**
- Orchestrates CRUD calls, applies rules, triggers side effects (notifications, score recalculation, badge checks).
- One file per feature module.

### `crud/`
- Pure database operations using SQLAlchemy.
- Functions: `create`, `get`, `get_multi`, `update`, `delete`.
- No business logic — just data access.
- One file per model or feature group.

### `models/`
- SQLAlchemy ORM model definitions.
- Define relationships, constraints, and column types.
- One file per model or grouped by module.

### `core/`
- `config.py` — Environment variables, settings (via Pydantic `BaseSettings`).
- `security.py` — JWT token creation, password hashing, token verification.
- `dependencies.py` — FastAPI dependency injection (get current user, get DB session, role checks).

### `utils/`
- Shared helpers: email sending, file upload handling, date formatting, PDF generation.

### `database.py`
- SQLAlchemy engine, session factory, Base declarative class.

### `main.py`
- FastAPI app initialization, CORS, middleware, router registration, startup/shutdown events.

---

## Frontend Layer Responsibilities

### `pages/`
- Route-level components. Each page corresponds to a URL route.
- Pages: `Dashboard`, `Environmental`, `Social`, `Governance`, `Gamification`, `Reports`, `Settings`, `Login`, `Profile`.

### `components/`
- Reusable UI building blocks.
- Subdirectories by domain: `components/environmental/`, `components/social/`, `components/common/`.
- Shared components: `DataTable`, `ScoreCard`, `ProgressBar`, `Modal`, `Badge`, `Chart`.

### `layouts/`
- Page wrapper components.
- `MainLayout` — Sidebar + header + content area.
- `AuthLayout` — Login/register pages without sidebar.

### `hooks/`
- Custom React hooks.
- API hooks wrapping React Query: `useEmissions()`, `useChallenges()`, `useDepartments()`.
- Utility hooks: `useAuth()`, `useNotifications()`, `useDebounce()`.

### `services/`
- Axios API client configuration.
- Service functions grouped by module: `environmentalService.ts`, `socialService.ts`, etc.
- Handles request/response interceptors and auth token injection.

### `types/`
- TypeScript interfaces and type definitions.
- Mirror backend schemas: `Department`, `Challenge`, `CarbonTransaction`, etc.

### `contexts/`
- React Context providers for global state.
- `AuthContext` — Current user, login/logout.
- `NotificationContext` — In-app notification state.
- `ThemeContext` — Dark/light mode (optional).

### `utils/`
- Pure helper functions: formatters, validators, constants.

---

## Data Flow Example: Creating a CSR Activity Participation

```
1. Employee fills form in React UI
        ↓
2. Axios POST /api/v1/social/participations
        ↓
3. Router receives request, validates via Pydantic schema
        ↓
4. Router calls service: social_service.create_participation(data)
        ↓
5. Service checks business rules:
   - Is evidence required? Check settings.
   - Is activity still open?
   - Has employee already participated?
        ↓
6. Service calls CRUD: participation_crud.create(db, participation_data)
        ↓
7. Service triggers side effects:
   - Award XP to employee
   - Check badge unlock conditions
   - Send notification to manager for approval
        ↓
8. Response returned to frontend
        ↓
9. React Query invalidates cache, UI updates
```

---

## API Versioning

All API routes are prefixed with `/api/v1/`.

```
/api/v1/auth/...
/api/v1/departments/...
/api/v1/environmental/...
/api/v1/social/...
/api/v1/governance/...
/api/v1/gamification/...
/api/v1/reports/...
/api/v1/settings/...
```
