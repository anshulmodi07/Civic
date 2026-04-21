# CivicMitra — Full Project Context & Architecture
## End-to-End Combined System Documentation (Admin Panel + User App)
**Version:** 1.0 | **Last Updated:** April 15, 2026 | **Status:** ✅ Ready for Review

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Project Ecosystem Overview — How Both Apps Connect](#2-project-ecosystem-overview)
3. [Shared Data Model & Entity Relationships](#3-shared-data-model--entity-relationships)
4. [Admin Panel — Architecture & Stack](#4-admin-panel--architecture--stack)
5. [User App (CivicMitra) — Architecture & Stack](#5-user-app-civicmitra--architecture--stack)
6. [Authentication & Role System (Both Apps)](#6-authentication--role-system)
7. [Core Modules — Admin Panel (6 Pages)](#7-core-modules--admin-panel)
8. [Core Modules — User App (6 Screens)](#8-core-modules--user-app)
9. [Complete API Reference (Shared Backend)](#9-complete-api-reference)
10. [Data Flow Diagrams — End to End](#10-data-flow-diagrams)
11. [User Journey Maps](#11-user-journey-maps)
12. [Component Architecture (Both Apps)](#12-component-architecture)
13. [State Management & Persistence](#13-state-management--persistence)
14. [Business Logic & Services](#14-business-logic--services)
15. [Error Handling & User Feedback](#15-error-handling--user-feedback)
16. [Configuration & Environment](#16-configuration--environment)
17. [Project File Structure (Both Apps)](#17-project-file-structure)
18. [Development Phases & Roadmap](#18-development-phases--roadmap)
19. [Technical Constraints & Known Limitations](#19-technical-constraints--known-limitations)
20. [Key Code References](#20-key-code-references)

---

## 1. Executive Summary

### 1.1 What Is CivicMitra?

**CivicMitra** is a full-stack civic complaint management platform built for campus environments. It consists of **two separate applications** that operate on the same backend and shared data:

| App | Platform | Users | Purpose |
|-----|----------|-------|---------|
| **Admin Panel** | React Web (Browser) | Department Admins (6 roles) | Manage workers, assign complaints, schedule shifts, monitor dashboards |
| **User App** | React Native / Expo (iOS, Android, Web) | Citizens & Workers | Report complaints, track status, accept & complete maintenance tasks |

Both apps share a **common backend REST API**, the same **data entities**, and the same **complaint lifecycle**. A complaint created by a citizen in the User App becomes visible to admins in the Admin Panel, gets assigned to a worker, and the worker completes it — all tracked end-to-end.

### 1.2 System Flow (Big Picture)

CITIZEN (User App)
  └─→ Creates complaint
         ↓
WORKER (User App — Worker Role)
  └─→ Sees complaint in available tasks
  └─→ Accepts task
         ↓
WORKER (My Tasks Section)
  └─→ Starts task
  └─→ Completes task with notes + photo
        OR
  └─→ Marks as incomplete (moves to Incomplete section)
         ↓
CITIZEN (User App)
  └─→ Receives update
  └─→ Sees complaint marked "Completed" or "Incomplete"
         ↓
ADMIN PANEL
  └─→ Handles shift management
  └─→ Monitors workers & task flow (supervision/dashboard)


### 1.3 Current Status Summary

| Feature Area | Admin Panel | User App |
|---|---|---|
| Authentication | ✅ Complete (Mock) | ✅ Complete |
| Dashboard/Analytics | ✅ Complete (Mock) | ✅ Complete |
| Complaint Management | ✅ Complete (Mock) | ✅ Complete (Browse/Mine) |
| Worker Management | ✅ Complete (Mock) | N/A |
| Shift Scheduling | ✅ Complete (Mock) | N/A |
| Task Acceptance (Worker) | N/A | ⚠️ Demo Mode |
| Create Complaint (Citizen) | N/A | ⚠️ Partial (forms in dev) |
| Map View | N/A | ⚠️ Partial |
| Backend Integration | 📋 Planned (Phase 2) | 📋 Planned (Phase 2) |

---

## 2. Project Ecosystem Overview

### 2.1 System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                        CIVICMITRA ECOSYSTEM                        │
│                                                                    │
│  ┌───────────────────────┐        ┌───────────────────────────┐    │
│  │     ADMIN PANEL       │        │       USER APP            │    │
│  │   (React Web App)     │        │  (React Native / Expo)    │    │
│  │                       │        │                           │    │
│  │  Department Admins    │        │  Citizens (create/track)  │    │
│  │  -                    │        │  Workers (accept/done)    │    │
│  │  -                    │        │                           │    |
│  │  - Plumbing           │        │  Platforms:               │    │
│  │  - Electicity         │        │  iOS, Android, Web        │    │
│  │  - Civil              │        │                           │    │
│  │  - Wifi               │        │                           │    │
│  └──────────┬────────────┘        └────────────┬──────────────┘    │
│             │                                  │                   │
│             └────────────┬─────────────────────┘                   │
│                          ▼                                         │
│              ┌───────────────────────┐                             │
│              │    SHARED BACKEND     │                             │
│              │   (Node/Express API)  │                             │
│              │                       │                             │
│              │  REST Endpoints:      │                             │
│              │  /auth/*              │                             │
│              │  /complaints/*        │                             │
│              │  /workers/*           │                             │
│              │  /shifts/*            │                             │
│              │  /dashboard/*         │                             │
│              │  /tasks/*             │                             │
│              └──────────┬────────────┘                             │
│                         ▼                                          │
│              ┌───────────────────────┐                             │
│              │  DATABASE             │                             │
│              │             MongoDB   │                             │
│              └───────────────────────┘                             │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 Repository / Directory Layout

```
civicmitra/                        ← Root monorepo (or two separate repos)
├── admin-panel/                   ← React Web Admin App
│   ├── src/
│   │   ├── pages/                 ← 6 main pages
│   │   ├── components/            ← Reusable UI components
│   │   ├── api/                   ← API service calls
│   │   ├── services/              ← Business logic
│   │   ├── data/                  ← Mock data
│   │   └── layouts/               ← AdminLayout wrapper
│   ├── docs/                      ← IEEE documentation suite (7000+ lines)
│   ├── package.json
│   └── vite.config.js
│
└── user-app/  (CivicMitra)        ← React Native / Expo User App
    ├── app/                       ← File-based routing (Expo Router)
    │   ├── _layout.tsx            ← Root layout & auth guard
    │   ├── (auth)/login.tsx       ← Login screen
    │   ├── (client)/              ← Citizen screens
    │   └── (worker)/              ← Worker screens
    ├── src/
    │   ├── api/                   ← Axios, auth, complaint, task APIs
    │   ├── components/            ← Shared UI components
    │   ├── context/               ← AuthContext
    │   └── utils/                 ← SLA, geo helpers
    ├── constants/                 ← Theme, colors, fonts
    ├── app.json                   ← Expo config
    └── package.json
```

### 2.3 How the Two Apps Interact via Data

```
CITIZEN creates complaint (User App)
    ↓  POST /complaints
DATABASE: complaint {status: "pending"}
    ↓  GET /tasks/available (Worker, User App)
WORKER sees complaint in available tasks
    ↓  PATCH /tasks/:id/accept
DATABASE: complaint {status: "accepted", assignedTo: workerId}
    ↓  GET /tasks/my (Worker, User App)
WORKER sees task in My Tasks
    ↓  PATCH /tasks/:id/start
DATABASE: complaint {status: "in_progress"}
    ↓  PATCH /tasks/:id/complete
        OR
    ↓  PATCH /tasks/:id/incomplete
DATABASE: complaint {status: "completed"} 
        OR
DATABASE: complaint {status: "incomplete"}
    ↓  GET /complaints/my (Citizen, User App)
CITIZEN sees complaint marked "Completed" ✅ 
        OR "Incomplete" ⚠️
    ↓
ADMIN PANEL
    ↓  GET /dashboard /workers
ADMIN monitors tasks + manages shifts (no assignment flow)
```

---

# 3. Shared Data Model & Entity Relationships

---

## 3.1 Entity Relationship Diagram

```
Department (1) ──┬──→ (N) AdminUser
                 └──→ (N) Worker ──→ (N) Task

User (Citizen) (1) ──→ (N) Complaint

Complaint (1) ──→ (N) Task
Complaint (N) ──→ (1) Worker (optional, via assignedTo)

Complaint ──(1)──→ (N) ComplaintImage
Complaint ──(1)──→ (N) Upvote

Worker ──(1)──→ (N) Shift
```

---

## 3.2 Entity Definitions

### Department

```
id          : string   — Unique identifier
name        : string   — "Electricity" | "Plumbing" | "Civil" | "Wifi"
code        : string   — Short code, e.g., "ELE", "PLB"
description : string
createdAt   : ISO8601
```

---

### User (Citizen)

```
id        : string
name      : string
email     : string   — Unique
phone     : string
createdAt : ISO8601
```

---

### AdminUser (Admin Panel)

```
id           : string
email        : string   — Unique
password     : string   — Hashed
name         : string
departmentId : string   — FK → Department
role         : "admin"
createdAt    : ISO8601
```

---

### Worker (Field Staff)

```
id            : string
name          : string
email         : string
departmentId  : string   — FK → Department
status        : "offline" | "idle" | "busy"
rating        : number   — 0.0 to 5.0
tasksTotal    : number
tasksComplete : number
skills        : string[] — e.g., ["electrician", "plumber"]
assignedArea  : string
createdAt     : ISO8601
```

---

### Complaint (Core Entity — Shared)

```
_id              : string   — Unique (MongoDB ObjectId format)
type             : "hostel" | "campus"
issueType        : string   — "electrician" | "plumber" | "civil" | etc.
description      : string   — Min 20 chars

status           : "pending" | "accepted" | "in-progress" | "completed" | "incomplete"

priority         : "low" | "medium" | "high" | "critical"

createdBy        : string   — FK → User (Citizen)
assignedTo       : string?  — FK → Worker (set when accepted)
departmentId     : string   — FK → Department

-- Location (Hostel type):
hostelName       : string?
floor            : string?
roomNumber       : string?

-- Location (Campus type):
locationLandmark : string?
locationAddress  : string?

-- GPS:
location         : { lat: number, lng: number }

-- Timestamps:
createdAt        : ISO8601
updatedAt        : ISO8601

-- Optional Rich Data:
timeline         : Array<{
  status     : string,
  timestamp  : ISO8601,
  updatedBy  : "worker" | "system" | "admin",
  note       : string?
}>

workerNotes      : string?
```

---

### ComplaintImage

```
id          : string
complaintId : string   — FK → Complaint
url         : string
uploadedAt  : ISO8601
```

---

### Upvote

```
id          : string
complaintId : string   — FK → Complaint
userId      : string   — FK → User
createdAt   : ISO8601
```

---

### Task (Worker Perspective of Complaint)

```
id             : string
complaintId    : string   — FK → Complaint
assignedTo     : string   — FK → Worker

type           : "hostel" | "campus"
issueType      : string

status         : "pending" | "accepted" | "in-progress" | "completed" | "incomplete"

note           : string?   — Completion or failure notes
completedImage : string?   — Evidence photo URL

startedAt      : ISO8601?
completedAt    : ISO8601?
updatedAt      : ISO8601
```

---

### Shift (Admin Panel Only)

```
id         : string
workerId   : string   — FK → Worker
date       : ISO8601
type       : "Morning" | "Evening" | "Night" | "Off"
available  : boolean
notes      : string?
```

---

## 3.3 Status Flow (Complaint Lifecycle)

```
[CITIZEN creates complaint]
        ↓
     pending
        ↓  [WORKER accepts task]
     accepted
        ↓  [WORKER starts task]
   in-progress
        ↓
   ┌───────────────┬───────────────┐
   ↓                               ↓
[WORKER completes]        [WORKER marks incomplete]
   ↓                               ↓
completed ✅                 incomplete ⚠️
        ↓
[CITIZEN receives update]
```

---

## Key Design Notes

* No admin assignment flow (worker-driven system)
* Complaint is the source of truth
* Task acts as worker abstraction layer
* Normalized media (ComplaintImage) and engagement (Upvote)
* Admin role limited to supervision and shift management
* Status lifecycle aligned with real-world workflow







---

## 4. Admin Panel — Architecture & Stack

### 4.1 Technology Stack

| Layer | Technologies |
|-------|---|
| Frontend Framework | React 18+, React Router 7, JavaScript ES2020+ |
| Styling | TailwindCSS 4.2, CSS Modules |
| Charts | Recharts 3.8 |
| Build Tool | Vite |
| Data (Phase 1) | localStorage + Mock data |
| State | React Hooks, localStorage persistence |

### 4.2 Architecture Pattern: 3-Layer

```
┌──────────────────────────────────────────────┐
│  PRESENTATION LAYER                           │
│  React Components → pages/ + components/      │
└──────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER                         │
│  services/adminService.js                     │
│  api/auth.js + api/dashboardApi.js   +(later on) api/complaintsApi.js +  api/shiftApi.js + api/workersApi.js       │
└──────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────┐
│  DATA PERSISTENCE LAYER                       │                     │
│  → REST Backend API                  │
└──────────────────────────────────────────────┘
```

### 4.3 Design Patterns Used

- **Container/Presentational Pattern** — Logic in page files, UI in components
- **Service Locator Pattern** — adminService.js routes calls
- **Layout Wrapper Pattern** — AdminLayout wraps all authenticated pages
- **Provider Pattern** — React Context for auth state

### 4.4 Admin Panel File Structure

```
admin-panel/
├── src/
│   ├── pages/
│   │   ├── Login.jsx            ← Auth + Department selection
│   │   ├── Dashboard.jsx        ← Stats, donut chart, tables
│   │   ├── Complaints.jsx       ← Filter/sort/search complaints
│   │   ├── Workers.jsx          ← Worker directory grid/table
│   │   ├── Shift.jsx            ← Weekly shift scheduler grid
│   │   └── Profile.jsx          ← Admin profile view/edit
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── Table.jsx
│   │   ├── Card.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── dashboard/           ← Dashboard-specific components
│   │   ├── login/               ← Login-specific components
│   │   └── navbar/              ← Navbar-specific components
│   ├── api/
│   │   ├── auth.js              ← Login/logout
│   │   └── dashboardApi.js      ← Dashboard data fetch
│   ├── services/
│   │   └── adminService.js      ← Business logic layer
│   ├── layouts/
│   │   └── AdminLayout.jsx      ← Sidebar + Navbar wrapper
│   ├── styles/
│   └── App.jsx, main.jsx
├── package.json
├── vite.config.js
└── eslint.config.js
```

---
## 5. User App (CivicMitra) — Architecture & Stack

### 5.1 Technology Stack

| Layer | Technologies |
|-------|---|
| Framework | React Native 0.81.5 (Hermes engine) |
| Routing | Expo Router ~6.0.23 (file-based) |
| HTTP Client | Axios ^1.14.0 with interceptors |
| Local Storage | AsyncStorage 2.2.0 (token persistence) |
| Location | expo-location ~19.0.8 |
| Image Picker | expo-image-picker ~17.0.10 |
| Icons | @expo/vector-icons (Ionicons) |
| Gradients | expo-linear-gradient ~15.0.8 |
| Build Tool | Expo ~54.0.33 |
| Platforms | iOS 14+, Android API 24+, Web |

### 5.2 Architecture Pattern: Layered MVC

```
┌──────────────────────────────────────────────────┐
│  PRESENTATION LAYER                               │
│  Screens (TSX/JS) | Components | Navigation       │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER                             │
│  AuthContext | Validation | SLA Logic             │
│  Geo Services | Filters | Utils                   │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│  DATA ACCESS LAYER                                │
│  Axios Instance | Demo Store | Real Backend API   │
│  Auth Endpoints | Complaint APIs | Task APIs      │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│  PERSISTENCE LAYER                                │
│  AsyncStorage (Token) | In-Memory Demo Store      │
└──────────────────────────────────────────────────┘
```

### 5.3 User App File Structure

```
user-app/
├── app/
│   ├── _layout.tsx                    ← ROOT: auth check + role-based routing
│   ├── modal.tsx
│   ├── (auth)/
│   │   └── login.tsx                  ← Login (both roles)
│   ├── (client)/
│   │   ├── _layout.tsx               ← Client tab layout
│   │   ├── index.tsx                 ← Home dashboard (stats + quick actions)
│   │   ├── browse.tsx                ← Browse all complaints
│   │   ├── my-complaints.tsx         ← User's complaints with SLA tracking
│   │   ├── create-complaint.tsx      ← Type selector (hostel/campus)
│   │   ├── create-complaint-hostel.tsx  ← Hostel form (⚠️ partial)
│   │   ├── create-complaint-campus.tsx  ← Campus form (⚠️ partial)
│   │   ├── complaint-detail/         ← Complaint detail view (⚠️ partial)
│   │   ├── complaint-map.tsx         ← Map view (⚠️ partial)
│   │   ├── complaint-map.web.tsx     ← Web-specific map
│   │   └── signout.tsx
│   └── (worker)/
│       └── (tabs)/
│           └── dashboard.tsx         ← Worker dashboard (⚠️ demo)
├── src/
│   ├── api/
│   │   ├── axios.js                  ← HTTP client + interceptors
│   │   ├── auth.api.js               ← Login, getMe, logout
│   │   ├── demoAuth.api.js           ← Demo mode auth
│   │   ├── complaint.api.js          ← CRUD + upvote
│   │   └── tasks.api.ts              ← Task accept/complete (demo)
│   ├── components/
│   │   ├── ComplaintCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── SLABadge.tsx
│   │   ├── ImagePreview.tsx
│   │   └── ErrorBoundary.tsx
│   ├── context/
│   │   └── AuthContext.js            ← Global auth state
│   └── utils/
│       └── sla.js                    ← SLA breach calculation
├── constants/
│   └── theme.ts                      ← Colors, fonts, gradients
├── app.json
└── package.json
```

## 6. Authentication & Role System

### 6.1 Roles Across Both Apps

| Role | App | Access |
|------|-----|--------|
| **Admin** (Department-based) | Admin Panel | Full dashboard, complaints, workers, shifts, profile |
| **Citizen** | User App | Create/browse/track complaints, upvote |
| **Worker** | User App | Accept/start/complete assigned tasks |

### 6.2 Admin Panel Authentication

**Flow:**
```
1. Admin enters Email + Password + selects Department
   ↓  POST /auth/login
2. Returns { token, user }
   ↓  localStorage.setItem("token", token)
3. AdminLayout protects all routes
4. Sidebar shows department name
```

**6 Departments (4 Admin Roles):**

-wifi
-electricity
-plubming
-civil

**Session Persistence:** localStorage token, survives page refresh.

### 6.3 User App Authentication (JWT-Based)

**Flow:**
```
1. User enters Email (it will be verified by collegd mail id only college mail id auth will be allowed)(+ Role selection: citizen/worker)
   ↓  POST /auth/login
2. Returns { token, user }
   ↓  AsyncStorage.setItem("token", token)
3. GET /auth/me → setUser(userData)
4. _layout.tsx checks role:
   - "client"  → /(client)/browse
   - "worker"  → /(worker)/dashboard
```

**Session Restore on App Launch:**
```javascript
useEffect(() => {
  const restoreSession = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const userData = await getMe();   // GET /auth/me
      setUser(userData);
    }
  };
  restoreSession();
}, []);
```

**Axios Token Injection:**
```javascript
instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401:
instance.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    await AsyncStorage.removeItem("token");
    // trigger logout via context
  }
});
```



### 6.5 Permission Matrix (Full)

| Feature | Admin (Panel) | Citizen (App) | Worker (App) |
|---------|---|---|---|
| Login/Logout | ✅ | ✅ | ✅ |
| Dashboard Analytics | ✅ | ✅ (own stats) | ✅ (task stats) |
| View All Complaints | ✅ | ✅ | ⚠️ Task-only |
| Create Complaint | X | ✅ | ❌ |
| Assign Worker | X | ❌ | ❌ |
| Accept Task | ❌ | ❌ | ✅ |
| Complete Task | ❌ | ❌ | ✅ |
| Upvote Complaint | ❌ | ✅ | ❌ |
| Manage Workers | ✅ | ❌ | ❌ |
| Schedule Shifts | ✅ | ❌ | ❌ |
| View Map | ❌ | ✅ | ❌ |
| Edit Profile | ✅ | ❌ | ❌ |

---

## 7. Core Modules — Admin Panel

### 7.1 Login Page (`Login.jsx`)

- Email + Password form
- Department dropdown (6 options)
- "Remember me" via localStorage (jwt)
- Session management on submit
- Redirects to Dashboard on success

### 7.2 Dashboard Page (`Dashboard.jsx`)

**4 Stat Cards:**
- Total Complaints
- Pending Complaints
- Workers Online
- Resolved Today

**Donut Chart** (Recharts): Complaint status breakdown — pending / assigned / in-progress / closed

**Complaint Table:** Recent 10 complaints with status badge, assigned worker, location

**Worker List:** Online workers with status indicator

**Data Source:** `dashboardApi.js` → mock data / `USE_MOCK` toggle

### 7.3 Complaints Page (`Complaints.jsx`)

- Full table view of all complaints
- **Filter by:** Status, Worker, Location, Department
- **Sort by:** Date, Priority, Status
- **Search:** Text search in description
- Status badge with color coding
- Click row for detail

### 7.4 Workers list (`Workers.jsx`)

- **View Modes:** Grid (card) / Table (row)
- **Worker Card shows:**
  - Online status indicator (green/grey dot)
  - Name, Department
  - Task progress bar (completed/total)
  - Star rating
  - Skills list
- Filter by department / status

### 7.5 Shift Page (`Shift.jsx`)

- **Weekly grid:** Workers (rows) × Days Mon–Sun (columns)
- **4 Shift Types:**
  - Morning (6am–2pm)
  - Evening (2pm–10pm)
  - Night (10pm–6am)
  - Off (day off)
- Click cell to change shift type
- Color-coded by shift type
- Save button to persist

### 7.6 Profile Page (`Profile.jsx`)

- View admin's own profile details
- Edit mode: name, email, contact
- Department info (read-only)
- Password change form (planned)

---

## 8. Core Modules — User App

### 8.1 Login Screen (`(auth)/login.tsx`) ✅ Complete

- Email + Password fields
- Role selector: Citizen / Worker
- Demo mode login (one-tap)
- Validates and calls auth API
- Routes to correct app section based on role

### 8.2 Home Dashboard (`(client)/index.tsx`) ✅ Complete

- Gradient header with greeting
- **3 Stat Cards:**
  - Active Complaints
  - Resolved Complaints
  - My Total Complaints
- Quick action buttons:
  - "Report Grievance" → Create Complaint
  - "Browse Issues" → Browse

### 8.3 Browse Complaints (`(client)/browse.tsx`) ✅ Complete

- Loads all complaints via `GET /complaints`
- **Text Search:** Filters by description + issueType
- **3 Filters:**
  - Type: hostel / campus / all
  - Issue Type: electrician, plumber, sanitation, etc.
  - Sort: Popular (by upvotes) / Recent (by date)
- **Per Card shows:**
  - Issue type badge
  - Description (truncated)
  - Status badge
  - Upvote count + Support button
  - SLA indicator
- Tap card → Complaint Detail

### 8.4 My Complaints (`(client)/my-complaints.tsx`) ✅ Complete

- Loads user's own complaints via `GET /complaints/my`
- **Status Tab filter:** All / Pending / In Progress / Resolved
- **Per Card shows:**
  - All browse card info, PLUS:
  - Days since creation
  - SLA badge: green "ON TIME" or red pulsing "SLA BREACH"
- Tap → Complaint Detail

### 8.5 Create Complaint (`(client)/create-complaint*.tsx`) ⚠️ Partial

**Type Selector screen:** Choose Hostel or Campus

**Hostel Form fields:**
- Hostel Name (dropdown)
- Floor
- Room Number
- Issue Type (dropdown)
- Description (min 20 chars)
- GPS location (auto-capture)
- Images (up to 5, camera/gallery)

**Campus Form fields:**
- Location Landmark (dropdown)
- Location Address (freeform)
- Issue Type (dropdown)
- Description (min 20 chars)
- GPS location
- Images (up to 5)

**Submission:** `POST /complaints` (multipart/form-data)

### 8.6 Worker Dashboard (`(worker)/(tabs)/dashboard.tsx`) ⚠️ Demo

- Task Stats: Assigned / In Progress / Completed
- My Tasks list with filter tabs
- Accept Task → start/complete workflow
- Availability toggle (online/offline)

---

## 9. Complete API Reference

### 9.1 Authentication Endpoints

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/auth/login` | ❌ | `{ email, password, name, role }` | `{ token, user }` |
| GET | `/auth/me` | ✅ | — | `{ id, name, email, role }` |
| POST | `/auth/logout` | ✅ | — | `{}` |

### 9.2 Complaint Endpoints

| Method | Endpoint | Auth | Body | Response | Notes |
|--------|----------|------|------|----------|-------|
| GET | `/complaints` | ✅ | ?status, ?type, ?page | `[Complaint]` | Browse all |
| POST | `/complaints` | ✅ | FormData + images | `Complaint` | Create new |
| GET | `/complaints/my` | ✅ | ?status | `[Complaint]` | Own complaints |
| GET | `/complaints/:id` | ✅ | — | `Complaint` | Detail view |
| POST | `/complaints/:id/support` | ✅ | `{}` | `Complaint` | Toggle upvote |
| DELETE | `/complaints/:id` | ✅ | — | 204 | Own + pending only |
| GET | `/complaints/nearby` | ✅ | ?lat, ?lng, ?radiusKm | `[Complaint]` | Map view |
| PATCH | `/complaints/:id/assign` | ✅ (Admin) | `{ workerId }` | `Complaint` | Admin only |

### 9.3 Worker Endpoints (Admin Panel)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| GET | `/workers` | ✅ | ?department, ?status | `[Worker]` |
| GET | `/workers/:id` | ✅ | — | `Worker` |
| POST | `/workers` | ✅ (Admin) | Worker data | `Worker` |
| PATCH | `/workers/:id` | ✅ (Admin) | Partial Worker | `Worker` |
| DELETE | `/workers/:id` | ✅ (Admin) | — | 204 |

### 9.4 Task Endpoints (Worker App)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| GET | `/tasks` | ✅ | ?status, ?area | `[Task]` |
| GET | `/tasks/my` | ✅ | — | `[Task]` |
| PATCH | `/tasks/:id/accept` | ✅ (Worker) | `{}` | `Task` |
| PATCH | `/tasks/:id/start` | ✅ (Worker) | `{}` | `Task` |
| PATCH | `/tasks/:id/complete` | ✅ (Worker) | FormData (note, image, status) | `Task` |

### 9.5 Shift Endpoints (Admin Panel)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| GET | `/shifts` | ✅ | ?week, ?workerId | `[Shift]` |
| POST | `/shifts` | ✅ (Admin) | `{ workerId, date, type }` | `Shift` |
| PATCH | `/shifts/:id` | ✅ (Admin) | `{ type }` | `Shift` |

### 9.6 Dashboard Endpoints

| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| GET | `/dashboard/admin` | ✅ (Admin) | `{ totalComplaints, pending, workersOnline, resolvedToday }` |
| GET | `/dashboard/citizen` | ✅ (Citizen) | `{ activeComplaints, resolvedComplaints, myComplaints }` |
| GET | `/dashboard/worker` | ✅ (Worker) | `{ assigned, inProgress, completed }` |

### 9.7 Standard Response Formats

**Success:**
```json
{ "id": "...", "status": "...", ... }          // Single object
[ { ... }, { ... } ]                           // Array
{ "data": [...], "total": 100, "page": 1 }    // Paginated
```

**Error:**
```json
{ "message": "Human-readable error", "code": "ERR_CODE", "errors": { "field": ["msg"] } }
```

**HTTP Codes:**
- 200 OK, 201 Created, 204 No Content
- 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 413 Payload Too Large, 500 Server Error

---

## 10. Data Flow Diagrams

### 10.1 Authentication Flow (User App)

```
[User Input: email + password + role]
         ↓
[Login Screen → handleLogin()]
         ↓
[AuthContext.login()]
  └─ POST /auth/login  ←── Axios (no token needed)
         ↓
[Backend]
  ├─ Validate credentials
  ├─ Generate JWT
  └─ Return { token, user }
         ↓
[Frontend]
  ├─ AsyncStorage.setItem("token", token)
  └─ GET /auth/me   ←── Axios (token in header)
         ↓
[setUser(userData)]
         ↓
[_layout.tsx re-renders]
  ├─ role === "client" → /(client)/browse
  └─ role === "worker" → /(worker)/dashboard
```

### 10.2 Complaint Creation Flow (User App → DB → Admin Panel)

```
[Citizen fills form]
         ↓
[Validate: description ≥ 20 chars, issueType valid]
         ↓
[Build FormData: issueType, description, location, images[]]
         ↓
POST /complaints (multipart/form-data)
         ↓
[Backend]
  ├─ Validate fields
  ├─ Upload images → S3/CDN
  ├─ Insert to DB: { status: "pending" }
  └─ Return { _id, status, createdAt }
         ↓
[User App]
  └─ Navigate to /my-complaints
         ↓
[DB: complaint with status = "pending"]
         ↓
[Worker App]
  └─ GET /tasks/my → new task appears 
  if worker accept task

### 10.3 Task Completion Flow (Worker App → DB → Citizen App)

```
[Worker sees task in My Tasks]
         ↓
PATCH /tasks/:id/accept
  └─ DB: task.status = "accepted"
         ↓
PATCH /tasks/:id/start
  └─ DB: task.status = "in-progress"
         ↓
[Worker completes work in real world]
         ↓
[Worker fills completion form: note + evidence photo]
         ↓
PATCH /tasks/:id/complete (FormData)
  └─ DB: task.status = "completed"
  └─ DB: complaint.status = "closed"
         ↓
[Citizen App]
  └─ GET /complaints/my → complaint shows status "closed" ✅
```

### 10.4 Admin Panel Data Flow

```
[Admin logs in → selects Department]
         ↓
POST /auth/login
  └─ localStorage.setItem("token")
         ↓
[AdminLayout renders Sidebar + Navbar]
         ↓
[Dashboard]
  └─ GET /dashboard/admin → stat cards + chart data
         ↓
[Complaints Page]
  └─ GET /complaints → table with filters
         ↓
[Workers Page]
  └─ GET /workers → grid/table with status can see details of workers
         ↓
[Shift Page]
  └─ GET /shifts?week=... → weekly grid
  └─ PATCH /shifts/:id → update shift type
```

---

## 11. User Journey Maps

### 11.1 Citizen: Report → Track → Resolved

```
START: Open User App
  ↓
Login (or demo)
  ↓
Home Dashboard
  ↓ tap "Report Grievance"
Create Complaint
  ├─ Select: Hostel / Campus
  ├─ Fill: issueType, description, location, images
  └─ Submit → POST /complaints
  ↓
My Complaints Tab
  ├─ New complaint: status = PENDING (yellow badge)
  └─ SLA badge: "ON TIME" (green)
  ↓ (admin assigns worker)
My Complaints Tab
  ├─ Status: ASSIGNED (blue badge)
  └─ "Assigned To: Team A"
  ↓ (worker accepts + starts)
My Complaints Tab
  ├─ Status: IN-PROGRESS (blue badge)
  └─ SLA still "ON TIME"
  ↓ (worker completes)
My Complaints Tab
  └─ Status: CLOSED/RESOLVED (green badge) ✅
END
```

### 11.2 Admin: Review → Assign → Monitor

```
START: Open Admin Panel (Browser)
  ↓
Login + Select Department
  ↓
Dashboard
  ├─ Stat card: "5 Pending Complaints"
  └─ Table shows recent complaints
  ↓ click complaint row
Complaint Detail
  ├─ See description, location, images
  └─ Select worker from dropdown → PATCH /complaints/:id/assign
  ↓
Workers Page
  ├─ See worker is now "busy" with task
  └─ Rating + task progress visible
  ↓
Shift Page
  └─ Check worker is scheduled for today (not "Off")
  ↓
Dashboard (refresh)
  └─ "Resolved Today" count increases after worker completes
END
```

### 11.3 Worker: Accept → Complete Task

```
START: Open User App (Worker login)
  ↓
Worker Dashboard
  ├─ Assigned: 3 tasks waiting
  └─ "My Tasks" tab
  ↓ tap pending task
Task Detail
  ├─ See: issueType, location, description
  └─ Tap "Accept" → PATCH /tasks/:id/accept
  ↓
Task status: ACCEPTED
  └─ Tap "Start Work" → PATCH /tasks/:id/start
  ↓
Task status: IN-PROGRESS
  └─ [Go fix the issue in real world]
  ↓
Tap "Complete"
  ├─ Fill: note (required), evidence photo, time spent
  └─ PATCH /tasks/:id/complete → { status: "completed" }
  ↓
Task removed from My Tasks
Complaint marked CLOSED in DB
Citizen sees RESOLVED ✅
END
```

---

## 12. Component Architecture

### 12.1 Admin Panel Components

| Component | File | Purpose |
|-----------|------|---------|
| Sidebar | `Sidebar.jsx` | Navigation links, department label |
| Navbar | `Navbar.jsx` | Top bar with user info + logout |
| Table | `Table.jsx` | Reusable sortable table |
| Card | `Card.jsx` | Stat card with number + icon |
| StatusBadge | `StatusBadge.jsx` | Colored status pill |

### 12.2 User App Components

| Component | File | Purpose |
|-----------|------|---------|
| ComplaintCard | `ComplaintCard.tsx` | Summary card for browse/my-complaints lists |
| StatusBadge | `StatusBadge.tsx` | Color-coded status with icon + label |
| SLABadge | `SLABadge.tsx` | SLA breach indicator with pulsing animation |
| ImagePreview | `ImagePreview.tsx` | Image with loading skeleton + optional remove |
| ErrorBoundary | `ErrorBoundary.tsx` | Catch render errors, show retry button |

### 12.3 StatusBadge Config (User App)

| Status | Color | Icon | Label |
|--------|-------|------|-------|
| pending | Yellow | hourglass | PENDING |
| assigned | Blue | person | ASSIGNED |
| in-progress | Blue | construct | IN PROGRESS |
| resolved / closed | Green | checkmark | RESOLVED |
| rejected | Red | close | REJECTED |
| accepted | Purple | checkmark | ACCEPTED |
| completed | Green | checkmark | COMPLETED |
| incomplete | Red | close | INCOMPLETE |

### 12.4 Theme / Color Palette

**User App Gradients (expo-linear-gradient):**
```javascript
Header (blue):   ["#1e3a8a", "#3b82f6", "#60a5fa"]
Campus (green):  ["#10b981", "#059669"]
Hostel (blue):   ["#3b82f6", "#2563eb"]
Worker (purple): ["#8b5cf6", "#7c3aed"]
```

**Status Colors:**
```
SLA Breach:   Red #dc2626 (pulsing dot)
SLA On-Time:  Green #15803d
Pending:      Amber #fef3c7
Assigned:     Sky #dbeafe
In-Progress:  Blue #3b82f6
Resolved:     Green #dcfce7
Rejected:     Red #fee2e2
```

---

## 13. State Management & Persistence

### 13.1 Admin Panel State

| Storage | Key | Value | Lifetime |
|---------|-----|-------|----------|
| localStorage | `"token"` | JWT string | Until logout |
| localStorage | `"user"` | User JSON | Until logout |
| localStorage | `"department"` | Selected dept | Until logout |
| React State | — | Page-level UI state | Component lifecycle |

**Mock Data Toggle:**
```javascript
const USE_MOCK = true;   // Switch in adminService.js

if (USE_MOCK) {
  return mockData.complaints;
} else {
  return await api.get("/complaints");
}
```

### 13.2 User App State

**Global (React Context):**
```javascript
AuthContext = {
  user: { id, name, email, role },
  loading: boolean,
  isAuthenticated: boolean,
  isWorker: boolean,
  isClient: boolean,
  login: async ({ email, name, role, password }) => void,
  logout: async () => void,
}
```

**Persistent (AsyncStorage):**
```
Key: "token"   Value: JWT string   Duration: Session-based
```

**Screen-level (useState):**
```javascript
// Browse screen example:
const [complaints, setComplaints] = useState([]);
const [loading, setLoading] = useState(false);
const [searchText, setSearchText] = useState("");
const [typeFilter, setTypeFilter] = useState("all");
const [sortBy, setSortBy] = useState("recent");
const [upvotingIds, setUpvotingIds] = useState([]);
```

---

## 14. Business Logic & Services

### 14.1 SLA Tracking (User App: `src/utils/sla.js`)

**SLA Hours by Issue Type:**
```javascript
const SLA_HOURS = {
  water:       24,    // 1 day
  electricity: 12,    // 12 hours
  road:        72,    // 3 days
  garbage:     48,    // 2 days
};
```

**Check SLA:**
```javascript
export const checkSLA = (issueType, createdAt, status) => {
  if (status === "closed") return { breached: false };
  const slaHours = SLA_HOURS[issueType];
  if (!slaHours) return { breached: false };
  const elapsedHours = (Date.now() - new Date(createdAt)) / 3600000;
  return {
    breached: elapsedHours > slaHours,
    elapsedHours: Math.floor(elapsedHours),
    slaHours
  };
};
```

### 14.2 Complaint Validation

```javascript
// Required validation rules:
description.length >= 20          // "Min 20 characters"
issueType in VALID_ISSUE_TYPES    // "Invalid issue type"

// Hostel-specific:
hostelName, floor, roomNumber required

// Campus-specific:
locationLandmark OR locationAddress required

// Image rules:
images.length <= 5                // "Max 5 images"
```

### 14.3 Filter & Search Logic (User App browse.tsx)

```javascript
// Search:
results = complaints.filter(c =>
  c.description.toLowerCase().includes(search) ||
  c.issueType.toLowerCase().includes(search)
);

// Type filter:
if (typeFilter !== "all") results = results.filter(c => c.type === typeFilter);

// Issue type filter:
if (issueTypeFilter !== "all") results = results.filter(c => c.issueType === issueTypeFilter);

// Sort:
if (sortBy === "popular") results.sort((a, b) => b.upvotes - a.upvotes);
else results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
```

### 14.4 Geolocation (User App)

```javascript
const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });
  return { lat: location.coords.latitude, lng: location.coords.longitude };
};
```

**Haversine Distance (for /complaints/nearby):**
```javascript
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.asin(Math.sqrt(a));
};
```

### 14.5 Admin Service Layer (`adminService.js`)

```javascript
// Service Locator pattern — routes to mock or real API
class AdminService {
  async getComplaints(filters) {
    if (USE_MOCK) return mockData.filterComplaints(filters);
    return await api.get("/complaints", { params: filters });
  }

  async assignWorker(complaintId, workerId) {
    if (USE_MOCK) return mockData.assignComplaint(complaintId, workerId);
    return await api.patch(`/complaints/${complaintId}/assign`, { workerId });
  }

  async getShifts(week) {
    if (USE_MOCK) return mockData.getShifts(week);
    return await api.get("/shifts", { params: { week } });
  }
}
```




---

## 15. Error Handling & User Feedback

### 15.1 Error Handling Patterns

**Admin Panel:**
```javascript
// API call wrapper:
try {
  const data = await adminService.getComplaints(filters);
  setComplaints(data);
} catch (error) {
  setError("Failed to load complaints");
  // Show error toast
}
```

**User App:**
```javascript
// Axios 401 → auto-logout (interceptor)
// API call in component:
try {
  const data = await getAllComplaints();
  setComplaints(data);
} catch (error) {
  console.log("Browse error:", error);
  setComplaints([]);  // Graceful empty state
}
```

### 15.2 Loading States

```jsx
{loading ? (
  <ActivityIndicator size="large" color="#3b82f6" />
) : (
  <FlatList data={complaints} ... />
)}
```

### 15.3 Double-Click Prevention

```jsx
{upvotingIds.includes(complaintId) ? (
  <ActivityIndicator size="small" />
) : (
  <TouchableOpacity onPress={handleToggleSupport}>
    <Text>Support ({upvotes})</Text>
  </TouchableOpacity>
)}
```

### 15.4 Graceful Degradation

- Demo mode activates if backend is unreachable
- Missing images show placeholder icon
- Malformed dates show "Unknown date"
- Empty filter results show empty state illustration
- `<ErrorBoundary>` catches render errors with retry button

---

## 16. Configuration & Environment

### 16.1 Admin Panel Environment

**vite.config.js:**
```javascript
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
});
```

**Mock Data Toggle:**
```javascript
// In adminService.js or api files:
const USE_MOCK = true;   // Set false for real backend
```

### 16.2 User App Environment

**.env:**
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.x:5000    # Your computer's local IP
EXPO_PUBLIC_USE_DEMO=true                        # Toggle demo vs real backend
```

**app.json (key settings):**
```json
{
  "expo": {
    "name": "CivicMitra",
    "slug": "civicmitra",
    "version": "1.0.0",
    "orientation": "portrait",
    "plugins": [
      ["expo-router", { "origin": false }],
      "expo-font",
      "expo-splash-screen"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "schemes": ["civicmitra"]
  }
}
```

### 16.3 Build Commands

**Admin Panel:**
```bash
cd admin-panel
npm install
npm run dev        # Development (Vite, port 5173)
npm run build      # Production build
npm run preview    # Preview production build
```

**User App:**
```bash
cd user-app
npm install
npm start          # Expo dev server (all platforms)
npm run android    # Android with cache reset
npm run ios        # iOS with cache reset
npm run web        # Web browser
npm run lint       # ESLint check
```

---

## 17. Project File Structure (Both Apps — Full View)

```
civicmitra/
│
├── admin-panel/                              [React Web]
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Complaints.jsx
│   │   │   ├── Workers.jsx
│   │   │   ├── Shift.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   └── navbar/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   └── dashboardApi.js
│   │   ├── services/
│   │   │   └── adminService.js
│   │   ├── data/
│   │   │   ├── users.js             (6 dept users)
│   │   │   ├── complaints.js        (50+ mock complaints)
│   │   │   └── workersData.js       (20+ mock workers)
│   │   ├── layouts/
│   │   │   └── AdminLayout.jsx
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── user-app/                                 [React Native / Expo]
    ├── app/
    │   ├── _layout.tsx              ← ROOT layout (auth guard + routing)
    │   ├── modal.tsx
    │   ├── (auth)/
    │   │   └── login.tsx
    │   ├── (client)/
    │   │   ├── _layout.tsx          ← Client tab bar
    │   │   ├── index.tsx            ← Home dashboard ✅
    │   │   ├── browse.tsx           ← Browse all complaints ✅
    │   │   ├── my-complaints.tsx    ← My complaints + SLA ✅
    │   │   ├── create-complaint.tsx ← Type selector ✅
    │   │   ├── create-complaint-hostel.tsx  ⚠️ partial
    │   │   ├── create-complaint-campus.tsx  ⚠️ partial
    │   │   ├── complaint-detail/    ← Detail view ⚠️ partial
    │   │   ├── complaint-map.tsx    ← Map view ⚠️ partial
    │   │   ├── complaint-map.web.tsx
    │   │   └── signout.tsx
    │   └── (worker)/
    │       └── (tabs)/
    │           └── dashboard.tsx    ← Worker home ⚠️ demo
    ├── src/
    │   ├── api/
    │   │   ├── axios.js             ← HTTP client + interceptors
    │   │   ├── auth.api.js
    │   │   ├── demoAuth.api.js      ← Demo mode auth
    │   │   ├── complaint.api.js
    │   │   └── tasks.api.ts
    │   ├── components/
    │   │   ├── ComplaintCard.tsx
    │   │   ├── StatusBadge.tsx
    │   │   ├── SLABadge.tsx
    │   │   ├── ImagePreview.tsx
    │   │   └── ErrorBoundary.tsx
    │   ├── context/
    │   │   └── AuthContext.js
    │   └── utils/
    │       └── sla.js
    ├── constants/
    │   └── theme.ts
    ├── assets/
    ├── app.json
    ├── tsconfig.json
    └── package.json
```

---

## 18. Development Phases & Roadmap

### Phase 1 — Current (Mock / UI Complete)

**Admin Panel ✅**
- All 6 pages functional
- localStorage session
- USE_MOCK flag for data toggling
- Recharts dashboard
- Shift scheduling grid
- Worker grid/table view

**User App ✅ / ⚠️**
- Login + auth guard ✅
- Browse + search + filter + upvote ✅
- My Complaints + SLA tracking ✅
- Create complaint (type selector + partial forms) ⚠️
- Worker task flow (demo mode) ⚠️
- Map view (partial) ⚠️

### Phase 2 — Planned (Backend Integration)

**Backend to Build:**
```
Runtime:    Node.js / Express
Database:   PostgreSQL (primary) or MongoDB
Auth:       JWT (HS256), bcrypt passwords
Storage:    AWS S3 or Cloudinary for images
```

**Endpoints to Implement:**
- All `/auth/*` routes
- All `/complaints/*` routes
- All `/workers/*` routes
- All `/shifts/*` routes
- All `/tasks/*` routes
- All `/dashboard/*` routes

**Admin Panel changes:**
- Replace `USE_MOCK` with real API calls
- JWT-based session (replace localStorage token)
- Real-time dashboard with polling or WebSockets

**User App changes:**
- Set `EXPO_PUBLIC_USE_DEMO=false`
- Point `EXPO_PUBLIC_API_URL` to deployed backend
- Enable multipart image upload (currently commented)
- Complete hostel + campus forms

### Phase 3 — Future

- Push Notifications (Expo Notifications) for status updates
- Real-time updates via Socket.io or SSE
- Comments on complaints
- Offline sync (Redux-Persist or WatermelonDB)
- Admin mobile app
- Analytics reporting exports (PDF/Excel)
- Docker + CI/CD pipeline
- Unit + integration + E2E tests

---

## 19. Technical Constraints & Known Limitations

### 19.1 Admin Panel

| Item | Status | Notes |
|------|--------|-------|
 6 users, 20+ workers, 50+ complaints in memory |
| No real auth | ⚠️ Phase 1 | localStorage token, not JWT-verified |
| No file upload | 📋 Planned | Profile photo / complaint image management |
| No real-time | 📋 Planned | Dashboard doesn't auto-refresh |
| Draw.io diagrams | 📋 Pending | DFD, Sequence, Process Flowcharts not yet made |

### 19.2 User App

| Feature | Status | Issue | Plan |
|---------|--------|-------|------|
| Image Upload | ⚠️ Commented | Multipart form disabled | Enable ComplaintCard code |
| Hostel Form | ⚠️ Partial | Incomplete validation | Finish form + validation |
| Campus Form | ⚠️ Partial | Landmark dropdown incomplete | Finish form |
| Complaint Detail | ⚠️ Partial | Timeline not rendering | Complete detail view |
| Map View | ⚠️ Partial | Leaflet not fully integrated | Leaflet markers + clustering |
| Worker Dashboard | ⚠️ Demo | Hardcoded stats | Link to /dashboard/worker API |
| Real-time Updates | 🔴 Missing | No WebSocket | Add Socket.io or SSE |
| Push Notifications | 🔴 Missing | No Expo Notifications | Implement for status changes |
| Comments | 🔴 Missing | No API | Design + implement |
| Pagination | 🔴 Missing | All data loads at once | Add ?page=&limit= support |
| Offline Sync | 🔴 Missing | No queue | Redux-Persist or WatermelonDB |
| Accessibility | 🔴 Missing | No a11y labels | Add aria/accessible labels |

### 19.3 Known Bugs

1. No exponential backoff on network retry
2. Token expiration not proactively checked — only on 401 response
3. Demo data lost on app reload
4. Large image arrays could cause memory issues (no lazy loading)
5. Double-click protection only implemented for upvote, not all buttons

---

## 20. Key Code References

### 20.1 Admin Panel — Critical Files

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/App.jsx` | Root component + router | Route definitions |
| `src/layouts/AdminLayout.jsx` | Sidebar + Navbar wrapper | `AdminLayout` |
| `src/api/auth.js` | Login/logout | `login()`, `logout()` |
| `src/api/dashboardApi.js` | Dashboard data | `getDashboardStats()` |
| `src/services/adminService.js` | Business logic + mock toggle | `getComplaints()`, `assignWorker()` |
| `src/data/complaints.js` | 50+ mock complaints | `mockComplaints` array |
| `src/data/workersData.js` | 20+ mock workers | `mockWorkers` array |
| `src/data/users.js` | 6 dept users | `mockUsers` array |
| `src/pages/Dashboard.jsx` | Main dashboard | Stat cards, chart, tables |
| `src/pages/Shift.jsx` | Shift scheduler | Weekly grid |
| `src/components/StatusBadge.jsx` | Status display | `STATUS_CONFIG` |

### 20.2 User App — Critical Files

| File | Purpose | Key Exports / Functions |
|------|---------|------------------------|
| `src/context/AuthContext.js` | Auth state | `AuthProvider`, `login()`, `logout()` |
| `app/_layout.tsx` | Root routing | Role-based navigation guard |
| `src/api/axios.js` | HTTP client | Interceptors, token injection |
| `src/api/auth.api.js` | Auth endpoints | `login()`, `getMe()`, `logoutUser()` |
| `src/api/complaint.api.js` | Complaint CRUD | `getAllComplaints()`, `createComplaint()`, `toggleUpvote()` |
| `src/api/tasks.api.ts` | Task APIs (demo) | `getAllTasks()`, `acceptTask()`, `completeTask()` |
| `src/utils/sla.js` | SLA calculation | `checkSLA()` |
| `app/(client)/browse.tsx` | Browse screen | Search, filter, sort, upvote |
| `app/(client)/my-complaints.tsx` | My complaints | SLA tracking, status tabs |
| `src/components/StatusBadge.tsx` | Status pill | `STATUS_CONFIG` map |
| `src/components/SLABadge.tsx` | SLA indicator | Pulsing animation |
| `constants/theme.ts` | Design tokens | `Colors`, `Fonts` |

### 20.3 Quick Function Lookup

| Function | File | Purpose |
|----------|------|---------|
| `login()` | AuthContext.js | Authenticate + store token |
| `logout()` | AuthContext.js | Clear token + user state |
| `restoreSession()` | AuthContext.js | Reload token on app launch |
| `getAllComplaints()` | complaint.api.js | Fetch complaint list |
| `createComplaint()` | complaint.api.js | POST new complaint (FormData) |
| `toggleUpvote()` | complaint.api.js | POST /complaints/:id/support |
| `checkSLA()` | sla.js | Returns { breached, elapsedHours, slaHours } |
| `acceptTask()` | tasks.api.ts | PATCH /tasks/:id/accept |
| `completeTask()` | tasks.api.ts | PATCH /tasks/:id/complete |
| `getDashboardStats()` | dashboardApi.js | Admin dashboard numbers |

---

## Appendix A: Mock Data Summary

### Admin Panel Mock Data

| Entity | Count | Source File |
|--------|-------|-------------|
| Admin Users | 6 (one per dept) | `data/users.js` |
| Workers | 20+ | `data/workersData.js` |
| Complaints | 50+ | `data/complaints.js` |
| Departments | 6 | Inline config |

### User App Demo Data

**Demo Users:**
```
Citizen:  demo@civicmitra.com  / demo1234
Worker:   worker@demo.com      / demo1234
```

**Demo Complaints (in-memory):**
```
c001: Electricty, Hostel A Room 302, IN-PROGRESS, 6 upvotes
c002: Plumbing, Mess Block, ASSIGNED, 3 upvotes
c003: wifi, Hostel B Room 205, PENDING, 4 upvotes
c004: civil, Main Gate, CLOSED, 4 upvotes
c005: wifi, Hostel C Room 108, PENDING, 2 upvotes
c006: Civil, Sports Complex, IN-PROGRESS
```

**Demo Dashboard Stats:**
```
activeComplaints:   4
resolvedComplaints: 12
myComplaints:       15
```

---

## Appendix B: Documentation Suite (Admin Panel /docs/)

| Document | Purpose | Lines |
|----------|---------|-------|
| `01_SRS.md` | Software Requirements Specification | ~1000 |
| `02_SDD.md` | Software Design Document | ~1200 |
| `03_ER_Diagram.md` | Entity Relationship Model | ~400 |
| `04_System_Architecture.md` | 3-Layer Architecture | ~600 |
| `05_Use_Cases.md` | 6 complete use cases | ~800 |
| `06_Data_Flow_Diagrams.md` | DFDs Level 0 + Level 1 | ~700 |
| `07_Sequence_Flows.md` | 6 UML sequence diagrams | ~800 |
| `07b_Process_Flowcharts.md` | 3 flowcharts + swimlanes | ~700 |
| `README.md` | Navigation index | ~200 |
| **Total** | | **7000+ lines** |

---

*Document Version: 1.0 | April 15, 2026 | CivicMitra Full Project Context*
*Covers: Admin Panel (React Web) + User App (React Native/Expo) + Shared Backend Contract*
