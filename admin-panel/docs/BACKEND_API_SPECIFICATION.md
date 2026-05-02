# Backend API Specification - Admin Panel
**Version:** 1.0  
**Last Updated:** April 17, 2026  
**Status:** Ready for Implementation  
**Standard:** RESTful API with JSON

---

## Table of Contents
1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [Authentication](#authentication)
4. [Common Patterns](#common-patterns)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Error Handling](#error-handling)
8. [Validation Rules](#validation-rules)
9. [Security](#security)
10. [Testing Checklist](#testing-checklist)

---

## Overview

### Base Configuration
- **Base URL (Development):** `http://localhost:5000`
- **Base URL (Production):** `https://api.civic-admin.com` *(to be updated)*
- **API Version:** `v1` (prefix: `/api`)
- **Response Format:** JSON
- **Charset:** UTF-8
- **Default Port:** 5000

### Project Context
- **Frontend:** React 18+ (vite)
- **Frontend Location:** `src/api/` and data APIs
- **Departments:** 6 (electrical, plumbing, it, sanitation, ac, construction)
- **Main Features:** Authentication, Dashboard, Complaints, Workers, Shifts, Profile Management
- **Phase 1 Status:** Mock data driven, localStorage sessions
- **Phase 2 Status:** Backend required for production

---

## Environment Setup

### Required Environment Variables
```env
# Backend Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=admin_panel_db
DB_USER=admin
DB_PASSWORD=your_strong_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration (to connect to backend)
Modify `src/api/auth.js`:
```javascript
// Change USE_MOCK from true to false when backend is ready
const USE_MOCK = false; // Set to false for production
```

---

## Authentication

### Authentication Flow

```
1. User Login (POST /api/auth/login)
   ↓
2. Server validates credentials
   ↓
3. Server returns JWT token + user object
   ↓
4. Frontend stores token in localStorage
   ↓
5. All subsequent requests include token in Authorization header
   ↓
6. Server validates token at middleware level
   ↓
7. If token valid → process request
   If token invalid → return 401 Unauthorized
```

### JWT Token Structure
```
Header: Bearer {token}
Payload: { userId, email, department, iat, exp }
Signature: HS256

Example:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Validation Middleware
```javascript
// Example middleware (pseudocode)
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ 
      error: 'Invalid token',
      message: err.message
    });
  }
}
```

---

## Common Patterns

### Response Format (Success)
```json
{
  "success": true,
  "data": {
    // Actual response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2026-04-17T10:30:45.123Z"
}
```

### Response Format (Error)
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    // Additional error context
  },
  "timestamp": "2026-04-17T10:30:45.123Z"
}
```

### Pagination (if applicable)
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Standard HTTP Status Codes
| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Token valid but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 500 | Server Error | Unhandled server error |

### Header Requirements
```
All requests should include:
Content-Type: application/json

Authenticated requests should include:
Authorization: Bearer {token}
```

---

## API Endpoints

### ⚡ 1. AUTHENTICATION ENDPOINTS

#### 1.1 User Login
```
POST /api/auth/login
Status Code: 200 OK | 400 Bad Request | 401 Unauthorized
```

**Request:**
```json
{
  "email": "tech@civic.com",
  "password": "123456",
  "department": "electrical"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "USR-001",
      "email": "tech@civic.com",
      "name": "Rahul Sharma",
      "department": "electrical",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid email, password, or department"
}
```

**Notes:**
- Email must be valid format
- Password must be at least 6 characters
- Department must match user's assigned department
- Frontend stores token in `localStorage.getItem('token')`
- Frontend stores user in `localStorage.getItem('user')`

**Frontend Call:**
```javascript
// src/api/auth.js - realLogin function
const realLogin = async (payload) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
```

---

#### 1.2 Get Current User
```
GET /api/auth/me
Status Code: 200 OK | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Request:**
```
Headers:
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "USR-001",
      "email": "tech@civic.com",
      "name": "Rahul Sharma",
      "department": "electrical",
      "role": "admin"
    }
  },
  "message": "User retrieved successfully"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

**Frontend Call:**
```javascript
// src/api/auth.js - realGetUser function
const realGetUser = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.user;
};
```

---

#### 1.3 User Logout
```
POST /api/auth/logout
Status Code: 200 OK | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Request:**
```
Headers:
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Notes:**
- Clean up localStorage on frontend after logout
- Backend can invalidate token in blacklist (optional)
- Frontend handles cleanup in `logoutUser()` function

**Frontend Call:**
```javascript
// src/api/auth.js
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
```

---

### 📊 2. DASHBOARD ENDPOINTS

#### 2.1 Get Dashboard Statistics
```
GET /api/dashboard/stats
Status Code: 200 OK | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Query Parameters:**
```
department: string (required)
  Values: electrical, plumbing, it, sanitation, ac, construction
  Example: /api/dashboard/stats?department=electrical
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "stats": [
      {
        "key": "total",
        "label": "Total Complaints",
        "icon": "alert",
        "iconBg": "#EFF6FF",
        "iconClr": "#2563EB",
        "barClr": "#2563EB",
        "num": 15,
        "sub": "+ 2 this week",
        "dir": "up",
        "barW": 75
      },
      {
        "key": "resolved",
        "label": "Resolved",
        "icon": "check",
        "iconBg": "#ECFDF5",
        "iconClr": "#059669",
        "barClr": "#059669",
        "num": 8,
        "sub": "+ 1 today",
        "dir": "up",
        "barW": 80
      },
      {
        "key": "pending",
        "label": "Pending",
        "icon": "clock",
        "iconBg": "#FFFBEB",
        "iconClr": "#D97706",
        "barClr": "#D97706",
        "num": 7,
        "sub": "requires attention",
        "dir": "flat",
        "barW": 70
      },
      {
        "key": "workers",
        "label": "Active Workers",
        "icon": "users",
        "iconBg": "#F5F3FF",
        "iconClr": "#7C3AED",
        "barClr": "#7C3AED",
        "num": 12,
        "sub": "online",
        "dir": "up",
        "barW": 80
      }
    ]
  },
  "message": "Dashboard statistics retrieved"
}
```

**Notes:**
- `num`: Actual count value
- `barW`: Percentage width (0-100) for visual bar display
- `dir`: Direction indicator (up, down, flat)
- `sub`: Subtitle text for context
- Calculate stats based on department filter
- Frontend calls: `src/api/dashboardApi.js - getStats(department)`

---

#### 2.2 Get Dashboard Complaints (for dashboard table)
```
GET /api/dashboard/complaints
Status Code: 200 OK | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Query Parameters:**
```
department: string (required)
limit: number (optional, default: 5)
  Example: /api/dashboard/complaints?department=electrical&limit=5
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": "CMP001",
        "title": "AC not cooling",
        "location": "Block A",
        "department": "ac",
        "status": "pending",
        "votes": 5,
        "worker": "Rohit Singh",
        "statusBg": "#EFF6FF",
        "statusColor": "#2563EB"
      },
      {
        "id": "CMP002",
        "title": "WiFi down",
        "location": "Library",
        "department": "it",
        "status": "in-progress",
        "votes": 8,
        "worker": "Neha Gupta",
        "statusBg": "#E0F2FE",
        "statusColor": "#0284C7"
      }
    ]
  },
  "message": "Dashboard complaints retrieved"
}
```

**Field Mapping:**
```
Frontend Field    → Backend Field
loc              → location
dept             → department
st               → status
dBg              → statusBg
dClr             → statusColor
```

---

### 🛠️ 3. COMPLAINTS ENDPOINTS

#### 3.1 Get All Complaints (with filters)
```
GET /api/complaints
Status Code: 200 OK | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Query Parameters:**
```
department: string (required)
  Example: /api/complaints?department=electrical

status: string (optional)
  Values: pending, in-progress, resolved
  Example: /api/complaints?department=electrical&status=pending

page: number (optional, default: 1)
limit: number (optional, default: 20)
  Example: /api/complaints?department=electrical&page=1&limit=20

sortBy: string (optional)
  Values: date, votes, status
  Example: /api/complaints?sortBy=-date (- for descending)

search: string (optional)
  Search in title/location fields
  Example: /api/complaints?search=water
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": "CMP001",
        "title": "AC not cooling",
        "description": "Air conditioning unit not working",
        "location": "Block A, Room 101",
        "department": "ac",
        "status": "pending",
        "priority": "high",
        "votes": 5,
        "assignedWorker": {
          "id": "W-001",
          "name": "Rohit Singh",
          "department": "ac"
        },
        "createdAt": "2026-04-15T10:30:00Z",
        "updatedAt": "2026-04-17T14:20:00Z",
        "resolvedAt": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  },
  "message": "Complaints retrieved"
}
```

**Notes:**
- Complaints must be filtered by department (user's department)
- Default sort by newest first (date descending)
- Support efficient searching
- Return worker details in assignedWorker object
- Frontend calls: `src/api/dashboardApi.js - getComplaints(department)`

---

#### 3.2 Get Single Complaint
```
GET /api/complaints/:id
Status Code: 200 OK | 404 Not Found | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**URL Parameters:**
```
id: string (required)
  Example: /api/complaints/CMP001
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "complaint": {
      "id": "CMP001",
      "title": "AC not cooling",
      "description": "Air conditioning unit not working in Block A",
      "location": "Block A, Room 101",
      "latitude": 28.5355,
      "longitude": 77.1922,
      "department": "ac",
      "status": "pending",
      "priority": "high",
      "votes": 5,
      "assignedWorker": {
        "id": "W-001",
        "name": "Rohit Singh",
        "type": "AC Technician",
        "contact": "9876543210"
      },
      "reportedBy": "Public",
      "createdAt": "2026-04-15T10:30:00Z",
      "updatedAt": "2026-04-17T14:20:00Z",
      "resolvedAt": null,
      "comments": [
        {
          "id": "COM-001",
          "author": "Rohit Singh",
          "text": "Started repair work",
          "createdAt": "2026-04-16T09:00:00Z"
        }
      ]
    }
  },
  "message": "Complaint retrieved"
}
```

---

#### 3.3 Create Complaint (for public)
```
POST /api/complaints
Status Code: 201 Created | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token - admin/staff only)
```

**Request:**
```json
{
  "title": "String - complaint title (required, max: 100)",
  "description": "String - detailed description (required, max: 1000)",
  "location": "String - location/address (required, max: 200)",
  "latitude": "Number - optional for mapping",
  "longitude": "Number - optional for mapping",
  "department": "String - department code (required)",
  "priority": "String - low|medium|high (default: medium)",
  "attachments": ["Array of file URLs - optional"]
}
```

**Example Request:**
```json
{
  "title": "Pipe leakage",
  "description": "Water leaking from main pipe in hostel block",
  "location": "Hostel Block B, Near Entrance",
  "department": "plumbing",
  "priority": "high"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "data": {
    "complaint": {
      "id": "CMP099",
      "title": "Pipe leakage",
      "description": "Water leaking from main pipe in hostel block",
      "location": "Hostel Block B, Near Entrance",
      "department": "plumbing",
      "status": "pending",
      "priority": "high",
      "votes": 0,
      "createdAt": "2026-04-17T10:30:00Z"
    }
  },
  "message": "Complaint created successfully"
}
```

**Validation Rules:**
- Title: Required, 5-100 characters
- Description: Required, 10-1000 characters
- Location: Required, 5-200 characters
- Department: Required, must match valid department code
- Priority: Optional, default "medium"

---

#### 3.4 Update Complaint
```
PUT /api/complaints/:id
Status Code: 200 OK | 400 Bad Request | 404 Not Found | 401 Unauthorized
Auth Required: YES (Bearer token - admin/assigned worker only)
```

**URL Parameters:**
```
id: string (required)
```

**Request:**
```json
{
  "status": "String - pending|in-progress|resolved (optional)",
  "assignedWorker": "String - worker ID (optional)",
  "priority": "String - low|medium|high (optional)",
  "description": "String - updated description (optional)"
}
```

**Example Request - Update Status:**
```json
{
  "status": "in-progress",
  "assignedWorker": "W-001"
}
```

**Example Request - Resolve:**
```json
{
  "status": "resolved",
  "notes": "Issue fixed. AC unit repaired and tested."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "complaint": {
      "id": "CMP001",
      "title": "AC not cooling",
      "status": "in-progress",
      "assignedWorker": {
        "id": "W-001",
        "name": "Rohit Singh"
      },
      "updatedAt": "2026-04-17T14:30:00Z"
    }
  },
  "message": "Complaint updated successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Complaint with ID CMP001 not found"
}
```

---

#### 3.5 Add Vote/Support to Complaint
```
POST /api/complaints/:id/vote
Status Code: 200 OK | 400 Bad Request | 404 Not Found
Auth Required: NO (public can vote)
```

**URL Parameters:**
```
id: string (required)
```

**Request:**
```json
{
  "userId": "String - anonymous user ID (optional)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "complaint": {
      "id": "CMP001",
      "votes": 6
    }
  },
  "message": "Vote recorded"
}
```

**Notes:**
- Increment vote count by 1
- Prevent duplicate votes using userId/IP tracking
- This makes complaints more visible/prioritized

---

#### 3.6 Delete Complaint (admin only)
```
DELETE /api/complaints/:id
Status Code: 204 No Content | 404 Not Found | 401 Unauthorized | 403 Forbidden
Auth Required: YES (Bearer token - admin only)
```

**URL Parameters:**
```
id: string (required)
```

**Response (Success - 204):**
```
HTTP/1.1 204 No Content
```

---

### 👷 4. WORKERS ENDPOINTS

#### 4.1 Get All Workers
```
GET /api/workers
Status Code: 200 OK | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Query Parameters:**
```
department: string (required)
  Example: /api/workers?department=electrical

status: string (optional)
  Values: active, inactive, on-leave, off-duty
  Example: /api/workers?department=electrical&status=active

shift: string (optional)
  Values: morning, evening, night
  Example: /api/workers?shift=morning

page: number (optional, default: 1)
limit: number (optional, default: 20)

sortBy: string (optional)
  Values: name, tasks, rating
  Example: /api/workers?sortBy=rating
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "workers": [
      {
        "id": "W-001",
        "name": "Ramesh Kumar",
        "initials": "RK",
        "avatarColor": "#2563EB",
        "type": "Senior Electrician",
        "department": "electrical",
        "shift": "Morning",
        "online": true,
        "tasks": {
          "completed": 4,
          "total": 6
        },
        "rating": 4.8,
        "contact": "9876543210",
        "email": "ramesh@civic.com",
        "joinDate": "2020-06-15",
        "availability": "available"
      },
      {
        "id": "W-002",
        "name": "Priya Sharma",
        "initials": "PS",
        "avatarColor": "#7C3AED",
        "type": "Electrician",
        "department": "electrical",
        "shift": "Evening",
        "online": true,
        "tasks": {
          "completed": 2,
          "total": 3
        },
        "rating": 4.5,
        "contact": "9876543211",
        "email": "priya@civic.com",
        "joinDate": "2021-03-20",
        "availability": "available"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  },
  "message": "Workers retrieved"
}
```

**Field Mapping:**
```
Frontend Field    → Backend Field
ini              → initials
clr              → avatarColor
type             → type (Senior/Junior/etc)
online           → online (boolean)
tasks: "4/6"     → tasks: { completed: 4, total: 6 }
```

**Notes:**
- Workers must be filtered by department (user's department)
- `online` status determined by last activity timestamp
- `tasks` shows completed vs total assigned tasks
- `rating` is averaged from complaint resolutions
- Frontend calls: `src/api/workerApi.js - fetchWorkers(department)`

---

#### 4.2 Get Single Worker
```
GET /api/workers/:id
Status Code: 200 OK | 404 Not Found | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**URL Parameters:**
```
id: string (required)
  Example: /api/workers/W-001
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "worker": {
      "id": "W-001",
      "name": "Ramesh Kumar",
      "type": "Senior Electrician",
      "department": "electrical",
      "shift": "Morning",
      "online": true,
      "contact": "9876543210",
      "email": "ramesh@civic.com",
      "joinDate": "2020-06-15",
      "experience": "6 years",
      "rating": 4.8,
      "completedTasks": 87,
      "totalTasks": 92,
      "successRate": 94.6,
      "certifications": ["Electrical Safety", "ABC Certified"],
      "assignedComplaints": [
        {
          "id": "CMP001",
          "title": "AC not cooling",
          "status": "in-progress"
        }
      ],
      "schedule": {
        "monday": "morning",
        "tuesday": "morning",
        "wednesday": "off",
        "thursday": "morning",
        "friday": "morning",
        "saturday": "evening",
        "sunday": "off"
      }
    }
  },
  "message": "Worker retrieved"
}
```

---

#### 4.3 Create Worker
```
POST /api/workers
Status Code: 201 Created | 400 Bad Request | 401 Unauthorized | 403 Forbidden
Auth Required: YES (Bearer token - admin only)
```

**Request:**
```json
{
  "name": "String - full name (required, max: 100)",
  "email": "String - email (required, unique)",
  "contact": "String - phone number (required)",
  "type": "String - job type/title (required)",
  "department": "String - department code (required)",
  "shift": "String - morning|evening|night (required)",
  "experience": "String - years of experience (optional)",
  "certifications": ["Array of certification names (optional)"]
}
```

**Example Request:**
```json
{
  "name": "Vikram Patel",
  "email": "vikram@civic.com",
  "contact": "9876543212",
  "type": "Electrician",
  "department": "electrical",
  "shift": "morning",
  "experience": "4 years",
  "certifications": ["Safety Training", "Basic Electrical"]
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "data": {
    "worker": {
      "id": "W-099",
      "name": "Vikram Patel",
      "email": "vikram@civic.com",
      "type": "Electrician",
      "department": "electrical",
      "createdAt": "2026-04-17T10:30:00Z"
    }
  },
  "message": "Worker created successfully"
}
```

**Validation Rules:**
- Name: Required, 3-100 characters
- Email: Required, unique, valid email format
- Contact: Required, valid phone format
- Type: Required (Senior/Junior/Trainee variations)
- Department: Required, must match valid department code
- Shift: Required, must be morning/evening/night

---

#### 4.4 Update Worker
```
PUT /api/workers/:id
Status Code: 200 OK | 400 Bad Request | 404 Not Found | 401 Unauthorized
Auth Required: YES (Bearer token - admin only)
```

**URL Parameters:**
```
id: string (required)
```

**Request (all fields optional):**
```json
{
  "name": "String",
  "email": "String",
  "contact": "String",
  "type": "String",
  "shift": "String - morning|evening|night",
  "experience": "String",
  "certifications": ["Array"]
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "worker": {
      "id": "W-001",
      "name": "Ramesh Kumar",
      "shift": "Evening",
      "updatedAt": "2026-04-17T14:30:00Z"
    }
  },
  "message": "Worker updated successfully"
}
```

---

#### 4.5 Get Worker Tasks
```
GET /api/workers/:id/tasks
Status Code: 200 OK | 404 Not Found | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**URL Parameters:**
```
id: string (required)
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "complaintId": "CMP001",
        "title": "AC not cooling",
        "status": "in-progress",
        "priority": "high",
        "location": "Block A",
        "assignedDate": "2026-04-15T10:00:00Z",
        "dueDate": "2026-04-18T18:00:00Z"
      },
      {
        "complaintId": "CMP003",
        "title": "Pipe leakage",
        "status": "completed",
        "priority": "medium",
        "location": "Hostel B",
        "assignedDate": "2026-04-10T10:00:00Z",
        "completedDate": "2026-04-12T16:00:00Z"
      }
    ],
    "summary": {
      "total": 6,
      "completed": 4,
      "inProgress": 2,
      "pending": 0
    }
  },
  "message": "Worker tasks retrieved"
}
```

---

#### 4.6 Update Worker Task Status
```
PUT /api/workers/:workerId/tasks/:complaintId
Status Code: 200 OK | 404 Not Found | 401 Unauthorized
Auth Required: YES (Bearer token - worker or admin)
```

**URL Parameters:**
```
workerId: string (required)
complaintId: string (required)
```

**Request:**
```json
{
  "status": "String - pending|in-progress|completed (required)",
  "notes": "String - optional notes (optional)"
}
```

**Example Request:**
```json
{
  "status": "completed",
  "notes": "AC unit repaired and tested. Cooling is normal."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "complaintId": "CMP001",
      "status": "completed",
      "completedDate": "2026-04-17T16:30:00Z"
    }
  },
  "message": "Task updated successfully"
}
```

---

### 📅 5. SHIFTS ENDPOINTS

#### 5.1 Get All Shifts
```
GET /api/shifts
Status Code: 200 OK | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Query Parameters:**
```
department: string (required)
week: string (optional, format: YYYY-MM-DD)
  Default: current week
  Example: /api/shifts?department=electrical&week=2026-04-15
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "shifts": [
      {
        "id": "SFT-001",
        "workerId": "W-001",
        "workerName": "Ramesh Kumar",
        "date": "2026-04-17",
        "dayOfWeek": "Thursday",
        "shiftType": "morning",
        "startTime": "08:00",
        "endTime": "16:00",
        "status": "scheduled"
      },
      {
        "id": "SFT-002",
        "workerId": "W-001",
        "workerName": "Ramesh Kumar",
        "date": "2026-04-18",
        "dayOfWeek": "Friday",
        "shiftType": "morning",
        "startTime": "08:00",
        "endTime": "16:00",
        "status": "scheduled"
      },
      {
        "id": "SFT-003",
        "workerId": "W-001",
        "workerName": "Ramesh Kumar",
        "date": "2026-04-19",
        "dayOfWeek": "Saturday",
        "shiftType": "off",
        "startTime": null,
        "endTime": null,
        "status": "off-day"
      }
    ],
    "week": {
      "start": "2026-04-15",
      "end": "2026-04-21"
    }
  },
  "message": "Shifts retrieved"
}
```

**Shift Types:**
```
- morning:    08:00 - 16:00 (8 hours)
- evening:    16:00 - 00:00 (8 hours)
- night:      00:00 - 08:00 (8 hours)
- off:        No work (full day off)
```

**Notes:**
- Return shifts for all workers in department
- Group by week (Monday-Sunday)
- Frontend displays as grid (workers × days)
- Frontend calls: `src/pages/Shift.jsx` accesses shift data

---

#### 5.2 Create/Update Shift
```
POST /api/shifts
Status Code: 201 Created | 200 OK | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token - admin only)
```

**Request (for creating multiple shifts):**
```json
{
  "shifts": [
    {
      "workerId": "W-001",
      "date": "2026-04-17",
      "shiftType": "morning"
    },
    {
      "workerId": "W-001",
      "date": "2026-04-18",
      "shiftType": "morning"
    },
    {
      "workerId": "W-002",
      "date": "2026-04-17",
      "shiftType": "evening"
    }
  ]
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "data": {
    "shifts": [
      {
        "id": "SFT-001",
        "workerId": "W-001",
        "date": "2026-04-17",
        "shiftType": "morning",
        "status": "scheduled"
      }
    ]
  },
  "message": "Shifts created successfully"
}
```

---

#### 5.3 Update Single Shift
```
PUT /api/shifts/:id
Status Code: 200 OK | 404 Not Found | 401 Unauthorized
Auth Required: YES (Bearer token - admin only)
```

**URL Parameters:**
```
id: string (required)
```

**Request:**
```json
{
  "shiftType": "String - morning|evening|night|off (required)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "shift": {
      "id": "SFT-001",
      "workerId": "W-001",
      "date": "2026-04-17",
      "shiftType": "evening",
      "updatedAt": "2026-04-17T14:30:00Z"
    }
  },
  "message": "Shift updated successfully"
}
```

---

#### 5.4 Get Weekly Schedule (detailed view)
```
GET /api/shifts/schedule/weekly
Status Code: 200 OK | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Query Parameters:**
```
department: string (required)
week: string (optional, format: YYYY-MM-DD)
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "schedule": {
      "W-001": {
        "workerName": "Ramesh Kumar",
        "shifts": {
          "monday": "morning",
          "tuesday": "morning",
          "wednesday": "off",
          "thursday": "morning",
          "friday": "morning",
          "saturday": "evening",
          "sunday": "off"
        }
      },
      "W-002": {
        "workerName": "Priya Sharma",
        "shifts": {
          "monday": "evening",
          "tuesday": "evening",
          "wednesday": "morning",
          "thursday": "evening",
          "friday": "off",
          "saturday": "off",
          "sunday": "night"
        }
      }
    }
  },
  "message": "Weekly schedule retrieved"
}
```

---

### 👤 6. PROFILE ENDPOINTS

#### 6.1 Get User Profile
```
GET /api/profile
Status Code: 200 OK | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Request:**
```
Headers:
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "USR-001",
      "name": "Rahul Sharma",
      "email": "tech@civic.com",
      "department": "electrical",
      "role": "admin",
      "joinDate": "2020-06-15",
      "phone": "9876543210",
      "avatar": "https://api.civic-admin.com/avatars/USR-001.jpg",
      "bio": "Senior Administrator - Electrical Department",
      "lastLogin": "2026-04-17T10:00:00Z"
    }
  },
  "message": "Profile retrieved"
}
```

---

#### 6.2 Update User Profile
```
PUT /api/profile
Status Code: 200 OK | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Request:**
```json
{
  "name": "String (optional)",
  "phone": "String (optional)",
  "bio": "String (optional)",
  "avatar": "File (optional)"
}
```

**Example Request:**
```json
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "bio": "Senior Administrator - Electrical Department"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "USR-001",
      "name": "Rahul Sharma",
      "phone": "9876543210",
      "bio": "Senior Administrator - Electrical Department",
      "updatedAt": "2026-04-17T14:30:00Z"
    }
  },
  "message": "Profile updated successfully"
}
```

---

#### 6.3 Change Password
```
PUT /api/profile/password
Status Code: 200 OK | 400 Bad Request | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Request:**
```json
{
  "currentPassword": "String (required)",
  "newPassword": "String (required, min: 6 characters)",
  "confirmPassword": "String (required, must match newPassword)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "INVALID_PASSWORD",
  "message": "Current password is incorrect"
}
```

---

#### 6.4 Get Department Info
```
GET /api/profile/department
Status Code: 200 OK | 401 Unauthorized
Auth Required: YES (Bearer token)
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "department": {
      "code": "electrical",
      "name": "Electrical Department",
      "manager": "Rahul Sharma",
      "totalWorkers": 12,
      "activeComplaints": 7,
      "resolvedThisWeek": 3,
      "description": "Handles electrical infrastructure and maintenance"
    }
  },
  "message": "Department info retrieved"
}
```

---

## Database Schema

### Entity Relationship Diagram
```
┌─────────────┐
│ Department  │
│   (D1)      │ 1 ← N
└──────┬──────┘
       │
       ├──→ User (admin users per department)
       │     - id (PK)
       │     - email (unique)
       │     - password (hashed)
       │     - department_id (FK)
       │     - created_at
       │
       └──→ Worker (workers per department)
             - id (PK)
             - name
             - department_id (FK)
             - type/role
             - shift
             - created_at
             │
             ├──→ Shift (1 ← N)
             │     - id (PK)
             │     - worker_id (FK)
             │     - date
             │     - shift_type
             │
             └──→ Complaint (assigned workers)
                   - id (PK)
                   - worker_id (FK)
                   - department_id (FK)
                   - status
                   - created_at
```

### Database Tables (SQL Reference)

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  department_id VARCHAR(50) NOT NULL,
  role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
  phone VARCHAR(20),
  bio TEXT,
  avatar_url VARCHAR(500),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  INDEX idx_email (email),
  INDEX idx_department_id (department_id)
);
```

#### Workers Table
```sql
CREATE TABLE workers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  contact VARCHAR(20) NOT NULL,
  type VARCHAR(100) NOT NULL,
  department_id VARCHAR(50) NOT NULL,
  shift ENUM('morning', 'evening', 'night') DEFAULT 'morning',
  experience_years INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  total_tasks INT DEFAULT 0,
  completed_tasks INT DEFAULT 0,
  online_status BOOLEAN DEFAULT FALSE,
  last_activity TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  INDEX idx_department_id (department_id),
  INDEX idx_online_status (online_status)
);
```

#### Complaints Table
```sql
CREATE TABLE complaints (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  department_id VARCHAR(50) NOT NULL,
  status ENUM('pending', 'in-progress', 'resolved') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  assigned_worker_id VARCHAR(50),
  votes INT DEFAULT 0,
  reported_by VARCHAR(100) DEFAULT 'Public',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (assigned_worker_id) REFERENCES workers(id),
  INDEX idx_department_id (department_id),
  INDEX idx_status (status),
  INDEX idx_worker_id (assigned_worker_id),
  INDEX idx_created_at (created_at)
);
```

#### Shifts Table
```sql
CREATE TABLE shifts (
  id VARCHAR(50) PRIMARY KEY,
  worker_id VARCHAR(50) NOT NULL,
  shift_date DATE NOT NULL,
  shift_type ENUM('morning', 'evening', 'night', 'off') DEFAULT 'morning',
  start_time TIME,
  end_time TIME,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (worker_id) REFERENCES workers(id),
  UNIQUE KEY unique_worker_date (worker_id, shift_date),
  INDEX idx_shift_date (shift_date),
  INDEX idx_worker_id (worker_id)
);
```

#### Departments Table
```sql
CREATE TABLE departments (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  manager_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code)
);
```

#### Sample Department Data
```sql
INSERT INTO departments (id, name, code, description) VALUES
('D-001', 'Electrical Department', 'electrical', 'Handles electrical infrastructure'),
('D-002', 'Plumbing Department', 'plumbing', 'Handles water supply and plumbing'),
('D-003', 'IT/WiFi Department', 'it', 'Handles network and WiFi services'),
('D-004', 'Sanitation Department', 'sanitation', 'Handles waste and cleaning'),
('D-005', 'AC Department', 'ac', 'Handles HVAC systems'),
('D-006', 'Construction Department', 'construction', 'Handles construction and repairs');
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    // Additional debugging info (include in dev, exclude in prod)
  },
  "timestamp": "2026-04-17T10:30:45.123Z"
}
```

### Common Error Codes
| Error Code | HTTP Code | Cause | Solution |
|-----------|-----------|-------|----------|
| `INVALID_CREDENTIALS` | 401 | Wrong email/password/department | Check login credentials |
| `UNAUTHORIZED` | 401 | No token or invalid token | Provide valid auth token |
| `TOKEN_EXPIRED` | 401 | Token has expired | Refresh token |
| `FORBIDDEN` | 403 | User lacks permission | Admin access required |
| `NOT_FOUND` | 404 | Resource doesn't exist | Check ID/parameters |
| `DUPLICATE_ENTRY` | 409 | Email/unique field already exists | Use unique value |
| `VALIDATION_ERROR` | 400 | Invalid input data | Fix validation errors |
| `INVALID_DEPARTMENT` | 400 | Department code invalid | Use valid department code |
| `DATABASE_ERROR` | 500 | Database operation failed | Contact support |
| `SERVER_ERROR` | 500 | Unhandled server error | Contact support |

### Validation Errors (Details Example)
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters",
    "department": "Department must be one of: electrical, plumbing, it, sanitation, ac, construction"
  }
}
```

---

## Validation Rules

### Email Validation
```
Pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
Min Length: 5
Max Length: 255
Must be unique in users table
```

### Password Validation
```
Min Length: 6 characters
Recommended: At least 8 characters with mixed case
Should contain: Letters, numbers (recommended)
Cannot be: Same as old password (on change)
```

### Department Validation
```
Valid values: electrical, plumbing, it, sanitation, ac, construction
Case-insensitive (normalize to lowercase)
Must match existing department in database
```

### Phone Number Validation
```
Format: 10 digits
Pattern: ^[0-9]{10}$
Example: 9876543210
```

### Complaint Fields Validation
```
Title: 5-100 characters, non-empty
Description: 10-1000 characters, non-empty
Location: 5-200 characters, non-empty
Priority: low|medium|high
Status: pending|in-progress|resolved
Votes: Non-negative integer
```

### Worker Fields Validation
```
Name: 3-100 characters
Email: Valid email format, unique
Contact: 10 digits
Type: Non-empty string
Experience: Non-negative integer
Shift: morning|evening|night
```

---

## Security

### Authentication & Authorization

1. **Password Storage**
   - Hash passwords using bcrypt (salt rounds: 10)
   - Never store plain text passwords
   - Compare using bcrypt.compare()

2. **JWT Tokens**
   - Sign with HS256 algorithm
   - Include: userId, email, department, iat, exp
   - Secret: Minimum 32 characters (from env variable)
   - Expiry: 7 days
   - Refresh token: 30 days

3. **Authorization Levels**
   ```
   Level 1: Public (no auth required)
   - GET /api/complaints/[id]/vote
   - POST /api/complaints (vote only)
   
   Level 2: Authenticated (token required)
   - Most endpoints
   - GET /api/dashboard/*
   - GET /api/workers
   - GET /api/shifts
   
   Level 3: Admin Only
   - POST/PUT/DELETE /api/workers
   - POST/PUT/DELETE /api/complaints
   - PUT /api/shifts
   - POST /api/shifts
   ```

4. **Role-Based Access Control (RBAC)**
   ```javascript
   // Middleware example
   async function adminOnly(req, res, next) {
     const user = req.user;
     if (user.role !== 'admin') {
       return res.status(403).json({ 
         error: 'FORBIDDEN',
         message: 'Admin access required'
       });
     }
     next();
   }
   ```

### CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting
```javascript
// Example: 100 requests per 15 minutes per IP
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
```

### Input Validation & Sanitization
```javascript
// Sanitize all inputs
const { body, validationResult } = require('express-validator');

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('department').toLowerCase()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

### SQL Injection Prevention
```javascript
// Use parameterized queries (prepared statements)
// GOOD: Use parameterized query
const query = 'SELECT * FROM users WHERE email = ?';
pool.query(query, [email], callback);

// BAD: String concatenation (VULNERABLE)
const query = `SELECT * FROM users WHERE email = '${email}'`;
pool.query(query, callback);
```

### HTTPS/TLS
- All production traffic must use HTTPS
- Use valid SSL/TLS certificates
- Enforce HSTS headers

### API Key (if needed for public services)
```
X-API-Key: {api-key}
Rate limits per key: 1000 requests/day
Store keys hashed in database
Rotate keys regularly
```

---

## Validation Rules Summary

### Frontend Data Flow
```
User Input 
  ↓
Frontend Validation (Form validation)
  ↓
API Request
  ↓
Backend Validation (Server-side checks)
  ↓
Database Insert/Update
  ↓
Response to Frontend
```

### Key Validation Checkpoints

1. **Email Validation**
   - Frontend: Pattern matching
   - Backend: Regex + uniqueness check

2. **Department Validation**
   - Frontend: Dropdown selection
   - Backend: Verify department exists

3. **Password Validation**
   - Frontend: Length check
   - Backend: Length check + salt/hash

4. **Complaint Data**
   - Frontend: Length limits, required fields
   - Backend: Full validation + sanitization

5. **Worker Assignment**
   - Frontend: Dropdown selection
   - Backend: Verify worker exists + department match

---

## Testing Checklist

### Unit Tests
- [ ] All authentication endpoints
- [ ] All validation functions
- [ ] Database queries
- [ ] JWT token generation/verification

### Integration Tests
- [ ] Login → Get User flow
- [ ] Create Complaint → Assign Worker flow
- [ ] Get Dashboard Stats flow
- [ ] Update Shift → Get Schedule flow

### End-to-End Tests (Frontend + Backend)
- [ ] Complete login flow
- [ ] Dashboard data loading
- [ ] Complaint creation and updates
- [ ] Worker assignment
- [ ] Shift scheduling

### Security Tests
- [ ] SQL injection attempts
- [ ] Invalid token handling
- [ ] Unauthorized access attempts
- [ ] CORS validation
- [ ] Rate limiting

### Performance Tests
- [ ] Dashboard load time < 2 seconds
- [ ] Large complaints list pagination
- [ ] Worker list filtering performance
- [ ] Concurrent requests handling

### API Documentation Tests
- [ ] All endpoints return documented format
- [ ] All error codes match documentation
- [ ] All field names match mapping
- [ ] Pagination works correctly

---

## Frontend-Backend Integration Points

### API Call Locations in Frontend

```javascript
// src/api/auth.js
- POST /api/auth/login → loginUser()
- GET /api/auth/me → getUser()

// src/api/dashboardApi.js
- GET /api/dashboard/stats → getStats()
- GET /api/dashboard/complaints → getComplaints()

// src/api/workerApi.js
- GET /api/workers → fetchWorkers()

// src/pages/Complaints.jsx
- GET /api/complaints → fetch complaints list

// src/pages/Shift.jsx
- GET /api/shifts → fetch schedule
- PUT /api/shifts/:id → update shifts

// src/pages/Profile.jsx
- GET /api/profile → user profile
- PUT /api/profile → update profile
```

### Environment Variables for Frontend
```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
```

### Feature Flags
```javascript
// src/api/auth.js - Change to false when backend ready
const USE_MOCK = false;

// This controls whether frontend uses mock data or real backend
```

---

## Deployment Checklist

- [ ] Environment variables configured (.env file)
- [ ] Database migrations applied
- [ ] JWT secret generated (min 32 chars)
- [ ] CORS origins configured
- [ ] Rate limiting enabled
- [ ] Error logging setup
- [ ] Authentication middleware tested
- [ ] All endpoints tested with Postman/Insomnia
- [ ] Frontend USE_MOCK flag set to false
- [ ] HTTPS/SSL configured
- [ ] Backup strategy in place
- [ ] Monitoring/alerting setup

---

## Important Notes for Consistency

1. **Field Naming Conventions**
   - Database: snake_case (user_id, created_at)
   - API Response: camelCase (userId, createdAt)
   - Frontend: camelCase throughout

2. **Status Values**
   - Always lowercase (pending, in-progress, resolved)
   - Valid only: pending, in-progress, resolved, completed, off-day

3. **Department Codes**
   - Always lowercase
   - Valid only: electrical, plumbing, it, sanitation, ac, construction
   - Normalize all department inputs to lowercase

4. **Timestamps**
   - ISO 8601 format (2026-04-17T10:30:45.123Z)
   - All times in UTC
   - Include milliseconds

5. **Shift Types**
   - Valid only: morning (08:00-16:00), evening (16:00-00:00), night (00:00-08:00), off
   - No custom shift types

6. **Pagination**
   - Default limit: 20
   - Max limit: 100
   - Always include total count

7. **Error Handling**
   - Always return error in documented format
   - Include timestamp in all responses
   - Log errors for debugging

8. **Authentication**
   - Token in Authorization header: "Bearer {token}"
   - Validate token in all protected endpoints
   - Return 401 for invalid/missing tokens

9. **Database Constraints**
   - Email must be unique
   - Department codes must be lowercase
   - IDs should be prefixed (USR-, W-, CMP-, SFT-, D-)

10. **Response Consistency**
    - All responses have 'success' field
    - All responses have 'message' field
    - All responses have 'timestamp' field
    - Data wrapped in 'data' object (for success) or error details (for failure)

---

## Support & Questions

For questions or clarifications:
1. Review the relevant section in this document
2. Check frontend code in `src/api/` and `src/pages/`
3. Reference the mock data in `src/mock/` and `src/data/`
4. Contact project lead

---

**Document Version:** 1.0  
**Last Updated:** April 17, 2026  
**Status:** Ready for Backend Development  
**Prepared by:** Admin Panel Development Team
