# Sequence Diagrams & Process Flows
## Civic Infrastructure Admin Panel

**Document Version:** 1.0  
**Date:** April 15, 2026  
**Status:** Approved  

---

## 1. Introduction

### 1.1 Purpose
This document defines sequence diagrams showing interaction flows between actors and system components, and swimlane diagrams showing process flows.

### 1.2 Notation

**UML Sequence Diagram:**
- Vertical lines = Actors/Objects (timeline)
- Horizontal arrows = Messages/method calls
- Rectangles on lines = Execution duration
- Dashed arrows = Return values

**Swimlane/Activity Diagrams:**
- Horizontal bars = Responsible actor/department
- Boxes = Activities/actions
- Diamonds = Decisions
- Arrows = Flow direction

---

## 2. Sequence Diagram: User Login

### 2.1 Login Sequence

```
User              Browser              Auth Service         localStorage
│                  │                      │                     │
├─ Enter email     │                      │                     │
├─ password ──────►│                      │                     │
├─ Select dept     │                      │                     │
│                  │                      │                     │
├─ Click Login ────│                      │                     │
│                  │                      │                     │
│                  ├─ Validate input ────►│                     │
│                  │                      │                     │
│                  ├─ loginUser()         │                     │
│                  │ (email, pwd, dept)   │                     │
│                  │◄─ Check USE_MOCK ────┤                     │
│                  │                      │                     │
│                  │  ┌─ If mock: ────────┤                     │
│                  │  │ Search users.js   │                     │
│                  │  │ Return token+user │                     │
│                  │  │                   │                     │
│                  │  │ If real: ─────────┤─ HTTP POST          │
│                  │  │ /auth/login       │ /auth/login         │
│                  │  │                   │                     │
│                  │◄─ Return {token,user}│                     │
│                  │                      │                     │
│                  ├──────────────────────────────────────────►│
│                  │ localStorage.setItem('token', token)       │
│                  │                                            │
│                  ├──────────────────────────────────────────►│
│                  │ localStorage.setItem('user', JSON.stringify)
│                  │                                            │
│                  │ Success! Redirect to /admin/dashboard      │
│◄─ Dashboard ─────│                      │                     │
  displayed        │                      │                     │
```

**Participants:**
1. User — Department administrator
2. Browser — React application
3. Auth Service — auth.js API functions
4. localStorage — Client-side persistent storage

**Key Points:**
- Email, password, department credentials collected
- Auth service checks `USE_MOCK` flag
- If mock: Validates against users.js
- If real (Phase 2): Calls backend API
- Token and user stored in localStorage
- Redirect to dashboard on success

---

## 3. Sequence Diagram: Dashboard Load

### 3.1 Dashboard Load Sequence

```
User              Dashboard              API Services         Data Sources
│                 Component              (auth, dashboard)    (Mock/API)
│                 │                      │                    │
├─ Navigate to ───►│                      │                    │
  Dashboard        │                      │                    │
│                  │                      │                    │
│                  ├─ useEffect() ───────►│                    │
│                  │ (componentDidMount)  │                    │
│                  │                      │                    │
│                  ├─ getUser() ──────────┼► Read localStorage │
│                  │ from localStorage    │                    │
│                  │◄──────────────────────── {user object}    │
│                  │                      │                    │
│                  ├─ Promise.all:        │                    │
│                  │ ├─ fetchStats()      │                    │
│                  │ ├─ fetchComplaints() │                    │
│                  │ └─ getWorkers()      │                    │
│                  │                      │                    │
│                  │                      ├─ Check USE_MOCK ──►│
│                  │                      │                    │
│                  │                      ├─ If mock: ────────►│
│                  │                      │ Load from files    │
│                  │                      │ Filter by dept     │
│                  │                      │◄── stats, complaints,
│                  │                      │    workers        │
│                  │                      │                    │
│                  │                      ├─ If real (Phase2):─┤
│                  │                      │ GET /api/stats     │
│                  │                      │ GET /api/complaints│
│                  │                      │ GET /api/workers   │
│                  │                      │◄── aggregated JSON │
│                  │                      │                    │
│                  │◄─ All data returned ─┤                    │
│                  │                      │                    │
│  [Loading done]  │                      │                    │
│                  ├─ setState(           │                    │
│                  │  stats,             │                    │
│                  │  complaints,        │                    │
│                  │  workers)           │                    │
│                  │                      │                    │
│  ┌─ Render ──────┤                      │                    │
│  │ StatsCards    │                      │                    │
│  │ DonutChart    │                      │                    │
│  │ ComplaintsT   │                      │                    │
│  │ WorkersList   │                      │                    │
│  └─              │                      │                    │
│◄─ Dashboard ─────│                      │                    │
  complete         │                      │                    │
```

**Participants:**
1. User — Administrator
2. Dashboard Component — React component
3. API Services — auth.js, dashboardApi.js
4. Data Sources — Mock files or backend API

**Key Points:**
- Dashboard loads on mount
- Reads user from localStorage
- Fetches stats, complaints, workers in parallel
- Applies department filter
- Renders all components after data arrives

---

## 4. Sequence Diagram: Update Complaint Status

### 4.1 Complaint Status Update

```
Admin            Complaints              API Service          Backend/
Page             Component                                   localStorage
│                │                       │                   │
├─ Click         │                       │                   │
  complaint      │                       │                   │
│                ├─ Open detail modal   │                   │
│                │                       │                   │
├─ Select new ──►│                       │                   │
  status         │                       │                   │
│                │                       │                   │
├─ Click         │                       │                   │
  Confirm ───────┤                       │                   │
│                │                       │                   │
│                ├─ Validate status ────►│                   │
│                │ transition           │                   │
│                │◄─ Validation OK ─────┤                   │
│                │                       │                   │
│                ├─ updateComplaintStatus()                 │
│                │ (complaintId, newStatus)
│                │                       ├─ Check USE_MOCK ─►│
│                │                       │                   │
│                │                       ├─ If mock: ───────►│
│                │                       │ Update state      │
│                │                       │◄─ {id, status}    │
│                │                       │                   │
│                │                       ├─ If real: ────────┤
│                │                       │ PATCH /complaints │
│                │                       │ /:id/status       │
│                │                       │◄─ {success}       │
│                │                       │                   │
│                │◄─ Status updated ─────┤                   │
│                │                       │                   │
│                ├─ Show success msg    │                   │
│                │ "Status updated"     │                   │
│                │                       │                   │
│  [Close Modal] ├─ Refresh table       │                   │
│                │ Re-render with       │                   │
│                │ new status           │                   │
│◄─ Updated ─────│                       │                   │
  complaint      │                       │                   │
  visible        │                       │                   │
```

**Alternative: Update Fails**
```
...
│                │                       │◄─ [Error 500]     │
│                │◄─ Error returned ─────┤                   │
│                │                       │                   │
│                ├─ Show error msg:      │                   │
│                │ "Failed to update.    │                   │
│                │ Retry?"               │                   │
├─ Click ────────├─ retry() ─────────────┤─ Retry PATCH ────►│
  Retry          │                       │                   │
│                │◄──────────── [Success]────────────────────┤
│                │                       │                   │
│                ├─ Refresh & close      │                   │
│◄─ Updated ─────│                       │                   │
```

---

## 5. Swimlane Diagram: Complaint Handling Process

### 5.1 End-to-End Complaint Resolution

```
┌──────────────────────────────────────────────────────────────────┐
│ COMPLAINT HANDLING WORKFLOW                                      │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────┬──────────────────┬──────────────────┬─────────────┐
│  CITIZEN        │  ADMIN PANEL     │  WORKER          │  SYSTEM     │
├─────────────────┼──────────────────┼──────────────────┼─────────────┤
│                 │                  │                  │             │
│ Submit Issue    │                  │                  │             │
│       ├─────────┼──►Complaint.....├─────────────────┼──► D1: Store │
│       │ │       │  Created         │                  │  complaint  │
│       │ │       │  Status: Pending │                  │             │
│       │ │       │           │      │                  │             │
│       │ │    [Assign Worker]       │                  │             │
│       │ │       │           │      │                  │             │
│       │ │       └───────────┼─────►Worker             │             │
│       │ │                   │  Receives              │             │
│       │ │                   │  Assignment            │             │
│       │ │                   │      │                  │             │
│       │ │      [Update Status]    │                  │             │
│       │ │       │      ╔═══════════╧════╗           │             │
│       │ │       │      ║ in-progress    ║           │             │
│       │ │       │      ╚═════════════════╝           │             │
│       │ │       │           │                        │             │
│       │ │       │           ▼                        │             │
│       │ │       │      Working on...                 │ D1: Update  │
│       │ │       │           │                        │  status     │
│       │ │       │      [Resolve]                     │             │
│       │ │       │      ╔═══════════╗                │             │
│       │ │       │      ║ resolved  ║◄──────────────►│ D1: Update  │
│       │ │       │      ╚═══════════╝ Mark Complete  │  & Resolve  │
│       │ │       │      Notify Admin                  │             │
│       │ │       │           │                        │             │
│       │ │       │      [Provide Rating]              │             │
│       │ │       │           │                        │             │
│       │ │  ┌──►[Show Resolution Details]            │             │
│       │ └──┤     Status: Resolved                    │ D1: Update  │
│       │    │     Assigned to: [Worker]              │  rating &   │
│       │    │     Completed: [Date]                  │  feedback   │
│       │    │     Rating: 4.5 stars                  │             │
│       │    └──────────────►Summary Saved            │             │
│       │     Citizen Satisfied                        │             │
│       │                                              │             │
└───────┴─────────────────────────────────────────────┴─────────────┘

Legend:
┌──────┐  = Process Box (Activity)
╔════╗    = Status Change
```

**Key Milestones:**
1. **Complaint Created** — Status: Pending
2. **Worker Assigned** — Admin assigns to available worker
3. **In Progress** — Admin or worker updates status
4. **Resolved** — Worker marks complete
5. **Feedback** — Citizen rates resolution
6. **Closed** — Marked as complete; worker rating updated

---

## 6. Activity Diagram: Dashboard Refresh Flow

### 6.1 Dashboard Refresh Process

```
                      Start
                        │
                        ▼
                    ┌────────┐
                    │ Check  │
                    │ Token  │
                    └───┬────┘
                        │
            ┌───────────┴────────────┐
       [Valid]                   [Invalid]
            │                        │
            ▼                        ▼
        ┌────────┐              ┌──────────┐
        │Fetch   │              │Redirect  │
        │Stats   │              │to Login  │
        └───┬────┘              └──────────┘
            │
            ├──────────────┐
            │              │
            ▼              ▼
        ┌──────┐   ┌──────────────┐
        │Fetch │   │ Fetch        │
        │Jobs  │   │ Complaints   │
        └───┬──┘   └────────┬─────┘
            │                │
            └────────┬───────┘
                     │
                     ▼
              ┌────────────────┐
              │ Wait for all   │
              │ data           │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │ Transform &    │
              │ Filter data    │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │ Update state   │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │ Trigger        │
              │ Re-render      │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │ Components     │
              │ Render         │
              └────────┬───────┘
                       │
                       ▼
                   Done
```

---

## 7. Swimlane Diagram: Shift Assignment Process

### 7.1 Weekly Shift Scheduling Workflow

```
┌────────────────┬──────────────────┬──────────────┐
│ ADMIN          │ SYSTEM           │ DATABASE     │
├────────────────┼──────────────────┼──────────────┤
│                │                  │              │
│View Schedule   │                  │              │
│      │─────────┼─►Load current     │              │
│      │ │       │   week shifts    │              │
│      │ │       │           │       │              │
│      │ │  [Check USE_MOCK]│       │              │
│      │ │       │           ├──────┼──►Get shifts │
│      │ │       │           │       │   from DB   │
│      │ │       │◄──────────┴───────┤──── [Phase2]
│      │ │       │   Or load mock    │              │
│      │ │       │           │       │              │
│      │ │    [Render Grid]  │       │              │
│      │ └──►Mon-Sun (Days)  │       │              │
│      │    Workers (Rows)  │       │              │
│      │           │        │       │              │
│Edit Shift       │        │       │              │
│      │─────────►│        │       │              │
│ Click cell      │   Edit Mode    │              │
│ [Worker+Date]   │   Selected     │              │
│      │        │           │       │              │
│Select new      │   Show Dropdown:│              │
│shift: Evening  │   Morning       │              │
│      ├────────►│   Evening       │              │
│      │ │       │   Night         │              │
│      │ │       │   Off           │              │
│      │ │       │           │       │              │
│Click Save      │   Validate:     │              │
│      ├────────►│   No conflicts? │              │
│      │ │       │   OK, proceed   │              │
│      │ │       │           │       │              │
│      │ │    [If Mock]       │       │              │
│      │ │       │  Update    │       │              │
│      │ │       │  component │       │              │
│      │ │       │  state     │       │              │
│      │ │       │           │       │              │
│      │ │    [If Real - Ph2] │       │              │
│      │ │       │  PATCH /api│       │              │
│      │ │       │  /shifts   ├──────┼───►UPDATE   │
│      │ │       │  /:id      │       │   shifts    │
│      │ │       │            │◄──────┤────────────►
│      │ │       │  Success!   │       │              │
│      │ │       │            │       │              │
│ See update     │   Re-render │       │              │
│ on grid        │   cell     │       │              │
│      │◄────────┤   Evening   │       │              │
│      │    │       │       │              │
│      │    │  Move to next day       │
│      │    │       │       │              │
└──────┴────┴──────────────────────────────┘

Result: Weekly schedule updated with new assignments
```

---

## 8. Error Handling Sequence: Network Failure

### 8.1 API Failure & Recovery

```
Component         API Service       Backend          User Feedback
    │                 │               │                    │
    ├─ Call API ─────►│               │                    │
    │                 │               │                    │
    │                 ├─ HTTP GET ───►│                    │
    │                 │               │                    │
    │                 │        [Network Error]             │
    │                 │        [Timeout after 5s]          │
    │                 │               │                    │
    │                 │◄──────────────┤                    │
    │                 │               │                    │
    │                 ├─ Log error    │                    │
    │                 │               │                    │
    │◄─ Error thrown ─┤               │                    │
    │                 │               │                    │
    ├─ setState(error)│               │                    │
    │                 │               │                    │
    ├─ Show error widget ────────────────────────────────┐│
    │ "Failed to load data"  │                            ││
    │ "Check your connection"│                            ││
    │ [Retry Button]  │◄────────────────────────────────┘│
    │                 │               │                    │
    ├─ User clicks ──┐│               │                    │
    │ Retry          └┼─ Call API ───►│                    │
    │                 │  retry...      │                    │
    │                 │               │                    │
    │                 ├─ [Success 200] │                    │
    │                 │   {data...}    │                    │
    │                 │               │                    │
    │◄─ Return data ──┤               │                    │
    │                 │               │                    │
    ├─ setState(data) │               │                    │
    │ Render          │               │                    │
    │                 │               │                    │
    ├─ Show data ────────────────────────────────────────►│
    │                 │               │  Data loaded       │
    │                 │               │  successfully      │
```

---

## 9. Summary Table: All Sequences

| Sequence | Trigger | Main Actors | Outcome |
|---|---|---|---|
| **Login** | User clicks login | User, Browser, Auth Service | Token stored; dashboard loaded |
| **Dashboard Load** | Page mount | Dashboard, API Services | Stats, complaints, workers rendered |
| **Update Status** | User updates complaint | Component, API, Backend | Complaint status changed |
| **Assign Worker** | User selects worker | Complaints, Workers, API | Complaint assigned |
| **Refresh Data** | User clicks refresh | Dashboard, API Services | All data re-fetched |
| **Error Recovery** | API fails | Component, API, Error handler | User shown error + retry option |

---

**Document End**  
*For detailed visual diagrams, see:*
- `docs/diagrams/Sequence_Diagrams.drawio` — UML sequence diagrams
- `docs/diagrams/Process_Flowcharts.drawio` — Swimlanes and activity diagrams
