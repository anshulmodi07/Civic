# CivicMitra Backend Implementation Guide

## Quick Start for Backend Team

This document provides all necessary information to implement backend endpoints that align with the frontend expectations.

---

## Key Principles

1. **Demo-to-Real Transition**: Frontend uses `EXPO_PUBLIC_USE_DEMO_API` environment variable to switch between demo and real backend
2. **Minimal Changes Required**: Once backend is live, frontend only needs to set `EXPO_PUBLIC_USE_DEMO_API=false` and configure `EXPO_PUBLIC_API_BASE_URL`
3. **Response Format Consistency**: All responses must match the documented JSON formats exactly
4. **Status Enums**: Use backend status enums, frontend normalizes for UI ("new" ↔ "pending")
5. **Array Management**: Use MongoDB's `$push` and `$pull` operators for array operations

---

## Database Schema Implementation

### Complaint Model

```javascript
const ComplaintSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  // Location Type
  type: {
    type: String,
    enum: ["hostel", "campus"],
    required: true,
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
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  issueType: {
    type: String,
    enum: ["electrician", "plumber", "ac", "wifi", "sanitation", "construction", "pest_control", "furniture", "other"],
    required: true,
    index: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  // Location coordinates (for geospatial queries)
  location: {
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },

  // Create geospatial index for "nearby" queries
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat] - note the order!
      index: "2dsphere",
    },
  },

  // Media & feedback
  images: [String], // URLs from cloud storage

  supporters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  comments: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // Status & assignment
  status: {
    type: String,
    enum: ["new", "assigned", "in-progress", "closed"],
    default: "new",
    index: true,
  },

  assignedTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },

  timestamps: true,
});

// Create geospatial index for nearby queries
ComplaintSchema.index({ "coordinates.coordinates": "2dsphere" });
```

### Task Model

```javascript
const TaskSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true,
  },

  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  status: {
    type: String,
    enum: ["assigned", "accepted", "in-progress", "resolved"],
    default: "assigned",
    index: true,
  },

  proofImages: [String], // URLs from cloud storage

  notes: String,

  // Timestamps for workflow tracking
  assignedAt: {
    type: Date,
    default: Date.now,
  },

  acceptedAt: Date,

  startedAt: Date,

  completedAt: Date,

  timestamps: true,
});
```

---

## Endpoint Implementation Details

### 1. POST /auth/login

**Handler Logic:**
```javascript
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Find user
  const user = await User.findOne({ email, role });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  });
};
```

---

### 2. POST /complaints

**Handler Logic:**
```javascript
exports.createComplaint = async (req, res) => {
  const { description, issueType, location, type, hostelName, floor, roomNumber, locationLandmark, locationAddress } = req.body;
  const userId = req.user.userId; // From auth middleware

  // Validate required fields
  if (!description || !issueType || !location) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const complaint = new Complaint({
      citizenId: userId,
      description,
      issueType,
      type,
      location: { lat: location.lat, lng: location.lng },
      coordinates: { type: "Point", coordinates: [location.lng, location.lat] },
      hostelName,
      floor,
      roomNumber,
      locationLandmark,
      locationAddress,
      status: "new",
      priority: "medium",
      supporters: [userId], // Creator supports their own complaint
      comments: [],
    });

    // Handle image uploads if provided
    if (req.files) {
      complaint.images = req.files.map(f => f.url); // Assuming multer + cloud storage
    }

    await complaint.save();

    // Create audit log
    await AuditLog.create({
      userId,
      action: "complaint_created",
      complaintId: complaint._id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Error creating complaint", error: error.message });
  }
};
```

---

### 3. GET /complaints

**Handler Logic:**
```javascript
exports.getAllComplaints = async (req, res) => {
  const { status, type, issueType } = req.query;

  try {
    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (issueType) filters.issueType = issueType;

    const complaints = await Complaint.find(filters)
      .populate("citizenId", "name email")
      .populate("supporters", "name")
      .populate("comments.userId", "name")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error: error.message });
  }
};
```

---

### 4. GET /complaints/nearby

**Handler Logic:**
```javascript
exports.getNearbyComplaints = async (req, res) => {
  const { lat, lng, radiusKm = 5 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "lat and lng required" });
  }

  try {
    const radiusMeters = radiusKm * 1000;
    const complaints = await Complaint.find({
      coordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radiusMeters,
        },
      },
    })
      .populate("citizenId", "name email")
      .populate("supporters", "name");

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching nearby complaints", error: error.message });
  }
};
```

---

### 5. POST /complaints/:id/support

**Handler Logic:**
```javascript
exports.supportComplaint = async (req, res) => {
  const complaintId = req.params.id;
  const userId = req.user.userId;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Check if user already supported
    const alreadySupported = complaint.supporters.includes(userId);

    if (alreadySupported) {
      // Remove supporter (unsupport)
      await Complaint.findByIdAndUpdate(
        complaintId,
        { $pull: { supporters: userId } },
        { new: true }
      );

      await AuditLog.create({
        userId,
        action: "complaint_unsupported",
        complaintId,
      });
    } else {
      // Add supporter
      await Complaint.findByIdAndUpdate(
        complaintId,
        { $push: { supporters: userId } },
        { new: true }
      );

      await AuditLog.create({
        userId,
        action: "complaint_supported",
        complaintId,
      });
    }

    // Fetch updated complaint to get all supporters
    const updated = await Complaint.findById(complaintId).populate("supporters", "name");

    res.json({
      supporters: updated.supporters,
      message: alreadySupported ? "Support removed" : "Complaint supported",
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating support", error: error.message });
  }
};
```

**IMPORTANT**: Frontend expects `supporters` to be an array. The count is calculated as `supporters.length`.

---

### 6. POST /complaints/:id/comments

**Handler Logic:**
```javascript
exports.addComment = async (req, res) => {
  const complaintId = req.params.id;
  const { text } = req.body;
  const userId = req.user.userId;

  if (!text) {
    return res.status(400).json({ message: "Comment text required" });
  }

  try {
    const comment = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      text,
      createdAt: new Date(),
    };

    await Complaint.findByIdAndUpdate(
      complaintId,
      { $push: { comments: comment } },
      { new: true }
    );

    res.status(201).json({
      commentId: comment._id,
      userId,
      text,
      createdAt: comment.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};
```

---

### 7. PATCH /tasks/:id/accept

**Handler Logic:**
```javascript
exports.acceptTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only the assigned worker can accept
    if (task.workerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only accept if status is "assigned"
    if (task.status !== "assigned") {
      return res.status(400).json({ message: "Task cannot be accepted at this stage" });
    }

    await Task.findByIdAndUpdate(
      taskId,
      { status: "accepted", acceptedAt: new Date() },
      { new: true }
    );

    res.json({ status: "accepted", acceptedAt: new Date() });
  } catch (error) {
    res.status(500).json({ message: "Error accepting task", error: error.message });
  }
};
```

---

### 8. PATCH /tasks/:id/start

**Handler Logic:**
```javascript
exports.startTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.workerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (task.status !== "accepted") {
      return res.status(400).json({ message: "Task must be accepted first" });
    }

    // Update task status and corresponding complaint status
    await Task.findByIdAndUpdate(
      taskId,
      { status: "in-progress", startedAt: new Date() }
    );

    await Complaint.findByIdAndUpdate(
      task.complaintId,
      { status: "in-progress" }
    );

    res.json({ status: "in-progress", startedAt: new Date() });
  } catch (error) {
    res.status(500).json({ message: "Error starting task", error: error.message });
  }
};
```

---

### 9. PATCH /tasks/:id/complete

**Handler Logic:**
```javascript
exports.completeTask = async (req, res) => {
  const taskId = req.params.id;
  const { notes } = req.body;
  const userId = req.user.userId;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.workerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (task.status !== "in-progress") {
      return res.status(400).json({ message: "Task must be in-progress" });
    }

    // Handle proof images if provided
    let proofImages = [];
    if (req.files) {
      proofImages = req.files.map(f => f.url);
    }

    // Update task and complaint status
    await Task.findByIdAndUpdate(
      taskId,
      {
        status: "resolved",
        completedAt: new Date(),
        proofImages,
        notes,
      }
    );

    await Complaint.findByIdAndUpdate(
      task.complaintId,
      { status: "closed" }
    );

    res.json({
      status: "resolved",
      completedAt: new Date(),
      proofImages,
    });
  } catch (error) {
    res.status(500).json({ message: "Error completing task", error: error.message });
  }
};
```

---

### 10. POST /tasks

**Handler Logic:**
```javascript
exports.createTask = async (req, res) => {
  const { complaintId, workerId } = req.body;

  // Only admin can create tasks
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can create tasks" });
  }

  try {
    // Verify complaint exists and is not already assigned
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.assignedTaskId) {
      return res.status(400).json({ message: "Complaint already has an assigned task" });
    }

    // Verify worker exists
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(400).json({ message: "Invalid worker" });
    }

    // Create task
    const task = new Task({
      complaintId,
      workerId,
      status: "assigned",
      assignedAt: new Date(),
    });

    await task.save();

    // Update complaint with assignedTaskId and status
    await Complaint.findByIdAndUpdate(
      complaintId,
      {
        assignedTaskId: task._id,
        status: "assigned",
      }
    );

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      action: "task_created",
      taskId: task._id,
      complaintId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};
```

---

## Middleware Requirements

### Auth Middleware
```javascript
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
```

### Role Middleware
```javascript
const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }
  next();
};
```

---

## Error Handling Convention

All error responses should follow this format:
```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "details": {} // Optional additional info
}
```

**HTTP Status Codes to Use:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate key)
- `500` - Server Error

---

## Testing Endpoints

### Using cURL

**Create Complaint:**
```bash
curl -X POST http://localhost:5000/complaints \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "hostel",
    "hostelName": "hostel_a",
    "floor": "3",
    "roomNumber": "302",
    "issueType": "electrician",
    "description": "Ceiling fan not working",
    "location": {"lat": 28.7450, "lng": 77.1120}
  }'
```

**Support Complaint:**
```bash
curl -X POST http://localhost:5000/complaints/c001/support \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

**Get Nearby:**
```bash
curl "http://localhost:5000/complaints/nearby?lat=28.7450&lng=77.1120&radiusKm=5" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

---

## Performance Considerations

### Indexes Required
```javascript
// Complaint indexes
db.complaints.createIndex({ status: 1 });
db.complaints.createIndex({ issueType: 1 });
db.complaints.createIndex({ citizenId: 1 });
db.complaints.createIndex({ "coordinates": "2dsphere" });

// Task indexes
db.tasks.createIndex({ workerId: 1, status: 1 });
db.tasks.createIndex({ complaintId: 1 });

// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
```

### Query Optimization Tips
1. Use projection to exclude large fields when not needed
2. Paginate results with `limit()` and `skip()`
3. Use lean() for read-only queries
4. Consider denormalizing supporter count if queried frequently

---

## Deployment Checklist

- [ ] Environment variables configured (JWT_SECRET, DB_URL, etc.)
- [ ] All indexes created on database
- [ ] JWT secret is strong and stored securely
- [ ] File upload service configured (AWS S3, Google Cloud Storage, etc.)
- [ ] Rate limiting implemented
- [ ] CORS configured for frontend URL
- [ ] Logging/monitoring set up
- [ ] Error tracking (Sentry, etc.)
- [ ] Database backups automated

---

## Next Steps for Frontend Team

1. Set backend API URL: `EXPO_PUBLIC_API_BASE_URL=https://your-backend.com`
2. Switch demo mode off: `EXPO_PUBLIC_USE_DEMO_API=false`
3. Run full integration tests
4. Deploy to TestFlight/Play Store beta

