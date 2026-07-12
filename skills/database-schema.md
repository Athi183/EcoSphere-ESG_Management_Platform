# Database Schema

## Overview

PostgreSQL relational database. All models use SQLAlchemy ORM.

Every table includes:
- `id` — Integer, primary key, auto-increment
- `created_at` — DateTime, server default `now()`
- `updated_at` — DateTime, on update `now()`

---

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌────────────────────┐
│    users     │──────→│   departments    │←──────│  department_scores │
└──────┬───────┘       └────────┬─────────┘       └────────────────────┘
       │                        │
       │    ┌───────────────────┼───────────────────┐
       │    │                   │                    │
       ↓    ↓                   ↓                    ↓
┌──────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ employee_        │  │ carbon_         │  │ environmental_      │
│ participations   │  │ transactions    │  │ goals               │
└───────┬──────────┘  └────────┬────────┘  └─────────────────────┘
        │                      │
        ↓                      ↓
┌──────────────────┐  ┌─────────────────┐
│ csr_activities   │  │ emission_factors│
└──────────────────┘  └─────────────────┘

┌──────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│   challenges     │←─│ challenge_          │  │    badges        │
│                  │  │ participations      │  │                  │
└──────────────────┘  └─────────────────────┘  └──────────────────┘

┌──────────────────┐  ┌─────────────────────┐
│  esg_policies    │←─│ policy_             │
│                  │  │ acknowledgements    │
└──────────────────┘  └─────────────────────┘

┌──────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│    audits        │←─│ compliance_issues   │  │    rewards       │
└──────────────────┘  └─────────────────────┘  └──────────────────┘

┌──────────────────┐  ┌─────────────────────┐
│   categories     │  │  reward_redemptions │
└──────────────────┘  └─────────────────────┘

┌──────────────────┐  ┌─────────────────────┐
│  notifications   │  │    user_badges      │
└──────────────────┘  └─────────────────────┘
```

---

## Master Data Tables

### `users`

| Column         | Type         | Constraints              |
| -------------- | ------------ | ------------------------ |
| id             | Integer      | PK, auto-increment       |
| email          | String(255)  | Unique, not null          |
| hashed_password | String(255) | Not null                  |
| full_name      | String(255)  | Not null                  |
| role           | Enum         | admin/manager/employee/auditor |
| department_id  | Integer      | FK → departments.id       |
| xp_balance     | Integer      | Default 0                 |
| total_xp_earned | Integer     | Default 0                 |
| is_active      | Boolean      | Default true              |
| avatar_url     | String       | Nullable                  |
| created_at     | DateTime     | Server default            |
| updated_at     | DateTime     | On update                 |

### `departments`

| Column         | Type         | Constraints              |
| -------------- | ------------ | ------------------------ |
| id             | Integer      | PK                       |
| name           | String(255)  | Unique, not null          |
| code           | String(50)   | Unique, not null          |
| head_id        | Integer      | FK → users.id, nullable   |
| parent_id      | Integer      | FK → departments.id, nullable (self-referential) |
| employee_count | Integer      | Default 0                 |
| status         | Enum         | active/inactive           |
| created_at     | DateTime     | Server default            |
| updated_at     | DateTime     | On update                 |

**Relationships:** `parent` (Many-to-One self), `children` (One-to-Many self), `employees` (One-to-Many users), `head` (Many-to-One users).

### `categories`

| Column | Type        | Constraints                        |
| ------ | ----------- | ---------------------------------- |
| id     | Integer     | PK                                 |
| name   | String(255) | Not null                           |
| type   | Enum        | csr_activity / challenge           |
| status | Enum        | active / inactive                  |

### `emission_factors`

| Column       | Type         | Constraints      |
| ------------ | ------------ | ---------------- |
| id           | Integer      | PK               |
| name         | String(255)  | Not null          |
| code         | String(50)   | Unique            |
| source_type  | Enum         | electricity / fuel / waste / materials / fleet |
| factor_value | Float        | Not null (kg CO₂e per unit) |
| unit         | String(50)   | Not null (e.g., kWh, liter, kg) |
| description  | Text         | Nullable          |
| status       | Enum         | active / inactive |

### `environmental_goals`

| Column        | Type         | Constraints         |
| ------------- | ------------ | ------------------- |
| id            | Integer      | PK                  |
| name          | String(255)  | Not null             |
| description   | Text         | Nullable             |
| department_id | Integer      | FK → departments.id  |
| target_value  | Float        | Not null             |
| current_value | Float        | Default 0            |
| unit          | String(50)   | Not null             |
| start_date    | Date         | Not null             |
| end_date      | Date         | Not null             |
| status        | Enum         | draft / in_progress / achieved / failed |

### `esg_policies`

| Column                  | Type         | Constraints  |
| ----------------------- | ------------ | ------------ |
| id                      | Integer      | PK           |
| title                   | String(255)  | Not null      |
| content                 | Text         | Not null      |
| effective_date          | Date         | Not null      |
| requires_acknowledgement | Boolean     | Default true  |
| status                  | Enum         | draft / active / archived |

### `badges`

| Column       | Type         | Constraints      |
| ------------ | ------------ | ---------------- |
| id           | Integer      | PK               |
| name         | String(255)  | Not null, unique  |
| description  | Text         | Nullable          |
| icon         | String(255)  | Icon URL/path     |
| unlock_rule  | Enum         | xp_threshold / challenge_count / csr_count |
| unlock_value | Integer      | Not null (threshold value) |

### `rewards`

| Column          | Type         | Constraints      |
| --------------- | ------------ | ---------------- |
| id              | Integer      | PK               |
| name            | String(255)  | Not null          |
| description     | Text         | Nullable          |
| points_required | Integer      | Not null          |
| stock           | Integer      | Not null, >= 0    |
| status          | Enum         | available / out_of_stock |

---

## Transactional Data Tables

### `carbon_transactions`

| Column            | Type         | Constraints             |
| ----------------- | ------------ | ----------------------- |
| id                | Integer      | PK                      |
| date              | Date         | Not null                 |
| department_id     | Integer      | FK → departments.id      |
| emission_factor_id | Integer     | FK → emission_factors.id  |
| quantity          | Float        | Not null                 |
| calculated_co2    | Float        | Not null (quantity × factor_value) |
| source_type       | String(100)  | Nullable (purchase / manufacturing / expense / fleet) |
| source_reference  | String(255)  | Nullable (e.g., PO-0042) |
| notes             | Text         | Nullable                 |

### `csr_activities`

| Column           | Type         | Constraints         |
| ---------------- | ------------ | ------------------- |
| id               | Integer      | PK                  |
| title            | String(255)  | Not null             |
| category_id      | Integer      | FK → categories.id   |
| description      | Text         | Nullable             |
| date             | Date         | Not null             |
| xp_reward        | Integer      | Default 0            |
| max_participants | Integer      | Nullable             |
| status           | Enum         | draft / active / completed / cancelled |
| created_by       | Integer      | FK → users.id        |

### `employee_participations`

| Column          | Type         | Constraints              |
| --------------- | ------------ | ------------------------ |
| id              | Integer      | PK                       |
| employee_id     | Integer      | FK → users.id             |
| activity_id     | Integer      | FK → csr_activities.id    |
| proof_file      | String(500)  | File path, nullable       |
| proof_filename  | String(255)  | Original filename, nullable |
| approval_status | Enum         | pending / approved / rejected |
| approver_id     | Integer      | FK → users.id, nullable   |
| points_earned   | Integer      | Default 0                 |
| completion_date | Date         | Nullable                  |

**Unique constraint:** (`employee_id`, `activity_id`) — one participation per employee per activity.

### `challenges`

| Column            | Type         | Constraints     |
| ----------------- | ------------ | --------------- |
| id                | Integer      | PK              |
| title             | String(255)  | Not null         |
| category_id       | Integer      | FK → categories.id |
| description       | Text         | Nullable         |
| xp               | Integer      | Not null         |
| difficulty        | Enum         | easy / medium / hard |
| evidence_required | Boolean      | Default false    |
| deadline          | Date         | Nullable         |
| status            | Enum         | draft / active / under_review / completed / archived |
| created_by        | Integer      | FK → users.id    |

### `challenge_participations`

| Column          | Type         | Constraints           |
| --------------- | ------------ | --------------------- |
| id              | Integer      | PK                    |
| challenge_id    | Integer      | FK → challenges.id     |
| employee_id     | Integer      | FK → users.id          |
| progress        | Float        | Default 0 (0-100%)     |
| proof_file      | String(500)  | Nullable               |
| proof_filename  | String(255)  | Nullable               |
| approval_status | Enum         | pending / approved / rejected |
| approver_id     | Integer      | FK → users.id, nullable |
| xp_awarded      | Integer      | Default 0              |

**Unique constraint:** (`challenge_id`, `employee_id`).

### `policy_acknowledgements`

| Column            | Type      | Constraints          |
| ----------------- | --------- | -------------------- |
| id                | Integer   | PK                   |
| policy_id         | Integer   | FK → esg_policies.id  |
| employee_id       | Integer   | FK → users.id         |
| acknowledged_date | DateTime  | Nullable              |
| status            | Enum      | pending / acknowledged |

**Unique constraint:** (`policy_id`, `employee_id`).

### `audits`

| Column        | Type         | Constraints         |
| ------------- | ------------ | ------------------- |
| id            | Integer      | PK                  |
| title         | String(255)  | Not null             |
| department_id | Integer      | FK → departments.id  |
| auditor_id    | Integer      | FK → users.id        |
| audit_date    | Date         | Not null             |
| score         | Float        | Nullable (0-100)     |
| findings      | Text         | Nullable             |
| status        | Enum         | scheduled / in_progress / completed |

### `compliance_issues`

| Column      | Type         | Constraints         |
| ----------- | ------------ | ------------------- |
| id          | Integer      | PK                  |
| audit_id    | Integer      | FK → audits.id       |
| title       | String(255)  | Not null             |
| description | Text         | Nullable             |
| severity    | Enum         | low / medium / high / critical |
| owner_id    | Integer      | FK → users.id, **not null** |
| due_date    | Date         | **Not null**          |
| status      | Enum         | open / in_progress / resolved |
| is_overdue  | Boolean      | Computed (due_date < today AND status != resolved) |

### `department_scores`

| Column               | Type    | Constraints         |
| -------------------- | ------- | ------------------- |
| id                   | Integer | PK                  |
| department_id        | Integer | FK → departments.id  |
| period               | String  | e.g., "2026-Q1"     |
| environmental_score  | Float   | 0-100                |
| social_score         | Float   | 0-100                |
| governance_score     | Float   | 0-100                |
| total_score          | Float   | Weighted average     |

---

## Junction / Supporting Tables

### `user_badges`

| Column     | Type     | Constraints     |
| ---------- | -------- | --------------- |
| id         | Integer  | PK              |
| user_id    | Integer  | FK → users.id    |
| badge_id   | Integer  | FK → badges.id   |
| awarded_at | DateTime | Server default   |

**Unique constraint:** (`user_id`, `badge_id`).

### `reward_redemptions`

| Column      | Type     | Constraints      |
| ----------- | -------- | ---------------- |
| id          | Integer  | PK               |
| user_id     | Integer  | FK → users.id     |
| reward_id   | Integer  | FK → rewards.id   |
| points_spent | Integer | Not null          |
| redeemed_at | DateTime | Server default    |

### `notifications`

| Column    | Type         | Constraints      |
| --------- | ------------ | ---------------- |
| id        | Integer      | PK               |
| user_id   | Integer      | FK → users.id     |
| title     | String(255)  | Not null          |
| message   | Text         | Not null          |
| type      | Enum         | compliance / challenge / badge / policy / reward / system |
| is_read   | Boolean      | Default false     |
| link      | String(500)  | Nullable (deep link) |

### `esg_settings`

| Column                    | Type    | Constraints  |
| ------------------------- | ------- | ------------ |
| id                        | Integer | PK           |
| auto_emission_calculation | Boolean | Default false |
| evidence_required         | Boolean | Default false |
| badge_auto_award          | Boolean | Default true  |
| env_weight                | Float   | Default 0.40  |
| social_weight             | Float   | Default 0.30  |
| governance_weight         | Float   | Default 0.30  |
| email_notifications       | Boolean | Default true  |
| in_app_notifications      | Boolean | Default true  |

---

## Key Relationships Summary

| Parent             | Child                     | Type     |
| ------------------ | ------------------------- | -------- |
| departments        | users                     | 1:N      |
| departments        | carbon_transactions       | 1:N      |
| departments        | environmental_goals       | 1:N      |
| departments        | audits                    | 1:N      |
| departments        | department_scores         | 1:N      |
| users              | employee_participations   | 1:N      |
| users              | challenge_participations  | 1:N      |
| users              | policy_acknowledgements   | 1:N      |
| users              | user_badges               | 1:N      |
| users              | reward_redemptions        | 1:N      |
| users              | notifications             | 1:N      |
| categories         | csr_activities            | 1:N      |
| categories         | challenges                | 1:N      |
| emission_factors   | carbon_transactions       | 1:N      |
| csr_activities     | employee_participations   | 1:N      |
| challenges         | challenge_participations  | 1:N      |
| esg_policies       | policy_acknowledgements   | 1:N      |
| audits             | compliance_issues         | 1:N      |
| badges             | user_badges               | 1:N      |
| rewards            | reward_redemptions        | 1:N      |
