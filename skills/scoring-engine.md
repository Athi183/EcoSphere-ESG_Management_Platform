# Scoring Engine

## Purpose

Calculate Environmental, Social, and Governance scores per department, then aggregate into Department Total Scores and an Overall ESG Score for the organization.

---

## Scoring Hierarchy

```
Environmental Score (per department)
Social Score (per department)
Governance Score (per department)
        ↓
Department Total Score = weighted average
        ↓
Overall ESG Score = weighted average of all Department Total Scores
```

---

## Default Weights (Configurable)

| Component       | Default Weight | Setting Key          |
| --------------- | -------------- | -------------------- |
| Environmental   | 40%            | `env_weight`         |
| Social          | 30%            | `social_weight`      |
| Governance      | 30%            | `governance_weight`  |

Weights are stored in `esg_settings` table and configurable by Admin.

Constraint: `env_weight + social_weight + governance_weight = 1.0`

---

## Environmental Score (0-100)

Calculated per department based on:

| Factor                  | Weight | Calculation                                   |
| ----------------------- | ------ | --------------------------------------------- |
| Goal Achievement Rate   | 40%    | `achieved_goals / total_goals × 100`          |
| Emission Reduction      | 35%    | `(prev_period_co2 - current_co2) / prev_period_co2 × 100` |
| Emission Intensity      | 25%    | `100 - (co2_per_employee / benchmark × 100)` |

```python
def calculate_environmental_score(department_id, period, db):
    # Goal achievement
    goals = get_department_goals(db, department_id, period)
    goal_rate = count_achieved(goals) / max(len(goals), 1) * 100

    # Emission reduction (vs previous period)
    current_co2 = sum_emissions(db, department_id, period)
    prev_co2 = sum_emissions(db, department_id, previous_period(period))
    reduction = ((prev_co2 - current_co2) / max(prev_co2, 1)) * 100
    reduction = max(0, min(reduction, 100))  # Clamp 0-100

    # Emission intensity
    employee_count = get_employee_count(db, department_id)
    co2_per_employee = current_co2 / max(employee_count, 1)
    benchmark = get_benchmark(db)  # Organization average
    intensity_score = max(0, 100 - (co2_per_employee / max(benchmark, 1) * 100))

    env_score = (goal_rate * 0.40) + (reduction * 0.35) + (intensity_score * 0.25)
    return round(min(max(env_score, 0), 100), 2)
```

---

## Social Score (0-100)

Calculated per department based on:

| Factor                  | Weight | Calculation                                   |
| ----------------------- | ------ | --------------------------------------------- |
| Participation Rate      | 35%    | `participating_employees / total_employees × 100` |
| Diversity Index         | 25%    | Based on gender/role distribution evenness     |
| Training Completion     | 20%    | `completed_training / total_employees × 100`   |
| Engagement Rate         | 20%    | `total_participations / total_employees`        |

```python
def calculate_social_score(department_id, period, db):
    dept_employees = get_department_employees(db, department_id)
    total = max(len(dept_employees), 1)

    # Participation rate
    participated = count_participated_employees(db, department_id, period)
    participation_rate = (participated / total) * 100

    # Diversity index (Simpson's Diversity Index simplified)
    diversity_index = calculate_diversity(db, department_id)

    # Training completion
    training_completed = count_training_completed(db, department_id, period)
    training_rate = (training_completed / total) * 100

    # Engagement (average activities per employee)
    total_participations = count_all_participations(db, department_id, period)
    engagement = min((total_participations / total) * 20, 100)  # Normalize

    social_score = (participation_rate * 0.35) + (diversity_index * 0.25) \
                 + (training_rate * 0.20) + (engagement * 0.20)
    return round(min(max(social_score, 0), 100), 2)
```

---

## Governance Score (0-100)

Calculated per department based on:

| Factor                  | Weight  | Calculation                                   |
| ----------------------- | ------- | --------------------------------------------- |
| Audit Average           | 35%     | Average audit score for the department         |
| Policy Compliance       | 25%     | `acknowledged / total_required × 100`          |
| On-Time Resolution      | 25%     | `resolved_on_time / total_issues × 100`        |
| Overdue Penalty         | -2 each | Deduct 2 points per open overdue issue         |

```python
def calculate_governance_score(department_id, period, db):
    # Audit average
    audits = get_department_audits(db, department_id, period)
    avg_audit = mean([a.score for a in audits if a.score]) if audits else 50

    # Policy compliance
    required_acks = count_required_acknowledgements(db, department_id)
    completed_acks = count_completed_acknowledgements(db, department_id)
    policy_compliance = (completed_acks / max(required_acks, 1)) * 100

    # Issue resolution
    total_issues = count_department_issues(db, department_id, period)
    resolved_on_time = count_resolved_on_time(db, department_id, period)
    resolution_rate = (resolved_on_time / max(total_issues, 1)) * 100

    # Overdue penalty
    overdue_count = count_overdue_issues(db, department_id)
    penalty = overdue_count * 2.0

    gov_score = (avg_audit * 0.35) + (policy_compliance * 0.25) \
              + (resolution_rate * 0.25) - penalty
    return round(min(max(gov_score, 0), 100), 2)
```

---

## Department Total Score

```python
def calculate_department_total_score(env_score, social_score, gov_score, settings):
    total = (env_score * settings.env_weight) \
          + (social_score * settings.social_weight) \
          + (gov_score * settings.governance_weight)
    return round(total, 2)
```

---

## Overall ESG Score (Organization-Level)

Weighted average of all Department Total Scores, weighted by department employee count.

```python
def calculate_overall_esg_score(db, period):
    dept_scores = get_all_department_scores(db, period)
    total_employees = sum(ds.department.employee_count for ds in dept_scores)

    if total_employees == 0:
        return 0

    weighted_sum = sum(
        ds.total_score * ds.department.employee_count
        for ds in dept_scores
    )
    return round(weighted_sum / total_employees, 2)
```

---

## When to Recalculate

Scores should be recalculated when:

| Trigger                           | What to Recalculate        |
| --------------------------------- | -------------------------- |
| Carbon transaction created/updated | Environmental Score       |
| Goal status changes               | Environmental Score        |
| CSR participation approved         | Social Score              |
| Challenge participation approved   | Social Score              |
| Audit completed                    | Governance Score           |
| Compliance issue resolved          | Governance Score           |
| Policy acknowledged                | Governance Score           |
| Any component score changes        | Department Total Score     |
| Any department score changes       | Overall ESG Score          |

### Implementation Approach

Option A: **Real-time** — Recalculate on every relevant event (via service hooks).
Option B: **Periodic** — Scheduled cron job recalculates all scores every hour/day.
Option C: **Hybrid** — Cache scores, invalidate on relevant events, recalculate on next read.

**Recommended: Option A** for a hackathon — keeps it simple and responsive.

---

## Storage

Scores are stored in the `department_scores` table:

```
department_scores
├── department_id
├── period (e.g., "2026-Q2" or "2026-07")
├── environmental_score
├── social_score
├── governance_score
└── total_score
```

---

## API Endpoints

| Method | Path                          | Description                 |
| ------ | ----------------------------- | --------------------------- |
| GET    | `/dashboard/scores`           | All department scores       |
| GET    | `/dashboard/overall-score`    | Organization ESG score      |
| GET    | `/departments/{id}/scores`    | Specific department scores  |
| POST   | `/scores/recalculate`         | Force recalculation (admin) |
