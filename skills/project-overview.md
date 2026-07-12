# EcoSphere — ESG Management Platform

## What is EcoSphere?

EcoSphere is an **Environmental, Social & Governance (ESG) Management Platform** built for an Odoo Hackathon context but implemented as a standalone full-stack application. It enables organizations to **measure, manage, and improve** their ESG performance by integrating operational data, employee participation, and compliance activities into a unified dashboard — with gamification to encourage sustainability.

---

## Main Objectives

1. **Environmental** — Track carbon emissions, configure emission factors, set sustainability goals, and generate environmental reports.
2. **Social** — Manage CSR activities, track employee participation, monitor diversity metrics, and measure engagement.
3. **Governance** — Maintain ESG policies, track policy acknowledgements, conduct audits, and manage compliance issues.
4. **Gamification** — Run sustainability challenges, award XP and badges, manage a reward catalog, and display leaderboards.
5. **Scoring** — Aggregate Environmental, Social, and Governance scores per department into an Overall ESG Score (weighted: 40% / 30% / 30%, configurable).
6. **Reporting** — Generate filtered, exportable reports (PDF / Excel / CSV) with a custom report builder.

---

## Technology Stack

### Frontend

| Technology     | Purpose                          |
| -------------- | -------------------------------- |
| React          | UI framework                     |
| React Router   | Client-side routing              |
| React Query    | Server-state management & caching |
| Tailwind CSS   | Utility-first styling            |
| Axios          | HTTP client                      |
| React Hook Form | Form handling & validation      |
| Recharts / Chart.js | Data visualization           |

### Backend

| Technology   | Purpose                    |
| ------------ | -------------------------- |
| FastAPI      | REST API framework         |
| SQLAlchemy   | ORM                        |
| PostgreSQL   | Relational database        |
| Alembic      | Database migrations        |
| JWT (PyJWT)  | Authentication tokens      |
| Pydantic     | Request/response validation |
| python-multipart | File uploads            |

### Database

- **PostgreSQL** (primary relational store)

---

## High-Level Architecture

```
React SPA (Tailwind CSS)
        ↓  HTTP / REST
FastAPI REST API (JWT Auth)
        ↓  SQLAlchemy ORM
PostgreSQL Database
```

---

## Folder Structure (Top Level)

```
EcoSphere-ESG_Management_Platform/
│
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── core/           # Config, security, dependencies
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routers/        # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── crud/           # Database operations
│   │   └── utils/          # Helpers (email, file upload, etc.)
│   ├── alembic/            # Migration scripts
│   ├── requirements.txt
│   └── .env
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level page components
│   │   ├── layouts/        # Page layout wrappers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions (Axios)
│   │   ├── types/          # TypeScript interfaces
│   │   ├── contexts/       # React Context providers
│   │   └── utils/          # Helper functions
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
├── skills/                 # Project skill files (this folder)
└── README.md
```

---

## User Roles

| Role     | Description                                                |
| -------- | ---------------------------------------------------------- |
| Admin    | Full platform access. Manages settings, users, departments, and all modules. |
| Manager  | Department-level operations. Approves CSR participation, manages challenges, views department reports. |
| Employee | Participates in CSR activities and challenges, redeems rewards, views personal dashboard. |
| Auditor  | Conducts audits, raises compliance issues, generates governance reports. |

---

## Key Business Domains

```
┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  Environmental   │   │     Social        │   │   Governance     │   │  Gamification    │
│                  │   │                   │   │                  │   │                  │
│ Emission Factors │   │ CSR Activities    │   │ ESG Policies     │   │ Challenges       │
│ Carbon Tracking  │   │ Participation     │   │ Acknowledgements │   │ XP & Badges      │
│ Goals            │   │ Diversity Metrics │   │ Audits           │   │ Rewards          │
│ Env Dashboard    │   │ Training          │   │ Compliance Issues│   │ Leaderboards     │
└────────┬─────────┘   └────────┬──────────┘   └────────┬─────────┘   └──────────────────┘
         │                      │                        │
         └──────────────────────┼────────────────────────┘
                                ↓
                    ┌──────────────────────┐
                    │   ESG Scoring Engine  │
                    │  (40% / 30% / 30%)   │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │  Dashboard & Reports │
                    └──────────────────────┘
```
