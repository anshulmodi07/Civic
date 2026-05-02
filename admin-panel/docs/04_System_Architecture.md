# System Architecture Document
## Civic Infrastructure Admin Panel

**Document Version:** 1.0  
**Date:** April 15, 2026  
**Status:** Approved  

---

## 1. Architecture Overview

### 1.1 High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ React Components: Pages, Layouts, Reusable Components   │ │
│  │ - Login.jsx, Dashboard.jsx, Complaints.jsx, Workers...  │ │
│  │ - Sidebar.jsx, Navbar.jsx, StatsCards.jsx, etc.        │ │
│  │ - Routing: React Router 7 (SPA navigation)              │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────┬──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│              BUSINESS LOGIC LAYER                            │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ API Services & Data Transformation                      │ │
│ │ - auth.js (loginUser, logoutUser, getUser)             │ │
│ │ - dashboardApi.js (fetchStats, fetchComplaints)        │ │
│ │ - adminService.js (getWorkers, getComplaints)          │ │
│ │ - Mock/Real Toggle (USE_MOCK flag)                      │ │
│ └──────────────────────────────────────────────────────────┘ │
└───────────────────────┬──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│              DATA PERSISTENCE LAYER                          │
│  ┌────────────────────┐        ┌──────────────────────────┐  │
│  │  localStorage      │        │  Backend API (Phase 2)   │  │
│  │  - token           │        │  - POST /auth/login      │  │
│  │  - user object     │        │  - GET /dashboard/stats  │  │
│  │  - shifts cache    │        │  - GET/POST /complaints  │  │
│  └────────────────────┘        │  - GET /workers          │  │
│                                 │  - GET/PATCH /shifts     │  │
│                                 └──────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Mock Data (Development Reference)                    │  │
│  │  - src/data/users.js, complaintsData.js, etc.        │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Characteristics

| Characteristic | Details |
|---|---|
| **Style** | Component-Based Layered Architecture |
| **Deployment** | Single-Page Application (SPA) - Client-side routing |
| **Communication** | HTTP REST (to backend); localStorage for client-side state |
| **Scalability** | Horizontal scaling via multiple backend instances (Phase 2) |
| **Reliability** | Graceful error handling; fallback to mock data during development |

---

## 2. Detailed Component Layers

### 2.1 Presentation Layer (UI Components)

**Responsibility:** Render user interface; capture user input; display data

**Technologies:**
- React 18+ — Component-based UI library
- React Router 7 — Client-side routing
- TailwindCSS 4.2 — Utility-first styling
- Recharts 3.8 — Data visualization (charts)

**Component Organization:**

```
src/components/
├── Reusable (Generic)
│   ├── Card.jsx — Generic card wrapper
│   ├── Table.jsx — Generic data table with sorting/pagination
│   ├── StatusBadge.jsx — Status indicator
│   └── [Other generic components]
├── Layout
│   ├── Navbar.jsx — Top navigation
│   ├── Sidebar.jsx — Left navigation menu
│   └── [Layout-specific components]
├── Feature-Specific
│   ├── dashboard/
│   │   ├── StatsCards.jsx
│   │   ├── ComplaintsTable.jsx
│   │   ├── DonutChart.jsx
│   │   ├── WorkersList.jsx
│   │   └── ActivityFeed.jsx
│   ├── login/
│   │   ├── LoginCard.jsx
│   │   ├── DepartmentSelect.jsx
│   │   ├── InputField.jsx
│   │   └── PasswordField.jsx
│   └── [Other feature components]
└── Utils
    └── iconMap.jsx — Icon name mapper
```

**Key Components:**

| Component | Props | Responsibility |
|---|---|---|
| `<StatsCards />` | `{stats}` | Display 4 key metrics |
| `<Table />` | `{columns, data, onSort, isLoading}` | Render sortable, paginated table |
| `<DonutChart />` | `{data}` | Render Recharts donut visualization |
| `<WorkersList />` | `{workers, filters}` | Display worker cards grid |
| `<Sidebar />` | `{isOpen, onClose}` | Left menu; active route highlighting |
| `<Navbar />` | `{}` | Top bar; user profile; search; notifications |

### 2.2 Business Logic Layer (API Services)

**Responsibility:** Fetch data, transform data, handle API communication, validate inputs

**API Service Files:**

```
src/api/
├── auth.js
│   ├── loginUser(email, password, department) — Authenticate user
│   ├── logoutUser() — Clear session
│   ├── getUser() — Retrieve current user
│   └── USE_MOCK flag — Toggle mock vs real API
├── dashboardApi.js
│   ├── fetchStats(department) — Get complaint statistics
│   ├── fetchComplaints(department, limit) — Get complaint list
│   └── USE_MOCK flag — For development
└── [Extended APIs]

src/services/
├── adminService.js
│   ├── getWorkers(department) — Fetch workers; apply filters
│   ├── getComplaints(department, filters) — Fetch complaints; apply filters
│   └── [Other service methods]
```

**Service Method Pattern:**

```javascript
// Pattern 1: Mock/Real Toggle
export const loginUser = async (email, password, department) => {
  if (USE_MOCK) {
    return mockLoginUser(email, password, department);
  }
  // Real API call
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, department })
  });
  return response.json();
};

// Pattern 2: Data Transformation
export const fetchComplaints = async (department, limit = 20) => {
  const data = USE_MOCK ? mockComplaints : await apiCall();
  return data
    .filter(c => c.department === department) // Filter by dept
    .slice(0, limit) // Limit results
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort
};
```

**Benefits:**
- ✅ Centralized API logic (easy to update)
- ✅ Mock/real toggle (zero UI code changes for Phase 2)
- ✅ Data transformation in one place
- ✅ Error handling standardized

### 2.3 Data Persistence Layer

#### 2.3.1 localStorage (Client-Side State)

**Purpose:** Persist session data across page reloads

**Storage Strategy:**
```javascript
// After successful login
localStorage.setItem('token', jwtToken);
localStorage.setItem('user', JSON.stringify({
  id: 'USR001',
  name: 'Rahul Sharma',
  email: 'tech@civic.com',
  department: 'technician'
}));

// On dashboard load
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
```

**Limitations:**
- Max ~5MB storage per domain
- No expiration (manual clear needed)
- Vulnerable to XSS attacks (Phase 2: HttpOnly cookies)
- No server-side backup

#### 2.3.2 Backend API (Phase 2)

**When Backend is Ready:**

1. **Replace mock flag:**
   ```javascript
   // Change in auth.js
   const USE_MOCK = false; // Instead of true
   ```

2. **API structure remains same:**
   - All services call same methods
   - Return same data structures
   - Zero component code changes

3. **Expected Backend Endpoints:**

   | Endpoint | Method | Purpose |
   |---|---|---|
   | `/api/auth/login` | POST | Authenticate user; return JWT |
   | `/api/auth/logout` | POST | Invalidate session |
   | `/api/auth/me` | GET | Get current user |
   | `/api/dashboard/stats` | GET | Complaint statistics |
   | `/api/complaints` | GET | List complaintsby filter |
   | `/api/complaints/:id` | PATCH | Update complaint status |
   | `/api/workers` | GET | List workers |
   | `/api/shifts` | GET/PATCH | Manage shifts |

#### 2.3.3 Mock Data Files

**Files:**
- `src/data/users.js` — 6 mock user profiles
- `src/mock/complaints.js` — 50+ mock complaints
- `src/data/workersData.js` — 30+ mock workers
- `src/mock/stats.js` — Pre-calculated statistics

**Benefit:** Realistic development environment without backend dependency

---

## 3. Key Architectural Patterns

### 3.1 Component-Based Architecture

**Pattern:** Break UI into small, reusable components

**Benefits:**
- Easier to test (single responsibility)
- Higher code reuse
- Easier to maintain (isolated changes)
- Faster development (composition)

**Example:**
```jsx
// Composition: Build complex UI from simple components
<Dashboard>
  <StatsCards stats={stats} />
  <div className="grid grid-cols-2">
    <DonutChart data={stats} />
    <ComplaintsTable complaints={complaints} />
  </div>
  <WorkersList workers={workers} />
</Dashboard>
```

### 3.2 Container/Presentational Pattern

**Container Components:** Manage state, fetch data (logic)
**Presentational Components:** Render UI, accept props (display)

**Example:**
```jsx
// Container (Smart) - Handles logic
function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetchStats().then(setStats);
  }, []);
  return <StatsCards stats={stats} />;
}

// Presentational (Dumb) - Just renders
function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-4">
      {/* Display stats */}
    </div>
  );
}
```

### 3.3 Separation of Concerns

**UI Layer** — Handle rendering and user interaction
**Business Logic** — Handle data transformation and API calls
**Data Layer** — Handle storage and retrieval

**Benefits:**
- Easier to test (mock data layer for UI tests)
- Easier to replace (e.g., swap API with mock database)
- Clearer code structure
- Reduced coupling

### 3.4 Single-Page Application (SPA) Pattern

**Router:** React Router manages navigation without full page reload

**Advantages:**
- Fast navigation (no page reload)
- Smooth user experience
- Client-side state management
- Reduced server load

**Implementation:**
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="complaints" element={<Complaints />} />
      {/* ... */}
    </Route>
  </Routes>
</BrowserRouter>
```

---

## 4. Data Flow

### 4.1 Login Data Flow

```
User Input (Email, Password, Department)
    ↓
LoginCard Component (validation)
    ↓
auth.js → loginUser(email, password, dept)
    ↓
    ├─→ [IF USE_MOCK] → Search users.js
    │
    └─→ [IF REAL API] → POST /auth/login
    ↓
Return {token, user} OR throw Error
    ↓
LoginCard stores in localStorage
    ↓
Navigate to /admin/dashboard
    ↓
Dashboard reads from localStorage → Render
```

### 4.2 Dashboard Data Flow

```
Dashboard Component Mount
    ↓
Read user from localStorage
    ↓
Parallel fetch:
  ├─→ fetchStats(department)
  ├─→ fetchComplaints(department)
  └─→ getWorkers(department)
    ↓
Each service:
  ├─→ [IF USE_MOCK] → Filter mock data by department
  └─→ [IF REAL API] → API call with department filter
    ↓
Promise.all() collects all results
    ↓
Component state updated (setStats, setComplaints, setWorkers)
    ↓
Components re-render with new data
    ↓
<StatsCards />, <DonutChart />, <ComplaintsTable />, <WorkersList /> render
```

### 4.3 Complaint Status Update Flow

```
User clicks "Update Status" in Complaints page
    ↓
Modal appears with status dropdown
    ↓
User selects new status (e.g., "in-progress")
    ↓
[Phase 1: Mock] Store in component state
[Phase 2: Real] POST /api/complaints/:id/status
    ↓
Update component state / table re-renders
    ↓
Show success message / error if failed
```

---

## 5. Deployment Architecture

### 5.1 Development Environment

```
Developer Workstation
├── Node.js 18+ runtime
├── npm/yarn package manager
├── Vite dev server (http://localhost:5173)
├── React app with hot module replacement
├── Mock data (no backend needed)
└── Browser with React DevTools
```

**Start Command:**
```bash
npm run dev
```

### 5.2 Production Deployment

```
┌─────────────────────────────────────────┐
│  User Browser (Client)                  │
│  - React SPA (JavaScript bundle)        │
│  - localStorage for session             │
│  - HTTPS connection required            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  CDN / Static File Server               │
│  - Serves index.html                    │
│  - Serves bundled JavaScript/CSS        │
│  - Static assets caching                │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Backend API (Phase 2)                  │
│  - http://api.civic.local  (or similar) │
│  - Authentication endpoints             │
│  - Data endpoints (complaints, workers) │
│  - Connected to database                │
└─────────────────────────────────────────┘
```

**Build Command:**
```bash
npm run build  # Outputs to /dist folder
```

### 5.3 Environment Configuration (Phase 2)

**.env.development:**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK=true
```

**.env.production:**
```
VITE_API_BASE_URL=https://api.civic.local/api
VITE_USE_MOCK=false
```

---

## 6. Integration Points

### 6.1 Current Integration (Dev with Mock)

```
Admin Panel (React)
    ↓ [Uses local mock data]
Mock Data Files (JSON)
```

### 6.2 Phase 2 Integration (Real Backend)

```
Admin Panel (React)
    ↓ [HTTP REST API]
Backend Server (Node/Express/Django - TBD)
    ↓ [SQL Queries]
Database (PostgreSQL/MySQL/MongoDB - TBD)
```

**Integration Checklist for Phase 2:**
- [ ] Backend API endpoints implemented
- [ ] CORS headers configured
- [ ] Authentication (JWT) implemented
- [ ] Database schema validated
- [ ] API client tests passing
- [ ] Toggle `USE_MOCK = false` in auth.js
- [ ] Environment variables configured
- [ ] Load testing completed
- [ ] Security review completed

---

## 7. Scaling Architecture

### 7.1 Horizontal Scaling (Phase 3+)

```
Load Balancer (Nginx/HAProxy)
    ├─→ Backend Instance 1
    ├─→ Backend Instance 2
    ├─→ Backend Instance 3
    └─→ Backend Instance N
         ↓
    Database (with replication)
         ├─→ Primary DB (writes)
         └─→ Replica DB (reads)
```

### 7.2 Caching Strategy (Phase 2+)

```
Frontend Cache (localStorage)
    ├─→ Valid for 5 minutes
    └─→ Manual refresh button
         ↓
CDN Cache (static assets)
    ├─→ Valid for 1 day
    └─→ Cache busting via hash names
         ↓
Backend Redis Cache (Phase 3+)
    ├─→ Valid for 10 minutes
    └─→ Invalidate on data change
```

---

## 8. Technology Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | React | 18+ | UI library |
| **Routing** | React Router | 7+ | SPA navigation |
| **Build Tool** | Vite | Latest | Fast dev server + build |
| **Styling** | TailwindCSS | 4.2+ | Utility CSS |
| **Charts** | Recharts | 3.8+ | Data visualization |
| **Linting** | ESLint | Latest | Code quality |
| **Package Manager** | npm/yarn | Latest | Dependency management |
| **Language** | JavaScript | ES2020+ | Modern syntax |
| **Browser** | Modern (Chrome, Firefox, Safari, Edge) | 90+ | Target environment |

---

## 9. Non-Functional Characteristics

| Characteristic | Target | Strategy |
|---|---|---|
| **Performance** | < 3s page load | Code splitting, lazy loading, minification |
| **Reliability** | 99% uptime | Error handling, fallback UI, retry logic |
| **Security** | OWASP Top 10 protected | Input validation, XSS prevention, CSRF tokens (Phase 2) |
| **Scalability** | 1000+ concurrent users | Horizontal scaling, caching, pagination |
| **Maintainability** | Easy to update/debug | Modular code, clear separation, documentation |
| **Accessibility** | WCAG 2.1 AA | Keyboard navigation, screen readers, semantic HTML |

---

## 10. Future Architecture Enhancements

| Enhancement | Timeline | Impact |
|---|---|---|
| **WebSocket (Real-time Updates)** | Phase 2.5 | Live notifications; reduced API polls |
| **Service Workers (Offline)** | Phase 3 | Works offline; syncs when online |
| **State Management (Redux/Zustand)** | Phase 2 | Better state handling at scale |
| **GraphQL API** | Phase 3 | Efficient data fetching; reduced payload |
| **Microservices Backend** | Phase 3+ | Independent scaling; better maintenance |
| **Mobile App** | Phase 3 | Native iOS/Android apps |
| **Progressive Web App** | Phase 2.5 | Install as app; offline support |

---

**Document End**  
*For detailed diagrams, see `docs/diagrams/System_Architecture.drawio`*
