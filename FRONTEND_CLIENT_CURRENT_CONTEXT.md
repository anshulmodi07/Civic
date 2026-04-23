# 📱 Frontend Client - Current Context & Implementation

**Project:** CivicMitra | Frontend Client (React Native + Expo)  
**Last Updated:** April 22, 2026  
**Version:** 1.0

---

## 📋 Table of Contents

1. [Current Architecture Overview](#current-architecture-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Current File-Based Routing](#current-file-based-routing)
5. [Authentication System (Current)](#authentication-system-current)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Client Screens (Current Implementation)](#client-screens-current-implementation)
9. [Components & UI](#components--ui)
10. [Data Models Used](#data-models-used)
11. [Known Limitations & Issues](#known-limitations--issues)
12. [Current Features Status](#current-features-status)

---

## 🏗️ Current Architecture Overview

### Technology Stack
```
Framework:      React Native with Expo (managed service)
Routing:        Expo Router v9+ (file-based routing)
Language:       TypeScript + JavaScript (mixed)
State Mgmt:     React Context API (AuthContext)
HTTP Client:    Axios with interceptors
Storage:        AsyncStorage (persistent token storage)
Icons:          Ionicons (expo-icons)
Graphics:       LinearGradient, Maps
```

### Framework Versions (package.json)
```
expo                    ~51.0.14
expo-router             ~3.5.12
react                   18.2.0
react-native            0.74.1
@react-navigation/*     (legacy, partially used)
axios                   ^1.7.5
expo-linear-gradient    ~12.8.1
expo-image-picker       ~14.7.1
```

---

## 📁 Project Structure

```
civic-app/
├── app/                                  [File-based routing - Expo Router]
│   ├── _layout.tsx                      [ROOT layout - Auth guard & role routing]
│   ├── modal.tsx                        [Modal definitions]
│   ├── (auth)/
│   │   └── login.tsx                    [Login screen wrapper]
│   ├── (client)/                        [Client/Citizen screens]
│   │   ├── _layout.tsx                  [Client tab layout]
│   │   ├── index.tsx                    [Dashboard/Home - ✅ ACTIVE]
│   │   ├── browse.tsx                   [Browse all complaints - ✅ ACTIVE]
│   │   ├── my-complaints.tsx            [User's complaints - ✅ ACTIVE]
│   │   ├── create-complaint.tsx         [Type selector (hostel/campus)]
│   │   ├── create-complaint-hostel.tsx  [Hostel form - IN DEV]
│   │   ├── create-complaint-campus.tsx  [Campus form - IN DEV]
│   │   ├── complaint-detail/
│   │   │   └── [id].tsx                 [Detail view - ✅ ACTIVE]
│   │   ├── complaint-map.tsx            [Map view - ✅ ACTIVE]
│   │   ├── complaint-map.web.tsx        [Web alternative]
│   │   └── signout.tsx                  [Logout screen]
│   └── (worker)/                        [Worker screens]
│       └── (tabs)/
│           ├── _layout.tsx              [Tab navigation]
│           ├── dashboard.tsx            [Worker dashboard - DEMO]
│           ├── all-tasks.tsx            [All tasks - DEMO]
│           ├── incomplete-tasks.tsx     [Incomplete - DEMO]
│           └── profile.tsx              [Profile - DEMO]
│
├── src/
│   ├── api/                             [API wrapper functions]
│   │   ├── auth.api.js                  [Authentication endpoints]
│   │   ├── complaint.api.js             [Complaint operations]
│   │   ├── tasks.api.ts                 [Task operations]
│   │   ├── axios.js                     [Axios instance + interceptors]
│   │   ├── config.js                    [API configuration]
│   │   └── demoAuth.api.js              [Demo/mock auth]
│   ├── components/
│   │   ├── ComplaintCard.tsx            [Reusable complaint card]
│   │   ├── ErrorBoundary.tsx            [Error handling wrapper]
│   │   ├── ImagePreview.tsx             [Image display component]
│   │   ├── SLABadge.tsx                 [SLA status indicator]
│   │   ├── StatusBadge.tsx              [Status indicator]
│   │   ├── TaskCard.tsx                 [Task card component]
│   │   └── ui/
│   │       ├── collapsible.tsx
│   │       ├── icon-symbol.tsx
│   │       └── themed-text.tsx
│   ├── context/
│   │   └── AuthContext.js               [Global auth state]
│   ├── screens/
│   │   ├── common/
│   │   │   └── LoginScreen.js           [Auth UI]
│   │   ├── client/
│   │   │   └── [legacy screens]         [Not actively used]
│   │   └── worker/
│   │       └── [legacy screens]         [Not actively used]
│   ├── services/
│   │   └── complaintValidation.service.js
│   ├── types/
│   │   └── task.ts
│   ├── utils/
│   │   ├── constants.js
│   │   ├── sla.js
│   │   └── storage.js
│   ├── hooks/
│   │   └── use-color-scheme.ts
│   └── navigation/
│       └── [legacy navigation]          [Partially used]
│
├── constants/
│   └── theme.ts                         [Colors, spacing, typography]
├── assets/
│   └── images/                          [Image assets]
├── docs/
│   ├── API_SPECIFICATION.md
│   ├── DATA_MODELS.md
│   └── prompt.md
├── app.json                             [Expo configuration]
├── package.json
├── tsconfig.json
└── eslint.config.js
```

---

## 🔐 Authentication System (Current)

### Current Auth Flow

```
1. App Start
   ├─ _layout.tsx checks localStorage for token
   ├─ If token exists → restore session
   └─ If no token → redirect to /(auth)/login

2. User Login (LoginScreen.js)
   ├─ Input: email, password, role (client/worker)
   ├─ Call: AuthContext.login()
   ├─ API: /auth/login endpoint
   └─ Response: { token, user }

3. Store Token
   ├─ AsyncStorage.setItem("token", jwt)
   ├─ Axios interceptor adds to header
   └─ Token valid for 7 days

4. Role-Based Routing
   ├─ role === "client" → /(client)/browse
   └─ role === "worker" → /(worker)/(tabs)/dashboard
```

### Current Login Methods (LoginScreen.js)

```javascript
// User can login as:
1. Client (Email + Password)
2. Worker (Email + Password)
3. Demo Mode (Pre-filled credentials)

// Demo Credentials
DEMO_CLIENT_EMAIL  = "demo@civicmitra.com"
DEMO_WORKER_EMAIL  = "worker@demo.com"
DEMO_PASSWORD      = "demo1234"
```

### Current AuthContext (src/context/AuthContext.js)

```javascript
{
  user,                    // Current user object
  loading,                 // Loading state
  isAuthenticated,         // Boolean
  isWorker,               // Boolean (role check)
  isClient,               // Boolean (role check)
  login(),                // Async login function
  logout()                // Async logout function
}
```

**Current Issues:**
- ⚠️ Google OAuth NOT implemented (backend supports, frontend doesn't)
- ⚠️ Token refresh NOT implemented (7-day expiry could cause sudden logout)
- ⚠️ User profile management NOT implemented
- ⚠️ Password reset NOT implemented
- ⚠️ Session recovery on token expiry NOT implemented

---

## 📊 State Management

### AuthContext Structure

```
AuthContext
├── user
│   ├── _id (ObjectId)
│   ├── name (String)
│   ├── email (String)
│   └── role ("client" | "worker")
├── loading (Boolean)
├── isAuthenticated (Boolean)
├── isWorker (Boolean)
├── isClient (Boolean)
├── login (Function)
└── logout (Function)
```

### State Persistence

```
AsyncStorage
├── token (JWT string - 7 days expiry)
└── [Optional: user data - could be added]
```

### No Redux/Zustand
- Using React Context API only
- Simple and lightweight for current needs
- May need Redux/Zustand as app scales

---

## 🔌 API Integration

### Axios Configuration (src/api/axios.js)

```javascript
Base Configuration:
├── Base URL: process.env.REACT_APP_API_URL || "http://localhost:5000"
├── Headers: Content-Type: application/json
├── Timeout: 10000ms
└── Interceptors:
    ├── Request: Add Authorization: Bearer {token}
    ├── Response: Handle errors
    └── Error: Global error handling
```

### API Wrappers

**auth.api.js - Authentication**
```javascript
export const login = async ({ email, name, role, password })
  // Endpoint: POST /auth/login
  // Returns: { token, user }

export const getMe = async ()
  // Endpoint: GET /auth/me
  // Returns: Current user data

export const logoutUser = async ()
  // Endpoint: POST /auth/logout
```

**complaint.api.js - Complaints**
```javascript
export const getAllComplaints = async ()
  // GET /complaints

export const getComplaintById = async (id)
  // GET /complaints/:id

export const createComplaint = async (data)
  // POST /complaints

export const getCitizenDashboard = async ()
  // GET /complaints/citizen/dashboard

export const toggleUpvote = async (complaintId)
  // POST /complaints/:id/upvote
```

**tasks.api.ts - Tasks**
```javascript
// Existing but minimal implementation
// Needs expansion based on backend
```

### API Error Handling

```javascript
Current:
├── Try-catch blocks in components
├── Alert popups for errors
└── Console logging

Missing:
├── Global error toasts/snackbars
├── Retry logic for failed requests
├── Rate limiting handling
└── Network offline handling
```

---

## 👥 Client Screens (Current Implementation)

### 1. Login Screen ✅ ACTIVE
**File:** `src/screens/common/LoginScreen.js`

**Features:**
- Email & password input
- Role selector (Client/Worker)
- Demo credentials auto-fill
- Loading state during login
- Error alerts
- Gradient UI with icons

**Issues:**
- ⚠️ No Google OAuth button
- ⚠️ No password reset/forgot password link
- ⚠️ No terms & conditions acceptance
- ⚠️ Limited input validation

---

### 2. Client Dashboard (Home) ✅ ACTIVE
**File:** `app/(client)/index.tsx`

**Features:**
- User greeting with name display
- Statistics: Active complaints, Resolved complaints, Total complaints
- Quick action buttons (Create, Browse, My Complaints)
- Recent activity feed placeholder
- Sign out button
- LinearGradient header

**Data Loaded:**
```javascript
{
  myComplaints: Number,
  activeComplaints: Number,
  resolvedComplaints: Number
}
```

**API Calls:**
- GET `/complaints/citizen/dashboard` → getCitizenDashboard()

**Issues:**
- ⚠️ Activity feed not populated (API not ready)
- ⚠️ No notification bell functionality
- ⚠️ No profile access from here
- ⚠️ Limited interactive elements

---

### 3. Browse Complaints ✅ ACTIVE
**File:** `app/(client)/browse.tsx`

**Features:**
- Search by text
- Filter by complaint type (hostel/campus)
- Filter by issue type (department)
- Sort options (popular/recent)
- Upvote functionality with loading state
- Complaint cards with thumbnail
- Infinite scroll/pagination

**State Management:**
```javascript
{
  complaints: [],
  filteredComplaints: [],
  searchText: "",
  typeFilter: "all",
  issueTypeFilter: "all",
  sortBy: "recent",
  loading: false,
  upvotingIds: []
}
```

**API Calls:**
- GET `/complaints` → getAllComplaints()
- POST `/complaints/:id/upvote` → toggleUpvote()

**Issues:**
- ⚠️ No pagination implementation
- ⚠️ Search performance not optimized
- ⚠️ Filter reset button missing
- ⚠️ No saved/bookmarked complaints

---

### 4. My Complaints ✅ ACTIVE
**File:** `app/(client)/my-complaints.tsx`

**Features:**
- List user's own complaints
- Filter by status (All/Pending/In Progress/Resolved)
- SLA badge (green = on-time, red = breached)
- Complaint cards with status indicator
- Tap to view details

**Data Structure:**
```javascript
Complaint {
  _id, type, status, description,
  departmentId, createdAt, updatedAt,
  images, supporters, assignedWorkerId
}
```

**Status Filters:**
- All
- Pending (status: "new")
- In Progress (status: "assigned", "in-progress")
- Resolved (status: "closed")

**API Calls:**
- GET `/complaints/my` → Get user's complaints
- SLA calculation from complaint createdAt

**Issues:**
- ⚠️ SLA threshold hardcoded (needs configuration)
- ⚠️ No bulk actions (mark all as read)
- ⚠️ No export/share functionality
- ⚠️ No sorting options

---

### 5. Create Complaint (Type Selector) 
**File:** `app/(client)/create-complaint.tsx`

**Features:**
- Two options: Hostel / Campus
- Navigation to appropriate form

**Status:** In Development

---

### 6. Create Hostel Complaint
**File:** `app/(client)/create-complaint-hostel.tsx`

**Features:**
- Hostel name input
- Floor selection
- Visibility toggle (Public/Private)
- Room number (conditional - if private)
- Landmark field (conditional - if public)
- Image picker (multiple)
- Department selector (dropdown)
- Description input (min 20 chars)

**Form State:**
```javascript
{
  hostelName: "",
  floor: "",
  visibility: "public",
  roomNumber: "",
  landmark: "",
  description: "",
  departmentId: "",
  images: []
}
```

**Validation:**
- ✅ Min 20 chars description
- ⚠️ No date picker for incident date
- ⚠️ No location picker

**Status:** In Development

---

### 7. Create Campus Complaint
**File:** `app/(client)/create-complaint-campus.tsx`

**Features:**
- Area input
- Location address input
- Description input (min 20 chars)
- Department selector
- Location picker (map)
- Image picker (multiple)
- Auto-public visibility

**Validation:**
- ✅ Min 20 chars description
- ⚠️ No location map integration confirmed

**Status:** In Development

---

### 8. Complaint Detail ✅ ACTIVE
**File:** `app/(client)/complaint-detail/[id].tsx`

**Features:**
- Full complaint information
- Image gallery with multiple images
- Location display
- Department badge
- Status badge
- Priority indicator
- Upvote button with counter
- Supporter list (clickable)
- Comments section (UI ready, backend not ready)
- Timeline view

**Data Loaded:**
```javascript
Complaint {
  _id, type, description, status,
  priority, department, location,
  images[], supporters[], comments[],
  createdAt, assignedWorker
}
```

**API Calls:**
- GET `/complaints/:id` → getComplaintById()
- POST `/complaints/:id/upvote` → toggleUpvote()

**Issues:**
- ⚠️ Comments section UI ready but no POST endpoint
- ⚠️ Supporter list not clickable (no profile view)
- ⚠️ No edit/delete for own complaints
- ⚠️ No share functionality
- ⚠️ Timeline view not fully implemented

---

### 9. Complaint Map ✅ ACTIVE
**File:** `app/(client)/complaint-map.tsx`

**Features:**
- Interactive map view
- Complaint markers with status color
- Tap marker to see complaint preview
- Radius filter for nearby complaints
- Map centering options

**Status:** Basic implementation - needs refinement

---

### 10. Sign Out ✅ ACTIVE
**File:** `app/(client)/signout.tsx`

**Features:**
- Calls logout from AuthContext
- Clears AsyncStorage token
- Redirects to login
- Shows confirmation

---

## 🎨 Components & UI

### Reusable Components

**ComplaintCard.tsx**
- Used in: Browse, My Complaints
- Shows: Title, status, department, upvote count
- Features: Tap to view detail

**StatusBadge.tsx**
- Shows complaint status with color coding
- Statuses: new, assigned, in-progress, closed

**SLABadge.tsx**
- Shows SLA status (on-time/breached)
- Color: Green (✅) / Red (❌)

**ImagePreview.tsx**
- Display complaint images
- Gallery view support

**TaskCard.tsx**
- Used in worker screens
- Shows task information

**ErrorBoundary.tsx**
- Global error handling
- Fallback UI on crash

### Theme & Styling

**constants/theme.ts**
```javascript
Colors:
├── Primary: #2563eb (blue)
├── Secondary: #1e40af (dark blue)
├── Success: #22c55e (green)
├── Error: #ef4444 (red)
├── Warning: #f59e0b (orange)
└── Background: #f8fafc (light)

Spacing: 8px base unit
Typography: Roboto, SF Pro Display
```

---

## 📲 Data Models Used

### Complaint (Frontend Model)
```javascript
{
  _id: String,
  userId: String,
  type: "hostel" | "campus",
  hostelName?: String,
  floor?: String,
  visibility?: "public" | "private",
  roomNumber?: String,
  landmark?: String,
  area?: String,
  locationAddress?: String,
  description: String,
  departmentId: String,
  priority: "low" | "medium" | "high",
  status: "new" | "assigned" | "in-progress" | "closed",
  location: { lat, lng },
  images: String[],
  supporters: String[],
  comments: Array,
  assignedWorkerId?: String,
  createdAt: Date,
  updatedAt: Date
}
```

### User (Frontend Model)
```javascript
{
  _id: String,
  name: String,
  email: String,
  role: "client" | "worker",
  // Additional fields not yet used:
  // - phone, hostel, rollNumber, deviceToken
}
```

### Department
```javascript
Enum: ["wifi", "plumber", "civil", "electrician", "carpenter"]
```

---

## ⚠️ Known Limitations & Issues

### Authentication Issues
- ❌ Google OAuth not implemented
- ❌ Token refresh not implemented (7-day expiry risk)
- ❌ Session recovery on app restart incomplete
- ❌ Password reset/forgot password not available
- ❌ No two-factor authentication
- ❌ No logout confirmation

### User Management Issues
- ❌ User profile management missing
- ❌ No profile edit screen
- ❌ No personal information update
- ❌ No device notifications setup
- ❌ No preferences/settings screen

### Complaint Features Missing
- ❌ No real-time updates on complaint status
- ❌ Comment system UI ready but backend not ready
- ❌ No file attachments (images only)
- ❌ No email notifications
- ❌ No push notifications
- ❌ No complaint editing capability
- ❌ No complaint deletion

### Map & Location
- ⚠️ Map implementation basic
- ⚠️ No real-time location tracking
- ⚠️ No location validation
- ⚠️ No radius search optimization

### Performance Issues
- ⚠️ No pagination (all complaints loaded)
- ⚠️ Images not optimized/cached
- ⚠️ No lazy loading for lists
- ⚠️ No offline mode support
- ⚠️ No sync when online

### Error Handling
- ⚠️ No global error handling
- ⚠️ No retry logic for failed requests
- ⚠️ No network status detection
- ⚠️ Limited user feedback on errors

### Testing
- ❌ No unit tests
- ❌ No integration tests
- ❌ No E2E tests
- ❌ Demo mode only for manual testing

---

## ✅ Current Features Status

| Feature | Status | File | Notes |
|---------|--------|------|-------|
| Login Screen | ✅ Active | LoginScreen.js | Email/password only |
| Dashboard | ✅ Active | index.tsx | Stats loading works |
| Browse Complaints | ✅ Active | browse.tsx | Full filtering |
| My Complaints | ✅ Active | my-complaints.tsx | With SLA |
| Complaint Detail | ✅ Active | complaint-detail/[id] | No editing |
| Complaint Map | ✅ Active | complaint-map.tsx | Basic |
| Create Hostel | ⚠️ In Dev | create-complaint-hostel.tsx | Form ready |
| Create Campus | ⚠️ In Dev | create-complaint-campus.tsx | Form ready |
| Sign Out | ✅ Active | signout.tsx | Working |
| Google OAuth | ❌ Not Started | LoginScreen.js | Backend ready |
| Token Refresh | ❌ Not Started | AuthContext.js | Critical! |
| User Profile | ❌ Not Started | N/A | Needed |
| Comments | ⚠️ Partial | complaint-detail | UI done, API missing |
| Notifications | ❌ Not Started | N/A | Not implemented |
| Real-time Updates | ❌ Not Started | N/A | No WebSocket |

---

## 🔄 API Endpoints Currently Used

```
Authentication:
├── POST /auth/login                      [✅ Working]
├── GET /auth/me                          [✅ Working]
└── POST /auth/logout                     [⚠️ Optional]

Complaints:
├── GET /complaints                       [✅ Working]
├── GET /complaints/:id                   [✅ Working]
├── POST /complaints                      [⚠️ Not fully tested]
├── GET /complaints/my                    [✅ Working]
├── GET /complaints/citizen/dashboard     [✅ Working]
└── POST /complaints/:id/upvote           [✅ Working]

Missing:
├── PUT /complaints/:id                   [❌ Edit]
├── DELETE /complaints/:id                [❌ Delete]
├── GET /comments                         [❌ Backend not ready]
├── POST /comments                        [❌ Backend not ready]
└── GET /notifications                    [❌ Not implemented]
```

---

## 📝 Summary

### What's Working ✅
- Basic authentication (email/password)
- Login/logout flow
- Dashboard with statistics
- Browse complaints with filtering
- View complaint details
- Upvote functionality
- SLA status tracking
- Role-based navigation

### What's In Progress ⚠️
- Create complaint forms (hostel/campus)
- Form validation
- Image picker integration
- Map location selector

### What's Missing ❌
- Google OAuth
- Token refresh mechanism
- User profile management
- Comment system (backend)
- Notifications
- Real-time updates
- Offline mode
- Edit/delete complaints
- Advanced search
- Saved complaints

### Critical Items
🔴 **URGENT:** Token refresh (7-day expiry)  
🔴 **URGENT:** Google OAuth (backend ready)  
🟡 **HIGH:** Comments system  
🟡 **HIGH:** User profile  
🟡 **HIGH:** Notifications

---

**Created:** April 22, 2026  
**Last Updated:** April 22, 2026  
**Version:** 1.0
