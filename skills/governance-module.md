# Governance Module

## Purpose

Manage ESG policies, track employee policy acknowledgements, conduct governance audits, and handle compliance issues with ownership and deadlines.

---

## Features

1. **ESG Policies** — Create, publish, and manage governance policies.
2. **Policy Acknowledgements** — Track employee acceptance of policies.
3. **Audits** — Schedule and conduct governance audits per department.
4. **Compliance Issues** — Track violations found during audits with assigned owners and due dates.
5. **Governance Dashboard** — Visualize compliance status, audit results, and overdue issues.

---

## Workflow

```
Admin creates ESG Policy
        ↓
Policy published (status: active)
        ↓
Employees receive acknowledgement request
(notification sent)
        ↓
Employees acknowledge policy
        ↓
Auditor schedules Audit for a department
        ↓
Audit conducted → findings recorded → score assigned
        ↓
Compliance Issues raised from audit findings
(each with owner + due date)
        ↓
Issue owners resolve issues before due date
        ↓
Overdue issues flagged → notifications sent
        ↓
Governance Score calculated
        ↓
Feeds into Department Total Score
```

---

## ESG Policies

Governance documents that employees must acknowledge.

### Fields

- `title` — Policy name
- `content` — Full policy text (rich text / HTML)
- `effective_date` — When the policy takes effect
- `requires_acknowledgement` — Whether employees must acknowledge
- `status` — draft / active / archived

### Status Transitions

```
Draft → Active → Archived
```

When a policy becomes **Active** and `requires_acknowledgement` is true:
- Create `policy_acknowledgement` records for all active employees (status: pending).
- Send notification/reminder to all employees.

---

## Policy Acknowledgements

Track individual employee policy acceptance.

### Fields

- `policy_id` — Which policy
- `employee_id` — Which employee
- `acknowledged_date` — When acknowledged (null if pending)
- `status` — pending / acknowledged

### Business Rules

- One acknowledgement per employee per policy (unique constraint).
- Reminder notifications sent for pending acknowledgements (configurable interval).
- Dashboard shows % acknowledged per policy.

---

## Audits

Governance reviews conducted per department.

### Fields

- `title` — Audit name (e.g., "Q2 2026 Engineering Audit")
- `department_id` — Department being audited
- `auditor_id` — User conducting the audit (role: auditor or admin)
- `audit_date` — Date of audit
- `score` — Audit score (0-100), assigned upon completion
- `findings` — Text summary of findings
- `status` — scheduled / in_progress / completed

### Status Transitions

```
Scheduled → In Progress → Completed
```

On completion, the `score` is finalized and feeds into the governance score.

---

## Compliance Issues

Problems found during audits that need resolution.

### Fields

- `audit_id` — Which audit raised this issue
- `title` — Issue title
- `description` — Detailed description
- `severity` — low / medium / high / critical
- `owner_id` — **Required.** User responsible for resolution.
- `due_date` — **Required.** Deadline for resolution.
- `status` — open / in_progress / resolved
- `is_overdue` — Computed: `due_date < today AND status != resolved`

### Business Rules (Mandatory)

1. **Every Compliance Issue must have an Owner** — `owner_id` is NOT NULL.
2. **Every Compliance Issue must have a Due Date** — `due_date` is NOT NULL.
3. **Overdue Detection** — Issues where `due_date < today` and `status` is not `resolved` are flagged as overdue.
4. **Overdue Notification** — When an issue becomes overdue, a notification is sent to:
   - The issue owner
   - The department head
   - Admin users
5. **Severity Escalation** — Critical severity issues can optionally trigger immediate notifications.

### Status Transitions

```
Open → In Progress → Resolved
```

Issues cannot be deleted — only resolved.

---

## Governance Score Calculation

The Governance Score for a department (0-100) considers:

1. **Audit Average** — Average score of completed audits for the department.
2. **Policy Compliance** — % of employees who acknowledged all required policies.
3. **Issue Resolution** — % of compliance issues resolved on time.
4. **Open Issue Penalty** — Deduction for each open/overdue issue.

```
governance_score = (avg_audit_score × 0.35)
                 + (policy_compliance_pct × 0.25)
                 + (on_time_resolution_pct × 0.25)
                 - (overdue_issues_count × 2.0)
```

Minimum score is 0.

---

## Dashboard Widgets

| Widget                   | Type       | Data Source                     |
| ------------------------ | ---------- | ------------------------------- |
| Total Policies           | KPI Card   | Count of active policies        |
| Acknowledgement Rate     | KPI Card   | Acknowledged / Total            |
| Open Issues              | KPI Card   | Count of open compliance issues |
| Overdue Issues           | KPI Card   | Count of overdue issues (red)   |
| Audit History            | Table      | Recent completed audits         |
| Audit Scores             | Bar Chart  | Audit scores by department      |
| Compliance Issues        | Table      | Open issues with severity, owner, due date |
| Policy Ack Progress      | Progress Bars | Per-policy acknowledgement % |
| Governance Score         | Gauge      | department_scores.governance_score |

---

## API Endpoints

| Method | Path                                         | Description              |
| ------ | -------------------------------------------- | ------------------------ |
| GET    | `/governance/policies`                       | List policies            |
| POST   | `/governance/policies`                       | Create policy            |
| PATCH  | `/governance/policies/{id}`                  | Update policy            |
| GET    | `/governance/acknowledgements`               | List acknowledgements    |
| POST   | `/governance/acknowledgements`               | Acknowledge a policy     |
| GET    | `/governance/audits`                         | List audits              |
| POST   | `/governance/audits`                         | Create audit             |
| PATCH  | `/governance/audits/{id}`                    | Update audit             |
| GET    | `/governance/compliance-issues`              | List compliance issues   |
| POST   | `/governance/compliance-issues`              | Create compliance issue  |
| PATCH  | `/governance/compliance-issues/{id}`         | Update compliance issue  |
| GET    | `/governance/dashboard`                      | Governance dashboard data |
