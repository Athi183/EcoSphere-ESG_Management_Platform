# API Design

## Base URL

```
http://localhost:8000/api/v1
```

---

## Response Format

### Success (Single Object)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Engineering"
  },
  "message": "Department created successfully"
}
```

### Success (List)

```json
{
  "success": true,
  "data": [...],
  "total": 42,
  "page": 1,
  "page_size": 20
}
```

### Error

```json
{
  "success": false,
  "error": "Not Found",
  "detail": "Department with ID 999 does not exist"
}
```

### Validation Error

```json
{
  "success": false,
  "error": "Validation Error",
  "detail": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## HTTP Methods

| Method | Purpose                      | Status Code |
| ------ | ---------------------------- | ----------- |
| GET    | Retrieve resource(s)         | 200         |
| POST   | Create resource              | 201         |
| PATCH  | Partial update               | 200         |
| DELETE | Remove resource              | 204         |

---

## Query Parameters (Lists)

| Parameter    | Type    | Default | Description                    |
| ------------ | ------- | ------- | ------------------------------ |
| `page`       | int     | 1       | Page number                    |
| `page_size`  | int     | 20      | Items per page (max 100)       |
| `search`     | string  | —       | Search across name/title fields |
| `sort_by`    | string  | created_at | Sort column               |
| `sort_order` | string  | desc    | asc or desc                    |
| `status`     | string  | —       | Filter by status enum value    |
| `department_id` | int  | —       | Filter by department           |
| `date_from`  | date    | —       | Filter start date              |
| `date_to`    | date    | —       | Filter end date                |

---

## Endpoint Catalog

### Auth

| Method | Path                  | Description           |
| ------ | --------------------- | --------------------- |
| POST   | `/auth/login`         | Login                 |
| POST   | `/auth/register`      | Register (admin only) |
| POST   | `/auth/refresh`       | Refresh token         |
| POST   | `/auth/logout`        | Logout                |
| GET    | `/auth/me`            | Current user          |

### Users

| Method | Path                  | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/users`              | List users            |
| GET    | `/users/{id}`         | Get user              |
| PATCH  | `/users/{id}`         | Update user           |
| DELETE | `/users/{id}`         | Deactivate user       |
| GET    | `/users/{id}/badges`  | User's badges         |
| GET    | `/users/{id}/rewards` | User's redemptions    |

### Departments

| Method | Path                        | Description        |
| ------ | --------------------------- | ------------------ |
| GET    | `/departments`              | List departments   |
| POST   | `/departments`              | Create department  |
| GET    | `/departments/{id}`         | Get department     |
| PATCH  | `/departments/{id}`         | Update department  |
| DELETE | `/departments/{id}`         | Delete department  |
| GET    | `/departments/{id}/scores`  | Department scores  |

### Categories

| Method | Path                  | Description       |
| ------ | --------------------- | ----------------- |
| GET    | `/categories`         | List categories   |
| POST   | `/categories`         | Create category   |
| PATCH  | `/categories/{id}`    | Update category   |
| DELETE | `/categories/{id}`    | Delete category   |

### Environmental

| Method | Path                              | Description                |
| ------ | --------------------------------- | -------------------------- |
| GET    | `/environmental/emission-factors` | List emission factors      |
| POST   | `/environmental/emission-factors` | Create emission factor     |
| PATCH  | `/environmental/emission-factors/{id}` | Update emission factor |
| DELETE | `/environmental/emission-factors/{id}` | Delete emission factor |
| GET    | `/environmental/carbon-transactions` | List carbon transactions |
| POST   | `/environmental/carbon-transactions` | Create carbon transaction |
| GET    | `/environmental/goals`            | List goals                 |
| POST   | `/environmental/goals`            | Create goal                |
| PATCH  | `/environmental/goals/{id}`       | Update goal                |
| GET    | `/environmental/dashboard`        | Environmental dashboard data |

### Social

| Method | Path                                 | Description            |
| ------ | ------------------------------------ | ---------------------- |
| GET    | `/social/csr-activities`             | List CSR activities    |
| POST   | `/social/csr-activities`             | Create CSR activity    |
| PATCH  | `/social/csr-activities/{id}`        | Update CSR activity    |
| GET    | `/social/participations`             | List participations    |
| POST   | `/social/participations`             | Submit participation   |
| PATCH  | `/social/participations/{id}/approve` | Approve participation |
| PATCH  | `/social/participations/{id}/reject` | Reject participation  |
| GET    | `/social/diversity`                  | Diversity metrics      |
| GET    | `/social/dashboard`                  | Social dashboard data  |

### Governance

| Method | Path                                      | Description              |
| ------ | ----------------------------------------- | ------------------------ |
| GET    | `/governance/policies`                    | List policies            |
| POST   | `/governance/policies`                    | Create policy            |
| PATCH  | `/governance/policies/{id}`               | Update policy            |
| GET    | `/governance/acknowledgements`            | List acknowledgements    |
| POST   | `/governance/acknowledgements`            | Acknowledge a policy     |
| GET    | `/governance/audits`                      | List audits              |
| POST   | `/governance/audits`                      | Create audit             |
| PATCH  | `/governance/audits/{id}`                 | Update audit             |
| GET    | `/governance/compliance-issues`           | List compliance issues   |
| POST   | `/governance/compliance-issues`           | Create compliance issue  |
| PATCH  | `/governance/compliance-issues/{id}`      | Update compliance issue  |
| GET    | `/governance/dashboard`                   | Governance dashboard data |

### Gamification

| Method | Path                                         | Description               |
| ------ | -------------------------------------------- | ------------------------- |
| GET    | `/gamification/challenges`                   | List challenges           |
| POST   | `/gamification/challenges`                   | Create challenge          |
| PATCH  | `/gamification/challenges/{id}`              | Update challenge          |
| PATCH  | `/gamification/challenges/{id}/transition`   | Transition challenge state |
| GET    | `/gamification/challenge-participations`     | List participations       |
| POST   | `/gamification/challenge-participations`     | Join challenge            |
| PATCH  | `/gamification/challenge-participations/{id}` | Update progress          |
| PATCH  | `/gamification/challenge-participations/{id}/approve` | Approve        |
| GET    | `/gamification/badges`                       | List all badges           |
| POST   | `/gamification/badges`                       | Create badge              |
| GET    | `/gamification/rewards`                      | List rewards catalog      |
| POST   | `/gamification/rewards`                      | Create reward             |
| POST   | `/gamification/rewards/{id}/redeem`          | Redeem a reward           |
| GET    | `/gamification/leaderboard`                  | Leaderboard               |
| GET    | `/gamification/dashboard`                    | Gamification dashboard    |

### Reports

| Method | Path                           | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/reports/environmental`       | Environmental report     |
| GET    | `/reports/social`              | Social report            |
| GET    | `/reports/governance`          | Governance report        |
| GET    | `/reports/esg-summary`         | ESG summary report       |
| POST   | `/reports/custom`              | Custom report builder    |
| GET    | `/reports/export/{format}`     | Export (pdf/csv/xlsx)    |

### Settings

| Method | Path                           | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/settings`                    | Get all settings         |
| PATCH  | `/settings`                    | Update settings          |
| GET    | `/settings/notifications`      | Notification config      |
| PATCH  | `/settings/notifications`      | Update notification config |

### Notifications

| Method | Path                           | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/notifications`               | List user notifications  |
| PATCH  | `/notifications/{id}/read`     | Mark as read             |
| PATCH  | `/notifications/read-all`      | Mark all as read         |

### Dashboard

| Method | Path                      | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/dashboard`              | Main ESG dashboard data    |
| GET    | `/dashboard/scores`       | All department scores      |
| GET    | `/dashboard/overall-score` | Organization ESG score    |
