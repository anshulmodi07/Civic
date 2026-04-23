# Data Flow Diagrams (DFD)
## Civic Infrastructure Admin Panel

**Document Version:** 1.0  
**Date:** April 15, 2026  
**Status:** Approved  

---

## 1. Introduction

### 1.1 Purpose
This document defines all data flows in the Civic Infrastructure Admin Panel using Data Flow Diagrams (DFD). DFDs visualize how data moves through the system from inputs to storage to outputs.

### 1.2 Using This Document

- **Level 0 (Context Diagram):** Highest-level view; shows system boundary and external entities
- **Level 1 (Detailed DFD):** Breaks down Level 0 into key processes; shows data stores

### 1.3 Notation

- **[circles]** = Processes (system functions)
- **[boxes]** = External entities (users, systems)
- **[cylinders]** = Data stores (databases, localStorage)
- **[arrows]** = Data flows (labeled with data items)

---

## 2. Level 0: Context Diagram

### 2.1 Context Diagram

```
                    ┌────────────────────────────┐
                    │   Email/Password/Dept      │
                    │   Complaints/Workers Data  │
                    └────────────────┬───────────┘
                                     │
                                     ▼
                    ┌────────────────────────────┐
                    │                            │
                    │  Admin Panel               │
                    │  (React SPA)               │
                    │                            │
                    └────────────────┬───────────┘
                                     │
                    ┌────────────────┴───────────┐
                    │                            │
                    ▼                            ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │  Display: Dashboard, │   │  Request: Get login  │
        │  Complaints, Workers │   │  credentials, query  │
        │  Shift Schedule      │   │  complaints, etc.    │
        └──────────────────────┘   └──────────────────────┘
                    │                            │
        ┌───────────┴────────────────────────────┴────────┐
        │                                                 │
        ▼                                                 ▼
   ┌─────────────┐                            ┌───────────────────┐
   │ Admin User  │                            │ Backend API &     │
   │ (Browser)   │                            │ Database          │
   └─────────────┘                            │ (Phase 2)         │
                                             └───────────────────┘
```

**External Entities:**
1. **Admin User** — Department manager accessing the system
2. **Backend API** (Phase 2) — External API service providing authentication and data
3. **Database** (Phase 2) — Persistent data storage

**System Boundary:** Admin Panel SPA

---

## 3. Level 1: Detailed Data Flows

### 3.1 Process Decomposition

```
Level 0 System (Admin Panel) decomposes into:

┌──────────────────────────────────────────────┐
│         ADMIN PANEL SYSTEM                   │
│                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐   │
│  │ P1   │  │ P2   │  │ P3   │  │ P4   │   │
│  │Auth  │  │Dash  │  │Comp  │  │Work  │   │
│  │      │  │      │  │      │  │      │   │
│  └──────┘  └──────┘  └──────┘  └──────┘   │
│  ┌──────┐  ┌──────┐                        │
│  │ P5   │  │ P6   │                        │
│  │Shift │  │Prof  │                        │
│  │      │  │      │                        │
│  └──────┘  └──────┘                        │
│                                              │
│  Data Stores:                               │
│  D1: localStorage (User & Token)            │
│  D2: Mock Data Files (Dev Reference)        │
│  D3: Backend API (Phase 2)                  │
└──────────────────────────────────────────────┘
```

### 3.2 Data Flow Level 1 Diagram

#### 3.2.1 Detailed System DFD

```
                      ┌─────────────────────────────────────────┐
                      │        ADMIN PANEL SYSTEM               │
                      │                                         │
    ┌─────────┐       │  ┌──────┐      ┌──────┐               │
    │ User    │───────┼──│ P1   │──────│ D1   │ (localStorage)
    │ (Email, │       │  │Auth  │      │      │
    │Password)│       │  └──────┘      └──────┘
    └─────────┘       │     │
                      │     └─────────────────┐
    ┌─────────┐       │                       │
    │ User    │───────┼─────┐                │
    │ Requests│       │     ▼                │
    │Dashboard│       │  ┌──────┐  ┌─────────┬──────┐
    │Data     │       │  │ P2   │  │D2: Mock │D3:   │
    │         │       │  │Dash  │  │ Data    │API   │
    └─────────┘       │  │      │  └─────────┴──────┘
                      │  └──────┘        ▲
    ┌─────────┐       │     │            │
    │ User    │       │     └─────────────┘
    │ Views   │───────┼──────┐
    │Reports  │       │      ▼
    ├─────────┤       │   ┌──────┐
    │ User    │───────┼───│ P3   │ ◄── Complaints Data
    │ Manages │       │   │Comp  │
    │Complaints       │   └──────┘
    ├─────────┤       │      │
    │ User    │───────┼──┐   │
    │ Views   │       │  ▼   │
    │ Workers │       │  ┌──────┐
    │ Updates │───────┼──│ P4   │ ◄── Workers Data
    │ Shifts  │       │  │Work  │
    └─────────┘       │  └──────┘
                      │     │
                      │     ├────────────────┐
                      │  ┌──────┐   ┌──────┐  ▼
                      │  │ P5   │   │ P6   │ ┌──────┐
                      │  │Shift │   │Prof  │ │ D1   │
                      │  └──────┘   └──────┘ │Token,│
                      │                      │User  │
                      └──────────────────────┴──────┘
```

### 3.3 Authentication Process (P1) Data Flow

```
                      User Input
                    (Email, Pass, Dept)
                          │
                          ▼
                    ┌──────────────┐
                    │   P1: Auth   │
                    │   Validate   │
                    └───────┬──────┘
                        │   │
              ┌─────────┘   └─────────┐
              │                       │
              ▼                       ▼
         [USE_MOCK?]            [Real API?]
              │                       │
              ▼                       ▼
          D2: Mock               ┌─────────┐
          users.js         Call /auth/login
              │                   (HTTP)
              └────────┬──────────┘
                       │
                       ▼
                ┌─────────────┐
                │  Validate   │
                │ Credentials │
                └──────┬──────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
    [Valid]                      [Invalid]
         │                            │
         ▼                            ▼
    ┌─────────┐                  ┌─────────┐
    │Generate │                  │ Error   │
    │Token &  │                  │Message  │
    │User Obj │                  └─────────┘
    └────┬────┘                      │
         │                           ▼
         ▼                        [Retry]
    ┌─────────┐
    │ D1:     │
    │Store in │
    │localStorage
    └────┬────┘
         │
         ▼
    ┌──────────┐
    │Dashboard │
    │Loaded    │
    └──────────┘
```

### 3.4 Dashboard Process (P2) Data Flow

```
         User navigates to Dashboard
                    │
                    ▼
        ┌───────────────────────┐
        │ P2: Load Dashboard    │
        │ 1. Check localStorage │
        │ 2. Fetch data         │
        └────────┬──────────────┘
                 │
         ┌───────┴───────────────────┐
         │                           │
         ▼                           ▼
    [Read D1]                  [Fetch ALL]
    Token & User         P2.1, P2.2, P2.3
         │                   │
         ├─ Stats            ├─ Stats Data
         │  (Total,Resolved) │
         │                   │
    Dept Name ◄──────────────┤
         │                   │
         ├─────────────────┐ ├─ Complaints
         │                 │ │  Data
         ▼                 │ │
    ┌─────────────┐        │ │
    │  Mock      │        │ ├─ Workers
    │  Data      │        │ │  Data
    │  or API    │        │ │
    └────┬────────┘        │ │
         │                 │ ▼
         │        ┌──────────────────┐
         │        │ P2: Process      │
         │        │ Filter by Dept   │
         │        │ Calculate Metrics│
         │        └────────┬─────────┘
         │                 │
         └────┬────────────┘
              │
              ▼
        ┌──────────────┐
        │Render:       │
        │- StatsCards  │
        │- DonutChart  │
        │- ComplaintsT │
        │- WorkersLst  │
        └──────────────┘
```

### 3.5 Complaints Management (P3) Data Flow

```
    User navigates to Complaints
              │
              ▼
    ┌─────────────────────┐
    │ P3: Manage          │
    │ Complaints          │
    └────┬────────────────┘
         │
    ┌────┴────────────────────────────────┐
    │                                     │
    ▼                                     ▼
[P3.1 Load]                         [P3.2 Apply Filters]
    │                                     │
    ▼                                     ▼
Fetch all                           Status Filter: pending/
complaints from                     in-progress/resolved
D2 (Mock) or D3 (API)                   │
    │                                   ▼
    │                            Worker Filter:
    ▼                            Select worker
┌─────────────────────┐               │
│ Display table       │               ▼
│ Headers:            │           Location Filter
│- ID, Title, Location               │
│- Status, Worker     │               ▼
│- Date               │          Search by Title/
└────┬────────────────┘          Location (Full-text)
     │                               │
     ▼                               ▼
Pagination (20 per page)       ┌──────────────┐
     │                           │ Apply ALL    │
     │                           │ Filters (AND)│
     ▼                           └────┬─────────┘
Sort Options:                        │
- Date (default)                     ▼
- ID, Title, Location, Status   ┌──────────────┐
     │                        │ Update Table  │
     │                        │ Show Results  │
     └──────────────────────┬──┘
                            ▼
                    ┌─────────────┐
                    │ [P3.3] Update
                    │ Status/Assign
                    │ Worker      │
                    └────┬────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
      [Phase 1: Mock]        [Phase 2: API]
            │                         │
      Update state         POST/PATCH to API
            │                         │
            ▼                         ▼
      Table re-renders     Database updated
```

### 3.6 Data Stores Summary

| Data Store | Type | Contents | Access Pattern |
|---|---|---|---|
| **D1** | localStorage | token, user object | Read/Write (client-side) |
| **D2** | Mock JSON Files | users, complaints, workers, stats | Read-only (development) |
| **D3** | Backend API + Database | All entities (Phase 2) | Read/Write (HTTP REST) |

### 3.7 Data Flows Glossary

| Data Flow | Source | Destination | Contents |
|---|---|---|---|
| User credentials | Admin User | P1 (Auth) | Email, password, department |
| Token + User Object | P1 (Auth) | D1 (localStorage) | JWT token, user profile |
| Request Dashboard | Admin User | P2 (Dashboard) | Navigation trigger |
| Department filter | D1 (localStorage) | P2 | Logged-in user's department |
| Stats query | P2 | D2/D3 (data) | Filtered by department |
| Complaints query | P2 | D2/D3 | Department complaints |
| Workers query | P2 | D2/D3 | Department workers |
| Complaint update | Admin User | P3 | New status/assigned worker |
| Update request | P3 | D3 (API) | Status/worker change (Phase 2) |

---

## 4. Process Specifications

### 4.1 Process P1: Authentication

**Input:** Email, Password, Department  
**Output:** Token, User Object (or Error)  
**Data Stores Used:** D2 (mock), D3 (API - Phase 2)  
**Processing:**
1. Validate email format
2. Search for user with email + password + department
3. If found: Generate token; Return token + user
4. If not found: Return error

---

## 5. Data Dictionary

| Data Item | Format | Description |
|---|---|---|
| `token` | JWT String | Authentication credential (Phase 1: mock; Phase 2: real JWT) |
| `user_object` | JSON | {id, name, email, department, role} |
| `department` | Enum | technician, plumbing, sanitation, hvac, network, construction |
| `complaint_id` | String | Unique complaint identifier |
| `complaint_status` | Enum | pending, in-progress, resolved |
| `worker_id` | String | Unique worker identifier |
| `shift_type` | Enum | morning, evening, night, off |

---

## 6. Data Flow Diagram (Visual)

**See related file:** `docs/diagrams/Data_Flow_Diagrams.drawio`

The diagram contains:
- Level 0 (Context) diagram
- Level 1 (Detailed) diagram showing all processes and data stores
- Flow arrows labeled with data items
- Process boxes numbered P1-P6
- Data store cylinders D1-D3

---

**Document End**  
*For visual DFD diagrams, see `docs/diagrams/Data_Flow_Diagrams.drawio`*
