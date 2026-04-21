# Quick Reference: API Endpoints & Demo Data

## API Endpoints Quick Map

### Authentication
```
POST   /auth/login               → Login with email/password
GET    /auth/me                  → Get current user profile
```

### Complaints - Read
```
GET    /complaints               → List all (filters: status, type, issueType)
GET    /complaints/my            → Current user's complaints only
GET    /complaints/:id           → Single complaint detail
GET    /complaints/nearby        → Complaints within radius (params: lat, lng, radiusKm)
```

### Complaints - Write
```
POST   /complaints               → Create new complaint (multipart/form-data with images)
POST   /complaints/:id/support   → Toggle support/upvote
POST   /complaints/:id/comments  → Add comment
PATCH  /complaints/:id/status    → Change status (admin)
DELETE /complaints/:id           → Delete complaint (owner/admin)
```

### Tasks - Read
```
GET    /tasks/available          → Tasks for current worker's department
GET    /tasks/my                 → Current worker's assigned tasks
GET    /tasks/:id                → Task detail with linked complaint
```

### Tasks - Write
```
POST   /tasks                    → Create task (admin assigns worker to complaint)
PATCH  /tasks/:id/accept         → Worker accepts task
PATCH  /tasks/:id/start          → Worker starts work
PATCH  /tasks/:id/complete       → Worker completes (with proof images + notes)
```

---

## Response Format Examples

### Complaint Object
```json
{
  "_id": "c001",
  "citizenId": "user_123",
  "type": "hostel",
  "hostelName": "hostel_a",
  "floor": "3",
  "roomNumber": "302",
  "issueType": "electrician",
  "priority": "medium",
  "description": "Ceiling fan not working...",
  "location": { "lat": 28.7450, "lng": 77.1120 },
  "images": ["url1", "url2"],
  "supporters": ["user_123", "user_456", "user_789"],
  "comments": [
    {
      "userId": "user_456",
      "text": "This is urgent!",
      "createdAt": "2026-04-16T10:30:00Z"
    }
  ],
  "status": "in-progress",
  "assignedTaskId": "t001",
  "createdAt": "2026-04-11T10:30:00Z",
  "updatedAt": "2026-04-14T12:00:00Z"
}
```

### Task Object
```json
{
  "_id": "t001",
  "complaintId": "c001",
  "workerId": "worker_123",
  "status": "in-progress",
  "assignedAt": "2026-04-16T09:00:00Z",
  "acceptedAt": "2026-04-16T09:15:00Z",
  "startedAt": "2026-04-16T10:00:00Z",
  "completedAt": null,
  "proofImages": [],
  "notes": null,
  "createdAt": "2026-04-16T09:00:00Z",
  "updatedAt": "2026-04-16T10:00:00Z"
}
```

### Support Toggle Response
```json
{
  "supporters": ["user_123", "user_456", "user_789"],
  "message": "Complaint supported"
}
```

---

## Demo Data Constants

### Status Values
```javascript
"new"          // Initial status (backend)
"pending"      // Initial status (frontend UI)
"assigned"     // Admin has assigned a task
"in-progress"  // Worker has started work
"closed"       // Problem resolved
"resolved"     // Task completed (alternate for "closed")
```

### Issue Types
```javascript
"electrician"
"plumber"
"ac"
"wifi"
"sanitation"
"construction"
"pest_control"
"furniture"
"other"
```

### Priority Levels
```javascript
"low"
"medium"
"high"
```

### Complaint Location Types
```javascript
"hostel"       // Hostel room complaint (has hostelName, floor, roomNumber)
"campus"       // Campus area complaint (has locationLandmark, locationAddress)
```

### Task Status Flow
```
assigned → accepted → in-progress → resolved
   ✓         ✓           ✓           ✓
```

### Complaint Status Flow
```
new → assigned → in-progress → closed
 ✓       ✓           ✓          ✓
```

---

## Frontend Demo Data Sample (Complaint)

```javascript
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
  upvotes: 1,  // Calculated from supporters.length
  comments: [],
  images: [],
  assignedTaskId: null,
  assignedTo: "Maintenance Team A"
}
```

### Frontend Demo Data Sample (Task)

```javascript
{
  _id: "t001",
  taskId: "t001",
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
```

---

## Frontend Configuration

### Environment Variables to Set

**Development (Demo Mode)**:
```
EXPO_PUBLIC_USE_DEMO_API=true
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

**Production (Real Backend)**:
```
EXPO_PUBLIC_USE_DEMO_API=false
EXPO_PUBLIC_API_BASE_URL=https://api.civicmitra.com
```

---

## Key Implementation Rules

### 1. Upvote/Support Handling
```javascript
// Frontend receives: { supporters: [userId1, userId2, ...] }
// Frontend calculates: upvotes = supporters.length
// Frontend should NOT store redundant upvotes field
```

### 2. Status Mapping
```javascript
// Backend sends: { status: "new" }
// Frontend treats as: "pending" for UI display
// Use normalizeComplaintStatus() helper for comparisons
```

### 3. Task-Complaint Linking
```javascript
// When creating task: POST /tasks { complaintId, workerId }
// Updates complaint: { assignedTaskId: task._id, status: "assigned" }
// Task stores: { complaintId, workerId }
```

### 4. Status Synchronization
```javascript
// Task status → Complaint status
Task.status = "in-progress" → Complaint.status = "in-progress"
Task.status = "resolved"    → Complaint.status = "closed"
```

### 5. Authorization
```javascript
// All requests require: Authorization: Bearer {JWT_TOKEN}
// Token obtained from: POST /auth/login
// Token contains: { userId, role }
```

---

## Common cURL Examples

### Get All Complaints
```bash
curl -X GET "http://localhost:5000/complaints?status=new" \
  -H "Authorization: Bearer $TOKEN"
```

### Create Complaint
```bash
curl -X POST http://localhost:5000/complaints \
  -H "Authorization: Bearer $TOKEN" \
  -F "type=hostel" \
  -F "hostelName=hostel_a" \
  -F "issueType=electrician" \
  -F "description=Issue description" \
  -F "location={\"lat\":28.7450,\"lng\":77.1120}" \
  -F "images=@image.jpg"
```

### Support Complaint
```bash
curl -X POST http://localhost:5000/complaints/c001/support \
  -H "Authorization: Bearer $TOKEN"
```

### Get Nearby Complaints
```bash
curl -X GET "http://localhost:5000/complaints/nearby?lat=28.7450&lng=77.1120&radiusKm=5" \
  -H "Authorization: Bearer $TOKEN"
```

### Accept Task
```bash
curl -X PATCH http://localhost:5000/tasks/t001/accept \
  -H "Authorization: Bearer $TOKEN"
```

### Complete Task
```bash
curl -X PATCH http://localhost:5000/tasks/t001/complete \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "proofImages=@proof1.jpg" \
  -F "proofImages=@proof2.jpg" \
  -F "notes=Work completed successfully"
```

---

## Frontend API Methods Location

| Method | File | Status |
|--------|------|--------|
| `getAllComplaints()` | complaint.api.js | ✅ Ready |
| `getMyComplaints()` | complaint.api.js | ✅ Ready |
| `getComplaintById()` | complaint.api.js | ✅ Ready |
| `getNearbyComplaints()` | complaint.api.js | ✅ Ready |
| `createComplaint()` | complaint.api.js | ✅ Ready |
| `toggleUpvote()` | complaint.api.js | ✅ Ready |
| `addComment()` | complaint.api.js | ✅ Ready |
| `updateComplaintStatus()` | complaint.api.js | ✅ Ready |
| `deleteComplaint()` | complaint.api.js | ✅ Ready |
| `getAllTasks()` | tasks.api.ts | ✅ Ready |
| `getMyTasks()` | tasks.api.ts | ✅ Ready |
| `acceptTask()` | tasks.api.ts | ✅ Ready |
| `startTask()` | tasks.api.ts | ✅ Ready |
| `completeTask()` | tasks.api.ts | ✅ Ready |

---

## Database Indexes Required

```javascript
// Complaint collection
db.complaints.createIndex({ status: 1 });
db.complaints.createIndex({ issueType: 1 });
db.complaints.createIndex({ citizenId: 1 });
db.complaints.createIndex({ "coordinates": "2dsphere" });

// Task collection
db.tasks.createIndex({ workerId: 1, status: 1 });
db.tasks.createIndex({ complaintId: 1 });

// User collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
```

---

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET returns data |
| 201 | Created | POST returns new resource |
| 400 | Bad Request | Missing required field |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Complaint/Task doesn't exist |
| 409 | Conflict | Duplicate entry |
| 500 | Server Error | Database error |

---

## Troubleshooting

### "Upvotes not updating"
- Check: Is `toggleUpvote()` being called with correct complaintId?
- Verify: Demo data has `supporters` array, not `upvotedBy`
- Solution: Ensure `normalizeComplaint()` is applied to results

### "Task endpoints returning 404"
- Check: Is `USE_DEMO_API` set correctly?
- Verify: Backend has defined endpoint paths
- Solution: Update `EXPO_PUBLIC_API_BASE_URL` if needed

### "Status shows as 'pending' in one place, 'new' in another"
- Issue: Status normalization not applied consistently
- Solution: Use `normalizeComplaintStatus()` for comparisons
- Use `statusMatches()` helper for filtering

### "Task not linked to complaint"
- Check: Does task object have `complaintId` field?
- Verify: Complaint has matching `assignedTaskId`
- Solution: Ensure both are set when creating task

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-16 | Initial alignment complete |

---

**Last Updated**: April 16, 2026  
**For**: CivicMitra Backend Team  
**Questions?**: See ALIGNMENT_SUMMARY.md or API_SPECIFICATION.md

