# 🔄 Frontend Client - Changes Required (According to Backend Schema)

**Project:** CivicMitra | Frontend Alignment Guide  
**Based On:** BACKEND_SCHEMA_AND_AUTH_DOCUMENTATION.md  
**Last Updated:** April 22, 2026  
**Version:** 1.0

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Authentication System Changes](#authentication-system-changes)
3. [User Model Alignment](#user-model-alignment)
4. [Complaint Data Model Changes](#complaint-data-model-changes)
5. [API Endpoint Changes](#api-endpoint-changes)
6. [Context & State Management Changes](#context--state-management-changes)
7. [Component Updates](#component-updates)
8. [Error Handling & Validation](#error-handling--validation)
9. [Security & Headers](#security--headers)
10. [New Features to Implement](#new-features-to-implement)
11. [Implementation Priority](#implementation-priority)
12. [Testing Requirements](#testing-requirements)

---

## 🎯 Executive Summary

### Gap Analysis: Frontend vs Backend

| Aspect | Backend Status | Frontend Status | Gap |
|--------|---|---|---|
| Auth Methods | 3 (OAuth, Worker, Admin) | 1 (Email/Password) | ⚠️ OAuth missing |
| User Model Fields | 3 fields (name, email, createdAt, updatedAt) | 3 fields | ✅ Match |
| Complaint Fields | 20+ fields (conditional) | 15 fields | ⚠️ Missing some |
| Status Enums | 4 (new, assigned, in-progress, closed) | 4 | ✅ Match |
| Priority Levels | 3 (low, medium, high) | 3 | ✅ Match |
| Department Types | 5 enum values | 5 enum values | ✅ Match |
| Token Expiry | 7 days | Handled by backend | ⚠️ No refresh |
| Role-Based Access | RBAC via middleware | Role-based routing | ⚠️ No API-level checks |
| Comment System | Implemented | UI only, no API | ❌ Needs implementation |
| Upvote System | Implemented | Implemented | ✅ Match |

### Critical Changes Needed
🔴 **MUST HAVE (Week 1):**
1. Implement Google OAuth login
2. Add token refresh mechanism
3. Implement comment API integration
4. Handle token expiry gracefully

🟡 **HIGH PRIORITY (Week 1-2):**
1. User profile management
2. Input validation alignment
3. Error handling improvements
4. Device token registration

🟢 **MEDIUM PRIORITY (Week 2-3):**
1. Real-time updates (WebSocket)
2. Notification system
3. Offline mode support

---

## 🔐 Authentication System Changes

### 1. Update Auth Flow to Support 3 Methods

**Current:**
```javascript
// LoginScreen.js - only supports email/password
const handleLogin = async () => {
  await login({
    email,
    name: email,
    role,
    password,
  });
};
```

**Required:**
```javascript
// Three separate flows needed:

// METHOD 1: User (Client) - Google OAuth
const handleGoogleLogin = async (googleToken) => {
  try {
    const response = await api.post("/auth/google-login", {
      token: googleToken
    });
    // Auto creates account if first login
    // Returns: { token, user: { _id, name, email } }
  }
};

// METHOD 2: Worker - Email + Password
const handleWorkerLogin = async () => {
  const response = await api.post("/auth/worker/login", {
    email,
    password
  });
  // Returns: { token, worker: { id, name, email } }
};

// METHOD 3: Admin - Email + Password (rarely used in app)
// Not needed in client app, but backend supports it
```

### 2. Update LoginScreen.js

**Add:**
- ✅ Google OAuth button with `@react-native-google-signin`
- ✅ Domain restriction messaging (@nitdelhi.ac.in)
- ✅ Auto-account creation explanation
- ✅ Separate UI paths for User vs Worker login
- ✅ Terms & conditions checkbox
- ✅ Forgot password link

**Remove:**
- ❌ Manual name input (auto from OAuth)
- ❌ Unified login endpoint
- ❌ Demo credentials (keep for testing, hide in production)

**Code Changes Required:**
```typescript
// app/(auth)/login.tsx
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState(null);
  // "google" | "worker" | null
  
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      
      // Call backend Google OAuth
      const response = await api.post("/auth/google-login", {
        token: tokens.idToken
      });
      
      await login({
        email: response.data.user.email,
        name: response.data.user.name,
        role: "client", // Always client for Google
        token: response.data.token
      });
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  return (
    <>
      {loginMethod === null && <MethodSelector />}
      {loginMethod === "google" && <GoogleLoginFlow />}
      {loginMethod === "worker" && <WorkerLoginFlow />}
    </>
  );
}
```

### 3. Update auth.api.js

**Change Endpoints:**
```javascript
// OLD - Unified endpoint
export const login = async ({ email, name, role, password }) => {
  return api.post("/auth/login", { email, name, role });
};

// NEW - Separate endpoints
export const googleLogin = async (googleToken) => {
  return api.post("/auth/google-login", { token: googleToken });
};

export const workerLogin = async ({ email, password }) => {
  return api.post("/auth/worker/login", { email, password });
};

export const adminLogin = async ({ email, password }) => {
  // Optional - for future admin panel
  return api.post("/auth/admin/login", { email, password });
};
```

### 4. Implement Token Refresh Mechanism

**Critical Issue:** Token expires in 7 days but no refresh!

**Solution:**
```javascript
// src/utils/tokenRefresh.js
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token");
    const newToken = response.data.token;
    
    await AsyncStorage.setItem("token", newToken);
    return newToken;
  } catch (error) {
    // Refresh failed - force logout
    throw error;
  }
};

// In axios.js interceptor:
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired
      try {
        await refreshToken();
        // Retry original request
        return api(error.config);
      } catch {
        // Refresh failed - logout user
        AuthContext.logout();
      }
    }
    return Promise.reject(error);
  }
);
```

**Backend Implementation Needed:**
```javascript
// backend/src/routes/auth.routes.js - ADD THIS ENDPOINT
router.post("/auth/refresh-token", authMiddleware, async (req, res) => {
  // Generate new token from current req.user
  const newToken = generateToken(req.user.id, req.user.role);
  res.json({ token: newToken });
});
```

### 5. Update AuthContext.js

**Changes:**
```javascript
// src/context/AuthContext.js

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  
  // NEW: Handle different auth methods
  const login = async (credentials) => {
    try {
      let response;
      
      if (credentials.method === "google") {
        response = await googleLogin(credentials.googleToken);
      } else if (credentials.method === "worker") {
        response = await workerLogin({
          email: credentials.email,
          password: credentials.password
        });
      }
      
      const token = response.data.token;
      await AsyncStorage.setItem("token", token);
      
      // Calculate token expiry
      const decoded = jwt_decode(token);
      setTokenExpiry(decoded.exp * 1000);
      
      // Set auto-refresh timer
      scheduleTokenRefresh(decoded.exp * 1000);
      
      // Get user data
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };
  
  // NEW: Schedule automatic token refresh
  const scheduleTokenRefresh = (expiryTime) => {
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    
    // Refresh 5 minutes before expiry
    const refreshTime = timeUntilExpiry - (5 * 60 * 1000);
    
    setTimeout(async () => {
      try {
        await refreshToken();
      } catch (error) {
        logout(); // Force logout on refresh failure
      }
    }, refreshTime);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isWorker: user?.role === "worker",
        isClient: user?.role === "client" || user?.role === "user",
        login,
        logout,
        tokenExpiry
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 👤 User Model Alignment

### Backend User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Frontend Needs To Add

**Fields Missing in Frontend:**
```javascript
// Backend supports but frontend doesn't use:
// (Not yet added to User model, but should be)
phone: String,
hostelName: String,
rollNumber: String,
deviceToken: String,
lastActive: Date,
profileImage: String,
emailVerified: Boolean
```

### User Profile Screen (NEW)

**File:** `app/(client)/profile.tsx` or `app/(auth)/profile.tsx`

**Features Needed:**
```javascript
- Display: Name, Email, Hostel, Roll Number, Phone
- Edit: Name, Phone, Hostel, Roll Number
- Change Password
- Notification Settings
- Device Token Registration
- Logout Button
- Delete Account Option
```

**Implementation:**
```typescript
// app/(client)/profile.tsx
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  
  useEffect(() => {
    // Load user profile
    // GET /auth/me or GET /users/profile
    loadProfile();
  }, []);
  
  const handleSaveProfile = async () => {
    // PUT /users/profile
    await api.put("/users/profile", {
      name: profile.name,
      phone: profile.phone,
      hostelName: profile.hostelName,
      rollNumber: profile.rollNumber
    });
  };
  
  const handleChangePassword = async () => {
    // POST /users/change-password
  };
  
  const handleRegisterDeviceToken = async () => {
    // POST /users/device-token
    // For push notifications
  };
}
```

**Backend Endpoints Needed:**
```
PUT /users/profile              - Update user profile
POST /users/change-password     - Change password
POST /users/device-token        - Register device token
DELETE /users/account           - Delete account
GET /users/profile              - Get full profile
```

---

## 📋 Complaint Data Model Changes

### Backend Complaint Model (Full)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User) ← IMPORTANT
  type: "hostel" | "campus",
  
  // Hostel-specific
  hostelName: String,
  floor: String,
  visibility: "public" | "private",
  roomNumber: String (conditional),
  landmark: String (conditional),
  
  // Campus-specific
  area: String,
  locationAddress: String,
  
  // Common
  description: String (20-500 chars),
  departmentId: ObjectId,
  priority: "low" | "medium" | "high",
  status: "new" | "assigned" | "in-progress" | "closed",
  
  // Location (IMPORTANT)
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

### Frontend Changes Required

**1. Update Create Complaint Forms**

**Current Issues:**
- ⚠️ No validation on description length (20-500)
- ⚠️ No image compression
- ⚠️ Missing priority field
- ⚠️ Location not sent as GeoJSON

**Hostel Form Changes:**
```typescript
// app/(client)/create-complaint-hostel.tsx
import { useState } from "react";

export default function CreateHostelComplaint() {
  const [form, setForm] = useState({
    type: "hostel",
    hostelName: "",
    floor: "",
    visibility: "public", // Add default
    roomNumber: "",       // Conditional
    landmark: "",         // Conditional
    description: "",
    departmentId: "",
    priority: "medium",   // ADD THIS
    location: { lat: null, lng: null },
    coordinates: null,    // Will be auto-set by backend
    images: []
  });
  
  const handleSubmit = async () => {
    // Validation
    if (form.description.length < 20 || form.description.length > 500) {
      Alert.alert("Description must be 20-500 characters");
      return;
    }
    
    // Prepare payload
    const payload = {
      type: "hostel",
      hostelName: form.hostelName,
      floor: form.floor,
      visibility: form.visibility,
      ...(form.visibility === "private" && { roomNumber: form.roomNumber }),
      ...(form.visibility === "public" && { landmark: form.landmark }),
      description: form.description,
      departmentId: form.departmentId,
      priority: form.priority,
      location: {
        lat: form.location.lat,
        lng: form.location.lng
      },
      images: form.images
    };
    
    // Create
    const response = await createComplaint(payload);
  };
}
```

**Campus Form Changes:**
```typescript
// app/(client)/create-complaint-campus.tsx
// Similar changes - add priority field, validation

// Auto-public visibility for campus
const [form, setForm] = useState({
  type: "campus",
  area: "",
  locationAddress: "",
  description: "",
  departmentId: "",
  priority: "medium",    // ADD THIS
  location: { lat: null, lng: null },
  images: [],
  visibility: "public"   // Always public, auto-set
});
```

**2. Update Complaint Detail Screen**

**Current:**
```typescript
// app/(client)/complaint-detail/[id].tsx
// Shows: description, images, upvote, supporters, comments
```

**Needs:**
```typescript
// ADD THESE SECTIONS:
- Priority badge (low/medium/high)
- Assignment info (if assigned)
- Task status (if assigned)
- Worker contact (if assigned)
- Full timeline of status changes
- Location on map
- Exact addresses
```

**Code Changes:**
```typescript
export default function ComplaintDetail() {
  const [complaint, setComplaint] = useState(null);
  
  return (
    <ScrollView>
      {/* Existing */}
      <StatusBadge status={complaint.status} />
      <Image source={{ uri: complaint.images[0] }} />
      <Text>{complaint.description}</Text>
      
      {/* ADD: Priority Badge */}
      <PriorityBadge priority={complaint.priority} />
      
      {/* ADD: Assignment Info */}
      {complaint.assignedWorkerId && (
        <AssignmentCard
          workerName={complaint.assignedWorker.name}
          workerPhone={complaint.assignedWorker.phone}
          status={complaint.assignedTask.status}
        />
      )}
      
      {/* ADD: Location on Map */}
      <MapView
        initialRegion={{
          latitude: complaint.location.lat,
          longitude: complaint.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      />
      
      {/* ADD: Timeline */}
      <Timeline events={complaint.timeline} />
      
      {/* Existing */}
      <UpvoteSection />
      <CommentsSection />
    </ScrollView>
  );
}
```

**3. Update Complaint Card Component**

**Add Missing Fields:**
```typescript
// components/ComplaintCard.tsx
export default function ComplaintCard({ complaint }) {
  return (
    <View style={styles.card}>
      {/* Existing */}
      <Image source={{ uri: complaint.images[0] }} />
      <Text>{complaint.description.substring(0, 100)}...</Text>
      <StatusBadge status={complaint.status} />
      
      {/* ADD */}
      <PriorityBadge priority={complaint.priority} />
      <Text>Supporters: {complaint.supporters.length}</Text>
      <View style={styles.locationInfo}>
        <Ionicons name="location" size={14} />
        <Text>{complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}</Text>
      </View>
    </View>
  );
}
```

---

## 🔌 API Endpoint Changes

### Update API Wrappers

**File:** `src/api/complaint.api.js`

**Changes Required:**

```javascript
// EXISTING - Update
export const createComplaint = async (complaintData) => {
  // Previous: POST /complaints
  // Data: { description, departmentId, ... }
  
  // New: Must include ALL fields
  const payload = {
    type: complaintData.type, // hostel | campus
    hostelName: complaintData.hostelName,
    floor: complaintData.floor,
    visibility: complaintData.visibility,
    roomNumber: complaintData.roomNumber,
    landmark: complaintData.landmark,
    area: complaintData.area,
    locationAddress: complaintData.locationAddress,
    description: complaintData.description,
    departmentId: complaintData.departmentId,
    priority: complaintData.priority, // NEW
    location: {
      lat: complaintData.location.lat,
      lng: complaintData.location.lng
    },
    images: complaintData.images
  };
  
  return api.post("/complaints", payload);
};

// EXISTING - Update
export const updateComplaint = async (complaintId, complaintData) => {
  // NEW ENDPOINT - currently doesn't exist
  // PUT /complaints/:id
  return api.put(`/complaints/${complaintId}`, complaintData);
};

// EXISTING - Need to verify
export const deleteComplaint = async (complaintId) => {
  // NEW ENDPOINT - currently doesn't exist
  // DELETE /complaints/:id
  return api.delete(`/complaints/${complaintId}`);
};

// EXISTING - Update to handle all fields
export const getComplaintById = async (complaintId) => {
  // GET /complaints/:id
  // Should return full complaint object
  const response = await api.get(`/complaints/${complaintId}`);
  return response.data;
};

// NEW - Comment endpoints
export const getComments = async (complaintId) => {
  // GET /complaints/:id/comments
  return api.get(`/complaints/${complaintId}/comments`);
};

export const addComment = async (complaintId, text) => {
  // POST /complaints/:id/comments
  return api.post(`/complaints/${complaintId}/comments`, {
    text: text
  });
};

export const deleteComment = async (complaintId, commentId) => {
  // DELETE /complaints/:id/comments/:commentId
  return api.delete(`/complaints/${complaintId}/comments/${commentId}`);
};

// EXISTING - Need verification
export const getAllComplaints = async (filters = {}) => {
  // GET /complaints?type=hostel&departmentId=...&status=...
  const query = new URLSearchParams(filters).toString();
  return api.get(`/complaints?${query}`);
};

// NEW - Advanced search
export const searchComplaints = async (searchTerm) => {
  // GET /complaints/search?q=searchTerm
  return api.get("/complaints/search", {
    params: { q: searchTerm }
  });
};

// NEW - Geo-based search
export const getComplaintsNearby = async (lat, lng, radiusKm = 5) => {
  // GET /complaints/nearby?lat=28.5&lng=77.2&radius=5
  return api.get("/complaints/nearby", {
    params: { lat, lng, radius: radiusKm }
  });
};
```

### New Backend Endpoints Needed

```
Authentication:
POST /auth/refresh-token         - Refresh JWT token
GET /auth/me                     - Get current user
GET /auth/me/profile             - Get full profile

Users:
GET /users/:id                   - Get user details
PUT /users/:id                   - Update user
PUT /users/:id/password          - Change password
DELETE /users/:id                - Delete account
POST /users/device-token         - Register push token

Complaints:
GET /complaints                  - List all
POST /complaints                 - Create complaint
GET /complaints/:id              - Get detail
PUT /complaints/:id              - Update complaint
DELETE /complaints/:id           - Delete complaint
GET /complaints/search           - Search complaints
GET /complaints/nearby           - Geo search
POST /complaints/:id/upvote      - Upvote
DELETE /complaints/:id/upvote    - Remove upvote

Comments:
GET /complaints/:id/comments     - List comments
POST /complaints/:id/comments    - Add comment
DELETE /complaints/:id/comments/:commentId - Delete comment
PUT /complaints/:id/comments/:commentId - Edit comment

Interactions:
GET /interactions                - List interactions
POST /interactions               - Create interaction
```

---

## 🧠 Context & State Management Changes

### AuthContext Updates

**File:** `src/context/AuthContext.js`

**Current:**
```javascript
{
  user,
  loading,
  isAuthenticated,
  isWorker,
  isClient,
  login(),
  logout()
}
```

**Required Updates:**
```javascript
{
  // Existing
  user,
  loading,
  isAuthenticated,
  isWorker,
  isClient: user?.role === "client" || user?.role === "user", // Handle both
  
  // NEW - Add these
  login(credentials),     // Handle multiple auth methods
  logout(),
  
  // NEW - Token management
  tokenExpiry,           // Timestamp of token expiry
  refreshToken(),        // Manual refresh (if needed)
  
  // NEW - Error handling
  authError,             // Current auth error message
  clearError(),          // Clear error message
  
  // NEW - Loading states
  isLoggingIn,           // Login in progress
  isRefreshingToken,     // Token refresh in progress
  
  // NEW - Device token
  deviceToken,           // Push notification token
  registerDeviceToken(token) // Register for push
}
```

### New State Providers (Optional)

```typescript
// src/context/NotificationContext.ts (NEW)
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  return (
    <NotificationContext.Provider value={{ notifications, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

// src/context/LocationContext.ts (NEW)
export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  
  return (
    <LocationContext.Provider value={{ userLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
```

---

## 🎨 Component Updates

### 1. Update LoginScreen Component

**Changes:**
```typescript
// OLD: Single login method
// NEW: Three paths
- Google OAuth (Users)
- Worker login (Workers)
- Password recovery

// Add:
- Login method selector screen
- Google sign-in button
- Worker email/password form
- Forgot password link
- Terms acceptance
- Domain restriction info
```

### 2. Update Dashboard Component

**Changes:**
```typescript
// Add:
- Notifications count badge
- Quick access to profile
- Recent activity feed
- Status filters for complaints
- Recent notifications preview
```

### 3. Update Complaint Detail Screen

**Changes:**
```typescript
// Add:
- Priority badge
- Assignment information
- Worker details if assigned
- Timeline of changes
- Map view of location
- Edit button (for own complaints)
- Delete button (for own complaints)
- Share functionality
```

### 4. Update Browse Screen

**Changes:**
```typescript
// Add:
- Advanced filters
- Search box
- Map view toggle
- Saved complaints
- Sort by distance
- Sort by priority
```

### 5. Update My Complaints Screen

**Changes:**
```typescript
// Add:
- Bulk actions
- Export to PDF
- Filter by priority
- Filter by date range
- Mark all as read
```

### 6. New Components Needed

```typescript
// components/PriorityBadge.tsx
export default function PriorityBadge({ priority }) {
  // Show: Low (gray), Medium (yellow), High (red)
}

// components/AssignmentCard.tsx
export default function AssignmentCard({ task, worker }) {
  // Show: Worker info, task status, progress
}

// components/CommentsList.tsx
export default function CommentsList({ comments, onAdd, onDelete }) {
  // Show all comments, add comment form, delete own comments
}

// components/Timeline.tsx
export default function Timeline({ events }) {
  // Show status change timeline
}

// components/Map.tsx
export default function MapView({ location, complaints }) {
  // Map with markers
}

// components/LocationPicker.tsx
export default function LocationPicker({ onLocationSelect }) {
  // Pick location from map or address search
}

// components/ImageUploader.tsx
export default function ImageUploader({ onImagesSelect }) {
  // Pick images, compress, preview
}
```

---

## ✔️ Error Handling & Validation

### Add Input Validation

**Complaint Form Validation:**
```javascript
const validateComplaint = (data) => {
  const errors = {};
  
  // Description: 20-500 chars
  if (!data.description || data.description.length < 20) {
    errors.description = "Min 20 characters";
  }
  if (data.description.length > 500) {
    errors.description = "Max 500 characters";
  }
  
  // Department: required
  if (!data.departmentId) {
    errors.departmentId = "Select a department";
  }
  
  // Priority: required
  if (!data.priority || !["low", "medium", "high"].includes(data.priority)) {
    errors.priority = "Select a priority";
  }
  
  // Type-specific validation
  if (data.type === "hostel") {
    if (!data.hostelName) errors.hostelName = "Required";
    if (!data.floor) errors.floor = "Required";
    if (data.visibility === "private" && !data.roomNumber) {
      errors.roomNumber = "Required for private";
    }
    if (data.visibility === "public" && !data.landmark) {
      errors.landmark = "Required for public";
    }
  }
  
  if (data.type === "campus") {
    if (!data.area) errors.area = "Required";
    if (!data.locationAddress) errors.locationAddress = "Required";
    if (!data.location.lat || !data.location.lng) {
      errors.location = "Select location on map";
    }
  }
  
  // Images: optional but recommended
  if (!data.images || data.images.length === 0) {
    // Warn but don't error
  }
  
  return errors;
};
```

### Improve Error Handling

**Current:**
```javascript
try {
  await complaintAPI.create(data);
} catch (error) {
  Alert.alert("Error", error.message);
}
```

**Required:**
```javascript
try {
  await complaintAPI.create(data);
} catch (error) {
  // Different handling based on error type
  if (error.response?.status === 400) {
    // Validation error
    handleValidationError(error.response.data.errors);
  } else if (error.response?.status === 401) {
    // Token expired
    await refreshToken();
    // Retry request
  } else if (error.response?.status === 403) {
    // Not authorized
    showErrorToast("You don't have permission");
  } else if (error.response?.status === 500) {
    // Server error
    showErrorToast("Server error - try again later");
  } else if (error.message === "Network Error") {
    // Offline
    showErrorToast("Check your internet connection");
  }
}
```

---

## 🔒 Security & Headers

### Verify CORS Configuration

**Backend (server.js) - Should Have:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Frontend Axios Configuration

**File:** `src/api/axios.js`

**Update:**
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor - Handle token expiry
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Token expired - try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await api.post('/auth/refresh-token');
        const newToken = refreshResponse.data.token;
        
        await AsyncStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout
        await AsyncStorage.removeItem('token');
        // Trigger logout in app
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🆕 New Features to Implement

### 1. Google OAuth Login

**Steps:**
1. Install: `expo-auth-session` and `@react-native-google-signin/google-signin`
2. Configure Google OAuth credentials
3. Add login button to LoginScreen
4. Call backend `/auth/google-login` endpoint
5. Auto-create user account on first login

### 2. Token Refresh Mechanism

**Steps:**
1. Add `/auth/refresh-token` endpoint to backend
2. Implement auto-refresh in AuthContext
3. Set up 5-minute before expiry refresh
4. Handle refresh failure with logout

### 3. Comment System

**Steps:**
1. Add comment API endpoints to backend
2. Create CommentsList component
3. Add comment input to ComplaintDetail
4. Implement real-time comment updates

### 4. User Profile Management

**Steps:**
1. Create profile screen
2. Add edit capability for name, phone, hostel
3. Implement change password
4. Add device token registration

### 5. Push Notifications

**Steps:**
1. Set up Expo Push Notifications
2. Register device token on login
3. Store device token in backend
4. Send notifications from backend

### 6. Real-Time Updates

**Steps:**
1. Set up WebSocket connection
2. Subscribe to complaint status changes
3. Update UI in real-time
4. Reconnect on connection loss

### 7. Offline Mode

**Steps:**
1. Cache API responses locally
2. Queue requests while offline
3. Sync when online
4. Show offline indicator

---

## 📊 Implementation Priority

### Phase 1: CRITICAL (Week 1) 🔴
- [ ] Google OAuth login
- [ ] Token refresh mechanism
- [ ] Fix role field (user vs client)
- [ ] Comment API integration
- [ ] Input validation

**Estimated Time:** 5-7 days

### Phase 2: HIGH (Week 2) 🟡
- [ ] User profile management
- [ ] Error handling improvements
- [ ] Priority field in complaints
- [ ] Device token registration
- [ ] Complaint editing/deletion

**Estimated Time:** 5-7 days

### Phase 3: MEDIUM (Week 3-4) 🟢
- [ ] Push notifications
- [ ] Real-time updates (WebSocket)
- [ ] Advanced search
- [ ] Geo-based filtering
- [ ] Offline mode

**Estimated Time:** 7-10 days

### Phase 4: NICE-TO-HAVE (Week 4+) 🔵
- [ ] Advanced analytics
- [ ] Social features
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Performance optimization

**Estimated Time:** Ongoing

---

## 🧪 Testing Requirements

### Unit Tests Needed

```javascript
// Test validation functions
test/validation.test.js
- validateComplaint()
- validateEmail()
- validatePassword()

// Test API calls
test/api.test.js
- login()
- createComplaint()
- getComments()

// Test context
test/AuthContext.test.js
- login flow
- logout flow
- token refresh
```

### Integration Tests Needed

```javascript
// Test full flows
test/auth.integration.test.js
- Google login flow
- Worker login flow
- Token refresh flow

test/complaint.integration.test.js
- Create complaint flow
- Add comment flow
- Update complaint flow
```

### E2E Tests Needed

```javascript
// Test real user scenarios
e2e/user.e2e.test.js
- User registers and logs in
- User creates complaint
- User adds comment
- User browses complaints
```

### Manual Testing Checklist

- [ ] Google OAuth login works
- [ ] Token auto-refreshes before expiry
- [ ] Comments can be added/deleted
- [ ] Offline mode works
- [ ] Push notifications received
- [ ] Profile can be edited
- [ ] All validations work
- [ ] Error messages clear
- [ ] Performance acceptable
- [ ] No memory leaks

---

## 📝 Summary of All Changes

| Component | Change | Type | Priority |
|-----------|--------|------|----------|
| LoginScreen.js | Add Google OAuth button | Feature | 🔴 CRITICAL |
| AuthContext.js | Implement token refresh | Feature | 🔴 CRITICAL |
| auth.api.js | Separate endpoints for auth | Update | 🔴 CRITICAL |
| axios.js | Add token refresh interceptor | Update | 🔴 CRITICAL |
| createComplaint forms | Add priority field, validation | Update | 🟡 HIGH |
| ComplaintDetail.tsx | Add priority, assignment, timeline | Update | 🟡 HIGH |
| CommentsSection | Implement API integration | Feature | 🔴 CRITICAL |
| Profile screen | Create new screen | Feature | 🟡 HIGH |
| Validation | Add complaint validation | Feature | 🟡 HIGH |
| Error handling | Improve error messages | Update | 🟡 HIGH |

---

**Created:** April 22, 2026  
**Last Updated:** April 22, 2026  
**Version:** 1.0

---

## 🎯 Next Steps

1. **Review** this document with your team
2. **Prioritize** which features to implement first
3. **Assign** tasks based on priority
4. **Set up** testing framework
5. **Begin** Phase 1 implementation (Google OAuth + Token Refresh)
