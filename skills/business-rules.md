# Business Rules

## Purpose

This document defines all **mandatory** business rules that are **in-scope** and must be implemented. These are not optional features.

---

## 1. Reward Redemption

**Rule:** Employees can redeem earned XP/Points for a Reward from the catalog.

### Conditions

- Employee's `xp_balance >= reward.points_required`.
- Reward's `stock > 0`.
- Reward's `status == "available"`.

### Actions on Redemption

1. Deduct XP: `employee.xp_balance -= reward.points_required`.
2. Deduct stock: `reward.stock -= 1`.
3. If `reward.stock == 0`, update `reward.status = "out_of_stock"`.
4. Create `reward_redemptions` record.
5. Send notification to employee.

### Validation Errors

- `"Insufficient XP balance"` — if `xp_balance < points_required`.
- `"Reward is out of stock"` — if `stock <= 0`.

---

## 2. Auto Emission Calculation

**Rule:** When enabled via Settings toggle, Carbon Transactions are auto-calculated from linked ERP operations.

### Trigger

When a Purchase Order, Manufacturing Order, Expense, or Fleet record is created/confirmed.

### Logic

1. Look up the Emission Factor associated with the product/source type.
2. Calculate: `co2 = quantity × emission_factor.factor_value`.
3. Create a `carbon_transaction` record with:
   - `source_type` = "purchase" / "manufacturing" / "expense" / "fleet"
   - `source_reference` = Document reference (e.g., "PO-0042")
   - `calculated_co2` = computed value

### Setting

`esg_settings.auto_emission_calculation` (Boolean, default: false)

### When Disabled

Users must manually create carbon transactions.

---

## 3. Evidence Requirement

**Rule:** When enabled via Settings toggle, CSR Activity participation and Challenge participation cannot be marked **Approved** without an attached proof file.

### Validation

```python
if settings.evidence_required and not participation.proof_file:
    raise HTTPException(
        status_code=400,
        detail="Proof file is required before approval"
    )
```

### Applies To

- `employee_participations` (CSR Activity participation)
- `challenge_participations` (Challenge participation)

### Setting

`esg_settings.evidence_required` (Boolean, default: false)

---

## 4. Badge Auto-Award

**Rule:** When enabled via Settings toggle, a Badge is automatically assigned to an employee the moment their XP, completed-challenge count, or other tracked metric satisfies that Badge's Unlock Rule.

### Trigger Points

Badge check runs after:
- CSR participation is approved (XP changes, CSR count changes).
- Challenge participation is approved (XP changes, challenge count changes).

### Unlock Rules

| `unlock_rule`    | Condition                                            |
| ---------------- | ---------------------------------------------------- |
| `xp_threshold`   | `employee.total_xp_earned >= badge.unlock_value`     |
| `challenge_count` | `completed_challenges_count >= badge.unlock_value`  |
| `csr_count`      | `approved_csr_count >= badge.unlock_value`           |

### Actions on Unlock

1. Create `user_badges` record (`user_id`, `badge_id`, `awarded_at`).
2. Send notification: "🏆 You earned the '{badge_name}' badge!"

### Setting

`esg_settings.badge_auto_award` (Boolean, default: true)

### When Disabled

Admins manually award badges through the admin interface.

---

## 5. Compliance Issue Ownership

**Rule:** Every Compliance Issue must have an assigned Owner and a Due Date.

### Database Enforcement

- `compliance_issues.owner_id` → NOT NULL
- `compliance_issues.due_date` → NOT NULL

### Overdue Detection

Issues that pass their Due Date while still Open or In Progress are flagged:

- `is_overdue = (due_date < today) AND (status != "resolved")`

### Overdue Actions

1. Set `is_overdue = True`.
2. Send notification to:
   - Issue owner
   - Department head
   - Admin users
3. Overdue issues count as a penalty in the Governance Score.

### Scheduled Check

A daily cron job scans for newly overdue issues:

```python
# Runs daily at midnight
def check_overdue_compliance_issues():
    overdue = query(
        ComplianceIssue.due_date < today(),
        ComplianceIssue.status != "resolved",
        ComplianceIssue.is_overdue == False,
    )
    for issue in overdue:
        issue.is_overdue = True
        notify_stakeholders(issue)
```

---

## 6. Notification Events (Mandatory)

The following notifications **must** be implemented:

| Event                          | Notification Required |
| ------------------------------ | --------------------- |
| New compliance issue raised    | ✅ Yes                |
| Compliance issue overdue       | ✅ Yes                |
| CSR participation approved     | ✅ Yes                |
| CSR participation rejected     | ✅ Yes                |
| Challenge approved             | ✅ Yes                |
| Challenge rejected             | ✅ Yes                |
| Badge unlocked                 | ✅ Yes                |
| Policy acknowledgement reminder | ✅ Yes               |
| Reward redeemed                | ✅ Yes                |

Configurable via `Settings → Notification Settings`.

---

## 7. Challenge Lifecycle

**Rule:** Challenges follow a strict state machine.

### Valid Transitions

| From         | To           | Who Can Trigger    |
| ------------ | ------------ | ------------------ |
| Draft        | Active       | Admin, Manager     |
| Draft        | Archived     | Admin, Manager     |
| Active       | Under Review | System (deadline) or Admin/Manager |
| Active       | Archived     | Admin, Manager     |
| Under Review | Completed    | Admin, Manager (after all reviewed) |
| Under Review | Archived     | Admin, Manager     |
| Completed    | Archived     | Admin, Manager     |

### Invalid Transitions

Any transition not listed above must be rejected:

```python
VALID_TRANSITIONS = {
    "draft": ["active", "archived"],
    "active": ["under_review", "archived"],
    "under_review": ["completed", "archived"],
    "completed": ["archived"],
    "archived": [],  # Terminal state
}

def transition_challenge(challenge, new_status):
    if new_status not in VALID_TRANSITIONS.get(challenge.status, []):
        raise HTTPException(400, f"Cannot transition from {challenge.status} to {new_status}")
    challenge.status = new_status
```

---

## 8. Participation Constraints

### CSR Participation

- One participation per employee per activity (unique constraint on `employee_id + activity_id`).
- Can only participate in **active** CSR activities.

### Challenge Participation

- One participation per employee per challenge (unique constraint on `employee_id + challenge_id`).
- Can only join **active** challenges.

---

## 9. XP Balance Integrity

- `xp_balance` can never go negative.
- `total_xp_earned` never decreases.
- `xp_balance = total_xp_earned - sum(reward_redemptions.points_spent)`

Validate before any deduction:

```python
if employee.xp_balance < points_to_deduct:
    raise HTTPException(400, "Insufficient XP balance")
```

---

## 10. ESG Score Weights

- Default: Environmental 40%, Social 30%, Governance 30%.
- Configurable per organization via `esg_settings`.
- Weights must always sum to 1.0 (100%).

```python
def validate_weights(env, social, gov):
    if abs((env + social + gov) - 1.0) > 0.001:
        raise HTTPException(400, "ESG weights must sum to 1.0")
```

---

## 11. Stock Validation (Rewards)

- Cannot redeem a reward with `stock <= 0`.
- Stock must be validated at the moment of redemption (not just at page load).
- Use database-level check or row-level locking to prevent race conditions.

---

## 12. Due Date Validation (Compliance Issues)

- `due_date` must be in the future when creating a new issue.
- `due_date` can be extended but not set to a past date when updating.

```python
if issue_data.due_date <= date.today():
    raise HTTPException(400, "Due date must be in the future")
```
