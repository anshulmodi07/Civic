# Use Case Specification Document
## Civic Infrastructure Admin Panel

**Document Version:** 1.0  
**Date:** April 15, 2026  
**Status:** Approved  

---

## 1. Introduction

### 1.1 Purpose
This document defines all functional use cases for the Civic Infrastructure Admin Panel. Each use case describes the interaction between actors and the system.

### 1.2 Actor Definitions

**Single Actor Type: Department Admin/Manager**

| Actor | Description | Count | Access |
|---|---|---|---|
| **Admin** | Authorized department manager | 6 (one per department) | Full access to department data |

**Note:** All user roles have identical permissions in Phase 1. Phase 2 may introduce role hierarchy (super-admin, manager, supervisor).

### 1.3 Use Case Overview

```
Total Use Cases: 6

1. UC-001: Authenticate User
2. UC-002: View Dashboard
3. UC-003: Manage Complaints
4. UC-004: Manage Workers
5. UC-005: Schedule Shifts
6. UC-006: Manage Profile
```

---

## 2. Use Case Descriptions

### Use Case UC-001: Authenticate User

#### 2.1.1 Overview

**Use Case Name:** Authenticate User  
**Priority:** CRITICAL  
**Actor:** End User  
**Complexity:** Low  

#### 2.1.2 Description

Administrator logs into the system using department selection, email, and password credentials.

#### 2.1.3 Preconditions

- User has valid email and password credentials
- Administrator account exists in the system
- Browser has JavaScript enabled
- User not already logged in

#### 2.1.4 Main Flow

| Step | Actor | System | Action |
|---|---|---|---|
| 1 | User | - | Navigates to login page (http://localhost:5173/) |
| 2 | - | System | Displays login form with department dropdown |
| 3 | User | - | Selects department from dropdown |
| 4 | User | - | Enters email address in email field |
| 5 | User | - | Enters password in password field |
| 6 | User | - | Clicks "Login" button |
| 7 | - | System | Validates email format (basic regex) |
| 8 | - | System | Checks if email matches credentials (mock or API) |
| 9 | - | System | Checks if password matches credentials |
| 10 | - | System | Checks if department matches user record |
| 11 | - | System | Generates/retrieves token (JWT) |
| 12 | - | System | Stores token and user object in localStorage |
| 13 | - | System | Redirects to /admin/dashboard |
| 14 | - | System | Loads dashboard with user's department data |

#### 2.1.5 Alternative Flows

**Alternative Flow A: Invalid Email Format**
- Step 7: System detects invalid email format
- System shows error: "Please enter a valid email address"
- User corrects email and retries (return to Step 6)

**Alternative Flow B: Invalid Credentials**
- Step 8-10: System finds no matching user record
- System shows error: "Invalid email or password"
- User re-enters credentials (return to Step 4)

**Alternative Flow C: Show Password Toggle**
- Step 5: User clicks "Show password" toggle
- System unhides password characters
- User can verify password before login

**Alternative Flow D: Empty Field Validation**
- Step 6: User clicks login with empty field(s)
- System highlights empty fields in red
- System shows error: "Please fill in all fields"
- User enters values (return to Step 4)

#### 2.1.6 Postconditions

**Success:**
- User session created and stored in localStorage
- User redirected to dashboard
- User can access department-filtered data
- Logout button visible in navbar

**Failure:**
- User remains on login page
- Error message displayed
- User can retry login

#### 2.1.7 Business Rules

- Email matching is case-insensitive
- Password matching is case-sensitive
- Account must belong to selected department
- Session timeout: 30 minutes of inactivity (Phase 2)
- Maximum 5 login attempts per email per 10 minutes (Phase 2)

#### 2.1.8 Related Use Cases

- UC-006: Manage Profile (view after login)
- [Logout] (inverse operation)

---

### Use Case UC-002: View Dashboard

#### 2.2.1 Overview

**Use Case Name:** View Dashboard  
**Priority:** CRITICAL  
**Actor:** Admin  
**Complexity:** Medium  

#### 2.2.2 Description

Administrator views the department dashboard displaying key metrics, complaint overview, and worker status.

#### 2.2.3 Preconditions

- User must be authenticated (logged in)
- Valid token in localStorage
- Internet connectivity available
- Dashboard data available (mock or backend)

#### 2.2.4 Main Flow

| Step | Actor | System | Action |
|---|---|---|---|
| 1 | User | - | Navigates to /admin/dashboard (via menu or direct URL) |
| 2 | - | System | Checks localStorage for valid token |
| 3 | - | System | If invalid/missing: Redirect to login |
| 4 | - | System | Retrieves user object from localStorage |
| 5 | - | System | Displays greeting: "Welcome, [Name]! ([Department])" |
| 6 | - | System | Shows loading spinner |
| 7 | - | System | Fetches 4 stats (total, resolved, pending, active workers) |
| 8 | - | System | Fetches complaints list for department |
| 9 | - | System | Fetches workers list for department |
| 10 | - | System | All data received; hides loading spinner |
| 11 | - | System | Renders StatsCards (4 metric cards) |
| 12 | - | System | Renders DonutChart with status distribution |
| 13 | - | System | Renders ComplaintsTable (recent 10 complaints) |
| 14 | - | System | Renders WorkersList (active workers) |
| 15 | User | - | Views complete dashboard |

#### 2.2.5 Alternative Flows

**Alternative Flow A: Data Fetch Fails**
- Step 7-9: API call fails (network error, server error)
- System shows error message: "Failed to load data. Retry?"
- Retry button available
- User clicks Retry (return to Step 6)

**Alternative Flow B: User Clicks Refresh**
- Step 15: User clicks refresh icon in navbar
- System shows loading spinner
- System re-fetches all data (return to step 7)

**Alternative Flow C: No Data Available**
- Step 10: Data arrays are empty
- System displays "No complaints" message
- System displays "No workers" message
- Dashboard still renders (empty tables)

#### 2.2.6 Postconditions

**Success:**
- Dashboard fully loaded and displayed
- All 4 stats cards visible with correct values
- Donut chart shows complaint distribution
- Complaints table shows recent entries
- Workers list shows current online/offline status

**Failure:**
- Dashboard partially loaded or error state
- User can retry loading data
- User can navigate to other pages

#### 2.2.7 Business Rules

- Display only department-filtered data
- Stats calculated from complaints dataset
- Donut chart shows: Resolved (green), Pending (yellow), In-Progress (blue)
- Workers list filtered by online status (optional)
- Auto-refresh every 30 seconds (Phase 2)

#### 2.2.8 Related Use Cases

- UC-003: Manage Complaints (click complaint for details)
- UC-004: Manage Workers (view worker details modal)

---

### Use Case UC-003: Manage Complaints

#### 2.3.1 Overview

**Use Case Name:** Manage Complaints  
**Priority:** HIGH  
**Actor:** Admin  
**Complexity:** High  
**Frequency:** Multiple times per day  

#### 2.3.2 Description

Administrator views, searches, filters, sorts, and updates complaint records for their department.

#### 2.3.3 Preconditions

- User authenticated
- Complaints page `/admin/complaints` accessible
- At least one complaint exists for the department (or empty state shown)

#### 2.3.4 Main Flow: View All Complaints

| Step | Actor | System | Action |
|---|---|---|---|
| 1 | User | - | Clicks "Complaints" in sidebar |
| 2 | - | System | Navigates to /admin/complaints |
| 3 | - | System | Fetches all complaints for department |
| 4 | - | System | Displays table with 20 complaints per page |
| 5 | - | System | Shows columns: ID, Title, Location, Status, Worker, Date |
| 6 | - | System | Shows pagination controls (Previous, Next, Jump to page) |
| 7 | User | - | Views complaint table |

#### 2.3.5 Alternative Flows

**Alternative Flow B1: Filter by Status**
- Step 7: User selects filter dropdown "Status"
- User chooses: "Pending" / "In-Progress" / "Resolved"
- System updates table showing only matching status
- Row count updated: "Showing 15 of 45 complaints"

**Alternative Flow B2: Filter by Worker**
- Step 7: User selects filter "Assigned Worker"
- System displays dropdown of department workers
- User selects specific worker
- System filters table: only complaints assigned to that worker

**Alternative Flow B3: Filter by Location**
- Step 7: User selects filter "Location"
- System displays dropdown of unique locations
- User selects location
- System filters complaints for that location

**Alternative Flow B4: Search by Title/Location**
- Step 7: User types in search box: "pothole"
- System filters table in real-time (as user types)
- Matching complaints highlighted
- Search cleared when input cleared

**Alternative Flow B5: Sort by Column**
- Step 7: User clicks column header (e.g., "Date")
- System sorts table by that column (ascending on first click, descending on second)
- Arrow icon shows sort direction
- Click again to toggle sort order

**Alternative Flow B6: Apply Multiple Filters**
- Step 7: User applies Status filter: "Pending"
- User applies Worker filter: "Rajesh Kumar"
- User types search: "water"
- System shows complaints that match ALL criteria (AND logic)

**Alternative Flow B7: Clear All Filters**
- Step 7: User clicks "Clear All Filters" button
- All filters reset
- Table shows all 20 complaints (first page)

#### 2.3.6 Additional Flow: Update Complaint Status

| Step | Actor | System | Action |
|---|---|---|---|
| 1 | User | - | Clicks complaint row to open details modal |
| 2 | - | System | Shows modal with complaint information |
| 3 | - | System | Shows "Status" field with current status |
| 4 | User | - | Clicks status dropdown |
| 5 | - | System | Shows available status values (dropdown) |
| 6 | User | - | Selects new status (e.g., "in-progress") |
| 7 | - | System | Shows confirmation: "Change status to 'in-progress'?" |
| 8 | User | - | Clicks "Confirm" button |
| 9 | - | System | Updates complaint status (Phase 2: API call) |
| 10 | - | System | Shows success message: "Status updated" |
| 11 | - | System | Closes modal or refreshes table |

#### 2.3.7 Additional Flow: Assign Worker

| Step | Actor | System | Action |
|---|---|---|---|
| 1 | User | - | Opens complaint details modal |
| 2 | - | System | Shows "Assigned Worker" field |
| 3 | - | System | If assigned: Shows worker name + "Change" button |
| 4 | - | System | If unassigned: Shows "Unassigned" + "Assign" button |
| 5 | User | - | Clicks "Assign" or "Change" button |
| 6 | - | System | Shows dropdown of available workers |
| 7 | - | System | Indicates worker load: "Rajesh (3/5 tasks)" |
| 8 | User | - | Selects worker from dropdown |
| 9 | - | System | Shows confirmation dialog |
| 10 | User | - | Clicks "Confirm" |
| 11 | - | System | Assigns complaint to worker (Phase 2: API call) |
| 12 | - | System | Shows success message |

#### 2.3.8 Postconditions

**Success:**
- Complaint table displays with filters/search applied
- Pagination works correctly
- Sorting order maintained
- Status and worker updates reflected immediately
- Table refreshes show updated data on next load

**Failure:**
- Update fails → Show error: "Failed to update. Retry?"
- Retry button available

#### 2.3.9 Business Rules

- Cannot filter/search if > 1000 complaints (pagination required)
- Status workflow: pending → in-progress → resolved (no regression)
- Cannot assign worker from different department
- Unassigning resets to "Unassigned" state
- Complaint counts updated in real-time on stats cards

#### 2.3.10 Related Use Cases

- UC-002: View Dashboard (stats updated)
- UC-004: Manage Workers (assign to worker)

---

### Use Case UC-004: Manage Workers

#### 2.4.1 Overview

**Use Case Name:** Manage Workers  
**Priority:** HIGH  
**Actor:** Admin  
**Complexity:** Medium  

#### 2.4.2 Description

Administrator views worker profiles, monitors online status, tracks task progress, and views performance ratings.

#### 2.4.3 Main Flow: View Workers

| Step | Actor | System | Action |
|---|---|---|---|
| 1 | User | - | Clicks "Workers" in sidebar |
| 2 | - | System | Navigates to /admin/workers |
| 3 | - | System | Fetches all workers for department |
| 4 | - | System | Displays workers as grid cards (4 per row, responsive) |
| 5 | - | System | Each card shows: Name, Status, Shift, Task progress, Rating |
| 6 | - | System | Status badge: Green (offline) / Gray (offline) |
| 7 | User | - | Views worker grid |

#### 2.4.4 Alternative Flows

**Alternative Flow A1: Filter by Status**
- Step 7: User clicks filter "Status"
- User selects: "All" / "Online" / "Offline"
- System re-renders grid showing only matching workers

**Alternative Flow A2: Filter by Shift**
- Step 7: User clicks filter "Current Shift"
- User selects: "All" / "Morning" / "Evening" / "Night"
- System updates grid

**Alternative Flow A3: Sort by Column**
- Step 7: User clicks sort dropdown
- Options: "Name" / "Online Status" / "Task Completion %"
- System re-sorts grid

**Alternative Flow A4: Search by Name**
- Step 7: User types worker name in search box
- System filters grid in real-time
- Cards update as user types

**Alternative Flow B: View Worker Details**
- Step 7: User clicks worker card
- System opens modal/drawer showing:
  - Name, Department, Contact number
  - Current shift and status
  - Tasks: X of Y completed (%)
  - Performance rating (stars)
  - Average response time
- User views details
- User clicks close button to dismiss modal

#### 2.4.5 Postconditions

**Success:**
- Workers grid displayed with applied filters/sorts
- Worker status updated in real-time
- Worker details modal opens/closes correctly

#### 2.4.6 Business Rules

- Display only department workers
- Online status refreshed every 30 seconds (Phase 2)
- Rating calculated from complaint feedback (Phase 2)
- Task completion % = completed / total
- Worker load indication: Show current pending tasks

#### 2.4.7 Related Use Cases

- UC-003: Manage Complaints (assign workers)
- UC-005: Schedule Shifts (assign shifts to workers)

---

### Use Case UC-005: Schedule Shifts

#### 2.5.1 Overview

**Use Case Name:** Schedule Shifts  
**Priority:** HIGH  
**Actor:** Admin  
**Complexity:** Medium  

#### 2.5.2 Description

Administrator views and modifies weekly shift schedules for workers.

#### 2.5.3 Main Flow: View Shift Schedule

| Step | Actor | System | Action |
|---|---|---|---|
| 1 | User | - | Clicks "Shift Schedule" in sidebar |
| 2 | - | System | Navigates to /admin/shift |
| 3 | - | System | Displays weekly grid (Monday-Sunday) |
| 4 | - | System | Rows: All department workers; Columns: Days of week |
| 5 | - | System | Shows current week date range |
| 6 | - | System | Each cell color-coded: Morning=Blue, Evening=Orange, Night=Purple, Off=Gray |
| 7 | User | - | Views weekly schedule |

#### 2.5.4 Alternative Flows

**Alternative Flow A1: Navigate Weeks**
- Step 7: User clicks "Previous Week" button
- System displays previous week's schedule
- Date range updated at top

**Alternative Flow A2: Navigate Weeks Forward**
- Step 7: User clicks "Next Week" button
- System displays next week's schedule

**Alternative Flow B: Edit Shift**
- Step 7: User clicks on grid cell (worker + day)
- System shows dropdown: "Morning" / "Evening" / "Night" / "Off"
- User selects new shift
- System updates cell color and text
- Transition (Phase 2: API call to backend)

**Alternative Flow C: Bulk Assign**
- Step 7: User selects multiple cells (Shift+Click)
- System shows "Assign to: [Shift dropdown]"
- User selects shift for all selected cells
- System updates all cells simultaneously

#### 2.5.5 Postconditions

**Success:**
- Shift schedule grid displays correctly
- Navigation between weeks works
- Shift edits visible immediately
- Changes persisted (localStorage Phase 1, API Phase 2)

**Failure:**
- Update fails → Show error: "Failed to save shift"
- Retry option available

#### 2.5.6 Business Rules

- One shift per worker per day
- Shift times: Morning=06-14, Evening=14-22, Night=22-06, Off=No shift
- All shifts for a week must be visible
- No overlapping shifts for same worker (Phase 2 validation)
- Undo recent changes possible (Phase 2)

#### 2.5.7 Related Use Cases

- UC-004: Manage Workers (related entity)
- [Export Schedule] (Phase 2)

---

### Use Case UC-006: Manage Profile

#### 2.6.1 Overview

**Use Case Name:** Manage Profile  
**Priority:** MEDIUM  
**Actor:** Admin  
**Complexity:** Low  

#### 2.6.2 Description

Administrator views and updates their personal profile information.

#### 2.6.3 Main Flow: View Profile

| Step | Actor | System | Action |
|---|---|---|---|
| 1 | User | - | Clicks profile icon in navbar or "Profile" in sidebar |
| 2 | - | System | Navigates to /admin/profile |
| 3 | - | System | Fetches user data from localStorage |
| 4 | - | System | Displays profile card with: Name, Email, Department, User ID, Phone |
| 5 | User | - | Views profile information |

#### 2.6.4 Alternative Flows

**Alternative Flow A: Edit Contact Number**
- Step 5: User clicks "Edit" button next to Contact field
- System shows input field with current phone number
- User changes phone number
- User clicks "Save"
- System validates phone format
- System updates localStorage (Phase 1) / API (Phase 2)
- System shows: "Profile updated successfully"

**Alternative Flow B: Change Password** (Phase 2)
- Step 5: User clicks "Change Password" section
- System shows form: Current Password, New Password, Confirm Password
- User enters all fields
- User clicks "Save"
- System validates:
  - Current password correct
  - New password != current password
  - Passwords match (confirm field)
- System updates password on backend
- System shows: "Password changed"

#### 2.6.5 Postconditions

**Success:**
- Profile information displayed correctly
- Editable fields updated and saved
- Changes persisted across sessions

**Failure:**
- Update fails → Show error: "Failed to update profile"
- User data remains unchanged
- Retry available

#### 2.6.6 Business Rules

- Email and Department not editable
- Name not editable (requires admin approval)
- Phone number must be valid format (10-15 digits)
- Password change requires current password verification
- Profile changes require confirmation before save

---

## 3. Use Case Diagram

```
              ┌───────────────┐
              │   Admin User  │
              └────────┬──────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    UC-001        UC-002        UC-003
  Authenticate    Dashboard    Manage
    (Login)       (View)      Complaints
         │             │             │
         └─────────────┼─────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    UC-004        UC-005        UC-006
   Manage        Schedule      Manage
   Workers       Shifts        Profile
         └─────────────┼─────────────┘
                       │
                  ┌────▼─────┐
                  │  System  │
                  └──────────┘
```

---

## 4. Use Case Summary Table

| UC # | Name | Priority | Complexity | Prerequisites | Key Actions |
|---|---|---|---|---|---|
| 001 | Authenticate | CRITICAL | Low | None | Select dept, enter email/password, login |
| 002 | View Dashboard | CRITICAL | Medium | Authenticated | View stats, complaints, workers |
| 003 | Manage Complaints | HIGH | High | Authenticated | Filter, search, sort, update status, assign worker |
| 004 | Manage Workers | HIGH | Medium | Authenticated | Filter, search, sort, view details |
| 005 | Schedule Shifts | HIGH | Medium | Authenticated | Navigate weeks, edit shifts, update assignments |
| 006 | Manage Profile | MEDIUM | Low | Authenticated | View and update personal information |

---

## 5. Non-Functional Requirements for Use Cases

| Requirement | Details |
|---|---|
| **Performance** | Each use case completes < 2 seconds |
| **Usability** | All use cases navigable within 3 clicks |
| **Accessibility** | All use cases WCAG 2.1 AA compliant |
| **Security** | Department-based access controls enforced |
| **Reliability** | Use cases handle network errors gracefully |

---

**Document End**  
*For visual diagram, see `docs/diagrams/Use_Cases.drawio`*
