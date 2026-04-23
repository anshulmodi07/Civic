# Software Requirements Specification (SRS)
## Civic Infrastructure Admin Panel

**Document Version:** 1.0  
**Date:** April 15, 2026  
**Status:** Approved  
**Standard:** IEEE 830-1998  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) documents the functional and non-functional requirements for the **Civic Infrastructure Admin Panel** – a web-based application designed to manage complaints, coordinate workers, and track civic maintenance tasks across multiple departments.

### 1.2 Scope
The Admin Panel is a React-based admin dashboard serving six civic service departments. It enables administrators to:
- Authenticate by department
- View real-time complaint status and metrics
- Manage worker assignments and shifts
- Track complaint progression
- Monitor departmental activity and performance

**Included Modules:**
- User Authentication & Department Selection
- Dashboard (metrics, complaint overview, worker list)
- Complaints Management
- Workers Management
- Shift Scheduling
- User Profile

**Out of Scope:**
- End-user complaint submission system
- SMS/Email notification delivery system
- Advanced reporting and analytics
- Mobile application
- Data migration from legacy systems

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|-----------|
| **Admin** | Authorized user accessing the panel (department manager) |
| **Department** | Service category (Technician, Plumbing, Sanitation, AC/HVAC, WiFi/Network, Construction) |
| **Complaint** | Civic maintenance issue reported by citizens |
| **Worker** | Staff member assigned to resolve complaints |
| **Shift** | Time period assignment (Morning, Evening, Night, Off) |
| **Mock** | Test data (not real backend data) |
| **JWT** | JSON Web Token (authentication credential) |
| **API** | Application Programming Interface |

### 1.4 References

| Reference | Description |
|-----------|------------|
| Project Workspace | `admin-panel` React + Vite project |
| Technology Stack | React 18+, React Router 7, TailwindCSS, Recharts, Vite |
| Backend Specification | See Phase 2 Backend Integration (Section 9) |

---

## 2. Overall Description

### 2.1 Product Perspective

The Admin Panel is a **standalone web application** that communicates with a backend API for authentication and data retrieval. Currently implemented with mock data; architecture supports seamless backend integration.

```
┌─────────────────────────────────────┐
│   User (Admin/Department Manager)   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Civic Infrastructure Admin Panel  │
│  (React + React Router + TailwindCSS)│
└────────────┬────────────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌──────────┐  ┌──────────────┐
│localStorage│  │ Backend API │
│ (Client   │  │ (Phase 2)    │
│  State)   │  └──────────────┘
└──────────┘
```

### 2.2 Product Functions

| Function | Description |
|----------|------------|
| **Authentication** | Login with email/password; department-based access control |
| **Dashboard** | Personalized metrics (total complaints, resolved, pending, active workers); visual status charts |
| **Complaint Processing** | View, filter, search complaints; track status through workflow |
| **Worker Management** | View worker profiles; monitor online/offline status; track task completion and ratings |
| **Shift Scheduling** | Assign workers to shifts (Morning/Evening/Night/Off) for weekly rotation |
| **Profile Management** | View and update administrator profile |

### 2.3 User Classes and Characteristics

**Single User Class:** Department Manager/Administrator

| Characteristic | Description |
|---|---|
| **Count** | 6 (one per department) |
| **Skill Level** | Intermediate; familiar with web applications |
| **Frequency** | Daily; multiple sessions per day |
| **Departments** | Technician, Plumbing, Sanitation, AC/HVAC, WiFi/Network, Construction |
| **Data Access** | Only their department's complaints and workers (role-based filtering) |

### 2.4 Operating Environment

**Browser Environment:**
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Desktop and tablet resolutions (minimum 1024x768)

**Backend Environment (Phase 2):**
- Backend API: `http://localhost:5000/api` (development)
- Production domain: TBD

**Client Environment:**
- Node.js 18+ (development)
- Modern JavaScript (ES2020+)

### 2.5 Design and Implementation Constraints

| Constraint | Details |
|-----------|---------|
| **Technology** | React 18+ (required by existing project) |
| **Styling** | TailwindCSS v4.2 (existing standard) |
| **State Management** | localStorage + component state (no Redux initially) |
| **Browser Compatibility** | Modern browsers (ES2020 support required) |
| **Performance** | Page load < 3 seconds; no animation interruption lag |
| **Data Persistence** | localStorage for auth tokens; backend API for business data |

### 2.6 User Assumptions and Dependencies

| Assumption | Details |
|-----------|---------|
| **User has email login** | Email address serves as unique identifier |
| **Department pre-assigned** | No self-service department selection beyond login |
| **Department isolation** | Users see only their department's data |
| **Browser storage** | localStorage available and enabled |
| **Internet connectivity** | API calls require network access to backend |
| **Single session per browser** | Only one user logged in per browser window |

---

## 3. Specific Requirements

### 3.1 Functional Requirements by Module

#### 3.1.1 Authentication Module

**REQ-AUTH-001: Department Selection**
- **Description:** User selects their department from a dropdown before login
- **Acceptance Criteria:**
  - Dropdown contains all 6 departments
  - Selection persists for current login attempt
  - User cannot bypass department selection
  - UI clearly displays selected department

**REQ-AUTH-002: Email/Password Login**
- **Description:** User enters email and password credentials
- **Acceptance Criteria:**
  - Email field validates format (basic regex)
  - Password field masks input
  - "Show password" toggle is available
  - Both fields required before submit
  - Error messages for empty fields

**REQ-AUTH-003: Credential Validation**
- **Description:** System validates credentials against user database
- **Acceptance Criteria:**
  - Exact match: email + password + department
  - Case-insensitive email matching
  - Invalid credentials show generic error ("Invalid email or password")
  - No account enumeration vulnerabilities
  - (Phase 2) Backend validates via `/auth/login` POST endpoint

**REQ-AUTH-004: Session Token Generation**
- **Description:** Upon successful login, system generates and stores token
- **Acceptance Criteria:**
  - Token stored in localStorage as `token` key
  - User object stored in localStorage as `user` key
  - Token includes user info: name, department, email
  - Session persists across page reloads
  - (Phase 2) Token is JWT with expiration

**REQ-AUTH-005: Logout**
- **Description:** User can end session and clear credentials
- **Acceptance Criteria:**
  - Logout button in navbar
  - Clears localStorage (token, user)
  - Redirects to login page
  - No back-button access to protected pages after logout

**REQ-AUTH-006: Session Verification**
- **Description:** Protected routes check for valid session
- **Acceptance Criteria:**
  - Missing token redirects to login
  - Invalid token redirects to login
  - User redirected to login if trying direct URL access
  - Dashboard loads only after successful auth

---

#### 3.1.2 Dashboard Module

**REQ-DASH-001: Personalized Greeting**
- **Description:** Dashboard displays logged-in user's name and department
- **Acceptance Criteria:**
  - Greets user by first name
  - Shows department name
  - Retrieved from localStorage user object
  - Visible at top of page

**REQ-DASH-002: Complaint Statistics Cards**
- **Description:** Display key metrics in card format
- **Acceptance Criteria:**
  - Card 1: Total Complaints (all time)
  - Card 2: Resolved (count + %)
  - Card 3: Pending (count + %)
  - Card 4: Active Workers (count)
  - Each card shows icon and color-coded status
  - Stats filtered by logged-in user's department
  - Metrics calculated from complaint data

**REQ-DASH-003: Complaint Status Donut Chart**
- **Description:** Visual representation of complaint distribution by status
- **Acceptance Criteria:**
  - Donut chart using Recharts library
  - Three segments: Resolved (green), Pending (yellow), In-Progress (blue)
  - Shows count labels on chart
  - Responsive sizing
  - Filtered by department
  - Updated when complaint data changes

**REQ-DASH-004: Complaints Table**
- **Description:** Tabular view of recent complaints for the department
- **Acceptance Criteria:**
  - Columns: ID, Title, Location, Department, Status, Worker Assigned, Date
  - Sortable by any column
  - Searchable by title/location
  - Filter by status (Pending/In-Progress/Resolved)
  - Paginated if > 10 complaints
  - Status color-coded (red=pending, blue=in-progress, green=resolved)
  - Click-to-view complaint details (future enhancement)

**REQ-DASH-005: Active Workers List**
- **Description:** Display workers currently on duty for the department
- **Acceptance Criteria:**
  - Shows worker card layout: name, photo, online status, task progression
  - Online/Offline badge (green/gray)
  - Task completion ratio (X of Y completed)
  - Worker rating (stars)
  - Filter by: All / Online / Offline
  - Maximum 4 workers visible; paginate if more
  - Sorted by online status first, then by task completion

**REQ-DASH-006: Activity Feed** (Optional)
- **Description:** Timeline of recent department events
- **Acceptance Criteria:**
  - Shows last 5 complain events (created/assigned/resolved)
  - Timestamp and actor name
  - Event type icon
  - Scrollable if > 5 events
  - Real-time updates when available

**REQ-DASH-007: Dashboard Refresh**
- **Description:** Data auto-refreshes at regular intervals
- **Acceptance Criteria:**
  - Initial load on page mount
  - Manual refresh button (icon in navbar)
  - Auto-refresh every 30 seconds (optional)
  - Loading indicators during fetch
  - Error handling with retry option

---

#### 3.1.3 Complaints Module

**REQ-COMP-001: View All Complaints**
- **Description:** List all complaints for the logged-in user's department
- **Acceptance Criteria:**
  - Table format with columns: ID, Title, Location, Status, Assigned Worker, Date
  - 20 complaints per page
  - Pagination controls (Previous/Next/Jump to page)
  - Sorted by date (newest first) by default

**REQ-COMP-002: Filter Complaints**
- **Description:** Filter table by various criteria
- **Acceptance Criteria:**
  - Filter by Status: All / Pending / In-Progress / Resolved
  - Filter by Worker: All / [Worker names for department]
  - Filter by Location: Dropdown of unique locations
  - Multiple filters applicable simultaneously
  - Clear All Filters button
  - Show count of results after filtering

**REQ-COMP-003: Search Complaints**
- **Description:** Full-text search across complaint title and location
- **Acceptance Criteria:**
  - Real-time search as user types
  - Case-insensitive matching
  - Highlights matching terms in results
  - Clears when input cleared
  - Works in combination with filters

**REQ-COMP-004: View Complaint Details**
- **Description:** Open detailed view of specific complaint
- **Acceptance Criteria:**
  - Modal or side panel showing:
    - Title, Description, Location, Department
    - Reported Date & Time
    - Current Status with history timeline
    - Assigned Worker (name + contact)
    - Notes/Comments from workers
    - Priority level
  - Close button to return to table
  - (Phase 2) Option to add notes as admin

**REQ-COMP-005: Update Complaint Status**
- **Description:** Change complaint status through workflow
- **Acceptance Criteria:**
  - Status dropdown in detail view: Pending → In-Progress → Resolved
  - Cannot skip workflow states (Pending must precede In-Progress)
  - Cannot revert status (only forward progression)
  - Timestamp recorded for each status change
  - Worker notified of status change (Phase 2: via API)
  - Confirmation dialog before save

**REQ-COMP-006: Assign Worker to Complaint**
- **Description:** Assign complaint to available worker
- **Acceptance Criteria:**
  - Dropdown showing available workers from department
  - Filter available workers by shift (show workers on current shift first)
  - Unassign option (reverts to "Unassigned")
  - Cannot assign worker from different department
  - Confirmation required for reassignment
  - Worker load shown (current tasks / max capacity)

**REQ-COMP-007: Export Complaints**
- **Description:** Export complaint data for reporting (Phase 2)
- **Acceptance Criteria:**
  - Export visible list as CSV
  - Include all columns: ID, Title, Location, Status, Worker, Date
  - Include applied filters in export
  - File named: `complaints_[department]_[date].csv`

---

#### 3.1.4 Workers Module

**REQ-WORK-001: View All Workers**
- **Description:** List all workers in logged-in user's department
- **Acceptance Criteria:**
  - Display as grid cards (default) or table (toggle option)
  - Cards show: Name, Status (online/offline), Department, Shift, Task Progress
  - Sort by: Name / Online Status / Task Completion %
  - Filter by: Status (Online/Offline/All)
  - Filter by: Shift (Morning/Evening/Night/All)
  - Search by name

**REQ-WORK-002: Worker Profile Card**
- **Description:** Detailed view of individual worker
- **Acceptance Criteria:**
  - Modal/drawer showing:
    - Photo, Name, ID, Department, Contact
    - Current Shift assignment
    - Online/Offline status with last activity time
    - Current Tasks (list of assigned complaints)
    - Task Completion Ratio: X of Y completed (%)
    - Performance Rating (1-5 stars)
    - Average Response Time
    - Notes field for admin comments
  - Close button to return to list

**REQ-WORK-003: Worker Online Status**
- **Description:** Track and display real-time worker availability
- **Acceptance Criteria:**
  - Green badge = Online (available)
  - Gray badge = Offline (not available)
  - Last activity timestamp: "Last seen 5 minutes ago"
  - (Phase 2) Updates via API polling or WebSocket
  - Indicate if worker hasn't updated status in 1 hour

**REQ-WORK-004: Worker Performance Metrics**
- **Description:** Display performance indicators
- **Acceptance Criteria:**
  - Task completion %: (completed tasks / total assigned)
  - Average rating: Aggregate from complaint resolutions
  - Response time: Average hours from assignment to "In-Progress"
  - Quality score: Based on rating feedback (future)
  - Benchmark against department average

**REQ-WORK-005: Send Message to Worker** (Phase 2)
- **Description:** Send message/task instruction to worker
- **Acceptance Criteria:**
  - Message input field in worker profile
  - Send button triggers API call to queue message
  - Timestamp and read receipts (if available from backend)
  - Message history log

---

#### 3.1.5 Shift Module

**REQ-SHIFT-001: View Weekly Shift Schedule**
- **Description:** Display weekly shift grid for all department workers
- **Acceptance Criteria:**
  - Grid layout: Workers (rows) × Days (columns)
  - Time periods: Morning (6-14), Evening (14-22), Night (22-6), Off
  - Current week highlighted
  - Previous/Next week navigation
  - Color-coded: Morning=Blue, Evening=Orange, Night=Purple, Off=Gray

**REQ-SHIFT-002: Assign Shifts**
- **Description:** Modify worker shift assignments
- **Acceptance Criteria:**
  - Click cell to edit worker's shift for that day
  - Dropdown: Morning / Evening / Night / Off
  - Cannot assign shift to > 1 worker for same time+location (future)
  - Save immediately or batch save option
  - Undo recent changes (6 months history)
  - Confirmation dialog for bulk operations (Phase 2)

**REQ-SHIFT-003: Shift Conflict Detection** (Phase 2)
- **Description:** Prevent scheduling conflicts
- **Acceptance Criteria:**
  - Alert if worker assigned overlapping shifts
  - Alert if critical time slots have no workers assigned
  - Suggest available workers when assigning shifts
  - Warn before assigning workers to excessive hours/week

**REQ-SHIFT-004: Export Schedule**
- **Description:** Export shift schedule for distribution
- **Acceptance Criteria:**
  - Export week as PDF or image
  - Include worker contact numbers
  - File named: `schedule_[department]_[week].pdf`
  - Can send/print to workers (Phase 2)

**REQ-SHIFT-005: Shift Change Requests** (Phase 2)
- **Description:** Allow workers to request shift swaps
- **Acceptance Criteria:**
  - Workers can request swap via mobile (future)
  - Admin reviews swap requests in panel
  - Approve/Deny with notification
  - Swap takes effect on approval

---

#### 3.1.6 Profile Module

**REQ-PROF-001: View User Profile**
- **Description:** Display current user's profile information
- **Acceptance Criteria:**
  - Name, Email, Department, User ID
  - Join date / Last login date
  - Active shift (current or next)
  - Contact number (editable)
  - Photo (read-only for now)

**REQ-PROF-002: Update Profile**
- **Description:** Allow user to update editable fields
- **Acceptance Criteria:**
  - Editable fields: Contact Number
  - Email, Department, Name not editable
  - Save button disables while request processing
  - Success/Error message after update
  - (Phase 2) Confirm email change via OTP

**REQ-PROF-003: Change Password** (Phase 2)
- **Description:** User can change login password
- **Acceptance Criteria:**
  - Require current password entry
  - New password must differ from current
  - Password strength validation
  - Confirmation field required
  - Email notification of password change

**REQ-PROF-004: Activity Log**
- **Description:** Display user's login history
- **Acceptance Criteria:**
  - Table: Login Time, Device Type, IP Address
  - Last 20 logins
  - Option to logout other sessions (Phase 2)

---

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements

| Requirement | Target | Acceptance Criteria |
|---|---|---|
| **Page Load Time** | < 3 seconds | Measured on 4G network; excludes backend latency |
| **API Response Time** | < 500ms | 95th percentile latency from client |
| **Dashboard Render** | < 1 second | After data fetch completes |
| **Search Result Time** | < 200ms | Search results appear while typing |
| **Complaint List Load** | < 2 seconds | 100 complaints max visible per page |
| **Shift Grid Render** | < 1 second | 50 workers per week grid |
| **Memory Usage** | < 100MB | Browser session memory baseline |

#### 3.2.2 Usability Requirements

| Requirement | Description |
|---|---|
| **Responsive Design** | Adapts to 1024x768 (min) to 4K monitors |
| **Navigation** | Clear sidebar menu; no more than 3 clicks to any feature |
| **Accessibility** | WCAG 2.1 Level AA compliance (keyboard navigation, screen readers support) |
| **Input Validation** | Real-time feedback; clear error messages |
| **Consistency** | Uniform color theme, button styles, spacing (TailwindCSS) |
| **Mobile Tablet** | Optimize for 768px-1024px tablets (responsive layout) |
| **Dark Mode** | TBD (Phase 2; currently light mode only) |

#### 3.2.3 Reliability Requirements

| Requirement | Target | Details |
|---|---|---|
| **Availability** | 99% | Planned maintenance windows excluded |
| **Data Integrity** | 100% | No data loss during network interruptions |
| **Session Timeout** | 30 mins inactivity | (Phase 2) Backend to enforce; frontend warning at 25 mins |
| **Error Recovery** | Graceful | Clear error messages; retry options provided |
| **Backup & Recovery** | TBD | Backend responsibility (Phase 2) |

#### 3.2.4 Security Requirements

| Requirement | Implementation |
|---|---|
| **Authentication** | Email + Password; stored securely on backend |
| **Authorization** | Role-based (by department); users see only their data |
| **Data Encryption** | HTTPS for all API calls (Phase 2) |
| **Session Security** | JWT tokens with expiration (Phase 2) |
| **Password Policy** | Minimum 6 characters; no complexity rules (Phase 2 to enhance) |
| **CSRF Protection** | CSRF tokens in API requests (Phase 2) |
| **XSS Prevention** | Input sanitization; Content Security Policy headers (Phase 2) |
| **SQL Injection Prevention** | Parameterized queries on backend (Phase 2) |
| **Rate Limiting** | Max 5 login attempts per email per 10 minutes (Phase 2) |
| **Audit Logging** | Log all admin actions: login, status changes, worker assignments (Phase 2) |
| **Data Privacy** | User data visible only to their department; no cross-department leakage |

#### 3.2.5 Maintainability Requirements

| Requirement | Details |
|---|---|
| **Code Style** | ESLint configuration provided; follows consistent formatting |
| **Component Reusability** | Generic components (Card, Table, Button) for consistency |
| **Documentation** | JSDoc comments for complex functions; README updated |
| **Modular Architecture** | API layer separated from UI; services isolated |
| **Version Control** | Git repository with clear commit history |
| **Testing** | Unit tests for utilities; integration tests for API calls (Phase 2) |
| **Dependency Updates** | Lock package versions; security updates applied promptly |

#### 3.2.6 Scalability Requirements

| Requirement | Target Scale |
|---|---|
| **Concurrent Users** | Support 100 simultaneous users per department |
| **Complaint Data** | Support 10,000+ complaints in database |
| **Worker Records** | Support 1,000+ workers across platform |
| **Query Performance** | Department-filtered queries < 500ms at scale |

---

## 4. External Interface Requirements

### 4.1 User Interface Requirements

#### 4.1.1 Login Page
- Department dropdown (6 options)
- Email input field (text, required)
- Password input field (masked, with toggle visibility)
- Show/Hide password checkbox
- Login button (disabled until both fields filled)
- Error message display area
- Branding: Civic Infrastructure logo & title
- Responsive for all device sizes

#### 4.1.2 Navigation Structure
**Sidebar (Left):**
- Logo/Branding at top
- Menu items:
  - Dashboard (icon + text)
  - Complaints (icon + text)
  - Workers (icon + text)
  - Shift Schedule (icon + text)
  - Profile (icon + text)
- Collapse/Expand toggle (mobile)
- Highlighted active page

**Navbar (Top):**
- Department name (top-left with sidebar logo)
- Search bar (global search across complaints)
- Notification bell (Phase 2)
- User name dropdown (top-right)
- Logout button in dropdown
- Refresh button

#### 4.1.3 Dashboard Layout
- Greeting section: "Welcome, [Name]! ([Department])"
- 4 Stats Cards grid (responsive: 1 col mobile, 2 cols tablet, 4 cols desktop)
- Donut Chart (status distribution) - 50% width
- Complaints Table (recent 5-10) - 50% width; scrollable
- Active Workers section - full width; 4 cards per row

#### 4.1.4 Table Components
- Header with column names; sortable arrows
- Rows with data and hover effects
- Action column (view details, edit, delete icons)
- Pagination controls below table
- Row count selector (10, 20, 50 per page)

#### 4.1.5 Modal/Dialog Windows
- Semi-transparent overlay
- Centered card with title, content, action buttons
- Close button (X) in top-right
- Keyboard support (Escape to close)
- Scrollable content if > viewport height

### 4.2 API Interface Requirements

#### 4.2.1 Authentication Endpoints (Phase 2)

**POST /auth/login**
```json
Request:
{
  "email": "tech@civic.com",
  "password": "123456",
  "department": "technician"
}

Response (Success 200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR001",
    "name": "Rahul Sharma",
    "email": "tech@civic.com",
    "department": "technician",
    "role": "admin"
  }
}

Response (Failure 401):
{
  "error": "Invalid email or password"
}
```

**GET /auth/me**
```
Header: Authorization: Bearer <token>

Response (Success 200):
{
  "id": "USR001",
  "name": "Rahul Sharma",
  "email": "tech@civic.com",
  "department": "technician",
  "role": "admin"
}
```

#### 4.2.2 Dashboard Endpoints (Phase 2)

**GET /dashboard/stats?department=technician**
```json
Response (Success 200):
{
  "stats": {
    "totalComplaints": 45,
    "resolvedComplaints": 32,
    "pendingComplaints": 13,
    "activeWorkers": 8
  }
}
```

**GET /dashboard/complaints?department=technician&limit=10**
```json
Response (Success 200):
{
  "complaints": [
    {
      "id": "CMP001",
      "title": "Road pothole near market",
      "location": "City Center Market",
      "department": "technician",
      "status": "pending",
      "assignedWorker": "RAJ001",
      "date": "2026-04-15T10:30:00Z"
    }
  ],
  "total": 45
}
```

#### 4.2.3 Complaints Endpoints (Phase 2)

**GET /complaints?department=technician&filter=status&limit=20&page=1**

**PATCH /complaints/:id/status**
```json
Request: { "status": "in-progress" }
Response: { "id": "CMP001", "status": "in-progress", "updatedAt": "..." }
```

**PATCH /complaints/:id/worker**
```json
Request: { "workerId": "WKR001" }
Response: { "id": "CMP001", "assignedWorker": "WKR001" }
```

#### 4.2.4 Workers Endpoints (Phase 2)

**GET /workers?department=technician**
```json
Response: 
{
  "workers": [
    {
      "id": "WKR001",
      "name": "Rajesh Kumar",
      "department": "technician",
      "online": true,
      "shift": "morning",
      "tasksDone": 8,
      "tasksTotal": 10,
      "rating": 4.5,
      "email": "rajesh@civic.com",
      "phone": "+91-9876543210"
    }
  ]
}
```

#### 4.2.5 Shift Endpoints (Phase 2)

**GET /shifts?department=technician&week=2026-04-15**
```json
Response:
{
  "shifts": [
    {
      "workerId": "WKR001",
      "day": "Monday",
      "shift": "morning",
      "date": "2026-04-21"
    }
  ]
}
```

**PATCH /shifts/:workerId/:date**
```json
Request: { "shift": "evening" }
Response: { "workerId": "WKR001", "date": "2026-04-21", "shift": "evening" }
```

---

## 5. System Features

| Feature | Priority | Status |
|---|---|---|
| User Authentication | Critical | Implemented (mock) |
| Department-Based Access | Critical | Implemented |
| Dashboard Overview | Critical | Implemented |
| Complaints Management | High | Implemented (read-only) |
| Workers Listing | High | Implemented |
| Shift Scheduling | High | Implemented (UI only) |
| User Profile | Medium | Implemented (basic) |
| Search & Filter | High | Implemented |
| Sorting & Pagination | High | Implemented |
| Export to CSV (Phase 2) | Medium | Not Started |
| Notifications (Phase 2) | Medium | Not Started |
| Audit Logging (Phase 2) | Medium | Not Started |

---

## 6. Constraints and Assumptions

### 6.1 System Constraints

| Constraint | Impact |
|---|---|
| **No Redux/Context** | Component-level state only; prop drilling for wide hierarchies |
| **localStorage Limited to ~5MB** | Cannot store massive complaint/worker datasets; pagination required |
| **No Real-time WebSocket** | Current polling-based refresh; batching APIs to reduce overhead |
| **Modern Browsers Only** | ES2020+ syntax; IE11 not supported |
| **Single Department per Session** | No switching departments mid-session (logout + login required) |

### 6.2 Business Assumptions

| Assumption | Details |
|---|---|
| **Pre-defined Departments** | 6 fixed departments; no admin ability to create departments |
| **User Pre-created by Backend** | No self-signup; admins created manually in backend |
| **Data Stays Online** | No offline-first functionality; connectivity required |
| **Email Uniqueness** | No two accounts share same email |
| **Department Ownership** | Each complaint/worker belongs to exactly one department |
| **No Cross-department Operations** | Cannot reassign complaint across departments |

---

## 7. Acceptance Criteria

### Functional Acceptance

| Component | Acceptance Test | Pass Criteria |
|---|---|---|
| **Login** | Correct credentials → Dashboard | Logged in; localStorage populated |
| **Invalid Credentials** | Wrong password → Error message | Error shown; no redirect |
| **Dashboard Stats** | View dashboard → Stats match mock data | All 4 stats cards display correctly |
| **Complaint Filter** | Apply filter → Table updates | Only filtered complaints shown |
| **Worker Search** | Type worker name → Results update | Real-time filtering works |
| **Shift Edit** | Click cell → Dropdown appears → Save | Shift changes persisted (to localStorage) |

### Non-Functional Acceptance

| Metric | Target | Test Method |
|---|---|---|
| **Page Load** | < 3 seconds | Chrome DevTools Performance tab |
| **Search Response** | < 200ms | Measure from keystroke to results |
| **Accessibility** | WCAG 2.1 AA | axe DevTools scan |
| **Mobile Layout** | No horizontal scroll @ 768px | Responsive design test |
| **Error Handling** | All errors have recovery option | Disconnect network; app should recover |

---

## 8. Glossary

| Term | Definition |
|---|---|
| **Admin** | Authorized department manager |
| **Complaint** | Civic issue reported by public |
| **Department** | Service category (Technician, Plumbing, etc.) |
| **Worker** | Staff member handling complaints; may work across multiple shifts |
| **Shift** | Time period: Morning (6-14), Evening (14-22), Night (22-6) |
| **Mock Data** | Test data; not from real backend |
| **localStorage** | Browser's persistent key-value storage |
| **JWT** | JSON Web Token; secure credential format (Phase 2) |
| **CSRF** | Cross-Site Request Forgery attack |
| **XSS** | Cross-Site Scripting attack |

---

## 9. Phase 2: Backend Integration Specification (Future)

### 9.1 Backend Requirements

When backend is ready, frontend will:
1. Replace `USE_MOCK = true` with `USE_MOCK = false` in `auth.js` and `dashboardApi.js`
2. API calls will route to `http://localhost:5000/api/` (configurable via .env)
3. All mock data files can be archived but kept for reference

### 9.2 Expected Backend Capabilities

- **User Management**: Create, read, update users; password hashing
- **Authentication**: Login endpoint; JWT token generation
- **Complaint Management**: CRUD operations; workflow validation
- **Worker Management**: Read worker status; update performance metrics
- **Shift Management**: Read/write shift schedules; conflict detection
- **Audit Logging**: Log all admin actions for compliance
- **Data Validation**: Server-side validation; constraint enforcement
- **Error Handling**: Consistent error responses; meaningful messages

### 9.3 Security Enhancements (Backend)

- HTTPS enforcement
- CORS configuration
- CSRF token validation
- Rate limiting
- SQL injection prevention
- Session timeout enforcement
- Encrypted password storage (bcrypt)

---

## 10. Approval & Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| **Project Manager** | TBD | TBD | TBD |
| **Business Analyst** | TBD | TBD | TBD |
| **Development Lead** | TBD | TBD | TBD |
| **QA Lead** | TBD | TBD | TBD |

---

**Document End**  
*For questions or updates, contact the Project Management Office.*
