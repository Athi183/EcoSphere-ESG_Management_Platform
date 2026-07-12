# Folder Structure

## Complete Directory Layout

This is the **exact** directory structure for the EcoSphere project. All generated code must be placed in the correct location.

---

## Root

```
EcoSphere-ESG_Management_Platform/
├── backend/
├── frontend/
├── skills/
└── README.md
```

---

## Backend (FastAPI)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                         # FastAPI app, CORS, middleware, router registration
│   ├── database.py                     # Engine, SessionLocal, Base
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                   # Pydantic BaseSettings, env vars
│   │   ├── security.py                 # JWT create/verify, password hashing
│   │   └── dependencies.py             # get_db, get_current_user, require_role
│   │
│   ├── models/
│   │   ├── __init__.py                 # Import all models for Alembic discovery
│   │   ├── user.py                     # User model
│   │   ├── department.py               # Department model
│   │   ├── category.py                 # Category model
│   │   ├── environmental.py            # EmissionFactor, CarbonTransaction, EnvironmentalGoal
│   │   ├── social.py                   # CSRActivity, EmployeeParticipation
│   │   ├── governance.py               # ESGPolicy, PolicyAcknowledgement, Audit, ComplianceIssue
│   │   ├── gamification.py             # Challenge, ChallengeParticipation, Badge, UserBadge, Reward, RewardRedemption
│   │   ├── scoring.py                  # DepartmentScore
│   │   ├── notification.py             # Notification
│   │   └── settings.py                 # ESGSettings
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py                     # LoginRequest, TokenResponse
│   │   ├── user.py                     # UserCreate, UserUpdate, UserResponse
│   │   ├── department.py               # DepartmentCreate, DepartmentUpdate, DepartmentResponse
│   │   ├── category.py                 # CategoryCreate, CategoryResponse
│   │   ├── environmental.py            # EmissionFactor*, CarbonTransaction*, Goal* schemas
│   │   ├── social.py                   # CSRActivity*, Participation* schemas
│   │   ├── governance.py               # Policy*, Acknowledgement*, Audit*, ComplianceIssue* schemas
│   │   ├── gamification.py             # Challenge*, Badge*, Reward*, Leaderboard* schemas
│   │   ├── scoring.py                  # DepartmentScoreResponse, OverallScoreResponse
│   │   ├── reports.py                  # ReportFilters, ReportData
│   │   ├── notification.py             # NotificationResponse
│   │   ├── settings.py                 # ESGSettingsUpdate, ESGSettingsResponse
│   │   └── common.py                   # ApiResponse, PaginatedResponse
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                     # /auth/*
│   │   ├── users.py                    # /users/*
│   │   ├── departments.py              # /departments/*
│   │   ├── categories.py               # /categories/*
│   │   ├── environmental.py            # /environmental/*
│   │   ├── social.py                   # /social/*
│   │   ├── governance.py               # /governance/*
│   │   ├── gamification.py             # /gamification/*
│   │   ├── reports.py                  # /reports/*
│   │   ├── dashboard.py                # /dashboard/*
│   │   ├── notifications.py            # /notifications/*
│   │   └── settings.py                 # /settings/*
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── department_service.py
│   │   ├── category_service.py
│   │   ├── environmental_service.py
│   │   ├── social_service.py
│   │   ├── governance_service.py
│   │   ├── gamification_service.py
│   │   ├── scoring_service.py
│   │   ├── report_service.py
│   │   ├── notification_service.py
│   │   └── settings_service.py
│   │
│   ├── crud/
│   │   ├── __init__.py
│   │   ├── base.py                     # CRUDBase generic class
│   │   ├── user.py
│   │   ├── department.py
│   │   ├── category.py
│   │   ├── environmental.py
│   │   ├── social.py
│   │   ├── governance.py
│   │   ├── gamification.py
│   │   ├── scoring.py
│   │   └── notification.py
│   │
│   └── utils/
│       ├── __init__.py
│       ├── email.py                    # SMTP email sending
│       ├── file_upload.py              # File upload handling
│       ├── pdf_generator.py            # PDF report generation
│       └── excel_generator.py          # Excel report generation
│
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/                       # Migration files
│
├── alembic.ini
├── requirements.txt
├── .env
└── .env.example
```

---

## Frontend (React + TypeScript + Vite)

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── DataTable.tsx
│   │   │   ├── ScoreCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── SearchFilter.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ExportButton.tsx
│   │   ├── charts/
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── GaugeChart.tsx
│   │   ├── environmental/
│   │   │   ├── EmissionFactorForm.tsx
│   │   │   ├── CarbonTransactionForm.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   └── EmissionBreakdown.tsx
│   │   ├── social/
│   │   │   ├── CSRActivityCard.tsx
│   │   │   ├── ParticipationForm.tsx
│   │   │   ├── ApprovalCard.tsx
│   │   │   └── DiversityChart.tsx
│   │   ├── governance/
│   │   │   ├── PolicyCard.tsx
│   │   │   ├── AuditForm.tsx
│   │   │   ├── ComplianceIssueCard.tsx
│   │   │   └── AcknowledgementStatus.tsx
│   │   ├── gamification/
│   │   │   ├── ChallengeCard.tsx
│   │   │   ├── BadgeGrid.tsx
│   │   │   ├── RewardCard.tsx
│   │   │   ├── LeaderboardTable.tsx
│   │   │   └── XPProgress.tsx
│   │   └── dashboard/
│   │       ├── KPICard.tsx
│   │       ├── ScoreGauge.tsx
│   │       ├── QuickActions.tsx
│   │       └── DepartmentRanking.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── environmental/
│   │   │   ├── EmissionFactors.tsx
│   │   │   ├── CarbonTransactions.tsx
│   │   │   ├── Goals.tsx
│   │   │   └── EnvironmentalDashboard.tsx
│   │   ├── social/
│   │   │   ├── CSRActivities.tsx
│   │   │   ├── Participation.tsx
│   │   │   ├── DiversityMetrics.tsx
│   │   │   └── SocialDashboard.tsx
│   │   ├── governance/
│   │   │   ├── Policies.tsx
│   │   │   ├── Acknowledgements.tsx
│   │   │   ├── Audits.tsx
│   │   │   ├── ComplianceIssues.tsx
│   │   │   └── GovernanceDashboard.tsx
│   │   ├── gamification/
│   │   │   ├── Challenges.tsx
│   │   │   ├── Badges.tsx
│   │   │   ├── Rewards.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   └── GamificationDashboard.tsx
│   │   ├── reports/
│   │   │   ├── ReportHub.tsx
│   │   │   ├── EnvironmentalReport.tsx
│   │   │   ├── SocialReport.tsx
│   │   │   ├── GovernanceReport.tsx
│   │   │   ├── ESGSummary.tsx
│   │   │   └── CustomReportBuilder.tsx
│   │   └── settings/
│   │       ├── Departments.tsx
│   │       ├── Categories.tsx
│   │       ├── ESGConfig.tsx
│   │       └── NotificationSettings.tsx
│   │
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNotifications.ts
│   │   ├── useDepartments.ts
│   │   ├── useEmissions.ts
│   │   ├── useChallenges.ts
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   │
│   ├── services/
│   │   ├── api.ts                      # Axios instance + interceptors
│   │   ├── authService.ts
│   │   ├── departmentService.ts
│   │   ├── categoryService.ts
│   │   ├── environmentalService.ts
│   │   ├── socialService.ts
│   │   ├── governanceService.ts
│   │   ├── gamificationService.ts
│   │   ├── reportService.ts
│   │   ├── notificationService.ts
│   │   └── settingsService.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── department.ts
│   │   ├── environmental.ts
│   │   ├── social.ts
│   │   ├── governance.ts
│   │   ├── gamification.ts
│   │   ├── reports.ts
│   │   └── common.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── App.tsx
│   ├── router.tsx
│   └── main.tsx
│
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Skills (Documentation)

```
skills/
├── project-overview.md
├── architecture.md
├── backend-guidelines.md
├── frontend-guidelines.md
├── database-schema.md
├── authentication.md
├── api-design.md
├── environmental-module.md
├── social-module.md
├── governance-module.md
├── gamification-module.md
├── reporting.md
├── notification-system.md
├── scoring-engine.md
├── business-rules.md
├── coding-standards.md
├── roadmap.md
├── system-prompt.md
└── folder-structure.md
```
