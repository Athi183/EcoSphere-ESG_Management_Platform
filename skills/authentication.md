# Authentication & Authorization

## Authentication Method

JWT (JSON Web Tokens) via FastAPI.

---

## Token Strategy

| Token Type    | Lifetime      | Storage              |
| ------------- | ------------- | -------------------- |
| Access Token  | 30 minutes    | Memory / httpOnly cookie |
| Refresh Token | 7 days        | httpOnly cookie      |

### Token Payload

```json
{
  "sub": 1,
  "email": "john@ecosphere.com",
  "role": "manager",
  "department_id": 3,
  "exp": 1720000000
}
```

---

## Password Handling

- Hash with **bcrypt** (via `passlib`).
- Never store plain text passwords.
- Minimum 8 characters, at least one uppercase, one number.

---

## Roles

| Role     | Description                                        |
| -------- | -------------------------------------------------- |
| Admin    | Full platform access. System configuration.        |
| Manager  | Department-level operations and approvals.         |
| Employee | Participation, personal dashboard, reward redemption. |
| Auditor  | Audits, compliance issues, governance reports.     |

---

## Permission Matrix

| Action                          | Admin | Manager | Employee | Auditor |
| ------------------------------- | ----- | ------- | -------- | ------- |
| **Settings & Configuration**    |       |         |          |         |
| Manage departments              | ✅    | ❌      | ❌       | ❌      |
| Manage categories               | ✅    | ❌      | ❌       | ❌      |
| Manage emission factors         | ✅    | ❌      | ❌       | ❌      |
| Configure ESG settings          | ✅    | ❌      | ❌       | ❌      |
| Manage users                    | ✅    | ❌      | ❌       | ❌      |
| **Environmental**               |       |         |          |         |
| View environmental dashboard    | ✅    | ✅      | ✅       | ✅      |
| Create/edit carbon transactions | ✅    | ✅      | ❌       | ❌      |
| Manage sustainability goals     | ✅    | ✅      | ❌       | ❌      |
| **Social**                      |       |         |          |         |
| Create CSR activities           | ✅    | ✅      | ❌       | ❌      |
| Participate in CSR activities   | ✅    | ✅      | ✅       | ❌      |
| Approve participation           | ✅    | ✅      | ❌       | ❌      |
| View diversity metrics          | ✅    | ✅      | ❌       | ❌      |
| **Governance**                  |       |         |          |         |
| Manage policies                 | ✅    | ❌      | ❌       | ❌      |
| Acknowledge policies            | ✅    | ✅      | ✅       | ✅      |
| Create/manage audits            | ✅    | ❌      | ❌       | ✅      |
| Create compliance issues        | ✅    | ❌      | ❌       | ✅      |
| **Gamification**                |       |         |          |         |
| Create/manage challenges        | ✅    | ✅      | ❌       | ❌      |
| Participate in challenges       | ✅    | ✅      | ✅       | ❌      |
| Approve challenge completion    | ✅    | ✅      | ❌       | ❌      |
| Manage badges                   | ✅    | ❌      | ❌       | ❌      |
| Manage rewards                  | ✅    | ❌      | ❌       | ❌      |
| Redeem rewards                  | ✅    | ✅      | ✅       | ❌      |
| View leaderboard                | ✅    | ✅      | ✅       | ✅      |
| **Reports**                     |       |         |          |         |
| View reports                    | ✅    | ✅      | ❌       | ✅      |
| Custom report builder           | ✅    | ✅      | ❌       | ❌      |
| Export reports                   | ✅    | ✅      | ❌       | ✅      |

---

## Backend Implementation

### Dependency: `get_current_user`

```python
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user
```

### Dependency: `require_role`

```python
def require_role(allowed_roles: list[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker
```

### Usage in Router

```python
@router.post("/departments/", dependencies=[Depends(require_role(["admin"]))])
def create_department(data: DepartmentCreate, db: Session = Depends(get_db)):
    return department_service.create(db, data)
```

---

## Frontend Implementation

### Auth Context

- Store user info and access token in React Context.
- On app load, attempt to refresh token from cookie.
- Provide `login()`, `logout()`, `isAuthenticated`, `user`, `hasRole()`.

### Route Protection

```tsx
function RequireAuth({ allowedRoles }: { allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return <Outlet />;
}
```

### Axios Interceptor

- Attach `Authorization: Bearer <token>` to every request.
- On 401 response, attempt token refresh.
- On refresh failure, redirect to login.

---

## API Endpoints

| Method | Endpoint             | Description              | Access |
| ------ | -------------------- | ------------------------ | ------ |
| POST   | `/api/v1/auth/login` | Login, returns tokens    | Public |
| POST   | `/api/v1/auth/register` | Register new user     | Admin  |
| POST   | `/api/v1/auth/refresh` | Refresh access token   | Auth   |
| POST   | `/api/v1/auth/logout` | Invalidate refresh token | Auth  |
| GET    | `/api/v1/auth/me`    | Get current user profile | Auth   |
