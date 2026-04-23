# 📋 Backend Schema & Auth - Quick Reference Guide

**Version:** 1.0  
**Last Updated:** April 22, 2026

---

## 🎯 At a Glance

### 3 User Roles

| Role | Login Method | Model | Collection |
|------|--------------|-------|-----------|
| **User** (Client) | Google OAuth | User.js | users |
| **Worker** | Email + Password | worker.js | workers |
| **Admin** | Email + Password | admin.js | admins |

### 8 Core Collections

```
1. users (Citizens/Clients)
2. workers (Maintenance staff)
3. admins (System admins)
4. departments (Categories: wifi, plumber, civil, electrician, carpenter)
5. complaints (Grievances/Issues)
6. tasks (Work assignments)
7. shifthistories (Worker schedules)
8. interactions (Comments & upvotes)
```

---

## 📊 Data Model Cheat Sheet

### User (Client)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),  // Must be @nitdelhi.ac.in
  createdAt: Date,
  updatedAt: Date
}
```
**Login:** Google OAuth only

---

### Worker
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  departmentId: ObjectId,
  dateOfJoining: Date,
  position: String,
  phoneNumber: String,
  totalTasks: Number,
  remainingTasks: Number,
  currentShift: "morning" | "evening" | "night" | "off",
  createdAt: Date,
  updatedAt: Date
}
```
**Login:** Email + Password

---

### Admin
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  departmentId: ObjectId (optional),
  createdAt: Date,
  updatedAt: Date
}
```
**Login:** Email + Password

---

### Department
```javascript
{
  _id: ObjectId,
  name: "wifi" | "plumber" | "civil" | "electrician" | "carpenter",
  createdAt: Date,
  updatedAt: Date
}
```
**Enum:** 5 fixed departments

---

### Complaint (Main Entity)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: "hostel" | "campus",
  
  // Hostel-specific
  hostelName: String,
  floor: String,
  visibility: "public" | "private",
  roomNumber: String (if private),
  landmark: String (if public),
  
  // Campus-specific
  area: String,
  locationAddress: String,
  
  // Common
  description: String (20-500 chars),
  departmentId: ObjectId,
  priority: "low" | "medium" | "high",
  status: "new" | "assigned" | "in-progress" | "closed",
  
  // Location
  location: { lat: Number, lng: Number },
  coordinates: { type: "Point", coordinates: [lng, lat] },
  
  // Media & Community
  images: [String],
  supporters: [ObjectId],
  comments: [{ userId, text, createdAt }],
  
  // Assignment
  assignedTaskId: ObjectId,
  assignedWorkerId: ObjectId,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

### Task
```javascript
{
  _id: ObjectId,
  complaintId: ObjectId (unique),
  workerId: ObjectId,
  status: "accepted" | "in-progress" | "completed" | "incompleted",
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  proofImages: [String],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

### ShiftHistory
```javascript
{
  _id: ObjectId,
  workerId: ObjectId,
  date: Date,
  shift: "morning" | "evening" | "night" | "off",
  createdAt: Date,
  updatedAt: Date
}
```
**Constraint:** Unique (workerId, date)

---

### Interaction
```javascript
{
  _id: ObjectId,
  complaintId: ObjectId,
  userId: ObjectId,
  type: "upvote" | "comment",
  commentText: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Quick Start

### 1. User Login (Google OAuth)
```bash
POST /auth/google-login
{
  "token": "<google_id_token>"
}

Response:
{
  "token": "jwt_token_here",
  "user": { _id, name, email }
}
```

### 2. Worker Login
```bash
POST /auth/worker/login
{
  "email": "worker@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "worker": { id, name, email }
}
```

### 3. Admin Login
```bash
POST /auth/admin/login
{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "admin": { id, name, email }
}
```

---

## 🎫 JWT Token Details

### Token Format
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Iiwicm9sZSI6IndvcmtlciJ9.signature
```

### Token Payload
```javascript
{
  id: "507f1f77bcf86cd799439011",    // User/Worker/Admin ID
  role: "user" | "worker" | "admin",  // User role
  iat: 1234567890,                   // Issued at
  exp: 1234654290                    // Expires at (7 days)
}
```

### Token Expiration
- **Duration:** 7 days
- **After expiry:** User must login again
- **Format:** Bearer token in Authorization header

### Using Token in Requests
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 👥 Permissions Matrix

| Feature | User | Worker | Admin |
|---------|------|--------|-------|
| Create Complaint | ✅ | ❌ | ❌ |
| View Own Complaints | ✅ | ❌ | ❌ |
| View All Complaints | ❌ | ❌ | ✅ |
| View Assigned Tasks | ❌ | ✅ | ❌ |
| Accept/Complete Task | ❌ | ✅ | ❌ |
| Assign Worker | ❌ | ❌ | ✅ |
| Manage Shifts | ❌ | ❌ | ✅ |
| Upvote/Comment | ✅ | ❌ | ❌ |

---

## 🔌 API Endpoints Reference

### Auth Routes

```
POST /auth/google-login          → User login
POST /auth/worker/login          → Worker login
POST /auth/admin/login           → Admin login
```

### Key Points
- No authentication required for auth endpoints
- Token received in response
- Token valid for 7 days
- Always include token in subsequent requests

---

## 🔒 Security Features

### Password Storage
- **Algorithm:** bcryptjs
- **Salt Rounds:** 10
- **Method:** One-way hashing (irreversible)
- **Protection:** Prevents rainbow table attacks

### JWT Token
- **Secret Key:** 32+ character random string
- **Algorithm:** HS256 (symmetric)
- **Expiration:** 7 days
- **Storage:** In Authorization header

### Google OAuth
- **Verification:** With Google servers
- **Domain Restriction:** @nitdelhi.ac.in only
- **Automatic Account Creation:** On first login
- **No Password Management:** OAuth handles auth

### Authorization
- **Two-level:** Auth (token validity) + Role (permissions)
- **Middleware:** authMiddleware + roleMiddleware
- **Response:** 403 if role not allowed

---

## 📁 Files Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js              ← User schema
│   │   ├── worker.js            ← Worker schema
│   │   ├── admin.js             ← Admin schema
│   │   ├── Complaint.js         ← Complaint schema
│   │   ├── Task.js              ← Task schema
│   │   ├── Department.js        ← Department schema
│   │   ├── shift.js             ← ShiftHistory schema
│   │   └── interaction.js       ← Interaction schema
│   ├── routes/
│   │   └── auth.routes.js       ← Auth endpoints
│   ├── controllers/
│   │   └── auth.controller.js   ← Auth logic
│   ├── middleware/
│   │   ├── auth.middleware.js   ← JWT verification
│   │   └── role.middleware.js   ← Role checking
│   └── utils/
│       └── jwt.js               ← Token generation
├── server.js                     ← App entry
└── package.json
```

---

## 🔧 Environment Variables

```bash
# Required
MONGO_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=long_random_secret_key_min_32_chars
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Optional
NODE_ENV=development
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

---

## ⚙️ Middleware Flow

```
Request
  ↓
CORS & JSON parsing
  ↓
Route Handler
  ↓
[Protected Routes]
  ├─ authMiddleware (verify JWT)
  ├─ roleMiddleware (check permission)
  └─ Controller
  ↓
Response
```

---

## 📝 Model Indexes

### For Better Performance
```javascript
// Complaint
db.complaints.createIndex({ "userId": 1 })
db.complaints.createIndex({ "departmentId": 1 })
db.complaints.createIndex({ "status": 1 })
db.complaints.createIndex({ "coordinates": "2dsphere" })

// Worker
db.workers.createIndex({ "departmentId": 1 })

// Task
db.tasks.createIndex({ "workerId": 1 })
db.tasks.createIndex({ "status": 1 })

// ShiftHistory
db.shifthistories.createIndex({ "workerId": 1, "date": 1 }, { unique: true })
```

---

## 🚀 Status Lifecycle

### Complaint Status Flow
```
new → assigned → in-progress → closed
```

### Task Status Flow
```
accepted → in-progress → completed
                      ↘
                    incompleted (rejected)
```

---

## 🧪 Testing Commands

### Test User Login (Google)
```bash
curl -X POST http://localhost:5000/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{"token":"<google_id_token>"}'
```

### Test Worker Login
```bash
curl -X POST http://localhost:5000/auth/worker/login \
  -H "Content-Type: application/json" \
  -d '{"email":"worker@test.com","password":"pass123"}'
```

### Test Protected Route (Example)
```bash
curl http://localhost:5000/api/complaints \
  -H "Authorization: Bearer <token>"
```

---

## 🔄 User Creation

### User (Client) - Auto-Created
- Created automatically on first Google login
- No admin action needed
- Email must end with @nitdelhi.ac.in

### Worker - Admin Creates
```javascript
// Admin or backend admin endpoint
const worker = await Worker.create({
  name: "John Worker",
  email: "john@example.com",
  password: bcrypt.hash("password123", 10),
  departmentId: "507f1f77bcf86cd799439011"
});
```

### Admin - Manual Creation
```javascript
const admin = await Admin.create({
  name: "Admin User",
  email: "admin@example.com",
  password: bcrypt.hash("password123", 10),
  departmentId: "507f1f77bcf86cd799439011"  // Optional
});
```

---

## 🐛 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `No token provided` | Missing Authorization header | Add token to header |
| `Invalid token` | Token expired or tampered | Login again |
| `Access denied` | Wrong role | Check user permissions |
| `Worker not found` | Email doesn't exist | Use correct email |
| `Invalid credentials` | Wrong password | Check password |
| `Only NIT Delhi users allowed` | Email not @nitdelhi.ac.in | Use NIT Delhi email |

---

## 📊 Relationships Summary

```
User
 ├─→ Complaint (1 to many)
 └─→ Interaction (1 to many)

Worker
 ├─→ Department (N to 1)
 ├─→ Task (1 to many)
 └─→ ShiftHistory (1 to many)

Department
 ├─→ Worker (1 to many)
 ├─→ Complaint (1 to many)
 └─→ Admin (1 to many)

Complaint
 ├─→ User (N to 1)
 ├─→ Department (N to 1)
 ├─→ Task (1 to 1)
 ├─→ Worker (optional)
 └─→ Interaction (1 to many)

Task
 ├─→ Complaint (N to 1)
 └─→ Worker (N to 1)

ShiftHistory
 └─→ Worker (N to 1)

Interaction
 ├─→ Complaint (N to 1)
 └─→ User (N to 1)
```

---

## 🔑 Key Points to Remember

1. **Three Auth Methods:** Google (User), Password (Worker/Admin)
2. **JWT Tokens:** Valid for 7 days, included in Authorization header
3. **Roles:** user, worker, admin (enforced via middleware)
4. **Passwords:** Always hashed with bcrypt, never stored plain
5. **Indexes:** On foreign keys for query performance
6. **Enums:** Use for status, role, shift values
7. **Unique Fields:** email in User/Worker/Admin
8. **Timestamps:** All models have createdAt/updatedAt

---

## ✅ Setup Checklist

- [ ] Node.js v16+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] .env file created with all variables
- [ ] `npm install` completed
- [ ] Departments seed data inserted
- [ ] Server starts without errors
- [ ] Can login and get token
- [ ] Token valid for protected routes

---

## 📞 Quick Reference

| Task | Where |
|------|-------|
| User Model | `src/models/User.js` |
| Worker Model | `src/models/worker.js` |
| Auth Controller | `src/controllers/auth.controller.js` |
| Auth Middleware | `src/middleware/auth.middleware.js` |
| Role Middleware | `src/middleware/role.middleware.js` |
| Token Generation | `src/utils/jwt.js` |
| Auth Routes | `src/routes/auth.routes.js` |
| Server Config | `server.js` |
| Environment Config | `.env` |

---

**Created:** April 22, 2026  
**Last Updated:** April 22, 2026  
**Version:** 1.0
