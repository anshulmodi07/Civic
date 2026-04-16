# CivicMitra API Specification

## Overview
This document defines the API contract between frontend (React Native + Expo) and backend (Node.js + Express + MongoDB).
The frontend currently uses **demo mode** for development. All endpoints are designed to work seamlessly when backend is ready.

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Complaint APIs](#complaint-apis)
3. [Task APIs](#task-apis)
4. [Data Models](#data-models)
5. [Demo Data](#demo-data)
6. [Status Mappings](#status-mappings)

---

## Authentication APIs

### Login
**Endpoint:** `POST /auth/login`

**Frontend Call:**
```javascript
await api.post("/auth/login", { email, password });
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "citizen" // or "worker", "admin"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "userId": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "citizen",
    "department": "electricity" // for workers/admins
  }
}
```

---

### Get Current User
**Endpoint:** `GET /auth/me`

**Frontend Call:**
```javascript
await api.get("/auth/me");
```

**Response:**
```json
{
  "userId": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "citizen",
  "department": "electricity"
}
```

---

## Complaint APIs

### Create Complaint
**Endpoint:** `POST /complaints`

**Frontend Call:**
```javascript
const formPayload = new FormData();
formPayload.append("type", "hostel"); // or "campus"
formPayload.append("hostelName", "hostel_a"); // if type=hostel
formPayload.append("floor", "3"); // if type=hostel
formPayload.append("roomNumber", "302"); // if type=hostel
formPayload.append("locationLandmark", "Main Gate"); // if type=campus
formPayload.append("locationAddress", "Address details"); // if type=campus
formPayload.append("issueType", "electrician");
formPayload.append("description", "Issue description");
formPayload.append("location", JSON.stringify({ lat: 28.7450, lng: 77.1120 }));
formPayload.append("images", file1); // Can append multiple images

await api.post("/complaints", formPayload, {
  headers: { "Content-Type": "multipart/form-data" }
});
```

**Backend Handler:**
```javascript
exports.createComplaint = async (req, res) => {
  const { description, issueType, location, images } = req.body;
  const complaint = await Complaint.create({
    citizenId: req.user.userId,
    description,
    issueType,
    location,
    images,
    status: "new", // Initial status
    priority: "medium"
  });
  res.status(201).json(complaint);
};
```

**Response:**
```json
{
  "_id": "complaint_id",
  "citizenId": "user_id",
  "description": "Issue description",
  "issueType": "electrician",
  "priority": "medium",
  "location": { "lat": 28.7450, "lng": 77.1120 },
  "images": ["url1", "url2"],
  "supporters": [],
  "comments": [],
  "status": "new",
  "assignedTaskId": null,
  "createdAt": "2026-04-16T10:30:00Z",
  "updatedAt": "2026-04-16T10:30:00Z"
}
```

---

### Get All Complaints
**Endpoint:** `GET /complaints?status=pending&type=hostel&issueType=electrician`

**Frontend Call:**
```javascript
await api.get("/complaints", { 
  params: { status: "pending", type: "hostel", issueType: "electrician" } 
});
```

**Response:**
```json
[
  {
    "_id": "c001",
    "citizenId": "user_demo",
    "description": "Ceiling fan not working",
    "issueType": "electrician",
    "priority": "medium",
    "status": "in-progress",
    "location": { "lat": 28.7450, "lng": 77.1120 },
    "supporters": ["user_id_1", "user_id_2"],
    "comments": [],
    "images": [],
    "assignedTaskId": "task_id",
    "createdAt": "2026-04-11T10:30:00Z",
    "updatedAt": "2026-04-14T12:00:00Z"
  }
]
```

---

### Get My Complaints (Citizen)
**Endpoint:** `GET /complaints/my`

**Frontend Call:**
```javascript
await api.get("/complaints/my");
```

**Response:** Same as Get All Complaints but filtered to `citizenId === req.user.userId`

---

### Get Complaint by ID
**Endpoint:** `GET /complaints/:id`

**Frontend Call:**
```javascript
await api.get(`/complaints/${complaintId}`);
```

**Response:** Single complaint object (same structure as above)

---

### Support Complaint (Upvote)
**Endpoint:** `POST /complaints/:id/support`

**Frontend Call:**
```javascript
await api.post(`/complaints/${complaintId}/support`);
```

**Backend Logic:**
- Add `req.user.userId` to `supporters` array if not already present
- If already present, remove from array (toggle behavior)

**Response:**
```json
{
  "supporters": ["user_id_1", "user_id_2", "user_id_3"],
  "message": "Complaint supported"
}
```

**Frontend Conversion:**
```javascript
// Demo mode returns { upvotes, upvoted }, but backend returns { supporters }
// Frontend toggleUpvote() adapts this:
const result = await api.post(`/complaints/${complaintId}/support`);
return {
  upvotes: result.data.supporters?.length ?? 0,
  upvoted: true
};
```

---

### Add Comment
**Endpoint:** `POST /complaints/:id/comments`

**Frontend Call:**
```javascript
await api.post(`/complaints/${complaintId}/comments`, { text: "Comment text" });
```

**Request:**
```json
{
  "text": "Comment text"
}
```

**Response:**
```json
{
  "commentId": "comment_id",
  "userId": "user_id",
  "text": "Comment text",
  "createdAt": "2026-04-16T10:30:00Z"
}
```

---

### Get Comments
**Endpoint:** `GET /complaints/:id/comments`

**Response:**
```json
[
  {
    "userId": "user_id",
    "userName": "User Name",
    "text": "Comment text",
    "createdAt": "2026-04-16T10:30:00Z"
  }
]
```

---

### Update Complaint Status (Admin/Staff)
**Endpoint:** `PATCH /complaints/:id/status`

**Request:**
```json
{
  "status": "assigned"  // new, assigned, in-progress, closed
}
```

**Response:**
```json
{
  "_id": "complaint_id",
  "status": "assigned",
  "updatedAt": "2026-04-16T10:30:00Z"
}
```

---

### Get Nearby Complaints
**Endpoint:** `GET /complaints/nearby?lat=28.7450&lng=77.1120&radiusKm=5`

**Frontend Call:**
```javascript
await api.get("/complaints/nearby", { 
  params: { lat, lng, radiusKm: 5 } 
});
```

**Response:** Array of complaints within specified radius

---

## Task APIs

### Get Available Tasks (Worker)
**Endpoint:** `GET /tasks/available`

**Frontend Call:**
```javascript
await api.get("/tasks/available");
```

**Response:**
```json
[
  {
    "_id": "task_id",
    "complaintId": "complaint_id",
    "issueType": "electrician",
    "description": "Ceiling fan not working",
    "location": { "lat": 28.7450, "lng": 77.1120 },
    "status": "assigned",
    "assignedAt": "2026-04-16T09:00:00Z"
  }
]
```

---

### Get My Tasks (Worker)
**Endpoint:** `GET /tasks/my`

**Frontend Call:**
```javascript
await api.get("/tasks/my");
```

**Response:** Tasks for current worker with `workerId === req.user.userId`

---

### Accept Task
**Endpoint:** `PATCH /tasks/:id/accept`

**Frontend Call:**
```javascript
await api.patch(`/tasks/${taskId}/accept`);
```

**Backend Logic:**
- Update task status to `accepted`
- Set `acceptedAt` timestamp
- Can only accept if current status is `assigned`

**Response:**
```json
{
  "status": "accepted",
  "acceptedAt": "2026-04-16T10:30:00Z"
}
```

---

### Start Task
**Endpoint:** `PATCH /tasks/:id/start`

**Frontend Call:**
```javascript
await api.patch(`/tasks/${taskId}/start`);
```

**Backend Logic:**
- Update task status to `in-progress`
- Set `startedAt` timestamp
- Update corresponding complaint status to `in-progress`

**Response:**
```json
{
  "status": "in-progress",
  "startedAt": "2026-04-16T10:45:00Z"
}
```

---

### Complete Task
**Endpoint:** `PATCH /tasks/:id/complete`

**Frontend Call:**
```javascript
const formData = new FormData();
formData.append("proofImages", image1);
formData.append("proofImages", image2);
formData.append("notes", "Work completed successfully");

await api.patch(`/tasks/${taskId}/complete`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
```

**Request:**
```json
{
  "proofImages": ["url1", "url2"],
  "notes": "Work completed successfully"
}
```

**Backend Logic:**
- Update task status to `resolved`
- Set `completedAt` timestamp
- Update corresponding complaint status to `closed`

**Response:**
```json
{
  "status": "resolved",
  "completedAt": "2026-04-16T15:30:00Z"
}
```

---

### Assign Task (Admin)
**Endpoint:** `POST /tasks`

**Request:**
```json
{
  "complaintId": "complaint_id",
  "workerId": "worker_id"
}
```

**Response:**
```json
{
  "_id": "task_id",
  "complaintId": "complaint_id",
  "workerId": "worker_id",
  "status": "assigned",
  "assignedAt": "2026-04-16T10:30:00Z"
}
```

---

## Data Models

### Complaint Schema
```javascript
const ComplaintSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Location Type
  type: {
    type: String,
    enum: ["hostel", "campus"],
    required: true
  },
  
  // Hostel-specific fields
  hostelName: String,
  floor: String,
  roomNumber: String,
  
  // Campus-specific fields
  locationLandmark: String,
  locationAddress: String,
  
  // Complaint details
  description: {
    type: String,
    required: true
  },
  issueType: {
    type: String,
    enum: ["water", "electricity", "road", "sanitation"],
    required: true
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  
  // Location coordinates
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  
  // Media & feedback
  images: [String],
  supporters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  
  // Status & assignment
  status: {
    type: String,
    enum: ["new", "assigned", "in-progress", "closed"],
    default: "new"
  },
  assignedTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },
  
  timestamps: true
});
```

### Task Schema
```javascript
const TaskSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["assigned", "accepted", "in-progress", "resolved"],
    default: "assigned"
  },
  proofImages: [String],
  notes: String,
  
  // Timestamps
  assignedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  
  timestamps: true
});
```

---

## Demo Data

### Demo Complaints
```javascript
const DEMO_COMPLAINTS = [
  {
    _id: "c001",
    type: "hostel",
    citizenId: "user_demo",
    hostelName: "hostel_a",
    floor: "3",
    roomNumber: "302",
    issueType: "electrician",
    priority: "medium",
    description: "Ceiling fan not working and one electrical socket is damaged in room.",
    status: "in-progress",
    createdAt: "2026-04-11T10:30:00Z",
    updatedAt: "2026-04-14T12:00:00Z",
    location: { lat: 28.7450, lng: 77.1120 },
    supporters: ["user_demo"],
    upvotes: 6,
    comments: [],
    images: [],
    assignedTaskId: null
  }
  // ... more demo complaints
];
```

### Demo Tasks
```javascript
const DEMO_TASKS = [
  {
    _id: "t001",
    complaintId: "c002",
    workerId: "worker_demo",
    status: "pending",
    assignedAt: "2026-04-16T09:00:00Z",
    acceptedAt: null,
    startedAt: null,
    completedAt: null,
    proofImages: [],
    notes: null
  }
  // ... more demo tasks
];
```

---

## Status Mappings

### Complaint Status Flow
```
new (pending in frontend)
  ↓
assigned
  ↓
in-progress
  ↓
closed
```

**Frontend Status Normalization:**
- API uses `new`, frontend UI displays as `pending`
- `statusMatches(actual, filter)` helper handles comparison
- Example: `statusMatches("new", "pending")` returns `true`

### Task Status Flow
```
assigned (pending in UI)
  ↓
accepted
  ↓
in-progress
  ↓
resolved (completed)
```

---

## Error Handling

All endpoints should return error responses in this format:
```json
{
  "status": 400,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Request Headers

All requests should include:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json (or multipart/form-data for file uploads)
```

---

## Rate Limiting (Future)

Recommended rate limits:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

## Versioning

Current API Version: **v1** (implied)

Future versions may use `/api/v2/`, `/api/v3/`, etc.

---

## Environment Configuration

**Frontend**: Set `EXPO_PUBLIC_USE_DEMO_API=false` to switch to backend

**Development:**
```
EXPO_PUBLIC_USE_DEMO_API=true
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

**Production:**
```
EXPO_PUBLIC_USE_DEMO_API=false
EXPO_PUBLIC_API_BASE_URL=https://api.civicmitra.com
```

---

## Testing with Postman/cURL

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","role":"citizen"}'
```

### Create Complaint
```bash
curl -X POST http://localhost:5000/complaints \
  -H "Authorization: Bearer {token}" \
  -F "type=hostel" \
  -F "hostelName=hostel_a" \
  -F "issueType=electrician" \
  -F "description=Ceiling fan not working" \
  -F "location={\"lat\":28.7450,\"lng\":77.1120}" \
  -F "images=@/path/to/image.jpg"
```

### Support Complaint
```bash
curl -X POST http://localhost:5000/complaints/c001/support \
  -H "Authorization: Bearer {token}"
```

