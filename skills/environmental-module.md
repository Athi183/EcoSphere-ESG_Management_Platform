# Environmental Module

## Purpose

Track and manage an organization's carbon footprint. Configure emission factors, record carbon transactions from daily business operations, set sustainability goals, and visualize environmental performance.

---

## Features

1. **Emission Factor Management** — CRUD for emission factors used in carbon calculations.
2. **Carbon Transaction Tracking** — Record or auto-calculate CO₂ emissions from operations.
3. **Sustainability Goals** — Set and track environmental targets per department.
4. **Department Carbon Tracking** — Aggregate emissions by department.
5. **Environmental Dashboard** — Visualize trends, top emitters, goal progress.

---

## Workflow

```
Configure Emission Factors
        ↓
Business Operations occur
(Purchase Orders, Manufacturing, Expenses, Fleet)
        ↓
Carbon Transactions created
(Manual entry OR auto-calculated from operations)
        ↓
CO₂ = Quantity × Emission Factor Value
        ↓
Aggregated per Department
        ↓
Compared against Sustainability Goals
        ↓
Environmental Score calculated
        ↓
Feeds into Department Total Score
```

---

## Emission Factors

Emission factors convert operational quantities into CO₂ equivalents.

| Source Type    | Example                     | Unit  | Factor (kg CO₂e) |
| -------------- | --------------------------- | ----- | ----------------- |
| Electricity    | Grid power consumption      | kWh   | 0.42              |
| Fuel           | Diesel for fleet            | liter | 2.68              |
| Materials      | Steel procurement           | kg    | 1.85              |
| Waste          | General landfill waste      | kg    | 0.58              |
| Fleet          | Vehicle kilometers driven   | km    | 0.21              |

### Fields

- `name` — Descriptive name (e.g., "Grid Electricity - US Average")
- `code` — Short code (e.g., "EF-ELEC-US")
- `source_type` — electricity / fuel / waste / materials / fleet
- `factor_value` — kg CO₂e per unit
- `unit` — Unit of measurement
- `status` — active / inactive

---

## Carbon Transactions

Each transaction represents a CO₂ emission event.

### Manual Entry

User fills in:
- Date
- Department
- Emission factor
- Quantity
- Source reference (optional, e.g., PO-0042)

**Calculated CO₂** = `quantity × emission_factor.factor_value`

### Auto Emission Calculation

When the **Auto Emission Calculation** setting is enabled:

1. A Purchase Order is confirmed → system finds the matching emission factor for the product → creates a carbon transaction automatically.
2. A Manufacturing Order is completed → same logic.
3. An Expense is posted → same logic.
4. A Fleet log is recorded → same logic.

The `source_type` field records where it came from (purchase / manufacturing / expense / fleet).
The `source_reference` field stores the document reference.

---

## Sustainability Goals

Goals let departments set environmental targets.

### Fields

- `name` — Goal name (e.g., "Reduce Q3 emissions by 15%")
- `department_id` — Which department owns this goal
- `target_value` — Target number (e.g., 500 kg CO₂e)
- `current_value` — Auto-calculated from carbon transactions in the date range
- `unit` — kg CO₂e / kWh / etc.
- `start_date`, `end_date` — Goal period
- `status` — draft / in_progress / achieved / failed

### Status Logic

- **Achieved**: `current_value <= target_value` after `end_date`.
- **Failed**: `current_value > target_value` after `end_date`.
- **In Progress**: Before `end_date`.

---

## Environmental Score Calculation

The Environmental Score for a department (0-100) considers:

1. **Goal Achievement Rate** — % of sustainability goals achieved.
2. **Emission Trend** — Is CO₂ decreasing over time?
3. **Emission Intensity** — CO₂ per employee.

```
env_score = (goal_achievement_rate × 0.40)
          + (emission_reduction_pct × 0.35)
          + (intensity_improvement × 0.25)
```

This feeds into the department's `environmental_score` in `department_scores`.

---

## Dashboard Widgets

| Widget                  | Type       | Data Source                    |
| ----------------------- | ---------- | ------------------------------ |
| Total CO₂ This Period   | KPI Card   | Sum of carbon_transactions     |
| CO₂ Trend               | Line Chart | Monthly carbon_transactions    |
| Top Emitting Departments | Bar Chart | Grouped carbon_transactions   |
| Goal Progress            | Progress Bars | environmental_goals         |
| Recent Transactions      | Table      | Latest carbon_transactions    |
| Environmental Score      | Gauge      | department_scores             |

---

## API Endpoints

| Method | Path                                     | Description                |
| ------ | ---------------------------------------- | -------------------------- |
| GET    | `/environmental/emission-factors`        | List emission factors      |
| POST   | `/environmental/emission-factors`        | Create emission factor     |
| PATCH  | `/environmental/emission-factors/{id}`   | Update emission factor     |
| DELETE | `/environmental/emission-factors/{id}`   | Delete emission factor     |
| GET    | `/environmental/carbon-transactions`     | List carbon transactions   |
| POST   | `/environmental/carbon-transactions`     | Create carbon transaction  |
| GET    | `/environmental/goals`                   | List sustainability goals  |
| POST   | `/environmental/goals`                   | Create goal                |
| PATCH  | `/environmental/goals/{id}`              | Update goal                |
| GET    | `/environmental/dashboard`               | Dashboard aggregation data |
