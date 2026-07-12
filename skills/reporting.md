# Reporting

## Purpose

Generate comprehensive ESG reports with filtering, visualization, and export capabilities. Includes pre-built reports and a custom report builder.

---

## Report Types

### 1. Environmental Report

**Content:**
- Total CO₂ emissions for the period
- Emissions breakdown by source type (electricity, fuel, waste, materials, fleet)
- Emissions breakdown by department
- Emission trend over time (monthly/quarterly)
- Sustainability goal progress
- Top emitting departments
- Comparison to previous period

### 2. Social Report

**Content:**
- CSR activities conducted
- Total employee participations
- Participation rate (% of employees engaged)
- Top participating departments
- XP distributed
- Diversity metrics snapshot
- Training completion rates
- Engagement trend over time

### 3. Governance Report

**Content:**
- Active policies and acknowledgement rates
- Audits conducted and average scores
- Open compliance issues by severity
- Overdue issues (highlighted)
- Resolution rate and average resolution time
- Department compliance rankings

### 4. ESG Summary Report

**Content:**
- Overall ESG Score (weighted average)
- Environmental, Social, and Governance scores
- Department rankings by total score
- Key highlights and improvements
- Risk areas (low-scoring departments)
- Period-over-period comparison

### 5. Custom Report Builder

**Features:**
- Select data modules to include (Environmental, Social, Governance, Gamification)
- Apply filters (see below)
- Choose visualization types
- Preview report before export
- Save report templates for reuse

---

## Filters

All reports support the following filters:

| Filter        | Type          | Options                        |
| ------------- | ------------- | ------------------------------ |
| Department    | Multi-select  | All departments                |
| Date Range    | Date picker   | Start date → End date          |
| Module        | Multi-select  | Environmental / Social / Governance |
| Employee      | Search select | Employee lookup                |
| Challenge     | Multi-select  | All challenges                 |
| ESG Category  | Multi-select  | All categories                 |

---

## Export Formats

| Format | Library / Method          | Content Type                  |
| ------ | ------------------------- | ----------------------------- |
| PDF    | ReportLab or WeasyPrint   | `application/pdf`             |
| Excel  | openpyxl or XlsxWriter    | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| CSV    | Python csv module          | `text/csv`                    |

### Export API

```
GET /api/v1/reports/export/{format}?type=environmental&department_id=3&date_from=2026-01-01&date_to=2026-06-30
```

Where `{format}` is `pdf`, `xlsx`, or `csv`.

---

## Backend Implementation

### Report Service

```python
class ReportService:
    def generate_environmental_report(self, db, filters: ReportFilters) -> ReportData:
        # 1. Query carbon_transactions with filters
        # 2. Aggregate by department, source_type, month
        # 3. Query goals and their progress
        # 4. Build report data structure
        pass

    def generate_social_report(self, db, filters: ReportFilters) -> ReportData:
        # 1. Query CSR activities and participations
        # 2. Calculate rates and trends
        # 3. Query diversity metrics
        pass

    def generate_governance_report(self, db, filters: ReportFilters) -> ReportData:
        # 1. Query policies, acknowledgements
        # 2. Query audits and scores
        # 3. Query compliance issues
        pass

    def generate_esg_summary(self, db, filters: ReportFilters) -> ReportData:
        # 1. Combine all three module reports
        # 2. Calculate overall ESG score
        # 3. Department rankings
        pass

    def export_report(self, report_data: ReportData, format: str) -> bytes:
        if format == "pdf":
            return self._generate_pdf(report_data)
        elif format == "xlsx":
            return self._generate_excel(report_data)
        elif format == "csv":
            return self._generate_csv(report_data)
```

### Report Filters Schema

```python
class ReportFilters(BaseModel):
    department_ids: list[int] | None = None
    date_from: date | None = None
    date_to: date | None = None
    modules: list[str] | None = None  # environmental, social, governance
    employee_ids: list[int] | None = None
    challenge_ids: list[int] | None = None
    category_ids: list[int] | None = None
```

---

## Frontend Implementation

### Report Pages

- **Report Hub** (`/reports`) — Grid of available report types with descriptions.
- **Individual Reports** — Pre-configured views with charts and tables.
- **Custom Report Builder** (`/reports/custom`) — Drag-and-drop or checkbox-based module selection with filter panel.

### Report Components

| Component            | Purpose                              |
| -------------------- | ------------------------------------ |
| ReportFilterPanel    | Sidebar/top bar with all filter controls |
| ReportChart          | Renders charts based on report data  |
| ReportTable          | Data table with sorting and pagination |
| ExportButton         | Dropdown: PDF / Excel / CSV          |
| ReportPreview        | Full-page preview before export      |
| ReportTemplateManager | Save/load custom report configurations |

---

## API Endpoints

| Method | Path                       | Description              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/reports/environmental`   | Environmental report data |
| GET    | `/reports/social`          | Social report data       |
| GET    | `/reports/governance`      | Governance report data   |
| GET    | `/reports/esg-summary`     | ESG summary report data  |
| POST   | `/reports/custom`          | Custom report with selected modules/filters |
| GET    | `/reports/export/{format}` | Export report (pdf/xlsx/csv) |
