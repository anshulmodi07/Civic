# Legacy Code Migration Guide
## Updating src/screens/ to Use API Wrapper Functions

**Purpose**: This guide shows how to update old screen files to use the new API wrapper functions instead of direct axios calls.

**Current Status**: ⚠️ These files make direct API calls that bypass the abstraction layer  
**Target Status**: ✅ Update to use wrapper functions for proper scalability

---

## Why Migrate?

| Aspect | Before (Direct API) | After (Wrapper Functions) |
|--------|-------------------|-------------------------|
| Demo Mode | ❌ Doesn't work | ✅ Works perfectly |
| Scalability | ⚠️ API calls scattered | ✅ Centralized control |
| Testing | ⚠️ Hard to mock | ✅ Easy to test |
| Switching Backend | ⚠️ Requires file changes | ✅ Just env var change |
| Error Handling | ⚠️ Inconsistent | ✅ Standardized |
| Token Management | ✅ Works (interceptor) | ✅ Works (interceptor) |

---

## Files Affected

### Client Screen Files
1. `CreateComplaintHostelScreen.js` - Create complaint for hostel
2. `CreateComplaintCampusScreen.js` - Create complaint for campus
3. `CreateComplaintScreen.js` - Generic creation (may be obsolete)
4. `MyComplaintsScreen.js` - List user's complaints
5. `BrowseComplaintsScreen.js` - Browse all complaints
6. `ComplaintDetailScreen.js` - View single complaint

### Worker Screen Files
7. `DashboardScreen.js` - Worker dashboard with stats
8. `MyTasksScreen.js` - Worker's assigned tasks
9. `TaskDetailScreen.js` - Task detail and completion
10. `CompleteTaskScreen.js` - Task completion workflow

---

## Migration Pattern

### Pattern 1: Simple GET (List)

**BEFORE** (❌ Direct API):
```javascript
import api from "../../api/axios";

const loadComplaints = async () => {
  try {
    const res = await api.get("/complaints/my");
    setComplaints(res.data);
  } catch (err) {
    console.log(err);
  }
};
```

**AFTER** (✅ Wrapper Function):
```javascript
import { getMyComplaints } from "../../api/complaint.api";

const loadComplaints = async () => {
  try {
    const data = await getMyComplaints();
    setComplaints(data);
  } catch (err) {
    console.log("Error loading complaints:", err);
  }
};
```

**Key Changes**:
- Remove: `import api from "../../api/axios";`
- Add: `import { getMyComplaints } from "../../api/complaint.api";`
- Replace: `api.get("/complaints/my")` with `getMyComplaints()`
- Simplified: Return value is already the data array

---

### Pattern 2: GET with Filters

**BEFORE** (❌ Direct API):
```javascript
const res = await api.get("/complaints", { 
  params: { status: "new", issueType: "electrician" } 
});
setComplaints(res.data);
```

**AFTER** (✅ Wrapper Function):
```javascript
import { getAllComplaints } from "../../api/complaint.api";

const data = await getAllComplaints({ 
  status: "new", 
  issueType: "electrician" 
});
setComplaints(data);
```

---

### Pattern 3: POST (Create)

**BEFORE** (❌ Direct API):
```javascript
const submitData = new FormData();
submitData.append("type", "hostel");
submitData.append("hostelName", hostelName);
submitData.append("issueType", issueType);
submitData.append("description", description);
submitData.append("location", JSON.stringify({ lat, lng }));
images.forEach(img => {
  submitData.append("images", { uri: img.uri, name: `photo.jpg`, type: "image/jpeg" });
});

await api.post("/complaints", submitData, {
  headers: { "Content-Type": "multipart/form-data" }
});
```

**AFTER** (✅ Wrapper Function):
```javascript
import { createComplaint } from "../../api/complaint.api";

const submitData = new FormData();
submitData.append("type", "hostel");
submitData.append("hostelName", hostelName);
submitData.append("issueType", issueType);
submitData.append("description", description);
submitData.append("location", JSON.stringify({ lat, lng }));
images.forEach(img => {
  submitData.append("images", { uri: img.uri, name: `photo.jpg`, type: "image/jpeg" });
});

await createComplaint(submitData);
```

**Key Changes**:
- Wrapper function handles `Content-Type` header automatically
- Same FormData setup
- Call wrapper instead of `api.post()`

---

### Pattern 4: Support/Upvote

**BEFORE** (❌ Direct API):
```javascript
await api.post(`/complaints/${complaintId}/support`);
```

**AFTER** (✅ Wrapper Function):
```javascript
import { toggleUpvote } from "../../api/complaint.api";

const result = await toggleUpvote(complaintId);
setUpvotes(result.upvotes);
```

**Key Changes**:
- Returns normalized response with `upvotes` and `upvoted` fields
- Backend's `supporters` array is converted to `upvotes` count automatically

---

### Pattern 5: Task Operations

**BEFORE** (❌ Direct API):
```javascript
import api from "../../api/axios";

await api.patch(`/tasks/${taskId}/accept`);
await api.patch(`/tasks/${taskId}/start`);
await api.patch(`/tasks/${taskId}/complete`, { proofImages, notes });
```

**AFTER** (✅ Wrapper Functions):
```javascript
import { acceptTask, startTask, completeTask } from "../../api/tasks.api";

await acceptTask(taskId);
await startTask(taskId);
await completeTask(taskId, "resolved", notes, image); // or "incomplete"
```

---

## File-by-File Migration Guide

### File 1: MyComplaintsScreen.js

**Location**: `src/screens/client/MyComplaintsScreen.js` (Line ~52)

**Current Code**:
```javascript
import api from "../../api/axios";

const loadComplaints = async () => {
  try {
    const res = await api.get("/complaints/my");
    setComplaints(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
};
```

**Updated Code**:
```javascript
import { getMyComplaints } from "../../api/complaint.api";

const loadComplaints = async () => {
  try {
    const data = await getMyComplaints();
    setComplaints(data);
  } catch (err) {
    console.log("Error loading complaints:", err);
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
};
```

---

### File 2: BrowseComplaintsScreen.js

**Location**: `src/screens/client/BrowseComplaintsScreen.js` (Line ~)

**Current Code**:
```javascript
import api from "../../api/axios";

const loadComplaints = async () => {
  try {
    const res = await api.get("/complaints", { 
      params: { status, type, issueType } 
    });
    setComplaints(res.data);
  } catch (error) {
    console.log(error);
  }
};
```

**Updated Code**:
```javascript
import { getAllComplaints } from "../../api/complaint.api";

const loadComplaints = async () => {
  try {
    const data = await getAllComplaints({ status, type, issueType });
    setComplaints(data);
  } catch (error) {
    console.log("Error loading complaints:", error);
  }
};
```

---

### File 3: CreateComplaintHostelScreen.js

**Location**: `src/screens/client/CreateComplaintHostelScreen.js` (Line ~128-165)

**Current Code**:
```javascript
import api from "../../api/axios";

try {
  await api.post("/complaints", submitData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  Alert.alert("Success", "Complaint submitted successfully", [
    { text: "OK", onPress: () => navigation.goBack() },
  ]);
} catch (error) {
  Alert.alert("Error", "Failed to submit complaint");
}
```

**Updated Code**:
```javascript
import { createComplaint } from "../../api/complaint.api";

try {
  await createComplaint(submitData);

  Alert.alert("Success", "Complaint submitted successfully", [
    { text: "OK", onPress: () => navigation.goBack() },
  ]);
} catch (error) {
  Alert.alert("Error", error.message || "Failed to submit complaint");
}
```

---

### File 4: CreateComplaintCampusScreen.js

**Exactly same as CreateComplaintHostelScreen.js migration above**

---

### File 5: DashboardScreen.js (Worker)

**Location**: `src/screens/worker/DashboardScreen.js` (Line ~85)

**Current Code**:
```javascript
import api from "../../api/axios";

const loadStats = async () => {
  try {
    const res = await api.get("/tasks/my");
    const tasks = res.data;
    setTasks(tasks);
    setStats({
      assigned: tasks.filter(t => t.status === "assigned").length,
      inProgress: tasks.filter(t => t.status === "in-progress").length,
      completed: tasks.filter(t => t.status === "resolved").length,
    });
  } catch (error) {
    console.log(error);
  }
};
```

**Updated Code**:
```javascript
import { getMyTasks } from "../../api/tasks.api";

const loadStats = async () => {
  try {
    const tasks = await getMyTasks();
    setTasks(tasks);
    setStats({
      assigned: tasks.filter(t => t.status === "assigned").length,
      inProgress: tasks.filter(t => t.status === "in-progress").length,
      completed: tasks.filter(t => t.status === "resolved").length,
    });
  } catch (error) {
    console.log("Error loading stats:", error);
  }
};
```

---

### File 6: MyTasksScreen.js (Worker)

**Location**: `src/screens/worker/MyTasksScreen.js` (Line ~67)

**Current Code**:
```javascript
import api from "../../api/axios";

const loadTasks = async () => {
  try {
    const res = await api.get("/tasks/my");
    setTasks(res.data);
  } catch (err) {
    console.log(err);
  }
};
```

**Updated Code**:
```javascript
import { getMyTasks } from "../../api/tasks.api";

const loadTasks = async () => {
  try {
    const data = await getMyTasks();
    setTasks(data);
  } catch (err) {
    console.log("Error loading tasks:", err);
  }
};
```

---

### File 7: TaskDetailScreen.js (Worker)

**Location**: `src/screens/worker/TaskDetailScreen.js`

**Current Pattern**:
```javascript
import api from "../../api/axios";

// BEFORE
await api.patch(`/tasks/${id}/accept`);
await api.patch(`/tasks/${id}/start`);
await api.patch(`/tasks/${id}/complete`, { proofImages, notes });
```

**Updated Pattern**:
```javascript
import { acceptTask, startTask, completeTask } from "../../api/tasks.api";

// AFTER
await acceptTask(id);
await startTask(id);
await completeTask(id, "resolved", notes, image);
```

---

## Batch Migration Script

If you want to update all files at once, here are the replacements needed:

### Replace 1: Remove all direct axios imports
```bash
# Search for:
import api from "../../api/axios";

# Remove these lines completely, then add specific imports below
```

### Replace 2: Add proper API imports

**For Complaint Screens**:
```javascript
import { 
  getMyComplaints, 
  getAllComplaints, 
  getComplaintById,
  createComplaint, 
  toggleUpvote 
} from "../../api/complaint.api";
```

**For Task Screens**:
```javascript
import { 
  getMyTasks, 
  getAllTasks,
  acceptTask, 
  startTask, 
  completeTask 
} from "../../api/tasks.api";
```

---

## Testing After Migration

### Step 1: Test Demo Mode
```bash
# Set in .env or expo config
EXPO_PUBLIC_USE_DEMO_API=true

# Run app
npm start
```

**Verify**:
- ✅ Complaints load
- ✅ Can create complaint
- ✅ Can upvote
- ✅ Tasks load
- ✅ Can accept/start/complete tasks

### Step 2: Test with Real Backend (when available)
```bash
EXPO_PUBLIC_USE_DEMO_API=false
EXPO_PUBLIC_API_URL=http://localhost:5000

# Run app
npm start
```

**Verify**:
- ✅ Same functionality works with real API
- ✅ Network requests show correct endpoints
- ✅ Error handling works

---

## Verification Checklist

After migration, verify:

- [ ] All imports changed from `api` to specific wrapper functions
- [ ] No direct `api.get()`, `api.post()`, `api.patch()` calls remain
- [ ] Error messages are descriptive
- [ ] Demo mode works (EXPO_PUBLIC_USE_DEMO_API=true)
- [ ] Backend mode ready (EXPO_PUBLIC_USE_DEMO_API=false)
- [ ] No console errors
- [ ] All screens render correctly

---

## Quick Reference: API Wrapper Functions

### Complaint Functions
```javascript
// Read
getMyComplaints()                    // Current user's complaints
getAllComplaints({ status, type, issueType })  // All (with filters)
getComplaintById(id)                 // Single complaint
getNearbyComplaints({ lat, lng, radiusKm })   // Geo query
getCitizenDashboard()                // Dashboard stats

// Write
createComplaint(formData)            // New complaint
toggleUpvote(complaintId)            // Support/unsupport
addComment(complaintId, text)        // Add comment
updateComplaintStatus(id, status)    // Change status (admin)
deleteComplaint(id)                  // Delete complaint
```

### Task Functions
```javascript
// Read
getMyTasks()                         // Worker's tasks
getAllTasks()                        // Available tasks
getTaskById(id)                      // Single task

// Write
acceptTask(taskId)                   // Accept assignment
startTask(taskId)                    // Start work
completeTask(taskId, type, notes, image)  // Mark complete
```

### Auth Functions
```javascript
login({ email, name, role, password })    // Login
getMe()                                   // Current user
logoutUser()                              // Logout
```

---

## Troubleshooting

### Issue: "getMyComplaints is not defined"
**Solution**: Check import path matches file location
```javascript
// If in src/screens/client/, path should be:
import { getMyComplaints } from "../../api/complaint.api";

// If in src/screens/worker/, path might be:
import { getMyComplaints } from "../../api/complaint.api";
```

### Issue: Demo mode not working
**Solution**: Make sure USE_DEMO_API is properly set
```javascript
// Check: src/api/config.js
export const USE_DEMO_API = process.env.EXPO_PUBLIC_USE_DEMO_API === "false" ? false : true;

// In .env or expo config:
EXPO_PUBLIC_USE_DEMO_API=true  // For demo
EXPO_PUBLIC_USE_DEMO_API=false // For production
```

### Issue: API returns different data than expected
**Solution**: Wrapper functions normalize responses
```javascript
// Backend might return: { supporters: [...], message: "..." }
// Wrapper normalizes to: { upvotes: number, upvoted: boolean }
```

---

## Summary

✅ **After migration, the legacy screens will**:
- ✅ Work in demo mode
- ✅ Work with real backend automatically
- ✅ Switch between modes with env var only
- ✅ Have consistent error handling
- ✅ Be maintainable and testable

**Migration Effort**: 5-10 minutes per file (find & replace + consolidate imports)

**Total Time**: 30-45 minutes for all files

---

**Note**: These files are currently not active in the main application (new Expo Router screens are used). Migrate them only if:
1. Legacy screens need to be reactivated
2. Full backwards compatibility needed
3. Phased migration in progress

For new development, always use the new Expo Router pattern with proper API wrapper imports.

