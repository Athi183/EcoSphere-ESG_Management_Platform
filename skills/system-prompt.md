# System Prompt — AI Coding Conventions

## Project

EcoSphere ESG Management Platform

## Stack

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL + Alembic + JWT (PyJWT) + Pydantic
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + React Query + React Router + React Hook Form + Axios

---

## Mandatory Conventions

### Backend

1. Always use **SQLAlchemy ORM** for database operations. Never write raw SQL unless for complex aggregations that cannot be expressed in ORM.
2. Keep **business logic in services** (`app/services/`). Routers stay thin — they parse the request, call a service, return the response.
3. Use **Pydantic schemas** for all request validation and response serialization. Never accept or return raw dicts.
4. Use **FastAPI dependency injection** (`Depends()`) for DB sessions, current user, and role checks.
5. All endpoints return the **standard JSON response format**: `{ success, data, message }`.
6. Use **Enum types** for status fields (never raw strings).
7. Always include **type hints** on function signatures.
8. Use **`CRUDBase`** generic class for common database operations.
9. Handle errors with **`HTTPException`** using correct status codes (400, 401, 403, 404, 409).
10. Passwords hashed with **bcrypt**. Tokens are **JWT** with expiry.

### Frontend

1. Use **functional components** with hooks only. No class components.
2. Use **TypeScript interfaces** for all props, API responses, and data types. Avoid `any`.
3. Use **React Query** (`@tanstack/react-query`) for all server state. No manual fetch + useState.
4. Use **React Hook Form** for all forms. No manual form state.
5. Use **Tailwind CSS** exclusively. No inline styles, no CSS modules.
6. API calls go in **services** (`src/services/`). Components never call Axios directly.
7. Prefer **reusable components** in `components/common/`. Extract when used more than once.
8. Keep components under **200 lines**. Split if larger.
9. No business logic in UI components — use hooks and services.

### Database

1. Every table has `id` (PK), `created_at`, `updated_at`.
2. Use **foreign keys** and **relationships** for all associations.
3. Use **unique constraints** where specified (e.g., one participation per employee per activity).
4. Migrations via **Alembic** — auto-generate from model changes.

### Architecture

1. Follow the **layered architecture**: Router → Service → CRUD → Model.
2. **Side effects** (notifications, score recalc, badge checks) are triggered from services, not routers or CRUD.
3. **Settings toggles** (auto emission, evidence required, badge auto-award) are checked in services before applying rules.
4. **File uploads** use a dedicated utility in `app/utils/file_upload.py`.

---

## Do NOT

- Do not put business logic in routers or models.
- Do not use raw strings for status/role values — use Enums.
- Do not hardcode configuration values — use environment variables.
- Do not skip validation — always validate inputs via Pydantic.
- Do not create new patterns without checking if an existing one applies.
- Do not use `any` in TypeScript.
- Do not call APIs directly from React components.
- Do not use inline styles in React.
