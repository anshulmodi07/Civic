You are working on an existing React Native (Expo) mobile application for a **public grievance system for college students**.

Your task is to **refactor and extend the existing codebase** to implement the following structured architecture, data schema, and UI flows.

---

# 🚀 APP OVERVIEW

This app allows students to:

1. Raise complaints (hostel or campus)
2. Track their complaints
3. Browse nearby complaints
4. Interact (upvote/comment)

---

# 🧩 CORE FEATURES

## 1. Home Screen (Dashboard)

The home screen should have 3 main actions:

* Raise Complaint
* My Complaints
* Browse Complaints

Use a clean card/grid UI.

---

## 2. Raise Complaint Flow

User selects complaint type:

* Hostel
* Campus

---

### A. Hostel Complaint Schema

Fields:

* hostel_name (enum or dropdown, max 3 options)
* floor (string or number)
* room_number (string)
* issue_type (enum, 6 types)
* description (text)
* photo (image upload → Supabase Storage)
* created_at (auto timestamp)

---

### B. Campus Complaint Schema

Fields:

* issue_type (enum, 6 types)
* location:

  * landmark (dropdown OR map select)
  * address (manual input fallback)
* description (text)
* photo (image upload)
* created_at (auto timestamp)

---

### Issue Types (enum)

* electrician
* AC
* plumber
* construction
* sanitation
* wifi

---

### Additional Logic

* Add **AI or rule-based validation after description input**
* Prevent empty/low-quality complaints

---

## 3. My Complaints Screen

User can:

* View all complaints they created
* Track status:

  * pending
  * in_progress
  * resolved
* See complaint details
* (Optional future) mark as resolved

---

## 4. Browse Complaints

Features:

* View all complaints (hostel + campus)
* Sort/filter:

  * by issue_type
  * by location
  * by popularity

Each complaint should support:

* Upvote (+1 system)
* Comments (threaded or simple list)

---

# 🗄️ DATABASE DESIGN

## Table: complaints

Columns:

* id (uuid, primary key)
* user_id (foreign key → auth.users)
* type (enum: hostel | campus)
* hostel_name (nullable)
* floor (nullable)
* room_number (nullable)
* issue_type (enum)
* location_landmark (nullable)
* location_address (nullable)
* description (text)
* photo_url (text)
* status (enum: pending, in_progress, resolved)
* upvotes (integer, default 0)
* created_at (timestamp)

---

## Table: comments

* id
* complaint_id (foreign key)
* user_id
* text
* created_at

---

## Table: upvotes

(prevent duplicate votes)

* id
* complaint_id
* user_id

---

# ⚙️ BACKEND ( To be done on later stage.. skip for now)

Implement:

* Auth (email or college login)
* Row Level Security:

  * Users can only edit their own complaints
* Storage:

  * Store complaint images
* Realtime (optional):

  * Live updates for upvotes/comments

---

# 📱 FRONTEND (React Native Expo)

## Tech:

* React Navigation
* Zustand or Context API (state)
---

## Screens Structure:

* HomeScreen
* RaiseComplaintScreen
* ComplaintFormHostel
* ComplaintFormCampus
* MyComplaintsScreen
* BrowseComplaintsScreen
* ComplaintDetailScreen

---

## UI Requirements:

* Clean minimal UI
* Card-based complaint display
* Floating action button (raise complaint)
* Image picker integration
* Dropdowns for enums
* Filter + search bar in browse screen

---

# 🔄 DATA FLOW

1. User submits complaint → stored in Supabase
2. Image uploaded → URL saved
3. Complaint appears in:

   * My Complaints
   * Browse Complaints
4. Users can:

   * Upvote → updates count
   * Comment → stored in comments table

---

# IMPROVEMENTS (OPTIONAL)

* Add geolocation tagging
* Add admin dashboard
* Add complaint verification system
* Add priority ranking (based on upvotes)

---

# YOUR TASK

* Refactor existing codebase to match this structure
* Create reusable components
* Ensure clean folder architecture
* Optimize Supabase queries
* Handle loading + error states properly
---

Return:

* Updated code snippets
* New files if needed
* Refactored components
* Database queries

Make sure everything integrates with the existing codebase.
