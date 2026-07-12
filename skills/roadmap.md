# Roadmap

## Implementation Order

Build the platform in this order. Each phase builds on the previous one.

---

## Phase 1: Foundation

**Goal:** Authentication, user management, and core master data.

### Tasks

- [ ] Project setup (FastAPI backend + React frontend)
- [ ] Database setup (PostgreSQL + SQLAlchemy + Alembic)
- [ ] User model and authentication (JWT login/register/refresh)
- [ ] Role-based access control (Admin, Manager, Employee, Auditor)
- [ ] Department CRUD
- [ ] Category CRUD
- [ ] ESG Settings model and API
- [ ] Protected routes (frontend)
- [ ] Main layout (sidebar + header)
- [ ] Login page

### Deliverables

- Working login/register flow
- Department and category management pages
- Role-based route protection

---

## Phase 2: Environmental Module

**Goal:** Carbon tracking and sustainability goals.

### Tasks

- [ ] Emission Factor model + CRUD + API
- [ ] Carbon Transaction model + CRUD + API
- [ ] CO₂ calculation logic (quantity × factor)
- [ ] Auto Emission Calculation (settings toggle)
- [ ] Environmental Goal model + CRUD + API
- [ ] Goal progress tracking
- [ ] Environmental Score calculation
- [ ] Emission Factors management page
- [ ] Carbon Transactions page (with manual entry form)
- [ ] Goals page with progress bars
- [ ] Environmental Dashboard

### Deliverables

- Configure emission factors
- Create/view carbon transactions
- Set and track sustainability goals
- Environmental dashboard with charts

---

## Phase 3: Social Module

**Goal:** CSR activities and employee participation.

### Tasks

- [ ] CSR Activity model + CRUD + API
- [ ] Employee Participation model + CRUD + API
- [ ] Participation submission with file upload
- [ ] Evidence requirement enforcement (settings toggle)
- [ ] Approval/rejection workflow
- [ ] XP award on approval
- [ ] Diversity metrics calculation
- [ ] Social Score calculation
- [ ] CSR Activities page
- [ ] Participation page (employee view)
- [ ] Approval queue (manager view)
- [ ] Social Dashboard

### Deliverables

- Create and manage CSR activities
- Employee participation with proof upload
- Manager approval workflow
- Social dashboard with metrics

---

## Phase 4: Governance Module

**Goal:** Policies, audits, and compliance.

### Tasks

- [ ] ESG Policy model + CRUD + API
- [ ] Policy Acknowledgement model + API
- [ ] Audit model + CRUD + API
- [ ] Compliance Issue model + CRUD + API
- [ ] Compliance Issue ownership enforcement (owner + due date required)
- [ ] Overdue detection logic
- [ ] Governance Score calculation
- [ ] Policies page
- [ ] Acknowledgement tracking page
- [ ] Audits page
- [ ] Compliance Issues page
- [ ] Governance Dashboard

### Deliverables

- Policy management and acknowledgement tracking
- Audit lifecycle
- Compliance issue tracking with overdue detection
- Governance dashboard

---

## Phase 5: Gamification Module

**Goal:** Challenges, XP, badges, rewards, leaderboard.

### Tasks

- [ ] Challenge model + CRUD + API + state machine
- [ ] Challenge Participation model + API
- [ ] Challenge lifecycle (Draft → Active → Under Review → Completed → Archived)
- [ ] XP system (balance tracking on user)
- [ ] Badge model + CRUD + API
- [ ] Badge auto-award logic (settings toggle)
- [ ] User Badges junction table
- [ ] Reward model + CRUD + API
- [ ] Reward redemption logic (XP deduction + stock check)
- [ ] Reward Redemptions table
- [ ] Leaderboard API
- [ ] Challenges page
- [ ] Challenge detail and participation
- [ ] Badges page
- [ ] Rewards catalog page
- [ ] Leaderboard page
- [ ] Gamification Dashboard

### Deliverables

- Full challenge lifecycle
- XP earning and spending
- Auto badge unlocking
- Reward catalog and redemption
- Leaderboards

---

## Phase 6: Reports

**Goal:** Generate and export ESG reports.

### Tasks

- [ ] Report service (data aggregation)
- [ ] Environmental Report API
- [ ] Social Report API
- [ ] Governance Report API
- [ ] ESG Summary Report API
- [ ] Custom Report Builder API
- [ ] PDF export (ReportLab / WeasyPrint)
- [ ] Excel export (openpyxl)
- [ ] CSV export
- [ ] Report Hub page
- [ ] Individual report pages with filters
- [ ] Custom Report Builder page
- [ ] Export buttons (PDF / Excel / CSV)

### Deliverables

- All four standard reports
- Custom report builder with filters
- Export to PDF, Excel, CSV

---

## Phase 7: Dashboard

**Goal:** Main ESG dashboard with KPIs and scores.

### Tasks

- [ ] Department Score model + calculation
- [ ] Overall ESG Score calculation
- [ ] Dashboard API (aggregated data)
- [ ] Main Dashboard page
- [ ] KPI cards (Environmental, Social, Governance, Total)
- [ ] Trend charts
- [ ] Department rankings
- [ ] Quick action buttons
- [ ] Score gauges

### Deliverables

- Unified ESG dashboard
- Real-time scores and rankings
- Visual KPIs and charts

---

## Phase 8: Notifications

**Goal:** In-app and email notification system.

### Tasks

- [ ] Notification model + API
- [ ] Notification service
- [ ] In-app notification delivery
- [ ] Email notification sending (SMTP)
- [ ] Overdue compliance issue cron job
- [ ] Policy acknowledgement reminders
- [ ] Notification bell component (header)
- [ ] Notification dropdown/panel
- [ ] Notification settings page
- [ ] Mark as read / mark all as read

### Deliverables

- In-app notification bell with unread count
- Email notifications for critical events
- Configurable notification preferences

---

## Phase 9: Polish & Testing

**Goal:** Testing, optimization, and final polish.

### Tasks

- [ ] Unit tests for all services
- [ ] Integration tests for API endpoints
- [ ] Frontend component tests
- [ ] Error handling review
- [ ] Loading states and empty states
- [ ] Responsive design verification
- [ ] Performance optimization
- [ ] Documentation (README, API docs)
- [ ] Seed data for demo
- [ ] Final UI polish

### Deliverables

- Test coverage for core business logic
- Polished, responsive UI
- Demo-ready with seed data

---

## Bonus Phase (Optional)

- [ ] Department ESG rankings page
- [ ] Smart dashboard visualizations (AI insights)
- [ ] Mobile-responsive interface optimization
- [ ] Dark mode
- [ ] WebSocket real-time notifications
- [ ] Audit trail / activity log
