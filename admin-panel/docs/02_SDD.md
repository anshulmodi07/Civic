# Software Design Document (SDD)
## Civic Infrastructure Admin Panel

**Document Version:** 1.0  
**Date:** April 15, 2026  
**Status:** Approved  
**Standard:** IEEE 1016-2009  

---

## 1. Introduction

### 1.1 Purpose
This Software Design Document (SDD) describes the detailed design and architecture of the Civic Infrastructure Admin Panel. It provides comprehensive guidance for developers, architects, and maintainers to understand the system structure, design decisions, and implementation approach.

### 1.2 Scope
Covers all design aspects of the React-based admin panel including:
- System architecture and component hierarchy
- Design patterns and decisions
- Module-level design for each feature (Authentication, Dashboard, Complaints, Workers, Shifts, Profile)
- Data persistence strategy
- Styling and UI component architecture
- API integration layer
- Security approach

### 1.3 Design Overview

**High-level Architecture:**
```
┌──────────────────────────────────────────────────────────┐
│         Presentation Layer (React Components)            │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Pages: Login, Dashboard, Complaints, Workers, Shifts ││
│  └──────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────┤
│         Business Logic Layer (Services & APIs)           │
│  ┌──────────────────────────────────────────────────────┐│
│  │ auth.js, dashboardApi.js, adminService.js            ││
│  │ with Mock/Real API toggle (USE_MOCK flag)            ││
│  └──────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────┤
│         Data Persistence Layer                           │
│  ┌──────────────────────────────────────────────────────┐│
│  │ localStorage (session tokens, user context)          ││
│  │ Backend API (Phase 2: /api/auth, /api/complaints...) ││
│  │ Mock Data Files (development reference)              ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

---

## 2. System Architecture

### 2.1 Architecture Style

**Selected: Component-Based Layered Architecture**

Components:
- **Presentation Layer:** React components (pages, layouts, reusable UI components)
- **Business Logic Layer:** API calls, data transformation, validation
- **Data Layer:** localStorage + Backend API

Benefits:
- Clear separation of concerns
- Easy to test and maintain
- Straightforward to add backend integration (Phase 2)
- Component reusability reduces code duplication

### 2.2 Architectural Patterns

#### 2.2.1 Model-View-Controller (Component-Based Variant)

**Model:** Data in localStorage + mock files (User, Complaints, Workers)
**View:** React components rendering data (Dashboard.jsx, Complaints.jsx, etc.)
**Controller:** API layer (auth.js, dashboardApi.js) handling data fetching and transformation

#### 2.2.2 Provider Pattern (localStorage as global state)

Instead of Redux Context, use localStorage as the single source of truth for:
- Current user (`localStorage.getItem('user')`)
- Authentication token (`localStorage.getItem('token')`)

Components read from localStorage on mount; update triggers re-render.

```javascript
// Example usage in Dashboard.jsx
const [user, setUser] = useState(null);
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  setUser(storedUser);
}, []);
```

#### 2.2.3 Service Locator Pattern

API layer acts as service locator:
- `auth.js` exports: `loginUser()`, `logoutUser()`, `getUser()`
- `dashboardApi.js` exports: `fetchStats()`, `fetchComplaints()`
- `adminService.js` exports: `getWorkers()`, `getComplaints()`

Components call services; services handle mock/real toggle internally.

#### 2.2.4 Mock/Real Toggle Pattern

Each API function checks `USE_MOCK` flag:
```javascript
const USE_MOCK = true; // Set to false when backend ready

export const loginUser = async (email, password, department) => {
  if (USE_MOCK) {
    return mockLoginUser(email, password, department);
  }
  return fetch(`${API_BASE}/auth/login`, { ... });
};
```

Benefit: Zero code changes needed for Phase 2 backend integration.

#### 2.2.5 Layout Pattern (Wrapper Pattern)

`AdminLayout.jsx` wraps all protected routes:
- Renders Sidebar + Navbar + Outlet (page content)
- Manages navigation state (active menu item)
- Ensures consistent UI across all pages

```jsx
<AdminLayout>
  <Routes>
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/admin/complaints" element={<Complaints />} />
    ...
  </Routes>
</AdminLayout>
```

### 2.3 Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | React | 18+ | UI library; component-based |
| **Routing** | React Router | 7+ | Client-side navigation; protected routes |
| **Styling** | TailwindCSS | 4.2+ | Utility-first CSS framework |
| **Charts** | Recharts | 3.8+ | Data visualization (Donut charts) |
| **Build Tool** | Vite | Latest | Fast dev server; optimized builds |
| **Linting** | ESLint | Latest | Code quality enforcement |
| **Language** | JavaScript | ES2020+ | Modern syntax features |

---

## 3. Component Architecture

### 3.1 Directory Structure

```
src/
├── App.jsx                          # Route definitions (main entry)
├── main.jsx                         # React DOM render entry
│
├── api/                             # Business Logic Layer
│   ├── auth.js                      # Authentication API (loginUser, logoutUser, getUser)
│   └── dashboardApi.js              # Dashboard data API (fetchStats, fetchComplaints)
│
├── services/                        # Business Logic (Extended)
│   └── adminService.js              # Helpers (getWorkers, getComplaints, getStats)
│
├── components/                      # Reusable UI Components
│   ├── Card.jsx                     # Generic card wrapper
│   ├── Sidebar.jsx                  # Left navigation sidebar
│   ├── Navbar.jsx                   # Top navigation bar
│   ├── StatusBadge.jsx              # Status indicator badge
│   ├── Table.jsx                    # Generic table component
│   │
│   ├── dashboard/                   # Dashboard-specific components
│   │   ├── StatsCards.jsx           # 4 metric cards (Total, Resolved, Pending, Workers)
│   │   ├── ComplaintsTable.jsx      # Recent complaints table
│   │   ├── DonutChart.jsx           # Status distribution chart
│   │   ├── WorkersList.jsx          # Worker cards grid
│   │   ├── ActivityFeed.jsx         # Event timeline (optional)
│   │   └── Icon.jsx                 # Status icons
│   │
│   ├── login/                       # Login-specific components
│   │   ├── LoginCard.jsx            # Main login form wrapper
│   │   ├── DepartmentSelect.jsx     # Department dropdown
│   │   ├── InputField.jsx           # Email input component
│   │   ├── PasswordField.jsx        # Password input with toggle visibility
│   │   └── LeftPanel.jsx            # Left side branding panel (future)
│   │
│   └── navbar/                      # Navbar sub-components
│       ├── Navbar.jsx               # Main navbar
│       ├── Navbar.icons.jsx         # Shared icon set
│       └── Navbar.styles.js         # Navbar styling utilities
│
├── layouts/                         # Page Layout Components
│   └── AdminLayout.jsx              # Sidebar + Navbar wrapper
│
├── pages/                           # Page Components (Route endpoints)
│   ├── Login.jsx                    # /login route
│   ├── Dashboard.jsx                # /admin/dashboard route
│   ├── Complaints.jsx               # /admin/complaints route
│   ├── Workers.jsx                  # /admin/workers route
│   ├── Shift.jsx                    # /admin/shift route
│   └── Profile.jsx                  # /admin/profile route
│
├── data/                            # Static/Mock Data
│   ├── users.js                     # 6 mock users (authentication source)
│   ├── complaintsData.js            # Mock complaints
│   ├── workersData.js               # Mock workers
│   ├── menuData.js                  # Sidebar menu items
│   ├── navbarData.js                # Navbar items
│   ├── sidebarDepartmentData.js    # Department-specific sidebar config
│   └── dashboardData.js             # Mock dashboard stats
│
├── mock/                            # Extended Mock Data
│   ├── complaints.js                # Detailed complaint mock data
│   ├── stats.js                     # Statistics mock data
│   └── users.js                     # Extended user mock data
│
├── styles/                          # Global Styling
│   ├── dashboardStyles.js           # Dashboard-specific CSS-in-JS
│   ├── loginStyles.js               # Login-specific CSS-in-JS
│   ├── navbar.css                   # Navbar styles
│   └── sidebar.css                  # Sidebar styles
│
├── utils/                           # Utility Functions
│   └── iconMap.jsx                  # Icon name → SVG mapper
│
├── App.css                          # Global styles
├── index.css                        # Reset/base styles
└── [configuration files]

```

### 3.2 Component Hierarchy (React Tree)

```
<App>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />}
        ├── <StatsCards />
        ├── <DonutChart />
        ├── <ComplaintsTable />
        ├── <WorkersList />
        └── <ActivityFeed /> (optional)
      />
      <Route path="complaints" element={<Complaints />}
        └── <Table /> (with filters, search)
      />
      <Route path="workers" element={<Workers />}
        ├── <Card /> (for each worker)
        └── <StatusBadge /> (online/offline)
      />
      <Route path="shift" element={<Shift />}
        └── [Shift grid - TBD]
      />
      <Route path="profile" element={<Profile />} />
    </Route>
  </Routes>
</App>
```

### 3.3 Reusable Components

#### 3.3.1 Card Component

**Purpose:** Generic card wrapper with consistent styling
**Props:**
- `title` (string): Card title
- `children` (JSX): Card content
- `footer` (JSX, optional): Action buttons or footer content
- `className` (string, optional): Additional Tailwind classes

**Usage:**
```jsx
<Card title="Worker Performance">
  <div>Rating: 4.5 stars</div>
</Card>
```

#### 3.3.2 Table Component

**Purpose:** Reusable data table with sorting, pagination
**Props:**
- `columns` (array): Column definitions `[{key, label, sortable}]`
- `data` (array): Row data
- `onSort` (function): Sort callback
- `isLoading` (bool): Show loading state
- `className` (string, optional): Additional styles

**Usage:**
```jsx
<Table
  columns={complaintColumns}
  data={filteredComplaints}
  onSort={handleSort}
/>
```

#### 3.3.3 StatusBadge Component

**Purpose:** Display status with color coding
**Props:**
- `status` (enum): "pending" | "in-progress" | "resolved" | "online" | "offline"
- `size` (string): "sm" | "md" | "lg"

**Usage:**
```jsx
<StatusBadge status="pending" />
```

#### 3.3.4 Navbar Component

**Purpose:** Top navigation bar
**Children:** Logo, Search bar, Notifications, User menu

**Usage:** Rendered in `AdminLayout.jsx`

#### 3.3.5 Sidebar Component

**Purpose:** Left navigation menu
**Props:**
- `isOpen` (bool): Mobile menu visibility
- `onClose` (function): Close menu callback
- `department` (string): Current user's department

**Features:**
- Menu items from `menuData.js`
- Active route highlighting
- Collapse/expand toggle (mobile)

---

## 4. Module Design

### 4.1 Authentication Module

**FilesInvolved:**
- `src/api/auth.js` (core logic)
- `src/pages/Login.jsx` (UI)
- `src/components/login/*` (sub-components)
- `src/data/users.js` (mock user database)

**Functional Methods:**

**`loginUser(email, password, department)`**
- Input: Email string, password string, department string
- Process:
  1. If `USE_MOCK`: Search `users.js` for exact email + password + department match
  2. If Real API: POST `http://localhost:5000/api/auth/login` with credentials
  3. On success: Return `{token, user}`
  4. On failure: Throw error with message
- Output: Promise<{token: string, user: object}>
- Storage: `localStorage.setItem('token', token)`, `localStorage.setItem('user', JSON.stringify(user))`

**`logoutUser()`**
- Input: None
- Process: Clear localStorage (token, user)
- Output: void
- Redirect: Navigate to `/` (login page)

**`getUser()`**
- Input: None
- Process: Retrieve from localStorage or call `/auth/me` endpoint
- Output: User object or null if not authenticated

**Design Decisions:**
1. **Use localStorage** instead of session cookies for single-page app
2. **No Redux Context** for minimal dependencies
3. **Mock/Real toggle** for Phase 2 backend integration
4. **Department stored with token** for access control

**Security Considerations:**
- ✅ Passwords validated on backend only (never stored in frontend)
- ✅ Token stored in localStorage (alternative: HttpOnly cookies for Phase 2)
- ✅ No credential logging
- ✅ Generic error messages (don't reveal if email exists)
- ⚠️ Vulnerable to XSS via localStorage (Phase 2: move to HttpOnly cookies)

---

### 4.2 Dashboard Module

**Files Involved:**
- `src/pages/Dashboard.jsx` (main page)
- `src/components/dashboard/*` (sub-components)
- `src/api/dashboardApi.js` (data fetching)
- `src/services/adminService.js` (data transformation)
- `src/mock/stats.js` (mock data)

**Functional Workflow:**

1. **Dashboard Mount**
   - Read user from localStorage
   - Extract department name
   - Fetch stats and complaints via `dashboardApi.js`

2. **Fetch Stats**
   - Call `fetchStats(department)`
   - Returns: `{total, resolved, pending, activeWorkers}`
   - Renders: `<StatsCards />`

3. **Fetch Complaints**
   - Call `fetchComplaints(department, limit=10)`
   - Returns: Array of complaint objects
   - Renders: `<ComplaintsTable />`

4. **Fetch Workers**
   - Call `getWorkers(department)`
   - Returns: Array of worker objects filtered by online status
   - Renders: `<WorkersList />`

5. **Status Chart**
   - Aggregate complaint statuses (Resolved, Pending, In-Progress)
   - Calculate percentages
   - Renders: `<DonutChart />` using Recharts

**Component Design:**

```jsx
// Dashboard.jsx
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    // 2. Fetch all data in parallel
    Promise.all([
      fetchStats(storedUser.department),
      fetchComplaints(storedUser.department),
      getWorkers(storedUser.department)
    ]).then(([stats, complaints, workers]) => {
      setStats(stats);
      setComplaints(complaints);
      setWorkers(workers);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1>Welcome, {user?.name}! ({user?.department})</h1>
      <StatsCards stats={stats} />
      <DonutChart data={stats} />
      <ComplaintsTable complaints={complaints} />
      <WorkersList workers={workers} />
    </div>
  );
}
```

**State Management:**
- `user`: From localStorage (read-only in component)
- `stats`, `complaints`, `workers`: Component state (fetched on mount)
- `loading`: Loading indicator

**Design Decisions:**
1. **Parallel data fetching** using `Promise.all()` for performance
2. **Department filtering** applied server-side (mock data also filtered)
3. **Separate components** for modularity (easy to test; easy to reuse)
4. **No global state** (no Redux) to keep complexity low
5. **Auto-refresh** via button (no polling by default)

---

### 4.3 Complaints Module

**Files Involved:**
- `src/pages/Complaints.jsx` (main page)
- `src/components/Table.jsx` (table rendering)
- `src/api/dashboardApi.js` (fetch logic)
- `src/mock/complaints.js` (mock data)

**Functional Workflow:**

1. **Load Complaints**
   - Fetch from `fetchComplaints(department, limit=100)`
   - Returns: Full complaint list for department

2. **Filter by Status**
   - User selects filter: Pending / In-Progress / Resolved
   - Client-side filter: `complaints.filter(c => c.status === selected)`

3. **Filter by Worker**
   - Dropdown of department workers
   - Client-side filter: `complaints.filter(c => c.assignedWorker === selected)`

4. **Search by Title/Location**
   - Real-time search as user types
   - Filter: `complaint.title.includes(term) || complaint.location.includes(term)`

5. **Sort**
   - Click column header to toggle sort order
   - Sort by: ID, Title, Location, Status, Worker, Date

6. **Pagination**
   - Display 20 complaints per page
   - Paginate client-side (Phase 2: server-side pagination for large datasets)

**Component Design:**

```jsx
// Complaints.jsx
export default function Complaints() {
  const [user, setUser] = useState(null);
  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    worker: 'all',
    searchTerm: ''
  });
  const [sort, setSort] = useState({ column: 'date', order: 'desc' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    fetchComplaints(storedUser.department).then(setAllComplaints);
  }, []);

  useEffect(() => {
    // Apply all filters
    let filtered = allComplaints.filter(c => {
      const statusMatch = filters.status === 'all' || c.status === filters.status;
      const workerMatch = filters.worker === 'all' || c.assignedWorker === filters.worker;
      const searchMatch = !filters.searchTerm ||
        c.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return statusMatch && workerMatch && searchMatch;
    });

    // Apply sort
    filtered.sort((a, b) => {
      let aVal = a[sort.column];
      let bVal = b[sort.column];
      return sort.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    setFilteredComplaints(filtered);
    setPage(1); // Reset to page 1 on filter change
  }, [allComplaints, filters, sort]);

  const pageSize = 20;
  const paginatedComplaints = filteredComplaints.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h1>Complaints for {user?.department}</h1>
      
      <FilterBar filters={filters} setFilters={setFilters} workers={...} />
      <SearchBar value={filters.searchTerm} onChange={setSearchTerm} />
      
      <Table
        columns={complaintColumns}
        data={paginatedComplaints}
        onSort={(col) => setSort({ column: col, order: sort.order === 'asc' ? 'desc' : 'asc' })}
      />
      
      <Pagination
        page={page}
        totalPages={Math.ceil(filteredComplaints.length / pageSize)}
        onPageChange={setPage}
      />
    </div>
  );
}
```

**Design Decisions:**
1. **Client-side filtering** for simplicity (Phase 2: move to backend for large datasets)
2. **Immediate filter application** as user changes filters (reactive UI)
3. **Case-insensitive search** for better UX
4. **Sort+Filter+Search** combined for flexibility
5. **Reset pagination** on filter change to prevent invalid page numbers

---

### 4.4 Workers Module

**Files Involved:**
- `src/pages/Workers.jsx`
- `src/components/Card.jsx`
- `src/services/adminService.js`
- `src/data/workersData.js` (mock data)

**Functional Workflow:**

1. **Load Workers**
   - Fetch `getWorkers(department)`
   - Returns: Array of worker objects with status, shift, task progress, rating

2. **Filter by Status**
   - All / Online / Offline
   - Client-side filter: `workers.filter(w => w.online === true/false)`

3. **Filter by Shift**
   - All / Morning / Evening / Night
   - Client-side filter: `workers.filter(w => w.shift === selected)`

4. **Display Cards**
   - Grid layout (4 cards per row, responsive)
   - Card shows: Name, Status badge, Department, Shift, Task progress bar, Rating

5. **Sort**
   - By Name / Online Status / Task Completion %

**Component Design:**

```jsx
// Workers.jsx
export default function Workers() {
  const [user, setUser] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', shift: 'all' });
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    getWorkers(storedUser.department).then(setWorkers);
  }, []);

  useEffect(() => {
    let filtered = workers.filter(w => {
      const statusMatch = filters.status === 'all' ||
        (filters.status === 'online' ? w.online : !w.online);
      const shiftMatch = filters.shift === 'all' || w.shift === filters.shift;
      return statusMatch && shiftMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'status') return b.online - a.online;
      if (sortBy === 'completion') return (b.tasksDone / b.tasksTotal) - (a.tasksDone / a.tasksTotal);
    });

    setFilteredWorkers(filtered);
  }, [workers, filters, sortBy]);

  return (
    <div>
      <h1>Workers - {user?.department}</h1>
      <FilterBar filters={filters} setFilters={setFilters} />
      <SortDropdown value={sortBy} onChange={setSortBy} />
      
      <div className="grid grid-cols-4 gap-4">
        {filteredWorkers.map(w => (
          <Card key={w.id}>
            <h3>{w.name}</h3>
            <StatusBadge status={w.online ? 'online' : 'offline'} />
            <div>Shift: {w.shift}</div>
            <ProgressBar value={(w.tasksDone / w.tasksTotal) * 100} />
            <Stars value={w.rating} />
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**Design Decisions:**
1. **Card-based layout** for visual appeal
2. **Responsive grid** (4 cols desktop, 2 cols tablet, 1 col mobile)
3. **Only display online status** (no detailed action needed yet)
4. **Real-time task progress** visualization
5. **Worker details in modal** (Phase 2: click card for details)

---

### 4.5 Shift Module

**Files Involved:**
- `src/pages/Shift.jsx`
- `src/styles/dashboardStyles.js`
- `src/data/workersData.js` (mock data)

**Functional Workflow:**

1. **Load Weekly Schedule**
   - Get all workers for department
   - Get shifts for current week
   - Build grid: workers (rows) × days (columns)

2. **Display Grid**
   - Rows: Worker names
   - Columns: Mon-Sun (7 days)
   - Cells: Shift assignment (Morning/Evening/Night/Off) with color coding

3. **Edit Shift**
   - Click cell → Dropdown appears
   - Select new shift → Save
   - Update localStorage (Phase 2: API call)

4. **Navigate Weeks**
   - Previous Week / Next Week buttons
   - Display current week range

**Component Design:**

```jsx
// Shift.jsx
export default function Shift() {
  const [user, setUser] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [shifts, setShifts] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(getMondayOfCurrentWeek());
  const [editingCell, setEditingCell] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    getWorkers(storedUser.department).then(setWorkers);
    // Load shifts from localStorage or API
    const savedShifts = JSON.parse(localStorage.getItem('shifts')) || {};
    setShifts(savedShifts);
  }, []);

  const handleShiftChange = (workerId, day, newShift) => {
    const key = `${workerId}-${day}`;
    setShifts(prev => ({
      ...prev,
      [key]: newShift
    }));
    localStorage.setItem('shifts', JSON.stringify(shifts));
    setEditingCell(null);
  };

  const weekDays = generateWeekDays(currentWeekStart);

  return (
    <div>
      <h1>Shift Schedule - {user?.department}</h1>
      <div className="flex justify-between">
        <button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}>← Previous Week</button>
        <span>{formatDate(currentWeekStart)} - {formatDate(addDays(currentWeekStart, 6))}</span>
        <button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>Next Week →</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Worker</th>
            {weekDays.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {workers.map(worker => (
            <tr key={worker.id}>
              <td>{worker.name}</td>
              {weekDays.map(day => (
                <td
                  key={`${worker.id}-${day}`}
                  onClick={() => setEditingCell(`${worker.id}-${day}`)}
                  className={`cursor-pointer shift-${shifts[`${worker.id}-${day}`] || 'off'}`}
                >
                  {editingCell === `${worker.id}-${day}` ? (
                    <select
                      onChange={(e) => handleShiftChange(worker.id, day, e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      autoFocus
                    >
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                      <option value="off">Off</option>
                    </select>
                  ) : (
                    shifts[`${worker.id}-${day}`] || 'Off'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Design Decisions:**
1. **Grid-based layout** for visual shift planning
2. **Click-to-edit** cells for in-place editing
3. **Color-coded shifts** (Morning=Blue, Evening=Orange, Night=Purple, Off=Gray)
4. **localStorage persistence** for demo; Phase 2: API backend
5. **Week navigation** with clear date display

---

### 4.6 Profile Module

**Files Involved:**
- `src/pages/Profile.jsx`
- `src/components/Card.jsx`

**Functional Workflow:**

1. **Load User Profile**
   - Read from localStorage (user object)
   - Display: Name, Email, Department, User ID, Join Date, Contact Number

2. **Edit Contact**
   - Click edit button
   - Input field appears
   - Save button triggers update
   - Phase 2: API call to update

3. **Display Activity Log**
   - Show last 10 logins (Phase 2: from backend)
   - Columns: Date, Time, Device, IP

**Component Design:**

```jsx
// Profile.jsx
export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSavePhone = async () => {
    setLoading(true);
    // Phase 2: await updateUserPhone(phone);
    setUser(prev => ({ ...prev, phone }));
    localStorage.setItem('user', JSON.stringify(user));
    setIsEditingPhone(false);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1>User Profile</h1>

      <Card title="Personal Information">
        <div className="space-y-4">
          <div><strong>Name:</strong> {user?.name}</div>
          <div><strong>Email:</strong> {user?.email}</div>
          <div><strong>Department:</strong> {user?.department}</div>
          <div><strong>User ID:</strong> {user?.id}</div>
          <div>
            <strong>Contact:</strong>
            {isEditingPhone ? (
              <>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                <button onClick={handleSavePhone} disabled={loading}>Save</button>
              </>
            ) : (
              <>
                {phone}
                <button onClick={() => setIsEditingPhone(true)}>Edit</button>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card title="Login History" className="mt-6">
        <Table
          columns={[{ key: 'date', label: 'Date' }, { key: 'device', label: 'Device' }]}
          data={[]} // Phase 2: fetch from API
        />
      </Card>
    </div>
  );
}
```

---

## 5. Data Persistence Layer

### 5.1 localStorage Strategy

**Keys and Structure:**

| Key | Value | Purpose | Lifetime |
|---|---|---|---|
| `token` | JWT string | Authentication credential | Until logout |
| `user` | JSON object | Current user info | Until logout |
| `shifts` | JSON object | Shift schedule cache | Until page reload |

**User Object Structure:**
```javascript
{
  "id": "USR001",
  "name": "Rahul Sharma",
  "email": "tech@civic.com",
  "department": "technician",
  "role": "admin",
  "joinDate": "2026-01-01",
  "phone": "+91-9876543210"
}
```

### 5.2 Mock Data Files

**Purpose:** Development reference and default fallback when backend unavailable

**Files:**
- `src/data/users.js` — 6 mock user profiles
- `src/mock/complaints.js` — 50+ mock complaint records
- `src/data/workersData.js` — 30+ mock worker records
- `src/mock/stats.js` — Calculated statistics

**Quality:**
- ✅ Realistic data (consistent relationships)
- ✅ Department-filtered data available
- ✅ Sufficient volume for testing pagination/performance
- ✅ Status distributions realistic (80% pending, 20% resolved, etc.)

### 5.3 Backend API Integration (Phase 2)

**Architecture:**
```
Frontend (React)
    ↓
API Service Layer (auth.js, dashboardApi.js)
    ├─ Check USE_MOCK flag
    ├─ If true: Return mock data
    └─ If false: Call backend
        ↓
Backend API (Node/Express - TBD)
    ├─ /api/auth/login
    ├─ /api/dashboard/stats
    ├─ /api/complaints
    ├─ /api/workers
    └─ /api/shifts
        ↓
Database (TBD: PostgreSQL/MongoDB)
```

**Integration Points:**
- `auth.js`: Toggle `USE_MOCK` to enable real API calls
- All API methods accept same parameters; return same data structure
- Zero UI code changes required for Phase 2 backend

---

## 6. Styling Architecture

### 6.1 Design System

**Color Palette (TailwindCSS):**
- Primary Blue: `#3B82F6` (Dashboard, primary actions)
- Success Green: `#10B981` (Resolved, online status)
- Warning Orange: `#F59E0B` (Pending, in-progress)
- Danger Red: `#EF4444` (Errors, critical)
- Gray Scale: `#F3F4F6` - `#1F2937` (backgrounds, text)

**Typography:**
- Headings: Inter or system font, 700 weight
- Body: Inter or system font, 400 weight
- Monospace: Courier New (code/IDs)

### 6.2 UI Component Styles

**Buttons:**
- Primary: Blue background, white text, hover darkens
- Secondary: Gray background, dark text
- Danger: Red background, white text

**Cards:**
- White background, subtle shadow, rounded corners (8px)
- Padding: 1.5rem
- Border: Optional 1px gray border

**Tables:**
- Header: Gray background, bold text
- Rows: Alternating white/light gray
- Hover: Light blue background on row hover

**Status Badges:**
- Resolved: Green background, green text light (#10B981)
- Pending: Orange background, orange text light (#F59E0B)
- In-Progress: Blue background, blue text light (#3B82F6)
- Online: Green dot + text
- Offline: Gray dot + text

### 6.3 Responsive Breakpoints

| Breakpoint | Width | Devices | Grid Cols |
|---|---|---|---|
| Mobile | < 640px | Phones | 1 |
| Tablet | 640px - 1024px | Tablets | 2 |
| Desktop | 1024px - 1440px | Small screens | 3-4 |
| Large | > 1440px | 4K monitors | 4+ |

**Example:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 col mobile, 2 cols tablet, 4 cols desktop */}
</div>
```

---

## 7. Security Design

### 7.1 Authentication & Authorization

**Flow:**
1. User selects department + enters email/password
2. Frontend validates locally (length, format)
3. Sends to backend for validation (Phase 2)
4. Backend returns JWT token + user object
5. Frontend stores in localStorage
6. All subsequent requests include token as Bearer header

**Session Checks:**
- On app load: Check localStorage for valid token
- If invalid/missing: Redirect to login
- If valid: Load dashboard

### 7.2 Access Control

**Rule:** Each user sees only their department's data
- Logged-in user's department extracted from token
- All API calls append `?department=<user_dept>`
- Backend enforces department filtering

**Example:**
```javascript
// Dashboard: Only show current department's complaints
const complaints = data.filter(c => c.department === user.department);
```

### 7.3 CSRF Protection (Phase 2)

- Backend generates CSRF token in login response
- Frontend includes token in all POST/PATCH requests
- Backend validates token before processing

### 7.4 XSS Prevention

- React automatically escapes JSX content
- Use `.textContent` instead of `.innerHTML`
- DOMPurify library for any user-generated HTML (Phase 2)

### 7.5 Sensitive Data Handling

- ❌ Never log passwords or tokens
- ✅ Use generic error messages ("Invalid credentials")
- ✅ Clear sensitive data on logout
- ✅ Set secure flags on cookies (SameSite, HttpOnly) - Phase 2

---

## 8. Error Handling & Recovery

### 8.1 Error Categories

| Type | Example | Handling |
|---|---|---|
| **Network Error** | API call fails | Show retry button; message: "Connection failed. Retry?" |
| **Auth Error** | Invalid credentials | Show error; remain on login page |
| **Data Error** | Complaint not found | Show message: "This complaint no longer exists" |
| **Validation Error** | Email format invalid | Highlight input; show error message |
| **Server Error** | 500 Internal Error | Show message: "Service temporarily unavailable. Please try again later." |

### 8.2 Error Recovery Strategy

**Pattern:**
1. Catch error in component/service
2. Log error for debugging (Phase 2: send to error tracking service)
3. Show user-friendly message
4. Provide recovery action (Retry, Go Back, Refresh, etc.)

**Example:**
```javascript
try {
  const data = await fetchComplaints(department);
  setComplaints(data);
} catch (error) {
  setError({
    message: 'Failed to load complaints. Please try again.',
    action: () => fetchComplaints(department)
  });
}
```

### 8.3 Loading States

- Show spinner while fetching data
- Disable buttons during submission
- Show skeleton loaders for smooth perception of load time

---

## 9. Performance Optimization

### 9.1 Bundle Size

- **Goal:** < 500KB gzipped
- **Strategy:**
  - Tree-shake unused code
  - Code-split by route (lazy load `/admin/complaints`, `/admin/workers`)
  - Compress images and icons

### 9.2 Rendering Performance

- **Memoization:** Wrap expensive components with `React.memo()`
- **useMemo:** Cache expensive calculations
- **useCallback:** Prevent unnecessary re-renders of child components
- **Virtual Lists:** Implement for large tables (Phase 2)

### 9.3 API Performance

- **Pagination:** Load 20 items per page (not 1000)
- **Filtering:** Client-side pre-filtering + server-side refinement (Phase 2)
- **Caching:** Cache complaint/worker lists for 5 minutes
- **Parallel Requests:** Fetch stats, complaints, workers simultaneously

### 9.4 CSS Performance

- **Critical CSS:** Inline critical styles (above the fold)
- **Code Splitting:** Separate CSS per route
- **Avoid Unused Styles:** PurgeCSS with TailwindCSS

---

## 10. Testing Strategy

### 10.1 Unit Tests

**Scope:** API services, utility functions, data transformations

**Example:**
```javascript
// src/api/__tests__/auth.test.js
describe('loginUser', () => {
  test('should return token for valid credentials', () => {
    const result = loginUser('tech@civic.com', '123456', 'technician');
    expect(result.token).toBeDefined();
    expect(result.user.department).toBe('technician');
  });

  test('should throw error for invalid password', () => {
    expect(() => loginUser('tech@civic.com', 'wrong', 'technician')).toThrow();
  });
});
```

### 10.2 Integration Tests

**Scope:** Component + API interaction

**Example:**
```javascript
// src/pages/__tests__/Dashboard.test.jsx
describe('Dashboard', () => {
  test('should display stats after loading', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Total Complaints/)).toBeInTheDocument();
    });
  });
});
```

### 10.3 E2E Tests (Phase 2)

**Tool:** Cypress or Playwright

**Scenarios:**
- Login flow: Select dept → Enter credentials → Dashboard loaded
- Complaint workflow: Filter → Search → Click complaint
- Shift scheduling: Edit cell → Save → Verify update

---

## 11. Maintenance & Support

### 11.1 Code Documentation

- JSDoc comments for all exported functions
- README in each component directory
- Inline comments for complex logic only

### 11.2 Dependency Management

- Regular security updates (npm audit)
- Lock package versions (package-lock.json)
- Review breaking changes before upgrading

### 11.3 Logging & Monitoring (Phase 2)

- Frontend error tracking (Sentry)
- API performance monitoring
- User behavior tracking (analytics)
- Error dashboards for support team

---

## 12. Future Enhancements (Phase 3+)

| Enhancement | Priority | Effort | Details |
|---|---|---|---|
| Dark Mode | Low | 2 days | Toggle theme; persist preference |
| Role-based UI | Medium | 3 days | Hide features based on role |
| Real-time Updates | High | 5 days | WebSocket for live notifications |
| Advanced Reporting | Medium | 1 week | Charts, export to PDF/Excel |
| Mobile App | Low | 2 weeks | React Native wrapper |
| Offline Support | Low | 1 week | Service Worker caching |
| Push Notifications | Medium | 3 days | Backend integration |
| Audit Trail | High | 4 days | Log all admin actions |

---

**Document End**  
*For architectural questions during development, refer to section 2 (System Architecture) and section 4 (Module Design).*
