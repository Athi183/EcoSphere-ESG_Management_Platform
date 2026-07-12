# Frontend Guidelines

## Framework

React 18+ with TypeScript, built using Vite.

---

## Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/             # Shared UI components
│   │   │   ├── DataTable.tsx
│   │   │   ├── ScoreCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── SearchFilter.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── charts/             # Chart components
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── GaugeChart.tsx
│   │   ├── environmental/
│   │   ├── social/
│   │   ├── governance/
│   │   ├── gamification/
│   │   └── dashboard/
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
│   ├── layouts/
│   │   ├── MainLayout.tsx      # Sidebar + Header + Content
│   │   └── AuthLayout.tsx      # Login/Register (no sidebar)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNotifications.ts
│   │   ├── useDepartments.ts
│   │   ├── useEmissions.ts
│   │   ├── useChallenges.ts
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   ├── services/
│   │   ├── api.ts              # Axios instance with interceptors
│   │   ├── authService.ts
│   │   ├── departmentService.ts
│   │   ├── environmentalService.ts
│   │   ├── socialService.ts
│   │   ├── governanceService.ts
│   │   ├── gamificationService.ts
│   │   ├── reportService.ts
│   │   └── settingsService.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── department.ts
│   │   ├── environmental.ts
│   │   ├── social.ts
│   │   ├── governance.ts
│   │   ├── gamification.ts
│   │   ├── reports.ts
│   │   └── common.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   ├── utils/
│   │   ├── formatters.ts       # Date, number, currency formatting
│   │   ├── validators.ts
│   │   └── constants.ts        # Roles, statuses, colors
│   ├── App.tsx
│   ├── router.tsx              # React Router config
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Routes

| Path                        | Page                    | Access       |
| --------------------------- | ----------------------- | ------------ |
| `/login`                    | Login                   | Public       |
| `/`                         | Dashboard               | All roles    |
| `/environmental`            | Environmental Dashboard | All roles    |
| `/environmental/emissions`  | Emission Factors        | Admin, Mgr   |
| `/environmental/carbon`     | Carbon Transactions     | All roles    |
| `/environmental/goals`      | Sustainability Goals    | Admin, Mgr   |
| `/social`                   | Social Dashboard        | All roles    |
| `/social/csr`               | CSR Activities          | All roles    |
| `/social/participation`     | Employee Participation  | All roles    |
| `/social/diversity`         | Diversity Metrics       | Admin, Mgr   |
| `/governance`               | Governance Dashboard    | All roles    |
| `/governance/policies`      | ESG Policies            | All roles    |
| `/governance/acknowledgements` | Policy Acknowledgements | All roles |
| `/governance/audits`        | Audits                  | Admin, Auditor |
| `/governance/compliance`    | Compliance Issues       | Admin, Auditor |
| `/gamification`             | Gamification Dashboard  | All roles    |
| `/gamification/challenges`  | Challenges              | All roles    |
| `/gamification/badges`      | Badges                  | All roles    |
| `/gamification/rewards`     | Rewards Catalog         | All roles    |
| `/gamification/leaderboard` | Leaderboard             | All roles    |
| `/reports`                  | Reports Hub             | Admin, Mgr, Auditor |
| `/reports/custom`           | Custom Report Builder   | Admin, Mgr   |
| `/settings`                 | Settings                | Admin        |
| `/settings/departments`     | Department Management   | Admin        |
| `/settings/categories`      | Category Management     | Admin        |

---

## Key Libraries

| Library          | Usage                                     |
| ---------------- | ----------------------------------------- |
| `axios`          | HTTP client (configured in `services/api.ts`) |
| `@tanstack/react-query` | Server state, caching, mutations   |
| `react-router-dom` | Client-side routing                     |
| `react-hook-form` | Form state management & validation       |
| `recharts`       | Charts and data visualization             |
| `react-hot-toast` | Toast notifications                      |
| `lucide-react`   | Icon library                              |
| `clsx`           | Conditional class names                   |
| `date-fns`       | Date manipulation                         |

---

## Conventions

### Components
- One component per file.
- Use functional components with hooks only.
- Props defined with TypeScript interfaces.
- Avoid inline styles — use Tailwind classes exclusively.
- Extract complex logic into custom hooks.

### API Service Pattern

```typescript
// services/environmentalService.ts
import api from './api';
import { CarbonTransaction, CarbonTransactionCreate } from '../types/environmental';

export const environmentalService = {
  getCarbonTransactions: (params?: Record<string, any>) =>
    api.get<ApiResponse<CarbonTransaction[]>>('/environmental/carbon-transactions', { params }),

  createCarbonTransaction: (data: CarbonTransactionCreate) =>
    api.post<ApiResponse<CarbonTransaction>>('/environmental/carbon-transactions', data),
};
```

### React Query Hook Pattern

```typescript
// hooks/useEmissions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentalService } from '../services/environmentalService';

export function useCarbonTransactions(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['carbon-transactions', params],
    queryFn: () => environmentalService.getCarbonTransactions(params),
  });
}

export function useCreateCarbonTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: environmentalService.createCarbonTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carbon-transactions'] });
    },
  });
}
```

### Protected Routes

```typescript
// Wrap routes with role-based guards
<Route element={<RequireAuth allowedRoles={['admin', 'manager']} />}>
  <Route path="/settings" element={<Settings />} />
</Route>
```

---

## State Management

- **Server state** → React Query (all API data).
- **Auth state** → React Context (`AuthContext`).
- **UI state** → Local component state (`useState`).
- **Form state** → React Hook Form.
- **No Redux.** React Query + Context is sufficient for this application.

---

## Styling

- Tailwind CSS for all styling.
- Custom theme colors in `tailwind.config.js` matching the ESG color palette:
  - Environmental: Greens (`#10B981`, `#059669`)
  - Social: Blues (`#3B82F6`, `#2563EB`)
  - Governance: Purples (`#8B5CF6`, `#7C3AED`)
  - Gamification: Ambers/Oranges (`#F59E0B`, `#D97706`)
- Dark mode support via `dark:` prefix classes.
- Responsive design: mobile-first approach.
