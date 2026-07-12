# Social Module

## Purpose

Manage Corporate Social Responsibility (CSR) activities, track employee participation, monitor diversity metrics, and measure social engagement across the organization.

---

## Features

1. **CSR Activities** — Create and manage social responsibility initiatives.
2. **Employee Participation** — Track who participated, with proof and approval.
3. **Diversity Metrics** — Monitor workforce diversity statistics.
4. **Training Completion** — Track employee training and development.
5. **Social Dashboard** — Visualize engagement, participation rates, and diversity.

---

## Workflow

```
Admin/Manager creates CSR Activity
        ↓
Activity published (status: active)
        ↓
Employee joins the activity
        ↓
Employee submits participation
(with proof file if Evidence Requirement enabled)
        ↓
Manager reviews and approves/rejects
        ↓
If approved:
  - Points/XP awarded to employee
  - Badge unlock check triggered
  - Social Score updated
        ↓
Feeds into Department Social Score
```

---

## CSR Activities

Organized social initiatives created by Admin or Manager.

### Fields

- `title` — Activity name (e.g., "Beach Cleanup Drive")
- `category_id` — FK to categories (type = csr_activity)
- `description` — Details about the activity
- `date` — When the activity occurs
- `xp_reward` — Points earned for participation
- `max_participants` — Optional cap on participants
- `status` — draft / active / completed / cancelled
- `created_by` — User who created it

### Status Transitions

```
Draft → Active → Completed
                → Cancelled
```

---

## Employee Participation

Tracks individual employee involvement in CSR activities.

### Fields

- `employee_id` — The participating employee
- `activity_id` — Which CSR activity
- `proof_file` — Uploaded evidence (photo, document)
- `proof_filename` — Original file name
- `approval_status` — pending / approved / rejected
- `approver_id` — Manager who reviewed
- `points_earned` — XP/points awarded upon approval
- `completion_date` — When participation was completed

### Business Rules

1. **One participation per employee per activity** — Enforced by unique constraint.
2. **Evidence Requirement** — When the global setting `evidence_required` is ON, participation cannot be approved unless `proof_file` is attached.
3. **Points awarded only on approval** — `points_earned` is set only when `approval_status` changes to `approved`.
4. **XP side effects on approval:**
   - Add `activity.xp_reward` to employee's `xp_balance` and `total_xp_earned`.
   - Trigger badge auto-award check.
   - Send notification to employee.

### Approval Flow

```
Employee submits participation → status: pending
        ↓
Manager reviews
        ↓
   Approve                          Reject
     ↓                                ↓
status: approved                 status: rejected
points_earned = xp_reward        points_earned = 0
employee.xp_balance += xp       notification sent
badge check triggered
notification sent
```

---

## Diversity Metrics

Track workforce diversity statistics per department.

### Tracked Dimensions

| Metric            | Description                             |
| ----------------- | --------------------------------------- |
| Gender ratio      | Male / Female / Non-binary / Undisclosed |
| Age distribution  | Age group brackets                      |
| Department spread | Employee distribution across departments |
| Role distribution | Admin / Manager / Employee / Auditor ratios |

### Data Source

Calculated from `users` table demographics. Can be extended with optional profile fields.

---

## Training Completion

Track employee participation in training programs.

### Implementation

- Can be modeled as a special CSR activity category (category type = "training").
- Or a separate lightweight model if needed.
- Track completion percentage and certification status.

---

## Social Score Calculation

The Social Score for a department (0-100) considers:

1. **CSR Participation Rate** — % of department employees who participated in activities.
2. **Diversity Index** — How diverse the department is.
3. **Training Completion Rate** — % of employees who completed training.
4. **Average Engagement** — Average activities per employee.

```
social_score = (participation_rate × 0.35)
             + (diversity_index × 0.25)
             + (training_completion × 0.20)
             + (engagement_rate × 0.20)
```

---

## Dashboard Widgets

| Widget                    | Type       | Data Source                      |
| ------------------------- | ---------- | -------------------------------- |
| Total Participations      | KPI Card   | Count of approved participations |
| Participation Rate        | KPI Card   | Approved / Total Employees       |
| CSR Activities This Month | KPI Card   | Count of active activities       |
| Participation Trend       | Line Chart | Monthly participation counts     |
| Department Engagement     | Bar Chart  | Participations per department    |
| Diversity Breakdown       | Pie Chart  | Gender / role distribution       |
| Pending Approvals         | Table      | Participations with status=pending |
| Social Score              | Gauge      | department_scores.social_score   |

---

## API Endpoints

| Method | Path                                   | Description            |
| ------ | -------------------------------------- | ---------------------- |
| GET    | `/social/csr-activities`               | List CSR activities    |
| POST   | `/social/csr-activities`               | Create CSR activity    |
| PATCH  | `/social/csr-activities/{id}`          | Update CSR activity    |
| GET    | `/social/participations`               | List participations    |
| POST   | `/social/participations`               | Submit participation   |
| PATCH  | `/social/participations/{id}/approve`  | Approve participation  |
| PATCH  | `/social/participations/{id}/reject`   | Reject participation   |
| GET    | `/social/diversity`                    | Diversity metrics data |
| GET    | `/social/dashboard`                    | Social dashboard data  |
