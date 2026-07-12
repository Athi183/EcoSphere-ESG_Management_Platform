# Coding Standards

## Purpose

Enforce consistency across the codebase. Follow these standards for all backend and frontend code.

---

## General

- Use meaningful, descriptive names for variables, functions, classes, and files.
- Avoid abbreviations unless universally understood (e.g., `id`, `url`, `db`).
- Keep functions focused — one function, one responsibility.
- Avoid duplicated code — extract shared logic into helpers or base classes.
- Use environment variables for all configuration (no hardcoded secrets, URLs, or ports).
- Write code that is self-documenting; add comments only for non-obvious logic.

---

## Python / Backend

### Naming

- **Files**: `snake_case.py` (e.g., `carbon_transaction.py`)
- **Classes**: `PascalCase` (e.g., `CarbonTransaction`)
- **Functions**: `snake_case` (e.g., `create_carbon_transaction`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PAGE_SIZE`)
- **Variables**: `snake_case`

### Code Style

- Follow PEP 8.
- Max line length: 120 characters.
- Use type hints on all function signatures.
- Use `f-strings` for string formatting.
- Use `Enum` for fixed choices (not raw strings).

### Architecture Rules

| Rule                                      | Details                                    |
| ----------------------------------------- | ------------------------------------------ |
| Business logic in services only           | Routers and CRUD stay thin                 |
| Routers never access DB directly          | Always go through service → CRUD           |
| Pydantic for all request/response         | No raw dicts in/out of APIs                |
| SQLAlchemy for all DB operations           | No raw SQL unless for complex aggregations |
| Dependencies via FastAPI `Depends()`       | DB session, current user, role checks      |
| All endpoints return consistent JSON       | Use the standard response wrapper          |
| No business logic in models               | Models define schema only                  |

### Error Handling

- Use `HTTPException` with appropriate status codes.
- 400 for validation errors.
- 401 for authentication failures.
- 403 for authorization failures.
- 404 for not found.
- 409 for conflicts (e.g., duplicate participation).

### Testing

- Use `pytest` for all tests.
- Test services (business logic) thoroughly.
- Use fixtures for DB setup.
- Mock external services (email, file storage).

---

## TypeScript / Frontend

### Naming

- **Files**: `PascalCase.tsx` for components (e.g., `CarbonTransactions.tsx`)
- **Files**: `camelCase.ts` for non-components (e.g., `environmentalService.ts`)
- **Interfaces/Types**: `PascalCase` (e.g., `CarbonTransaction`)
- **Functions**: `camelCase` (e.g., `getCarbonTransactions`)
- **Constants**: `UPPER_SNAKE_CASE`
- **Hooks**: `useCamelCase` (e.g., `useCarbonTransactions`)

### Code Style

- Use TypeScript — avoid `any` type.
- Define interfaces for all props, API responses, and data types.
- Use functional components with hooks — no class components.
- Extract complex logic into custom hooks.
- Keep components under 200 lines — split if larger.

### Architecture Rules

| Rule                                       | Details                                   |
| ------------------------------------------ | ----------------------------------------- |
| No inline styles                           | Use Tailwind classes exclusively          |
| No business logic in components            | Use hooks and services                    |
| API calls in services only                 | Components never call Axios directly      |
| React Query for all server state           | No manual fetch + useState patterns       |
| Forms use React Hook Form                  | No manual form state management           |
| Reusable components in `components/common/` | Tables, modals, cards, etc.              |
| Page-level components in `pages/`          | One per route                             |
| Types match backend schemas                | Keep frontend types in sync               |

### Component Pattern

```typescript
interface Props {
  departmentId: number;
  onClose: () => void;
}

export function CarbonTransactionForm({ departmentId, onClose }: Props) {
  const { register, handleSubmit } = useForm<CarbonTransactionCreate>();
  const createMutation = useCreateCarbonTransaction();

  const onSubmit = (data: CarbonTransactionCreate) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Transaction created");
        onClose();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

### Import Order

1. React and third-party libraries
2. Local components
3. Hooks
4. Services and utilities
5. Types
6. Styles/assets

---

## Git Conventions

### Branch Naming

- `feature/environmental-module`
- `feature/gamification-badges`
- `fix/carbon-calculation-bug`
- `chore/update-dependencies`

### Commit Messages

Use conventional commits:

```
feat: add emission factor CRUD endpoints
fix: correct CO2 calculation rounding
chore: update SQLAlchemy to v2.0
docs: add API documentation for social module
```

---

## File Organization

- One model per file (or grouped by module if small).
- One router per module.
- One service per module.
- Schema files can group related schemas (Create, Update, Response).
- Keep related files close together.

---

## Documentation

- All API endpoints documented with FastAPI's auto-docs (via type hints and docstrings).
- README.md with setup instructions.
- Environment variables documented in `.env.example`.
- Complex business logic documented with inline comments.
