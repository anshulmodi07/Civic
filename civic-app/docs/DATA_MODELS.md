# CivicMitra Data Model Relationships

## Overview
This document explains how data models relate to each other and how workflows flow through the system.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                          USER                               │
│                                                              │
│  • userId (ObjectId)      [PK]                             │
│  • name, email, role                                        │
│  • department (worker/admin only)                           │
└─────────┬──────────────────────────────────────────────────┘
          │
          │ userId
          ├──────────────────────────────┐
          │                              │
          │                              │
          ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│    COMPLAINT         │      │       TASK           │
│                      │      │                      │
│ • complaintId [PK]   │      │ • taskId [PK]       │
│ • citizenId [FK→User]│      │ • workerId [FK→User]│
│ • issueType          │◄─────┤ • complaintId [FK]  │
│ • location           │      │ • status            │
│ • supporters []      │      │ • assignedAt        │
│ • comments []        │      │ • acceptedAt        │
│ • status             │      │ • startedAt         │
│ • assignedTaskId ────┼─────►│ • completedAt       │
│                      │      │                      │
└──────────────────────┘      └──────────────────────┘
```

---

## User Model

### Roles
- **citizen**: Creates complaints, supports complaints, views task progress
- **worker**: Accepts and completes tasks assigned to them
- **admin**: Manages assignments, views analytics, escalates issues

### Key Fields
```javascript
{
  userId: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: "citizen" | "worker" | "admin",
  department: String, // for workers/admins: "water", "electricity", "road", "sanitation"
  avatar: String,
  verified: Boolean,
  createdAt: Date
}
```

### Relationships
- **← Complaint.citizenId**: User created these complaints
- **← Complaint.supporters[]**: User supported these complaints
- **← Complaint.comments[].userId**: User commented on these complaints
- **← Task.workerId**: User assigned these tasks
- **← AuditLog.userId**: User actions logged

---

## Complaint Model

### Workflow States
```
new (citizen creates)
  ↓
assigned (admin assigns task)
  ↓
in-progress (worker starts task)
  ↓
closed (worker completes task)
```

### Key Fields
```javascript
{
  complaintId: ObjectId,
  
  // Creator
  citizenId: ObjectId → User,
  
  // Location
  type: "hostel" | "campus",
  
  // Hostel Fields
  hostelName: String,
  floor: String,
  roomNumber: String,
  
  // Campus Fields
  locationLandmark: String,
  locationAddress: String,
  
  // Issue Details
  issueType: "water" | "electricity" | "road" | "sanitation",
  priority: "low" | "medium" | "high",
  description: String,
  
  // Geolocation
  location: { lat: Number, lng: Number },
  
  // Community Engagement
  supporters: ObjectId[] → User,
  comments: [{
    userId: ObjectId → User,
    text: String,
    createdAt: Date
  }],
  
  // Media
  images: String[] (URLs),
  
  // Status
  status: "new" | "assigned" | "in-progress" | "closed",
  
  // Task Assignment
  assignedTaskId: ObjectId → Task,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Relationships
- **→ User (citizenId)**: Who reported this complaint
- **→ User[] (supporters)**: Who upvoted this complaint
- **→ User[] (comments[].userId)**: Who commented on this complaint
- **→ Task (assignedTaskId)**: Task assigned to resolve this complaint
- **← Task (complaintId)**: Inverse of above

### Key Behaviors
- **Create**: Citizen reports issue → Status = "new"
- **Upvote**: Supporter added/removed from `supporters[]`
- **Comment**: New entry added to `comments[]`
- **Assign Task**: Admin → Set `assignedTaskId` → Set `status = "assigned"`
- **Update Status**: Tied to task status changes

---

## Task Model

### Workflow States
```
assigned (admin assigns worker)
  ↓
accepted (worker accepts task)
  ↓
in-progress (worker starts work)
  ↓
resolved (worker marks complete)
```

### Key Fields
```javascript
{
  taskId: ObjectId,
  
  // References
  complaintId: ObjectId → Complaint,
  workerId: ObjectId → User,
  
  // Status & Progress
  status: "assigned" | "accepted" | "in-progress" | "resolved",
  
  // Work Product
  proofImages: String[] (URLs),
  notes: String,
  
  // Timeline
  assignedAt: Date (when admin creates task),
  acceptedAt: Date (when worker clicks "Accept"),
  startedAt: Date (when worker clicks "Start"),
  completedAt: Date (when worker clicks "Complete"),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Relationships
- **→ Complaint (complaintId)**: The complaint being resolved
- **→ User (workerId)**: The worker assigned to this task
- **← Complaint (assignedTaskId)**: Inverse relationship

### Key Behaviors
- **Create**: Admin → Creates task for specific worker → Set `status = "assigned"`
- **Accept**: Worker views task → Clicks "Accept" → `status = "accepted"` + `acceptedAt = now`
- **Start**: Worker → Clicks "Start Work" → `status = "in-progress"` + `startedAt = now`
- **Complete**: Worker → Uploads proof images + notes → `status = "resolved"` + `completedAt = now`

### Complaint Status Updates
Task status changes should trigger corresponding complaint status updates:
- Task.status = "assigned" → Complaint.status = "assigned"
- Task.status = "in-progress" → Complaint.status = "in-progress"
- Task.status = "resolved" → Complaint.status = "closed"

---

## Complete User Journey

### Citizen Flow
```
1. Citizen logs in → Views complaints list
2. Citizen creates complaint (POST /complaints)
   → Complaint.status = "new"
   → Complaint.citizenId = citizen
   → Complaint.supporters = [citizen]
3. Other citizens can see complaint on map/list
4. Citizen can support complaint (POST /complaints/:id/support)
   → Added to Complaint.supporters[]
5. Citizen can comment (POST /complaints/:id/comments)
   → Added to Complaint.comments[]
6. Citizen can view complaint detail with latest supporters count and comments
7. When admin assigns task → Citizen sees "Assigned" status
8. When worker starts work → Status = "In Progress"
9. When worker completes → Status = "Closed" + proof images visible
```

### Worker Flow
```
1. Worker logs in → Views available tasks (for their department)
   → GET /tasks/available
   → Query: Task.status = "assigned" AND Complaint.issueType matches department
2. Worker can accept task (PATCH /tasks/:id/accept)
   → Task.status = "accepted"
   → Task.acceptedAt = now
3. Worker views task detail (links to complaint, location, requester name)
4. Worker clicks "Start" (PATCH /tasks/:id/start)
   → Task.status = "in-progress"
   → Task.startedAt = now
   → Complaint.status = "in-progress" (synced)
5. Worker performs work at location
6. Worker uploads proof images and notes (PATCH /tasks/:id/complete)
   → Task.status = "resolved"
   → Task.completedAt = now
   → Task.proofImages = [urls]
   → Task.notes = notes
   → Complaint.status = "closed" (synced)
7. Citizen can view completed task with proof
```

### Admin Flow
```
1. Admin logs in → Views all complaints (dashboard/analytics)
2. Admin views complaints by status/priority/department
3. Admin can bulk-assign workers to complaints
   → Creates Task: { complaintId, workerId, status: "assigned" }
   → Updates Complaint: { status: "assigned", assignedTaskId: task._id }
4. Admin tracks task progress
5. Admin can escalate issues if not progressing
6. Admin views analytics on:
   → Complaint response times by department
   → Worker efficiency (avg time to resolve)
   → Complaint hotspots (geographic concentration)
   → SLA metrics
```

---

## Data Flow Diagrams

### Creating a Complaint
```
Frontend (Citizen)
    │
    ├─ POST /complaints (with FormData: type, location, issueType, description, images)
    │
    ▼
Backend (auth.middleware validates token → gets userId)
    │
    ├─ Creates Complaint:
    │    • citizenId = req.user.userId
    │    • supporters = [req.user.userId] (creator supports own complaint)
    │    • status = "new"
    │    • priority = "medium"
    │
    ├─ Saves images to storage, returns URLs
    │
    ├─ Audit log: "Complaint created by {citizenId}"
    │
    ▼
Frontend (receives complaint object)
    │
    └─ Updates UI: Complaint added to list

Database State After Creation:
┌─────────────────────────────────┐
│ Complaint c001                  │
│ • citizenId: user123            │
│ • supporters: [user123]         │
│ • status: "new"                 │
│ • assignedTaskId: null          │
└─────────────────────────────────┘
```

### Supporting a Complaint
```
Frontend (Citizen)
    │
    ├─ POST /complaints/:id/support
    │
    ▼
Backend (auth validates → gets userId)
    │
    ├─ Check if userId in Complaint.supporters
    │    • If YES: remove from array (unsupport)
    │    • If NO: add to array (support)
    │
    ├─ Response: { supporters: ['user1', 'user2', 'user3'] }
    │
    ├─ Audit log: "{userId} supported complaint {id}"
    │
    ▼
Frontend (converts response)
    │
    ├─ Parse response.supporters.length → upvotes
    │
    └─ Update UI: Show updated count

Database State After Support:
Before:   supporters: [user123]
After:    supporters: [user123, user456]
          (user456 added if they weren't already there)
```

### Assigning & Completing Task
```
Admin Dashboard
    │
    ├─ Admin selects complaint & worker
    │
    ├─ POST /tasks { complaintId, workerId }
    │
    ▼
Backend
    │
    ├─ Creates Task:
    │    • complaintId = selected complaint
    │    • workerId = selected worker
    │    • status = "assigned"
    │
    ├─ Updates Complaint:
    │    • assignedTaskId = task._id
    │    • status = "assigned"
    │
    ├─ Audit log: "Task assigned to {workerId} for complaint {complaintId}"
    │
    ▼
Worker App
    │
    ├─ Worker sees new task: GET /tasks/available
    │
    ├─ Worker: PATCH /tasks/:id/accept
    │    → Task.status = "accepted"
    │    → Task.acceptedAt = now
    │
    ├─ Worker: PATCH /tasks/:id/start
    │    → Task.status = "in-progress"
    │    → Task.startedAt = now
    │    → Complaint.status = "in-progress" (sync)
    │
    ├─ [Worker travels and does work]
    │
    ├─ Worker: PATCH /tasks/:id/complete
    │    → Uploads proofImages + notes
    │    → Task.status = "resolved"
    │    → Task.completedAt = now
    │    → Complaint.status = "closed" (sync)
    │
    ▼
Citizen App
    │
    └─ Citizen sees complaint status changed to "Closed"
       └─ Can view proof images & worker notes

Database State After Workflow:
┌─────────────────────────────────┐        ┌─────────────────────────────────┐
│ Complaint c001                  │        │ Task t001                       │
│ • status: "closed"              │◄───────│ • complaintId: c001             │
│ • assignedTaskId: t001          │        │ • workerId: worker456           │
│                                 │        │ • status: "resolved"            │
│                                 │        │ • proofImages: [url1, url2]     │
└─────────────────────────────────┘        │ • completedAt: 2026-04-16T15:30 │
                                           └─────────────────────────────────┘
```

---

## Important Synchronization Rules

### Complaint Status Sync
When a task transitions, the complaint must transition:
```javascript
// In task controller
if (task.status === "in-progress") {
  await Complaint.updateOne({ _id: task.complaintId }, { status: "in-progress" });
}
if (task.status === "resolved") {
  await Complaint.updateOne({ _id: task.complaintId }, { status: "closed" });
}
```

### Supporters Count
Frontend should count actual array length, not cached value:
```javascript
// WRONG: Trust upvotes field
upvotes: complaint.upvotes

// RIGHT: Count array
upvotes: complaint.supporters.length
```

### Comments Array
Since comments are embedded, operations must do full array rewrites:
```javascript
// To add comment:
await Complaint.updateOne(
  { _id: id },
  { $push: { comments: { userId, text, createdAt: Date.now() } } }
);

// To get comments:
const complaint = await Complaint.findById(id);
return complaint.comments;
```

---

## Schema Validation Rules

### Complaint Validation
```
✓ citizenId: Required, must be valid User ObjectId
✓ issueType: Required, must be one of ["water", "electricity", "road", "sanitation"]
✓ description: Required, 10-500 characters
✓ location: Required, must have lat: [-90, 90], lng: [-180, 180]
✓ images: Optional, max 10 files, max 5MB each
✓ type: Required, must be "hostel" or "campus"
✓ priority: Optional, defaults to "medium"
✓ status: Defaults to "new", admin can change
```

### Task Validation
```
✓ complaintId: Required, must reference existing Complaint
✓ workerId: Required, must reference existing User with role "worker"
✓ status: Defaults to "assigned"
✓ assignedAt: Auto-set on creation
✓ Only worker assigned to task can accept/start/complete
```

---

## Future Considerations

### SLA Tracking
- Add SLA target per department (e.g., "electricity: 48 hours")
- Track `complaint.expectedResolutionTime`
- Alert if exceeding SLA

### Historical Tracking
- Consider archiving old complaints to separate collection
- Keep AuditLog indefinitely
- Implement retention policies

### Scalability
- Geospatial index on `location` for nearby queries
- Index on `status` for filtering
- Index on `issueType` for department filtering
- Consider denormalization of supporter count in future

