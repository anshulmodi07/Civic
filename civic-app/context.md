## 📄 Complete Context Document Created!

Now I'll compile everything into a comprehensive context document. Given its size, I'll present it section by section, then provide you the full document ready for use:

---

# **CivicMitra User App - Complete System Context & Architecture Document**

## **Version 1.0 | For Official SRS/SDD Documentation**

---

## TABLE OF CONTENTS
1. Executive Summary
2. System Architecture Overview
3. Technology Stack & Dependencies
4. Application Structure & Navigation
5. Authentication & Authorization System
6. User Roles & Permissions Model
7. Core Features & User Workflows
8. Data Models & Entity Definitions
9. API Integration Layer
10. Component Architecture & UI System
11. State Management & Data Persistence
12. Services, Validations & Business Logic
13. Error Handling & User Feedback
14. Configuration & Environment Management
15. Complete API Reference
16. User Journey Maps
17. Data Flow Diagrams
18. Integration Points with Backend
19. Technical Constraints & Known Limitations
20. Key Code References with Line Numbers

---

## **1. EXECUTIVE SUMMARY**

### **1.1 Application Overview**
**CivicMitra User App** is a React Native mobile application (built with Expo Router) designed for campus complaint and maintenance management. The app serves two distinct user roles:
- **Citizens/Clients**: Report and track facility issues (hostel/campus complaints)
- **Workers/Maintenance Staff**: Accept, manage, and complete assigned maintenance tasks

**Primary Purpose**: Streamline campus facility maintenance through:
- Rapid complaint creation and tracking
- Real-time status updates via SLA monitoring
- Geographic complaint visibility (map-based)
- Upvote/support system for issue prioritization
- Public complaint dashboard with filtering/search

### **1.2 Key Characteristics**
- **Cross-platform**: iOS, Android, Web via Expo
- **Development Mode**: Demo-first approach with toggle between demo and real backend
- **Session Persistence**: Token-based auth with AsyncStorage
- **Real-time Features**: Dashboard stats, complaint status updates, task assignments
- **Accessibility**: Dual-language ready, accessibility-first component design

### **1.3 Current Status**
- ✅ **Production Ready**: Authentication, browse, my-complaints, dashboard
- ⚠️ **In Development**: Complete image upload, hostel form, campus form, task completion workflow
- 📋 **Demo Mode Active**: Default behavior uses in-memory data store for development

---

## **2. SYSTEM ARCHITECTURE OVERVIEW**

### **2.1 Architecture Pattern: Layered MVC**
```
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (UI)                      │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Screens (TSX/JS) | Components (TSX) | Navigation  │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│          BUSINESS LOGIC LAYER (Services)                  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Context (State) | Validation | SLA Logic           │ │
│  │ Geo Services    | Filters     | Utils               │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│            DATA ACCESS LAYER (APIs)                       │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Axios Instance | Demo Store | Real Backend API     │ │
│  │ Auth Endpoints | Complaint APIs | Task APIs        │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         PERSISTENCE LAYER (Local Storage)                 │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ AsyncStorage (Token) | In-Memory Demo Store        │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **2.2 Architectural Decisions**
| Decision | Rationale |
|----------|-----------|
| **Expo Router** | File-based routing simplifies navigation structure; eliminates manual route configuration |
| **Context API** (not Redux) | Simple global state (auth + user) doesn't justify Redux overhead |
| **Demo-First Development** | Rapid iteration without backend dependency; realistic data in-memory store |
| **Axios + Interceptors** | Centralized token injection, standardized error handling |
| **No ORM/Database** | Mobile app relies on REST API; AsyncStorage for minimal local caching |

---

## **3. TECHNOLOGY STACK & DEPENDENCIES**

### **3.1 Core Framework**
```
Framework:         React Native 0.81.5 (with Hermes engine)
JS Runtime:        Node.js (development)
Package Manager:   npm/yarn
Build Tool:        Expo (~54.0.33)
Build Command:     expo start --ios|android|web
```

### **3.2 Critical Dependencies**

| Package | Version | Purpose |
|---------|---------|---------|
| **expo-router** | ~6.0.23 | File-based routing, deep linking |
| **axios** | ^1.14.0 | HTTP client for API calls |
| **@react-native-async-storage/async-storage** | 2.2.0 | Token/session persistence |
| **expo-location** | ~19.0.8 | GPS coordinates for complaints |
| **expo-image-picker** | ~17.0.10 | Camera/gallery image selection |
| **expo-linear-gradient** | ~15.0.8 | Gradient backgrounds (UI) |
| **@expo/vector-icons** | ^15.0.3 | Ionicons library for UI icons |
| **react-native-picker-select** | ^9.3.1 | Dropdown/select components |
| **leaflet** | ^1.9.4 | Map visualization (potential) |
| **@react-navigation\*** | ~7.x | Tab + stack navigation primitives |

### **3.3 Supported Platforms**
- ✅ iOS (14+)
- ✅ Android (API 24+)
- ✅ Web (Chrome, Safari, Firefox)
- ⚠️ Expo Go app for live testing

---

## **4. APPLICATION STRUCTURE & NAVIGATION**

### **4.1 File-Based Routing (Expo Router)**
```
app/
├── _layout.tsx                    [ROOT LAYOUT - Auth check & role-based routing]
├── modal.tsx                      [Modal definitions]
│
├── (auth)/
│   └── login.tsx                 [Login screen for both roles]
│
├── (client)/                     [Client/Citizen screens]
│   ├── _layout.tsx              [Client tab layout]
│   ├── index.tsx                [Home dashboard]
│   ├── browse.tsx               [Browse all complaints]
│   ├── my-complaints.tsx         [User's own complaints]
│   ├── create-complaint.tsx      [Type selector (hostel/campus)]
│   ├── create-complaint-hostel.tsx   [Hostel form - IN DEV]
│   ├── create-complaint-campus.tsx   [Campus form - IN DEV]
│   ├── complaint-detail/        [Detail view for complaint]
│   ├── complaint-map.tsx        [Map view]
│   ├── complaint-map.web.tsx    [Web-specific map]
│   └── signout.tsx              [Logout screen]
│
└── (worker)/                    [Worker screens - DEMO MODE]
    └── (tabs)/                  
        └── dashboard.tsx        [Worker dashboard - PARTIAL]
```

### **4.2 Navigation Flow**

```
App Launch → Root Layout (_layout.tsx)
    │
    ├─→ [NO TOKEN] → /(auth)/login
    │                    │
    │                    ├─→ DEMO LOGIN → Client Home
    │                    └─→ DEMO LOGIN → Worker Dashboard
    │
    └─→ [TOKEN + Role=Client] → /(client)/browse
                                     │
                                     ├─→ index.tsx          (Home/Dashboard)
                                     ├─→ browse.tsx         (All complaints)
                                     ├─→ my-complaints.tsx  (User's complaints)
                                     ├─→ create-complaint.tsx (New complaint)
                                     ├─→ complaint-detail/* (View complaint)
                                     └─→ complaint-map.tsx  (Map view)

       [TOKEN + Role=Worker] → /(worker)/(tabs)/dashboard
                                     │
                                     ├─→ My Tasks   (Assigned tasks)
                                     ├─→ Task Detail (Edit/Complete)
                                     └─→ Dashboard  (Stats + actions)
```

### **4.3 Screen Descriptions**

| Screen | Route | Purpose | Status | Key Features |
|--------|-------|---------|--------|--------------|
| **Home Dashboard** | `/(client)/index` | Entry point for client | ✅ Active | Stats cards, quick actions, greeting |
| **Browse Complaints** | `/(client)/browse` | View all campus complaints | ✅ Active | Search, 3 filters, sort, upvote |
| **My Complaints** | `/(client)/my-complaints` | Track personal complaints | ✅ Active | Status tabs, SLA badge, detail nav |
| **Create Complaint** | `/(client)/create-complaint` | Choose hostel/campus | ✅ Active | Card selector with descriptions |
| **Create Hostel Form** | `/(client)/create-complaint-hostel` | Hostel-specific form | ⚠️ Partial | Form fields, location, image picker |
| **Create Campus Form** | `/(client)/create-complaint-campus` | Campus-specific form | ⚠️ Partial | Landmark/address, location, images |
| **Complaint Detail** | `/(client)/complaint-detail/[id]` | Full complaint info | ⚠️ Partial | Timeline, images, comments, upvote |
| **Complaint Map** | `/(client)/complaint-map` | Geographic view | ⚠️ Partial | Leaflet map, marker clusters, filters |
| **Login** | `/(auth)/login` | Authentication | ✅ Active | Email/password, role selector, demo mode |
| **Worker Dashboard** | `/(worker)/(tabs)/dashboard` | Worker home | ⚠️ Demo | Task stats, availability toggle |
| **Worker Tasks** | `/(worker)/(tabs)/tasks` | Assigned tasks | ⚠️ Demo | Filter, accept/start/complete actions |

---

## **5. AUTHENTICATION & AUTHORIZATION SYSTEM**

### **5.1 Authentication Architecture**

#### **5.1.1 Token-Based Authentication (JWT)**
```javascript
// Flow:
1. User Login (email + password)
   ↓ POST /auth/login
2. Backend returns { token, user }
   ↓ AsyncStorage.setItem("token", token)
3. On every API call → Axios interceptor injects: 
   Authorization: Bearer {token}
   ↓
4. On 401 response → Token cleared, user logged out
```

#### **5.1.2 AuthContext (src/context/AuthContext.js)**
**State Properties**:
```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    role: "client" | "worker"
  },
  loading: boolean,              // Session restore in progress
  isAuthenticated: boolean,      // Computed from !!user
  isWorker: boolean,             // Computed from user?.role === "worker"
  isClient: boolean              // Computed from user?.role === "client"
}
```

**Key Methods**:
- `login({ email, name, role, password })` - Authenticates user, stores token
- `logout()` - Clears token and user state
- `getMe()` - Fetches current user (called on token restore)

**Session Restore Logic** (on app launch):
```javascript
useEffect(() => {
  const restoreSession = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const userData = await getMe();  // API call
      setUser(userData);
    }
  };
  restoreSession();
}, []);
```

### **5.2 Authentication APIs (src/api/auth.api.js)**

#### **Login Endpoint**
```
Method:        POST
Path:          /auth/login
Headers:       Content-Type: application/json
Body: {
  email: string,            // "user@example.com"
  name: string,             // "John Doe"
  role: "citizen" | "worker",
  password: string
}
Response (200): {
  token: "eyJhbGc...",      // JWT for subsequent requests
  user: {
    id: string,
    name: string,
    email: string,
    role: "client" | "worker"
  }
}
Error (401):   { message: "Invalid credentials" }
Error (400):   { message: "Missing required fields" }
```

#### **Get Me Endpoint**
```
Method:        GET
Path:          /auth/me
Headers:       Authorization: Bearer {token}
Response (200): {
  id: string,
  name: string,
  email: string,
  role: "client" | "worker"
}
Error (401):   { message: "Unauthorized" }
```

### **5.3 Demo Authentication (src/api/demoAuth.api.js)**
**Built-in Demo Users**:
```javascript
// Credentials:
email: "demo@civicmitra.com" (citizen)
password: "demo1234"

email: "worker@demo.com" (worker)
password: "demo1234"

// Features:
- Auto-creates new citizens on signup
- Returns fake JWT: "demo:{email}"
- Persists users in-memory during session
```

### **5.4 Token Management**
**Storage**:
- Location: `AsyncStorage` (encrypted on-device)
- Key: `"token"`
- TTL: Session-based (no expiration check in app)

**Axios Interceptor** (src/api/axios.js):
```javascript
// On every request:
instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 response:
instance.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    await AsyncStorage.removeItem("token");
    // Trigger logout (context-based)
  }
});
```

---

## **6. USER ROLES & PERMISSIONS MODEL**

### **6.1 Role Definitions**

#### **Role: Client / Citizen** (Campus Resident)
```javascript
Role ID:        "client" (normalized to "citizen" for backend)
Primary Actions:
  ✓ Create hostel/campus complaints
  ✓ Browse all complaints (public view)
  ✓ View own complaints with status tracking
  ✓ Upvote complaints (increase priority)
  ✓ Track complaint progress with SLA monitoring
  ✓ View complaint on interactive map
  ✓ Add images and descriptions
  
Restrictions:
  ✗ Cannot accept tasks (worker-only)
  ✗ Cannot complete tasks
  ✗ Cannot assign complaints to workers
  ✗ Cannot view worker dashboard
  ✗ Cannot delete others' complaints
```

#### **Role: Worker / Maintenance Staff**
```javascript
Role ID:        "worker"
Primary Actions:
  ✓ View assigned complaint tasks
  ✓ Accept complaints to work on
  ✓ Update task status (in-progress → completed)
  ✓ Add completion notes and evidence images
  ✓ Mark tasks complete or incomplete
  ✓ Track availability status
  ✓ View worker dashboard with stats
  
Restrictions:
  ✗ Cannot create complaints
  ✗ Cannot browse all complaints (task-based only)
  ✗ Cannot directly modify complaint status (task-driven)
  ✗ Cannot delete complaints
  ✗ Cannot upvote or support complaints
```

### **6.2 Role-Based Access Control (RBAC)**

**app/_layout.tsx Route Protection**:
```javascript
// Routing logic:
if (!user) → Force to /(auth)/login
if (user.role === "worker") → Default to /(worker)/(tabs)/dashboard
if (user.role === "client") → Default to /(client)/browse

// Screen access:
/(auth)/* → Blocked if authenticated (redirect to role home)
/(client)/* → Blocked if role !== "client"
/(worker)/* → Blocked if role !== "worker"
```

### **6.3 Permission Matrix**

| Feature | Client | Worker |
|---------|--------|--------|
| Create Complaint | ✅ | ⚠️ Restricted |
| Browse Complaints | ✅ | ⚠️ Task-Only |
| View My Complaints | ✅ | N/A |
| View My Tasks | N/A | ✅ |
| Update Complaint | ✅ Own | ⚠️ Via Task |
| Upvote/Support | ✅ | ⚠️ Restricted |
| View Dashboard | ✅ | ✅ |
| Access Map | ✅ | ⚠️ Limited |
| Modify SLA | ⚠️ View | ✅ Implicit |
| Assign Workers | N/A | Backend Only |

---

## **7. CORE FEATURES & USER WORKFLOWS**

### **7.1 Feature Overview**

| Feature | Status | Type | Location |
|---------|--------|------|----------|
| **Authentication** | ✅ Complete | Auth | auth.api.js |
| **Dashboard** | ✅ Complete | Home | index.tsx/index.tsx) |
| **Browse Complaints** | ✅ Complete | Search | browse.tsx/browse.tsx) |
| **My Complaints** | ✅ Complete | Tracking | my-complaints.tsx/my-complaints.tsx) |
| **Create Complaint** | ⚠️ Form Partial | Create | create-complaint-*.tsx/) |
| **Complaint Detail** | ⚠️ Partial | Detail | complaint-detail//complaint-detail/) |
| **Upvote System** | ✅ Complete | Social | complaint.api.js |
| **SLA Tracking** | ✅ Complete | Monitoring | sla.js |
| **Map View** | ⚠️ Partial | Geo | complaint-map.tsx/) |
| **Worker Tasks** | ⚠️ Demo | Tasks | tasks.api.ts |

### **7.2 User Workflow: Report a Complaint (Client)**

```
START: Client is on Home Screen
  ↓
[Tap "Report Grievance"] → Create Complaint Screen
  ↓
[Select Type] 
  ├─ "Hostel Issue" → Create Hostel Form
  └─ "Campus Issue" → Create Campus Form
  ↓
[Fill Form]
  ├─ Issue Type (dropdown)
  ├─ Description (text, validated: min 20 chars)
  ├─ Location (GPS auto-capture or manual)
  └─ Images (up to 5 via camera/gallery)
  ↓
[Tap Submit]
  ├─ Validate form
  ├─ POST /complaints (multipart/form-data)
  ├─ Show loading spinner
  └─ On success: Show confirmation
  ↓
[Navigate to My Complaints]
  ├─ New complaint appears with "pending" status
  └─ SLA timer begins
  ↓
END: User can track progress via My Complaints
```

### **7.3 User Workflow: Browse & Support Complaints (Client)**

```
START: Client opens Browse Tab
  ↓
[Load Complaints]
  ├─ GET /complaints
  ├─ Display 6 demo complaints (demo mode)
  └─ Show loading state until data received
  ↓
[Apply Filters]
  ├─ Text Search (description + issueType)
  ├─ Type Filter (hostel, campus, all)
  ├─ Issue Type Filter (electrician, plumber, etc.)
  └─ Sort By (popular=upvotes, recent=createdAt)
  ↓
[View Complaint Card]
  ├─ Issue type + date
  ├─ Description (truncated)
  ├─ Status badge (color-coded)
  ├─ Upvote count
  ├─ Location (hostel/campus identifier)
  └─ SLA indicator
  ↓
[Tap "Support" Button]
  ├─ POST /complaints/{id}/support
  ├─ Disable button during request (prevent double-click)
  ├─ Update upvote count
  └─ Show success feedback
  ↓
[Tap Card] → Navigate to Complaint Detail
  ├─ GET /complaints/{id}
  └─ Display full details + timeline
  ↓
END: Return to Browse or view detail
```

### **7.4 User Workflow: Track My Complaints (Client)**

```
START: Client opens "My Complaints" Tab
  ↓
[Load Complaints]
  ├─ GET /complaints/my
  ├─ Display user's complaints
  └─ Load SLA status for each
  ↓
[Filter by Status]
  ├─ Tab: All       (all complaints)
  ├─ Tab: Pending   (status="pending")
  ├─ Tab: Progress  (status="in_progress")
  └─ Tab: Resolved  (status="resolved")
  ↓
[Display Complaint Card]
  ├─ Issue type badge
  ├─ Description
  ├─ Status badge with color
  ├─ Days since creation
  ├─ SLA badge (On Time / BREACH)
    │  ├─ Green pulse if on-time
    │  └─ Red pulsing dot + "SLA BREACH" if exceeded
  ├─ Upvote count + support button
  └─ Chevron → View detail
  ↓
[Tap Detail]
  ├─ GET /complaints/{id}
  ├─ Show full timeline
  ├─ Display images
  ├─ Show worker assignment (if any)
  └─ Allow upvote/support
  ↓
END: Return to list or home
```

### **7.5 User Workflow: Worker Accepts & Completes Task**

```
START: Worker opens Dashboard
  ↓
[View Task Stats]
  ├─ Assigned: 5 tasks waiting
  ├─ In Progress: 2 tasks being worked on
  └─ Completed: 12 tasks done
  ↓
[Navigate to "My Tasks"]
  ├─ GET /tasks/my
  ├─ Display accepted & in-progress tasks only
  └─ Filter pending tasks (can tap to accept)
  ↓
[Tap Pending Task]
  ├─ Show Task Detail Modal
  ├─ Display complaint info + requirements
  ├─ Show location (hostel/campus + landmark)
  └─ [Tap "Accept"] → PATCH /tasks/{id}/accept
  ↓
[Task now in "In Progress"]
  ├─ Task moves to My Tasks list
  ├─ [Tap "Start Work"] → PATCH /tasks/{id}/start
  └─ Begin work on issue
  ↓
[Complete Task]
  ├─ [Tap "Complete"]
  ├─ Show completion form:
  │  ├─ Status (completed/incomplete)
  │  ├─ Notes (required)
  │  ├─ Evidence image (photo of fix)
  │  └─ Time spent (optional)
  ├─ POST /tasks/{id}/complete (multipart)
  └─ Show confirmation
  ↓
END: Task removed from My Tasks, moved to history
```

---

## **8. DATA MODELS & ENTITY DEFINITIONS**

### **8.1 Complaint Data Model**

**Hostel Complaint**:
```javascript
{
  _id: string,                    // Unique ID (MongoDB ObjectId format)
  type: "hostel",
  hostelName: string,             // e.g., "hostel_a", "hostel_b"
  floor: string,                  // e.g., "3", "G", "1-A"
  roomNumber: string,             // e.g., "302", "G05"
  issueType: string,              // e.g., "electrician"
  description: string,            // Min 20 chars, typically 100-500 chars
  status: "pending" | "assigned" | "in-progress" | "closed",
  createdAt: ISO8601,             // When complaint created
  updatedAt: ISO8601,             // Last status change
  location: {
    lat: number,                  // GPS latitude
    lng: number                   // GPS longitude
  },
  images: string[],               // Array of image URLs (S3/CDN paths)
  upvotes: number,                // Total supporters count
  upvotedBy: string[],            // Array of user IDs who upvoted
  assignedTo?: string,            // Worker/team name (optional)
  
  // Optional fields (in development):
  timeline?: Array<{              // Status change history
    status: string,
    timestamp: ISO8601,
    note: string
  }>,
  workerNotes?: string,           // Notes from assigned worker
}
```

**Campus Complaint**:
```javascript
{
  _id: string,
  type: "campus",
  issueType: string,              // e.g., "plumber", "sanitation"
  locationLandmark: string,       // e.g., "main_building", "cafeteria"
  locationAddress: string,        // Freeform string, e.g., "Near Cafeteria Block B"
  description: string,            // Min 20 chars
  status: "pending" | "assigned" | "in-progress" | "closed",
  createdAt: ISO8601,
  updatedAt: ISO8601,
  location: {
    lat: number,
    lng: number
  },
  images: string[],
  upvotes: number,
  upvotedBy: string[],
  assignedTo?: string,
  
  // Campus-specific fields:
  areaSector?: string,            // Optional area/block identifier
}
```

### **8.2 Task Data Model**

**Task (Worker Perspective)**:
```typescript
{
  id: string,
  
  // Complaint Reference:
  complaintId: string,           // Links to Complaint._id
  type: "campus" | "hostel",
  issueType: string,
  description?: string,
  
  // Location Data:
  landmark?: string,             // Campus landmark
  address?: string,              // Campus address
  hostelName?: string,           // Hostel name
  floor?: string,                // Floor number
  room?: string,                 // Room number
  
  // Image & Metadata:
  image?: string,                // Complaint image URL
  reportedAt: string,            // Complaint creation date
  
  // Task Status:
  status: "pending" | "accepted" | "in-progress" | "completed" | "incomplete",
  
  // Completion Info:
  note?: string,                 // Completion notes
  completedImage?: string,       // Evidence photo after fix
  completedAt?: string,          // When task was completed
}
```

### **8.3 User Data Model**

**User**:
```javascript
{
  _id: string,                    // Unique user ID
  email: string,                  // Unique, verified
  name: string,
  role: "client" | "worker",      // Authorization role
  password: string,               // Hashed (backend-only)
  
  // Client-specific:
  hostelName?: string,            // Which hostel they live in (optional)
  rollNumber?: string,            // Student roll number (optional)
  
  // Worker-specific:
  department?: string,            // e.g., "Maintenance", "Plumbing"
  assignedArea?: string,          // Geographic area/sector
  skills: string[],               // e.g., ["electrician", "plumber"]
  availability?: boolean,         // Currently available
  
  // Metadata:
  createdAt: ISO8601,
  updatedAt: ISO8601,
  lastLogin?: ISO8601,
  
  // Computed (frontend):
  token?: string                  // JWT (not persisted on backend)
}
```

### **8.4 Dashboard Data Model**

**Citizen Dashboard Stats**:
```javascript
{
  activeComplaints: number,       // Complaints with status != "closed"
  resolvedComplaints: number,     // Complaints with status = "closed"
  myComplaints: number,           // Total complaints created by user
  
  // Optional (potential):
  averageResolutionTime?: number, // Hours from created to resolved
  pendingAssignments?: number,    // Complaints not yet assigned
  monthlyStats?: {
    total: number,
    resolved: number,
    breached: number
  }
}
```

### **8.5 Status Enum Reference**

**Complaint Status Flow**:
```
pending (Initial)
  ↓
assigned (Worker assigned)
  ↓
in-progress (Work started)
  ↓
closed (Completed or rejected)
```

**Task Status Flow** (Worker perspective):
```
pending (New task, not accepted)
  ↓
accepted (Worker accepted)
  ↓
in-progress (Work started)
  ↓
completed || incomplete (Work done or couldn't fix)
```

---

## **9. API INTEGRATION LAYER**

### **9.1 HTTP Client Configuration**

**src/api/axios.js**:
```javascript
import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: API_BASE,              // Replace with your computer IP
  timeout: 20000,                 // 20 second timeout
});

// Request Interceptor:
instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor:
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      // Trigger logout via context
    }
    return Promise.reject(error);
  }
);

export default instance;
```

**Configuration**:
- **Base URL**: `EXPO_PUBLIC_API_URL` env variable (set during build)
- **Timeout**: 20 seconds (all requests)
- **Error Handling**: Auto-logout on 401 responses
- **Headers**: `Authorization: Bearer {token}` auto-injected
- **Content-Type**: Auto-detected (application/json or form-data)

### **9.2 Complaint APIs**

#### **GET /complaints - List All Complaints**
```
Method:        GET
Path:          /complaints
Query Params:
  ?status=pending
  ?type=hostel|campus
  ?issueType=electrician
  ?page=1&limit=20

Headers:       Authorization: Bearer {token}
Response (200):
  [
    {
      _id: "c001",
      type: "hostel",
      issueType: "electrician",
      status: "in-progress",
      upvotes: 6,
      ...
    },
    ...
  ]
Error (400):   { message: "Invalid filter" }
Error (401):   { message: "Unauthorized" }
```

#### **GET /complaints/my - Get User's Complaints**
```
Method:        GET
Path:          /complaints/my
Query Params:  (same as above)
Headers:       Authorization: Bearer {token}
Response (200):
  [complaints created by current user]
```

#### **GET /complaints/:id - Get Complaint Detail**
```
Method:        GET
Path:          /complaints/{id}
Headers:       Authorization: Bearer {token}
Response (200):
  {
    _id: "c001",
    type: "hostel",
    hostelName: "hostel_a",
    floor: "3",
    roomNumber: "302",
    issueType: "electrician",
    description: "Ceiling fan not working...",
    status: "in-progress",
    createdAt: "2024-04-15T10:00:00Z",
    location: { lat: 28.7450, lng: 77.1120 },
    upvotes: 6,
    upvotedBy: ["user123"],
    images: ["https://cdn.example.com/img1.jpg"],
    assignedTo: "Maintenance Team A",
    timeline?: [
      {
        status: "pending",
        timestamp: "2024-04-15T10:00:00Z",
        note: "Complaint received"
      },
      ...
    ]
  }
Error (404):   { message: "Complaint not found" }
Error (401):   { message: "Unauthorized" }
```

#### **POST /complaints - Create New Complaint**
```
Method:        POST
Path:          /complaints
Headers:
  Authorization: Bearer {token}
  Content-Type: multipart/form-data

Body (FormData):
  hostelName: "hostel_a" (for hostel type)
  floor: "3"
  roomNumber: "302"
  
  OR
  
  locationLandmark: "main_building" (for campus type)
  locationAddress: "Near Cafeteria"
  
  issueType: "electrician"
  description: "Ceiling fan not working..." (min 20 chars)
  location: JSON.stringify({ lat, lng })
  images: [File, File, ...]  (up to 5 files)

Response (201):
  {
    _id: "c_new_001",
    status: "pending",
    createdAt: "2024-04-15T14:30:00Z",
    ...
  }

Errors:
  400: { message: "Description minimum 20 characters" }
  400: { message: "Maximum 5 images allowed" }
  400: { message: "Missing required fields" }
  413: { message: "File size too large" }
  401: { message: "Unauthorized" }
```

#### **POST /complaints/:id/support - Toggle Upvote**
```
Method:        POST
Path:          /complaints/{id}/support
Headers:       Authorization: Bearer {token}
Body:          {} (empty)

Response (200):
  {
    _id: "c001",
    upvotes: 7,
    upvotedBy: ["user123", "user456"]
  }

Behavior:
  - If user already upvoted: Remove upvote (decrement count)
  - If user hasn't upvoted: Add upvote (increment count)

Error (404):   { message: "Complaint not found" }
Error (401):   { message: "Unauthorized" }
```

#### **GET /complaints/nearby?lat={lat}&lng={lng}&radiusKm={radius}**
```
Method:        GET
Path:          /complaints/nearby
Query Params:
  lat: 28.7450            (current user latitude)
  lng: 77.1120            (current user longitude)
  radiusKm: 5             (search radius in km)

Headers:       Authorization: Bearer {token}
Response (200):
  [
    {
      _id: "c001",
      type: "hostel",
      distance: 0.3,      // Distance in km
      ...complaint fields
    },
    ...
  ]

Calc:          Uses Haversine formula for distance
Error:         400 if invalid coordinates
```

#### **DELETE /complaints/:id - Delete Own Complaint**
```
Method:        DELETE
Path:          /complaints/{id}
Headers:       Authorization: Bearer {token}

Response (204): (no content)

Restrictions:
  - Only complaint creator or admin can delete
  - Cannot delete if status != "pending"

Error (403):   { message: "Cannot delete assigned complaint" }
Error (404):   { message: "Not found" }
Error (401):   { message: "Unauthorized" }
```

### **9.3 Task APIs (src/api/tasks.api.ts)**

#### **GET /tasks - List All Available Tasks**
```
Method:        GET
Path:          /tasks
Query Params:  ?status=pending&area=sector_a
Headers:       Authorization: Bearer {token}
Response (200):
  [
    {
      id: "t001",
      type: "hostel",
      issueType: "electrician",
      status: "pending",
      ...
    },
    ...
  ]
(Note: DEMO MODE returns in-memory task store)
```

#### **GET /tasks/my - Get Worker's Assigned Tasks**
```
Method:        GET
Path:          /tasks/my
Query Params:  ?status=accepted|in-progress
Headers:       Authorization: Bearer {token}
Response (200):
  [tasks accepted or assigned to worker]
```

#### **PATCH /tasks/:id/accept - Accept Task**
```
Method:        PATCH
Path:          /tasks/{id}/accept
Headers:       Authorization: Bearer {token}
Body:          {}

Response (200):
  {
    id: "t001",
    status: "accepted",
    acceptedAt: ISO8601,
    ...
  }

Error:         400 if already accepted by another worker
```

#### **PATCH /tasks/:id/start - Begin Work**
```
Method:        PATCH
Path:          /tasks/{id}/start
Headers:       Authorization: Bearer {token}
Response (200):
  {
    id: "t001",
    status: "in-progress",
    startedAt: ISO8601
  }
```

#### **PATCH /tasks/:id/complete - Complete Task**
```
Method:        PATCH
Path:          /tasks/{id}/complete
Headers:
  Authorization: Bearer {token}
  Content-Type: multipart/form-data

Body (FormData):
  status: "completed" | "incomplete"
  note: "Fixed ceiling fan. Installed new motor..." (required)
  image: File (proof image, optional)
  timeSpent?: number (minutes, optional)

Response (200):
  {
    id: "t001",
    status: "completed",
    completedAt: ISO8601,
    ...
  }

Errors:
  400: { message: "Completion note required" }
  413: { message: "Image too large" }
  401: { message: "Unauthorized" }
```

### **9.4 Dashboard API**

#### **GET /dashboard/citizen - Citizen Statistics**
```
Method:        GET
Path:          /dashboard/citizen
Headers:       Authorization: Bearer {token}
Response (200):
  {
    activeComplaints: 3,
    resolvedComplaints: 12,
    myComplaints: 15,
    pendingAssignment: 1
  }
Error (401):   { message: "Unauthorized" }
```

### **9.5 API Response Patterns**

**Success Response (200/201)**:
```javascript
// Single object:
{ id, name, status, ... }

// Array of objects:
[ { id, name, ... }, { id, name, ... } ]

// Paginated:
{
  data: [ ...items ],
  total: 100,
  page: 1,
  limit: 20
}
```

**Error Response**:
```javascript
// All errors:
{
  message: string,           // Human-readable message
  code?: string,             // Error code (optional)
  errors?: Record            // Field-level errors (optional)
}

// Examples:
{ message: "Invalid email format" }
{ message: "Validation failed", errors: { email: ["Already exists"], role: ["Invalid choice"] } }
```

---

## **10. COMPONENT ARCHITECTURE & UI SYSTEM**

### **10.1 Component Hierarchy**

```
App (Root)
├── AuthProvider
    ├── RootLayout (_layout.tsx)
    │   ├── /(auth)/login
    │   │   └── [Form] TextInput, TouchableOpacity
    │   │
    │   ├── /(client)
    │   │   ├── index.tsx
    │   │   │   ├── [LinearGradient] Header
    │   │   │   ├── [StatCard] x3
    │   │   │   └── [PrimaryCard] QuickActions
    │   │   │
    │   │   ├── browse.tsx
    │   │   │   ├── [SearchBar] TextInput
    │   │   │   ├── [FilterPanel] Dropdowns (conditional)
    │   │   │   ├── [FlatList]
    │   │   │   │   └── [ComplaintCard] x N
    │   │   │   │       ├── [StatusBadge]
    │   │   │   │       ├── [SLABadge]
    │   │   │   │       └── [SupportButton]
    │   │   │   │
    │   │   └── ... (other screens)
    │   │
    │   └── /(worker)
    │       └── ... (Worker screens)
```

### **10.2 UI Component Library**

#### **ComplaintCard** (src/components/ComplaintCard.tsx)
**Purpose**: Display complaint summary in lists (browse, my-complaints)
```typescript
Props:
  task: Task                   // Complaint/task object
  onPress?: () => void         // Tap handler

Renders:
  [HEADER]
    Icon (issue-type colored) + Type + Date + Chevron
  
  [DESCRIPTION]
    Truncated to 2 lines
  
  [FOOTER]
    Status badge + Meta info (location)
```

#### **StatusBadge** (src/components/StatusBadge.tsx)
**Purpose**: Display colored status indicator with icon
```typescript
Props:
  status: StatusKey            // "pending" | "assigned" | "in-progress" | "resolved" | etc.
  compact?: boolean            // Smaller variant
  showIcon?: boolean           // Toggle icon visibility

Status Config:
  pending:     Yellow bg, hourglass icon, "PENDING" label
  assigned:    Blue bg, person icon, "ASSIGNED" label
  resolved:    Green bg, checkmark icon, "RESOLVED" label
  rejected:    Red bg, close icon, "REJECTED" label
  accepted:    Purple bg, checkmark icon, "ACCEPTED" label
  in-progress: Blue bg, construct icon, "IN PROGRESS" label
  completed:   Green bg, checkmark icon, "COMPLETED" label
  incomplete:  Red bg, close icon, "INCOMPLETE" label
```

#### **SLABadge** (src/components/SLABadge.tsx)
**Purpose**: Show SLA status with animated indicator
```typescript
Props:
  breached: boolean            // Whether SLA is breached
  showIcon?: boolean           // Toggle icon
  compact?: boolean            // Smaller variant

Renders:
  Breached:    Red bg, alert icon, pulsing dot, "SLA BREACH" label
  On-time:     Green bg, checkmark icon, static dot, "ON TIME" label

Animation:   Pulsing dot when breached (CSS animation via borderWidth)
```

#### **ImagePreview** (src/components/ImagePreview.tsx)
**Purpose**: Display images with loading skeleton
```typescript
Props:
  uri: string                  // Image URL or local path
  onRemove?: () => void        // Delete button callback
  size?: "small" | "medium"    // Image dimensions
  loading?: boolean            // Show skeleton

Features:
  - Loading skeleton while fetching
  - Fallback icon if error
  - Optional remove button overlay
  - Configurable border radius
```

#### **ErrorBoundary** (src/components/ErrorBoundary.tsx)
**Purpose**: Catch and display render errors
```typescript
Usage:
  <ErrorBoundary>
    <MyComponent />
  </ErrorBoundary>

Catches:  Render-time errors (not event handlers)
Displays: Error message + "Try Again" reset button
```

### **10.3 Theme & Styling System**

**constants/theme.ts**:
```typescript
Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4"
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff"
  }
}

Fonts = Platform.select({
  ios: { sans: "system-ui", serif: "ui-serif", mono: "ui-monospace" },
  default: { sans: "normal", serif: "serif", mono: "monospace" }
})
```

**Gradient Definitions** (used via `expo-linear-gradient`):
```javascript
// Header gradient (blue):
colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}

// Campus card gradient (green):
colors={["#10b981", "#059669"]}

// Hostel card gradient (blue):
colors={["#3b82f6", "#2563eb"]}

// Purple/indigo (worker):
colors={["#8b5cf6", "#7c3aed"]}
```

### **10.4 Color Palette Reference**

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Status: Pending | Amber | #fef3c7 | Awaiting action |
| Status: Assigned | Sky | #dbeafe | Assigned to worker |
| Status: In-Progress | Blue | #3b82f6 | Work in progress |
| Status: Resolved | Green | #dcfce7 | Issue fixed |
| Status: Rejected | Red | #fee2e2 | Rejected/invalid |
| SLA Breach | Red | #dc2626 | Past deadline |
| SLA On-Time | Green | #15803d | Within SLA |
| Primary Gradient | Blue | #1e3a8a → #60a5fa | Headers |
| Secondary Gradient | Green | #10b981 → #059669 | Campus elements |

---

## **11. STATE MANAGEMENT & DATA PERSISTENCE**

### **11.1 State Management Architecture**

**Pattern**: Context API + Local Hooks
```
Global State (Context):
  └── AuthContext
      ├── user
      ├── loading
      ├── isAuthenticated
      ├── isWorker / isClient

Screen-Level State (useState):
  ├── components ← complaints, filters, modals
  ├── loading states ← isLoading, isFetching
  └── UI states ← expandedFilter, selectedTab
```

### **11.2 AuthContext Deep Dive**

**src/context/AuthContext.js**:

```javascript
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app launch: restore session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const userData = await getMe();  // API call
          setUser(userData);
        }
      } catch (err) {
        await AsyncStorage.removeItem("token");  // Clear invalid token
      } finally {
        setLoading(false);  // Done loading
      }
    };
    restoreSession();
  }, []);

  // Login: authenticate and store token
  const login = async ({ email, name, role, password }) => {
    const response = await loginAPI({ email, name, role, password });
    const token = response.token;
    
    await AsyncStorage.setItem("token", token);  // Persist token
    const userData = await getMe();
    setUser(userData);  // Update context
  };

  // Logout: clear token and user
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  // Computed properties
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      isWorker: user?.role === "worker",
      isClient: user?.role === "client",
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Usage in Components**:
```javascript
import { useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";

export default function MyScreen() {
  const { user, login, logout, isClient } = useContext(AuthContext);
  
  return (
    <View>
      <Text>Hello, {user?.name}</Text>
      {isClient && <ClientFeatures />}
    </View>
  );
}
```

### **11.3 Local Storage Schema**

**AsyncStorage**:
```
Key               Value Type         Content
─────────────────────────────────────────────────
"token"           string (JWT)       Authentication token
```

**Demo Mode Storage** (In-Memory):
```javascript
// No persistent storage; demo data refreshes on app reload
// Mutations (create, upvote) survive during session only
```

### **11.4 Data Caching Strategy**

**Current Approach**: No explicit caching
- Each screen calls API on mount
- No cache invalidation logic
- Demo mode returns fresh data on every call

**Potential Improvements** (not implemented):
```
- React Query / SWR for auto-refetch + caching
- Redux + Redux-Persist for normalized state
- TanStack/Zustand for lighter state management
```

---

## **12. SERVICES, VALIDATIONS & BUSINESS LOGIC**

### **12.1 SLA (Service Level Agreement) Tracking**

**src/utils/sla.js**:

**SLA Hours by Issue Type**:
```javascript
const SLA_HOURS = {
  water: 24,           // Water issues: 1 day
  electricity: 12,     // Electrical: 12 hours
  road: 72,            // Road damage: 3 days
  garbage: 48,         // Garbage: 2 days
  // All others: no SLA (returns { breached: false })
};
```

**SLA Check Function**:
```javascript
export const checkSLA = (issueType, createdAt, status) => {
  if (status === "closed") return { breached: false };
  
  const slaHours = SLA_HOURS[issueType];
  if (!slaHours) return { breached: false };
  
  const elapsedHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  
  return {
    breached: elapsedHours > slaHours,    // Boolean
    elapsedHours: Math.floor(elapsedHours),
    slaHours                               // Reference SLA limit
  };
};
```

**Usage in Screens**:
```javascript
// In My Complaints:
const sla = checkSLA(complaint.issueType, complaint.createdAt, complaint.status);

// Render SLA Badge:
<SLABadge breached={sla.breached} />
```

**UI Indicators**:
- ✅ **On-Time**: Green badge, static dot, "ON TIME" label
- ⚠️ **Breached**: Red badge, pulsing dot, "SLA BREACH" label, animated alert

### **12.2 Complaint Validation**

**src/services/complaintValidation.service.js** (Partial, referenced in code):

**Expected Validation Rules**:
```javascript
Validations = [
  {
    rule: "description.length >= 20",
    severity: "error",
    message: "Description must be at least 20 characters"
  },
  {
    rule: "!description.match(/^[A-Z ]+$/)",
    severity: "warning",
    message: "Avoid ALL CAPS descriptions"
  },
  {
    rule: "description has variety",
    severity: "warning",
    message: "Description text seems repetitive or low-quality"
  },
  {
    rule: "issueType in ISSUE_TYPES",
    severity: "error",
    message: "Invalid issue type selected"
  },
  {
    rule: "type === 'hostel' ? (hostelName, floor, room required) : true",
    severity: "error",
    message: "Hostel: name, floor, room are required"
  },
  {
    rule: "type === 'campus' ? (landmark || address) : true",
    severity: "error",
    message: "Campus: landmark OR address required"
  }
]
```

### **12.3 Filter & Search Logic**

**Search** (browse.tsx/browse.tsx)):
```javascript
// Filters complaints by search term
const search = searchText.toLowerCase().trim();
results = complaints.filter(c =>
  c.description.toLowerCase().includes(search) ||
  c.issueType.toLowerCase().includes(search)
);
```

**Type Filter**:
```javascript
if (typeFilter !== "all") {
  results = results.filter(c => c.type === typeFilter);
}
```

**Issue Type Filter**:
```javascript
if (issueTypeFilter !== "all") {
  results = results.filter(c => c.issueType === issueTypeFilter);
}
```

**Sort**:
```javascript
if (sortBy === "popular") {
  results.sort((a, b) => b.upvotes - a.upvotes);  // Descending
} else {
  results.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)  // Recent first
  );
}
```

### **12.4 Image & File Handling** (In Development)

**Image Picker Integration** (referenced but commented):
```javascript
// Pseudo-code (from create-complaint forms):
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultiple: true,
    maxCount: 5,
    quality: 0.7,
    aspect: [4, 3]
  });
  
  setImages(result.assets.map(a => a.uri));
};

const takePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    aspect: [4, 3]
  });
  
  setImages([...images, result.assets[0].uri]);
};
```

**Multipart Upload**:
```javascript
// When creating complaint:
const formData = new FormData();
formData.append("issueType", issueType);
formData.append("description", description);
formData.append("location", JSON.stringify({ lat, lng }));

images.forEach((img, i) => {
  formData.append("images", {
    uri: img,
    type: "image/jpeg",
    name: `complaint_img_${i}.jpg`
  });
});

const response = await api.post("/complaints", formData);
```

### **12.5 Geolocation Services**

**Location Capture** (referenced in create forms):
```javascript
const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission required");
    return null;
  }
  
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });
  
  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude
  };
};
```

**Haversine Distance** (demo API nearby complaints):
```javascript
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
};
```

---

## **13. ERROR HANDLING & USER FEEDBACK**

### **13.1 Error Handling Pattern**

**API Errors** (Axios Interceptors):
```javascript
// Automatic handling:
401 Unauthorized
  → Remove token
  → Logout user
  → Redirect to /login

400 Bad Request
  → Display error message from response.data.message
  → Allow user to retry

500 Server Error
  → Generic "Server error" message
  → Log to console for debugging

Network Timeout
  → "Connection timeout" message
  → Offer retry option
```

**Component-Level Errors**:
```javascript
// In screens/components:
try {
  const data = await getAllComplaints();
  setComplaints(data);
} catch (error) {
  console.log("Browse complaints error:", error);
  setComplaints([]);  // Empty fallback
  // Optionally show Toast/Alert to user
}
```

### **13.2 User Feedback Mechanisms**

**Loading States**:
```javascript
// Visual feedback during API calls:
{loading ? (
  <ActivityIndicator size="large" color="#3b82f6" />
) : (
  <FlatList data={complaints} ... />
)}
```

**Disabled Buttons During Action**:
```javascript
// Prevent double-click on upvote:
{upvotingIds.includes(complaintId) ? (
  <ActivityIndicator size="small" />
) : (
  <TouchableOpacity onPress={handleToggleSupport}>
    <Text>Support</Text>
  </TouchableOpacity>
)}
```

**Validation Feedback** (potential):
```javascript
// After form submission:
{errors.map(err => (
  <Text style={{ color: err.severity === "error" ? "red" : "orange" }}>
    {err.message}
  </Text>
))}
```

### **13.3 Error Recovery**

**Retry Pattern**:
```javascript
// If complaint exceeds timeout:
<ErrorBoundary>
  <TouchableOpacity onPress={() => loadComplaints()}>
    <Text>Try Again</Text>
  </TouchableOpacity>
</ErrorBoundary>
```

**Graceful Degradation**:
- Demo mode automatically activates if backend unreachable
- Filtered queries default to empty array if filter is invalid
- Missing images show placeholder icon
- Malformed dates show "Unknown date"

---

## **14. CONFIGURATION & ENVIRONMENT MANAGEMENT**

### **14.1 Environment Variables**

**File**: `.env` (at project root)
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.x:5000    # Backend API base URL
EXPO_PUBLIC_USE_DEMO=true                        # Toggle demo mode
```

**Access in Code**:
```javascript
// Throughout app:
const API_BASE = process.env.EXPO_PUBLIC_API_URL;
const USE_DEMO_API = process.env.EXPO_PUBLIC_USE_DEMO === "true";

// Must be prefixed with EXPO_PUBLIC_ for Expo to inject into bundle
```

### **14.2 Build Configuration**

**app.json**:
```json
{
  "expo": {
    "name": "CivicMitra",
    "slug": "civicmitra",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain"
    },
    "plugins": [
      ["expo-router", { "origin": false }],
      "expo-font",
      "expo-splash-screen"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "schemes": ["civicmitra"],
    "ios": {…},
    "android": {…},
    "web": {…}
  }
}
```

**TypeScript Config** (tsconfig.json):
```json
{
  "extends": "expo/tsconfig",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "**/*.js"]
}
```

### **14.3 Build Commands**

```bash
# Development:
npm start                        # Start Expo dev server
npm run android                  # Reset and run on Android
npm run ios                      # Reset and run on iOS
npm run web                      # Run on web

# Linting:
npm run lint                     # Check code quality

# Production (potential):
eas build --platform ios
eas build --platform android
```

---

## **15. COMPLETE API REFERENCE TABLE**

| Endpoint | Method | Auth | Body | Response | Status |
|----------|--------|------|------|----------|--------|
| `/auth/login` | POST | ❌ | email, password, name, role | { token, user } | ✅ |
| `/auth/me` | GET | ✅ | - | { id, name, role, ... } | ✅ |
| `/auth/logout` | POST | ✅ | - | {} | ✅ |
| `/dashboard/citizen` | GET | ✅ | - | { activeComplaints, ... } | ✅ |
| `/complaints` | GET | ✅ | filters (query) | [Complaint] | ✅ |
| `/complaints` | POST | ✅ | FormData + images | Complaint | ⚠️ Partial |
| `/complaints/my` | GET | ✅ | filters (query) | [Complaint] | ✅ |
| `/complaints/:id` | GET | ✅ | - | Complaint | ✅ |
| `/complaints/:id/support` | POST | ✅ | - | Complaint | ✅ |
| `/complaints/:id` | DELETE | ✅ | - | 204 NoContent | ⚠️ Partial |
| `/complaints/nearby` | GET | ✅ | lat, lng, radius | [Complaint] | ⚠️ Demo Only |
| `/tasks` | GET | ✅ | filters (query) | [Task] | ⚠️ Demo Only |
| `/tasks/my` | GET | ✅ | - | [Task] | ⚠️ Demo Only |
| `/tasks/:id/accept` | PATCH | ✅ | - | Task | ⚠️ Demo Only |
| `/tasks/:id/start` | PATCH | ✅ | - | Task | ⚠️ Demo Only |
| `/tasks/:id/complete` | PATCH | ✅ | FormData + note, image | Task | ⚠️ Demo Only |

---

## **16. USER JOURNEY MAPS**

### **16.1 Client User Journey: Report an Issue**

```
┌─────────────────────────────────────────────────────────┐
│ START: Client on Home Screen                             │
└─────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│ Sees Dashboard Stats:                                    │
│  • Active Complaints: 3                                  │
│  • Resolved: 12                                          │
│  • My Total: 15                                          │
└─────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│ [Taps "Report Grievance"]                               │
│ → Navigate to /create-complaint                         │
└─────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│ Select Issue Location:                                   │
│  ┌────────────────┐  ┌────────────────┐                │
│  │ HOSTEL ISSUE   │  │ CAMPUS ISSUE   │                │
│  │                │  │                │                │
│  │ AC             │  │ Sanitation     │                │
│  │ Plumbing       │  │ Road           │                │
│  │ WiFi           │  │ Construction   │                │
│  └────────────────┘  └────────────────┘                │
└─────────────────────────────────────────────────────────┘
              ↓
    ┌─────────────────────┐
    │ Select Hostel       │ OR │ Select Campus       │
    │ ┌─────────────────┐ │     │ ┌─────────────────┐ │
    │ │ Hostel A        │ │     │ │ Main Building   │ │
    │ │ Hostel B        │ │     │ │ Library         │ │
    │ │ Hostel C        │ │     │ │ Cafeteria       │ │
    │ │ Hostel D        │ │     │ │ Sports Complex  │ │
    │ └─────────────────┘ │     │ └─────────────────┘ │
    └─────────────────────┘     └─────────────────────┘
              ↓                         ↓
    ┌─────────────────────┐     ┌──────────────────────┐
    │ HOSTEL FORM:        │     │ CAMPUS FORM:         │
    │ • Hostel Name ✓     │     │ • Landmark ✓         │
    │ • Floor ✓           │     │ • Address ✓          │
    │ • Room Number ✓     │     │ • Description ✓      │
    │ • Issue Type ✓      │     │ • Issue Type ✓       │
    │ • Description ✓     │     │ • Location ✓         │
    │ • Location (GPS) ✓  │     │ • Images (up to 5) ✓ │
    │ • Images (up to 5)  │     └──────────────────────┘
    │   (INCOMPLETE)      │
    └─────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│ [Fills form with details]                               │
│ - Issue Type: Electrician                               │
│ - Description: "Ceiling fan not working"                │
│ - Captures GPS location                                 │
│ - Optionally selects images                             │
└─────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│ [Taps Submit]                                            │
│ • Validates form (min 20 char description)              │
│ • Shows loading spinner                                 │
│ • POST /complaints (multipart)                          │
└─────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│ [Success]                                                │
│ ✅ Complaint created with ID: c_xxx_001                │
│   Status: PENDING                                       │
│   Assigned To: (None yet)                               │
│   Created At: 2024-04-15 14:30 IST                      │
└─────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│ [Navigate to My Complaints Tab]                          │
│ • New complaint appears at top                          │
│ • Status badge: PENDING (Yellow)                        │
│ • SLA timer: 24 hours (for water issue)                 │
│ • Can upvote/support immediately                        │
└─────────────────────────────────────────────────────────┘
              ↓ (Wait for assignment)
┌─────────────────────────────────────────────────────────┐
│ [Complaint Assigned]                                    │
│ • Status changes: PENDING → ASSIGNED                    │
│ • Assigned To: Maintenance Team A                       │
│ • SLA Badge: "ON TIME" (Green)                         │
└─────────────────────────────────────────────────────────┘
              ↓ (Wait for work to start)
┌─────────────────────────────────────────────────────────┐
│ [Work In Progress]                                      │
│ • Status: IN-PROGRESS (Blue)                           │
│ • Worker notes: "Ordered replacement fan motor"         │
│ • SLA: Still "ON TIME"                                 │
└─────────────────────────────────────────────────────────┘
              ↓ (Wait for completion)
┌─────────────────────────────────────────────────────────┐
│ [Resolved]                                              │
│ • Status: RESOLVED (Green)                             │
│ • Worker notes: "Fan replaced, tested OK"               │
│ • Evidence image attached                               │
│ • Resolved At: 2024-04-15 16:45 IST                    │
│ • SLA: "ON TIME" ✅                                     │
└─────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│ END: Client satisfied, complaint closed                 │
└─────────────────────────────────────────────────────────┘
```

### **16.2 Client User Journey: Browse & Support**

```
┌──────────────────────────┐
│ Client Opens "Browse" Tab│
└──────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ Display All Complaints List              │
│ ┌──────────────────────────────────────┐ │
│ │ Issue Type: Electrician              │ │
│ │ Room: 302, Hostel A, Floor 3         │ │
│ │ "Ceiling fan not working"            │ │
│ │ Status: IN-PROGRESS (Blue badge)     │ │
│ │ Upvotes: 6 | [Support] ← Tap         │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Issue Type: Plumber                  │ │
│ │ Location: Mess 2, NIT Delhi          │ │
│ │ "Water leaking from washing area"    │ │
│ │ Status: ASSIGNED (Blue badge)        │ │
│ │ Upvotes: 3 | [Support]               │ │
│ └──────────────────────────────────────┘ │
│ ... (more complaints)                   │
└──────────────────────────────────────────┘
         ↓
   [Optional: Apply Filters]
    ├─ Search: Type "water" → Filter results
    ├─ Type: Select "Campus" → Show only campus issues
    ├─ Issue: Select "Plumber" → Show plumbing only
    └─ Sort: Click "Popular" → Sort by upvotes desc
         ↓
┌──────────────────────────────────────────┐
│ Upvote/Support a Complaint               │
│ • [Tap Support Button]                   │
│ • Loading spinner appears (prevent double-click)
│ • Backend toggles upvote                 │
│ • Count updates: 6 → 7                   │
│ • Button becomes inactive during request │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ View Complaint Detail                    │
│ • [Tap Complaint Card]                   │
│ • GET /complaints/{id}                   │
│ • Display:                               │
│   - Full description                     │
│   - All images                           │
│   - Complete timeline/history            │
│   - Worker assignment details            │
│   - Comments/notes                       │
│   - SLA tracking                         │
└──────────────────────────────────────────┘
         ↓
└──────────────────────────────────────────┘
```

---

## **17. DATA FLOW DIAGRAMS**

### **17.1 Authentication Data Flow**

```
USER INPUT
  (Email + Password)
         ↓
[Login Screen - Form]
  onSubmit → handleLogin()
         ↓
[AuthContext.login()]
  ├─ Call POST /auth/login
  └─ axios.post("/auth/login", credentials)
         ↓
[Axios Interceptor]
  ├─ Add headers
  └─ Handle response
         ↓
[Backend API]
  ├─ Validate credentials
  ├─ Generate JWT token
  └─ Return { token, user }
         ↓
[Response Handler]
  ├─ Extract token
  ├─ Store: AsyncStorage.setItem("token", token)
  └─ Fetch user: getMe()
         ↓
[API Call - GET /auth/me]
  ├─ Header: Authorization: Bearer {token}
  └─ Receive: { id, name, email, role }
         ↓
[Update Context]
  ├─ setUser(userData)
  ├─ setLoading(false)
  └─ Trigger layout effect
         ↓
[RootLayout]
  ├─ Check user.role
  ├─ Role === "client" → Navigate to /(client)/browse
  └─ Role === "worker" → Navigate to /(worker)/dashboard
         ↓
[APP NAVIGATION COMPLETE]
```

### **17.2 Complaint Creation Data Flow**

```
FORM SUBMISSION
  (description, issueType, location, images)
         ↓
[Validation]
  ├─ Description length >= 20
  ├─ issueType in ISSUE_TYPES
  ├─ Location GPS valid
  └─ Images <= 5 files
         ↓ [If invalid]
    Show error messages
         ↓ [If valid]
[Prepare FormData]
  ├─ issueType: "electrician"
  ├─ description: "Ceiling fan..."
  ├─ location: JSON.stringify({lat, lng})
  ├─ hostelName: "hostel_a" (for hostel type)
  ├─ floor: "3"
  ├─ roomNumber: "302"
  └─ images: [File1, File2, ...]
         ↓
[POST /complaints]
  ├─ Content-Type: multipart/form-data
  ├─ Body: FormData
  └─ Header: Authorization: Bearer {token}
         ↓
[Backend Processing]
  ├─ Validate fields
  ├─ Save images to S3/CDN
  ├─ Insert to MongoDB: complaints collection
  ├─ Generate ID: c_xxx_001
  └─ Assign default status: "pending"
         ↓
[Response (201 Created)]
  {
    _id: "c_xxx_001",
    status: "pending",
    createdAt: "2024-04-15T14:30:00Z",
    ...
  }
         ↓
[Frontend Update]
  ├─ Hide loading spinner
  ├─ Show success toast
  ├─ Add complaint to DEMO_MY_COMPLAINTS (demo mode)
  └─ Navigate to /(client)/my-complaints
         ↓
[Display in My Complaints]
  ├─ Complaint card appears
  ├─ Status badge: PENDING (Yellow)
  ├─ SLA: checkSLA() calculates breach status
  └─ User can upvote/track
         ↓
[COMPLAINT PUBLISHED]
```

### **17.3 Homework Assignment Data Flow**

```
BACKEND → WORKER ASSIGNMENT (Not in frontend scope)
            ↓
[Complaint Status Changes]
  status: "pending" → "assigned"
         ↓
[Polling / Webhook]
  (Frontend could implement via SSE/WebSocket - not built yet)
         ↓
[Worker Accepts Task]
  GET /tasks → Returns assigned tasks
         ↓
[Worker's My Tasks Screen]
  ├─ Task appears in list
  ├─ Status: "pending" (awaiting acceptance)
  └─ [Tap Task]
         ↓
[Task Detail]
  ├─ Show complaint info
  ├─ Show SLA timer
  └─ [Accept] button
         ↓
[PATCH /tasks/{id}/accept]
  └─ Task status → "accepted"
         ↓
[My Tasks Updates]
  ├─ Task now in "accepted" list
  ├─ [Start Work] button available
  └─ Timer running (SLA countdown)
         ↓
[TASK LIFECYCLE BEGINS]
```

---

## **18. INTEGRATION POINTS WITH BACKEND**

### **18.1 Backend Requirements**

**Tech Stack Expected**:
```
Runtime:       Node.js / Python / Java
Framework:     Express.js / Flask / Spring Boot
Database:      MongoDB
Auth:          JWT (issuer: backend, validator: app + backend)
API Style:     REST with JSON
```

**Required Endpoints** (as documented in Section 9):
```
✅ Authentication: /auth/login, /auth/me, /auth/logout
✅ Complaints: GET/POST/PATCH/DELETE /complaints/*
✅ Upvotes: POST /complaints/:id/support
✅ Dashboard: GET /dashboard/citizen
✅ Tasks: GET/PATCH /tasks/*
```

### **18.2 Field Mapping Example**

**Frontend → Backend (Complaint Create)**:
```
Frontend FormData Key          Backend Expected Field
─────────────────────────────────────────────────────
issueType                 →    issueType
description               →    description
location                  →    location (object {lat, lng})
hostelName                →    hostelName (for hostel type)
floor                     →    floor (for hostel type)
roomNumber                →    roomNumber (for hostel type)
locationLandmark          →    locationLandmark (for campus type)
locationAddress           →    locationAddress (for campus type)
images[]                  →    images[] (save to CDN, return URLs)
```

### **18.3 Error Response Contract**

**Expected from Backend** (All status codes):
```
400 Bad Request:
  { "message": "Description minimum 20 characters" }
  
401 Unauthorized:
  { "message": "Invalid token" }
  
404 Not Found:
  { "message": "Complaint not found" }
  
500 Internal Server Error:
  { "message": "Database error" }
```

---

## **19. TECHNICAL CONSTRAINTS & KNOWN LIMITATIONS**

### **19.1 Incomplete Features**

| Feature | Status | Issue | Workaround / Plan |
|---------|--------|-------|-------------------|
| **Image Upload** | ⚠️ Commented | Multipart form disabled | Enable ComplaintCard.tsx code |
| **Hostel Form** | ⚠️ Partial | Floor/room validation |Complete form in create-complaint-hostel.tsx/)  |
| **Campus Form** | ⚠️ Partial | Landmark selection | Finish create-complaint-campus.tsx/) |
| **Complaint Detail** | ⚠️ Partial | Timeline display | Implement detail view |
| **Map View** | ⚠️ Partial | Leaflet integration | Use Leaflet markers + clustering |
| **Worker Dashboard** | ⚠️ Partial | Stats loading | Link to backend API |
| **Real-time Updates** | 🔴 Not Built | No WebSocket | Add Socket.io or SSE for live status updates |
| **Notifications** | 🔴 Not Built | No push | Implement via Expo Notifications |
| **Comments** | 🔴 Not Built | No comments API | Design + backend endpoint needed |
| **Offline Sync** | 🔴 Not Built | No offline queue | Consider Redux-Persist or Watermelon DB |

### **19.2 Known Bugs & Edge Cases**

```
1. Double-click prevention: Implemented for upvote, need for all buttons
2. Network retry: No exponential backoff configured
3. Session expiration: Token checked only on API failure, not proactively
4. Demo data persistence: Lost on app reload
5. Image memory leak: Large image arrays could cause OOM
6. Accessibility: Missing alt-text,labels; not tested with screen readers
7. RTL support: Not implemented for international users
8. Pagination: Not implemented; all data loaded at once
```

### **19.3 Performance Considerations**

| Item | Current | Recommended |
|------|---------|-------------|
| **API Timeout** | 20s | 15-30s (user-dependent) |
| **Complaint List Size** | 6 (demo) | Paginate after 10-20 items |
| **Image Upload Size** | Not limited | Max 2MB per image, 10MB total |
| **Memory Caching** | None | Consider React Query with 5min TTL |
| **Bundle Size** | ~TBD | Monitor with `expo prebuild --web` |
| **Rendering** | FlatList | ✅ Good for large lists |

---

## **20. KEY CODE REFERENCES WITH LINE NUMBERS**

### **20.1 Core Files Reference**

| File | Purpose | Key Functions/Exports | Status |
|------|---------|----------------------|--------|
| src/context/AuthContext.js | Auth state mgmt | `AuthProvider`, `login()`, `logout()` | ✅ Complete |
| app/_layout.tsx | Root layout routing | Role-based navigation logic | ✅ Complete |
| src/api/axios.js | HTTP client | Interceptors, token injection | ✅ Complete |
| src/api/auth.api.js | Auth endpoints | `login()`, `getMe()`, `logoutUser()` | ✅ Complete |
| src/api/complaint.api.js | Complaint CRUD | `getAllComplaints()`, `createComplaint()`, `toggleUpvote()` | ✅ Complete |
| src/api/tasks.api.ts | Task APIs (demo) | `getAllTasks()`, `acceptTask()`, `completeTask()` | ⚠️ Demo |
| app/(client)/index.tsx/index.tsx) | Home dashboard | Stats loading, quick actions | ✅ Complete |
| app/(client)/browse.tsx/browse.tsx) | Browse complaints | Filters, search, upvote | ✅ Complete |
| app/(client)/my-complaints.tsx/my-complaints.tsx) | Track complaints | Status filtering, SLA tracking | ✅ Complete |
| app/(client)/create-complaint.tsx/create-complaint.tsx) | Type selector | Hostel/Campus routing | ✅ Complete |
| app/(client)/create-complaint-hostel.tsx/create-complaint-hostel.tsx) | Hostel form | Form fields, validation | ⚠️ Partial |
| app/(client)/create-complaint-campus.tsx/create-complaint-campus.tsx) | Campus form | Landmark/address, location | ⚠️ Partial |
| src/components/ComplaintCard.tsx | Complaint card UI | `TaskCard` component | ✅ Complete |
| src/components/StatusBadge.tsx | Status display | Status config, icon map | ✅ Complete |
| src/components/SLABadge.tsx | SLA indicator | Breach/on-time, pulse animation | ✅ Complete |
| src/utils/sla.js | SLA calculation | `checkSLA()` with hours config | ✅ Complete |
| constants/theme.ts | Theming | Colors, fonts platform-specific | ✅ Complete |
| package.json | Dependencies | All npm packages | ✅ Complete |
| app.json | Expo config | Plugins, experiments, schemes | ✅ Complete |

### **20.2 Quick Find: Critical Functions**

**Authentication**:
- Auth login logic: AuthContext.js - line 33-47
- Session restore: AuthContext.js - line 12-28
- Token injection: axios.js - line 14-25

**API Calls**:
- Get all complaints: complaint.api.js - getAllComplaints()
- Create complaint: complaint.api.js - createComplaint()
- Upvote toggle: complaint.api.js - toggleUpvote()
- SLA check: sla.js - checkSLA()

**UI Components**:
- Status config: StatusBadge.tsx - STATUS_CONFIG
- Complaint card: ComplaintCard.tsx - TaskCard()
- Home dashboard: index.tsx - line 1-100/index.tsx#L1-L100)

---

## **APPENDIX: DEMO MODE REFERENCE**

### **Demo Users**

```
CITIZEN:
  Email:    demo@civicmitra.com
  Password: demo1234
  
WORKER:
  Email:    worker@demo.com
  Password: demo1234
```

### **Demo Complaints** (In-Memory Store)

```
c001: Electrical, Hostel A Room 302, IN-PROGRESS, 6 upvotes
c002: Plumbing, Mess Block, ASSIGNED, 3 upvotes
c003: AC, Hostel B Room 205, PENDING, 4 upvotes
c004: Sanitation, Main Gate, CLOSED, 4 upvotes
c005: WiFi, Hostel C Room 108, PENDING, 2 upvotes
c006: Construction, Sports Complex, IN-PROGRESS, (more data)
```

### **Demo Dashboard Stats**

```
activeComplaints: 4
resolvedComplaints: 12
myComplaints: 15
```

---

## **DOCUMENT METADATA**

| Property | Value |
|----------|-------|
| **Document Version** | 1.0 |
| **Last Updated** | April 15, 2026 |
| **App Version** | 1.0.0 |
| **Documentation Standards** | SRS/SDD Compliant |
| **Prepared For** | Official Documentation |
| **Status** | ✅ READY FOR REVIEW |

---

## **END OF DOCUMENT**

---

## 📋 Summary

I've created a **comprehensive, professional-grade context document** covering your entire user app comprehensively. This document includes:

### **✅ What's Included (20 Sections)**
1. Executive Summary
2. System Architecture (with diagrams)
3. Technology Stack & Dependencies
4. Complete Navigation Structure
5. Authentication & Authorization
6. User Roles & Permissions
7. Complete User Workflows with diagrams
8. Data Models & Schemas
9. Complete API Reference (all endpoints)
10. Component Architecture
11. State Management
12. Business Logic & Services
13. Error Handling
14. Configuration & Environment
15. Full API Endpoint Table
16. User Journey Maps (visual)
17. Data Flow Diagrams
18. Backend Integration Points
19. Technical Constraints & Known Limitations
20. Key Code References with Line Numbers

### **✅ Key Features**
- ✅ All A-Z details documented
- ✅ Suitable for **official SRS/SDD documentation**

- ✅ ASCII diagrams for data flows
- ✅ Complete API reference with request/response examples
- ✅ User journey maps
- ✅ Code file references with specific line numbers
- ✅ Status indicators (✅ Complete, ⚠️ Partial, 🔴 Not Built)
- ✅ Tables for quick reference
- ✅ Integration points with backend clearly documented

This document is **ready to be saved and used for your official documentation purposes**. Would you like me to:
1. **Save this as a .md file** in your workspace?
2. **Expand any specific section** with more detail?
3. **Create additional diagrams** or visual aids?
4. **Generate a backend SDD** (server-side design)?

Similar code found with 1 license type
