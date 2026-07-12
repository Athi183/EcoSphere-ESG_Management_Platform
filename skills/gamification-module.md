# Gamification Module

## Purpose

Engage employees in sustainability through challenges, XP (experience points), badges, rewards, and leaderboards. Gamification is the primary driver of employee engagement with ESG activities.

---

## Features

1. **Challenges** — Sustainability challenges with full lifecycle management.
2. **Challenge Participation** — Employee enrollment, progress tracking, and approval.
3. **XP System** — Points earned from CSR activities and challenges.
4. **Badges** — Auto-awarded achievements based on unlock rules.
5. **Rewards** — Redeemable catalog items using earned XP/points.
6. **Leaderboards** — Rankings by XP, challenges completed, and department.

---

## Challenge Lifecycle

Challenges follow a strict state machine:

```
    ┌─────────────────────────────────────────┐
    │           Can be Archived at            │
    │           any point below               │
    └─────────────────────────────────────────┘

    Draft → Active → Under Review → Completed
      │        │          │             │
      └────────┴──────────┴─────────────┴──→ Archived
```

### State Definitions

| State        | Description                                          |
| ------------ | ---------------------------------------------------- |
| Draft        | Challenge created but not yet visible to employees.  |
| Active       | Challenge is live. Employees can join and participate. |
| Under Review | Deadline passed or manually triggered. Submissions being reviewed. |
| Completed    | All submissions reviewed. XP awarded. Challenge closed. |
| Archived     | Challenge removed from active view. Can happen from any state. |

### Transition Rules

| From         | To           | Triggered By              |
| ------------ | ------------ | ------------------------- |
| Draft        | Active       | Admin/Manager publishes   |
| Draft        | Archived     | Admin/Manager archives    |
| Active       | Under Review | Deadline passes OR manual |
| Active       | Archived     | Admin/Manager archives    |
| Under Review | Completed    | All participations reviewed |
| Under Review | Archived     | Admin/Manager archives    |
| Completed    | Archived     | Admin/Manager archives    |

---

## Challenge Fields

- `title` — Challenge name (e.g., "Zero Waste Week")
- `category_id` — FK to categories (type = challenge)
- `description` — What the challenge entails
- `xp` — XP awarded upon approved completion
- `difficulty` — easy / medium / hard
- `evidence_required` — Whether proof upload is mandatory
- `deadline` — Optional end date
- `status` — draft / active / under_review / completed / archived
- `created_by` — Admin/Manager who created it

---

## Challenge Participation

### Fields

- `challenge_id` — Which challenge
- `employee_id` — Participating employee
- `progress` — 0-100% completion
- `proof_file` — Evidence upload
- `proof_filename` — Original file name
- `approval_status` — pending / approved / rejected
- `approver_id` — Manager who reviewed
- `xp_awarded` — XP given upon approval

### Participation Rules

1. **One participation per employee per challenge** (unique constraint).
2. **Can only join Active challenges.**
3. **Evidence Required** — If `challenge.evidence_required` is true, approval requires proof_file.
4. **Approval triggers XP award:**
   - `xp_awarded = challenge.xp`
   - `employee.xp_balance += challenge.xp`
   - `employee.total_xp_earned += challenge.xp`
   - Badge auto-award check triggered.
   - Notification sent to employee.

### Approval Flow

```
Employee joins challenge → progress: 0%, status: pending
        ↓
Employee updates progress and submits proof
        ↓
Challenge enters Under Review
        ↓
Manager reviews participation
        ↓
   Approve                          Reject
     ↓                                ↓
xp_awarded = challenge.xp         xp_awarded = 0
employee.xp_balance += xp         notification: rejected
badge check triggered
notification: approved + XP earned
```

---

## XP System

XP (Experience Points) are the universal currency for gamification.

### XP Sources

| Source                    | XP Amount                |
| ------------------------- | ------------------------ |
| CSR Activity Participation | `csr_activity.xp_reward` |
| Challenge Completion       | `challenge.xp`           |

### Employee XP Fields

- `xp_balance` — Current spendable XP (decreases on reward redemption).
- `total_xp_earned` — Lifetime XP earned (never decreases; used for leaderboard ranking and badge unlock).

### XP Formula

```
xp_balance = total_xp_earned - total_xp_spent_on_rewards
```

---

## Badges

Achievement markers auto-awarded when conditions are met.

### Fields

- `name` — Badge name (e.g., "Eco Champion")
- `description` — What it represents
- `icon` — Image/icon URL
- `unlock_rule` — xp_threshold / challenge_count / csr_count
- `unlock_value` — Numeric threshold

### Unlock Rules

| Rule Type        | Condition                                    | Example                     |
| ---------------- | -------------------------------------------- | --------------------------- |
| xp_threshold     | `employee.total_xp_earned >= unlock_value`   | "Earn 500 XP" → unlock_value: 500 |
| challenge_count  | `completed_challenges_count >= unlock_value` | "Complete 10 challenges" → 10 |
| csr_count        | `approved_csr_participations >= unlock_value` | "Join 5 CSR activities" → 5 |

### Badge Auto-Award (Setting Toggle)

When **Badge Auto-Award** is enabled in settings:

1. After any XP change or challenge/CSR approval, the system checks all un-awarded badges.
2. For each badge where the employee meets the `unlock_rule`:
   - Create `user_badges` record.
   - Send notification: "🏆 You earned the {badge.name} badge!"
3. If disabled, admins manually award badges.

### Check Logic (Pseudocode)

```python
def check_badge_unlock(employee_id: int, db: Session):
    employee = get_employee(db, employee_id)
    awarded_badge_ids = get_awarded_badge_ids(db, employee_id)
    all_badges = get_all_badges(db)

    for badge in all_badges:
        if badge.id in awarded_badge_ids:
            continue

        unlocked = False
        if badge.unlock_rule == "xp_threshold":
            unlocked = employee.total_xp_earned >= badge.unlock_value
        elif badge.unlock_rule == "challenge_count":
            count = count_completed_challenges(db, employee_id)
            unlocked = count >= badge.unlock_value
        elif badge.unlock_rule == "csr_count":
            count = count_approved_csr(db, employee_id)
            unlocked = count >= badge.unlock_value

        if unlocked:
            award_badge(db, employee_id, badge.id)
            send_notification(employee_id, f"🏆 Badge Unlocked: {badge.name}")
```

---

## Rewards

Items employees can redeem using earned XP/points.

### Fields

- `name` — Reward name (e.g., "Extra Day Off")
- `description` — What the reward is
- `points_required` — XP cost to redeem
- `stock` — Available quantity (decrements on redemption)
- `status` — available / out_of_stock

### Redemption Rules

1. Employee must have `xp_balance >= reward.points_required`.
2. Reward must have `stock > 0`.
3. On redemption:
   - `employee.xp_balance -= reward.points_required`
   - `reward.stock -= 1`
   - If `reward.stock == 0`, set `reward.status = "out_of_stock"`.
   - Create `reward_redemptions` record.
   - Send notification: "🎁 You redeemed {reward.name}!"
4. **Stock validation is mandatory** — cannot redeem out-of-stock rewards.

---

## Leaderboards

Rankings of employees and departments by ESG engagement.

### Individual Leaderboard

Ranked by `total_xp_earned` (descending).

Display:
- Rank
- Employee name
- Department
- Total XP
- Challenges completed
- Badges earned

### Department Leaderboard

Ranked by `department_scores.total_score` (descending).

Display:
- Rank
- Department name
- Environmental Score
- Social Score
- Governance Score
- Total Score

### Filters

- Time period (this month / quarter / year / all-time)
- Department
- Difficulty level

---

## Dashboard Widgets

| Widget                    | Type       | Data Source                     |
| ------------------------- | ---------- | ------------------------------- |
| Active Challenges         | KPI Card   | Count of active challenges      |
| My XP Balance             | KPI Card   | Current user's xp_balance       |
| Badges Earned             | KPI Card   | Current user's badge count      |
| Top Performers            | Table      | Leaderboard top 10              |
| Challenge Progress        | Progress Bars | User's active participations  |
| Recent Badges             | Card Grid  | Recently unlocked badges        |
| Reward Catalog            | Card Grid  | Available rewards with stock    |
| Challenge Status Overview | Pie Chart  | Challenges by status            |

---

## API Endpoints

| Method | Path                                                  | Description               |
| ------ | ----------------------------------------------------- | ------------------------- |
| GET    | `/gamification/challenges`                            | List challenges           |
| POST   | `/gamification/challenges`                            | Create challenge          |
| PATCH  | `/gamification/challenges/{id}`                       | Update challenge          |
| PATCH  | `/gamification/challenges/{id}/transition`            | Transition state          |
| GET    | `/gamification/challenge-participations`              | List participations       |
| POST   | `/gamification/challenge-participations`              | Join a challenge          |
| PATCH  | `/gamification/challenge-participations/{id}`         | Update progress           |
| PATCH  | `/gamification/challenge-participations/{id}/approve` | Approve participation     |
| PATCH  | `/gamification/challenge-participations/{id}/reject`  | Reject participation      |
| GET    | `/gamification/badges`                                | List all badges           |
| POST   | `/gamification/badges`                                | Create badge              |
| GET    | `/gamification/rewards`                               | List reward catalog       |
| POST   | `/gamification/rewards`                               | Create reward             |
| PATCH  | `/gamification/rewards/{id}`                          | Update reward             |
| POST   | `/gamification/rewards/{id}/redeem`                   | Redeem a reward           |
| GET    | `/gamification/leaderboard`                           | Get leaderboard           |
| GET    | `/gamification/dashboard`                             | Gamification dashboard    |
