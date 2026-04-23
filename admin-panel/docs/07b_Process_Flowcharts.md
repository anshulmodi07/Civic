# Process Flowcharts & Activity Diagrams
## Civic Infrastructure Admin Panel

**Document Version:** 1.0  
**Date:** April 15, 2026  
**Status:** Approved  

---

## 1. Introduction

### 1.1 Purpose
Process flowcharts and activity diagrams document detailed workflows, decision points, and control flow within business processes.

---

## 2. Main Process Flowcharts

### 2.1 Flowchart: User Login Process

```
                    START
                      │
                      ▼
            ┌──────────────────────┐
            │ Navigate to login    │
            │ page                 │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ Display login form   │
            │ - Dept dropdown      │
            │ - Email field        │
            │ - Password field     │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ User enters          │
            │ credentials          │
            └──────────┬───────────┘
                       │
                       ▼
            ◇──────────────────────◇
            │ All fields filled?   │
            ◇──────────────────────◇
               │             │
            NO │             │ YES
               │             │
               ▼             ▼
         [Show Error:    ┌───────────────┐
          Please fill    │ Validate email│
          all fields]    │ format        │
               │         └───────┬───────┘
               │                 │
               └────────┬────────┘
                        │
                        ▼
                 ◇─────────────────◇
                 │ Email format OK?│
                 ◇─────────────────◇
                    │           │
                 NO │           │ YES
                    │           │
                    ▼           ▼
              [Show Error:  ┌────────────────┐
               Invalid     │ Call loginUser()│
               email]      │ (email, pwd,   │
                    │      │  dept)         │
                    │      └───────┬────────┘
                    │              │
                    │              ▼
                    │       ┌────────────────┐
                    │       │ Check mock/real│
                    │       │ flag           │
                    │       └───────┬────────┘
                    │               │
                    │       ┌───────┴──────────┐
                    │       │                  │
                    │     [Mock]          [Real - Phase 2]
                    │       │                  │
                    │       ▼                  ▼
                    │  ┌──────────┐    ┌──────────────┐
                    │  │Match cred│    │POST /auth/   │
                    │  │in users.│    │login endpoint│
                    │  │js        │    └──────┬───────┘
                    │  └────┬─────┘           │
                    │       │                │
                    │       └────────┬───────┘
                    │               │
                    └───────────────┼──────────────┐
                                    │              │
                           ◇────────────────◇
                           │ Valid creds?   │
                           ◇────────────────◇
                              │        │
                           NO │        │ YES
                              │        │
                              ▼        ▼
                         [Error:  ┌──────────────┐
                          Invalid │Generate token│
                          creds]  │Store in LS:  │
                              │   │- token       │
                              │   │- user object │
                              │   └─────┬────────┘
                              │         │
                              │         ▼
                              │   ┌──────────────┐
                              │   │Navigate to   │
                              │   │/admin/       │
                              │   │dashboard     │
                              │   └─────┬────────┘
                              │         │
                              └─────┬───┘
                                    │
                                    ▼
                               ┌──────────┐
                               │Dashboard │
                               │Loaded    │
                               └─────┬────┘
                                     │
                                     ▼
                                  END

Legend:
┌──┐ = Process box (action)
◇  = Decision diamond (yes/no)
[]  = Terminator (start/end)
─►  = Flow direction
```

### 2.2 Flowchart: Complaint Management

```
                        START
                          │
                          ▼
                ┌─────────────────────┐
                │ Admin views         │
                │ complaints page     │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Fetch all complaints│
                │ for department      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Display table       │
                │ (20 per page)       │
                └──────────┬──────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌────────┐      ┌────────────┐      ┌──────────┐
   │Apply   │      │Search/Type │      │Sort by   │
   │Filter  │      │            │      │Column    │
   └───┬────┘      └────┬───────┘      └────┬─────┘
       │                │                   │
       ▼                ▼                   ▼
   [Filter          [Search         [Sort order
    Options:        Query:          toggled]
    Status,         Title/
    Worker,         Location]
    Location]       │
       │            │
       └────────┬───┴────────────┐
                │                │
                ▼                ▼
           Update Table      Continue?
           Display Results   ◇─────────◇
                             │         │
                          NO │         │ YES
                             │         │
                             ▼         ▼
                          ┌──────┐ ┌────────┐
                          │ Back │ │Select  │
                          │ to   │ │ Compl. │
                          │ Home │ │to View │
                          └──────┘ │Details │
                                   └───┬────┘
                                       │
                                       ▼
                                 ┌──────────────┐
                                 │Open Modal:   │
                                 │- Title       │
                                 │- Location    │
                                 │- Status      │
                                 │- Worker      │
                                 └─────┬────────┘
                                       │
                      ┌────────────────┼─────────────────┐
                      │                │                 │
                      ▼                ▼                 ▼
                 ┌─────────┐   ┌──────────────┐   ┌──────────┐
                 │View Only│   │Update Status │   │Assign    │
                 │Details  │   │or Worker     │   │Different │
                 │         │   └──────┬───────┘   │Worker    │
                 │         │          │           └────┬─────┘
                 │         │          │                │
                 │         │    ◇──────────────◇       │
                 │         │    │ Changes     │       │
                 │         │    │ Confirmed?  │       │
                 │         │    ◇──────────────◇       │
                 │         │       │        │          │
                 │         │    NO │        │ YES      │
                 │         │       │        │          │
                 │         │       ▼        ▼          │
                 │         │    [Keep]  ┌────────┐    │
                 │         │     │      │Update  │    │
                 │         │     │      │Data    │    │
                 │         │     │      │(Mock/  │    │
                 │         │     │      │API)    │    │
                 │         │     │      └───┬────┘    │
                 │         │     │          │         │
                 │         └──────────┬─────┘         │
                 │                    │                │
                 │                    ▼                │
                 │             ┌──────────────┐       │
                 │             │Show Success  │       │
                 │             │Message       │       │
                 │             └──────┬───────┘       │
                 │                    │                │
                 └────────────────────┼────────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │Close Modal &  │
                              │Refresh Table  │
                              └───────┬───────┘
                                      │
                                      ▼
                                   END
```

### 2.3 Flowchart: Worker Shift Assignment

```
                        START
                          │
                          ▼
                ┌─────────────────────┐
                │ Admin navigates to  │
                │ Shift Schedule      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Load current week   │
                │ schedule (Mon-Sun)  │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Display grid:       │
                │ Rows: Workers       │
                │ Cols: Days          │
                │ Values: Shift types │
                │ (color-coded)       │
                └──────────┬──────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────────┐   ┌──────────────┐   ┌──────────┐
   │Click prev/  │   │Click grid    │   │Export    │
   │next week    │   │cell to edit  │   │Schedule  │
   │button       │   │              │   │(Phase 2) │
   └──┬──────────┘   └──────┬───────┘   └────┬─────┘
      │                     │                │
      ▼                     ▼                ▼
   Change week        Show shift        Generate
   display            dropdown:          PDF/CSV
   (update             - Morning
   dates)              - Evening
      │                - Night
      │                - Off
      │                     │
      │                     ▼
      │              User selects
      │              new shift
      │                     │
      │                     ▼
      │          ┌─────────────────────┐
      │          │ Confirm action:     │
      │          │ "Change to Evening?"│
      └──────────┤ [Confirm] [Cancel]  │
                 └──────┬──────┬────────┘
                        │      │
                    YES │      │ NO
                        │      │
                        ▼      ▼
                   ┌────────┐[Back to
                   │Update  │ grid]
                   │Cell &  │
                   │Save    │
                   └───┬────┘
                       │
              ┌────────┴─────────┐
              │                  │
          [Mock]            [Real API Ph2]
              │                  │
              ▼                  ▼
         Update state      PATCH /shifts/:id
         in component      {shift: 'evening'}
              │                  │
              │                  ▼
              │            Backend updates DB
              │                  │
              └────────┬─────────┘
                       │
                       ▼
                ┌──────────────────┐
                │Success message:  │
                │"Shift updated"   │
                └──────┬───────────┘
                       │
                       ▼
                ┌──────────────────┐
                │Re-render grid:   │
                │Cell color changed│
                │to new shift color│
                └──────┬───────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
    Continue          ┌─────────────┐
    editing?      ┌───┤ Save All    │
    ◇──────────◇  │   │ Changes &   │
    │         │   │   │ Finish      │
YES │         │NO │   └────┬────────┘
    │         │   │        │
    ▼         ▼   │        ▼
  [More]   ┌──┐   │   ┌──────────┐
   edits   │ ◄────┘   │ END      │
           │          │ Schedule │
           └──────┬───┘ saved    │
                  │              │
                  └──────────────┘
```

---

## 3. Activity Diagrams

### 3.1 Activity Diagram: Data Refresh Logic

```
┌─────────┐
│  START  │
└────┬────┘
     │
     ▼
┌────────────────┐
│ User clicks    │
│ Refresh button │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Show loading   │
│ spinner        │
└────────┬───────┘
         │
         ◄────────────────────────────┐
         │                            │
         ▼                            │
┌────────────────────────────────────┐│
│ Fetch in parallel:                 ││
│  - fetchStats(dept)  ──┐           ││
│  - fetchComplaints   ──┼─ Wait All ││
│  - getWorkers(dept)  ──┘           ││
└────────┬─────────────────────────────┘│
         │                             │
      ◇──────────────────────────────◇ │
      │ All data received      │      │
      │ or error after 5s?     │      │
      ◇──────────────────────────────◇ │
         │              │              │
    ERROR │              │ SUCCESS     │
         │              │              │
         ▼              ▼              │
   ┌──────────────┐ ┌────────────────┐│
   │ Show error   │ │ Update state   ││
   │ message with │ │ setStats,      ││
   │ retry button │ │ setComplaints, ││
   │              │ │ setWorkers     ││
   └────┬─────────┘ └────────┬───────┘│
        │                    │        │
        │                 [Hide       │
        │                 Spinner]    │
        │                    │        │
        │                    ▼        │
        │             ┌─────────────┐ │
        │             │ Trigger     │ │
        │             │ re-render   │ │
        │             └────┬────────┘ │
        │                  │          │
        ▼                  ▼          │
    ┌─────────┐     ┌────────────────────┐
    │ User    │     │ Components render  │
    │ clicks  │     │ with new data:     │
    │ Retry   │     │ - StatsCards       │
    └─┬───────┘     │ - DonutChart       │
      │             │ - ComplaintsTable  │
      │             │ - WorkersList      │
      └───────┬─────┴────────┬───────────┘
              │              │
        [Retry]          [Continue]
              │              │
              │              ▼
              │         ┌─────────┐
              │         │  END    │
              │         │ Display │
              │         │Updated  │
              │         │Dashboard│
              │         └─────────┘
              │
              └────(Loop back to first fetch step)
```

---

## 4. Decision Tables

### 4.1 Filter Application Decision Table

| Status Filter | Worker Filter | Location Filter | Logic | Result |
|---|---|---|---|---|
| Any | Any | Any | Show All | All complaints |
| Pending | Any | Any | Status=Pending | Pending only |
| In-Progress | Any | Any | Status=In-Progress | In-progress only |
| Resolved | Any | Any | Status=Resolved | Resolved only |
| Any | Worker1 | Any | Worker=Worker1 | Worker1 assigned |
| Pending | Worker1 | Any | Status=Pending AND Worker=Worker1 | Pending + Worker1 |
| Any | Any | Location1 | Location=Location1 | Location1 complaints |
| Pending | Worker1 | Location1 | ALL three filters | AND logic (all must match) |

### 4.2 Status Update Validation Decision Table

| Current Status | New Status Requested | Valid? | Action |
|---|---|---|---|
| Pending | In-Progress | YES | Update + timestamp + notification |
| Pending | Resolved | NO | Error: "Must be In-Progress first" |
| Pending | Pending | YES | No change (idempotent) |
| In-Progress | Resolved | YES | Update + mark completed + worker rating |
| In-Progress | Pending | NO | Error: "Cannot revert to Pending" |
| Resolved | Resolved | YES | No change |
| Resolved | Any other | NO | Error: "Resolved complaints cannot change" |

---

## 5. Process State Machines

### 5.1 Complaint Status State Machine

```
    ┌─────────┐
    │       PENDING
    │  (Created, awaiting│
    │   assignment)    │
    └────┬────────────┘
         │ [Worker Assigned]
         ▼
    ┌────────────┐
    │IN-PROGRESS │◄──┐ [Continue investigation]
    │(Being      │   │
    │worked on) │   └────────────────┐
    └────┬──────┴──────────────────────┘
         │ [Work complete]
         ▼
    ┌────────────┐
    │ RESOLVED   │
    │(Completed, │
    │closed)     │
    └────────────┘

Valid Transitions:
- Pending → In-Progress ✓
- Pending → Resolved ✗ (must go through In-Progress)
- In-Progress → Resolved ✓
- Resolved → Pending ✗ (irreversible)
- Resolved → In-Progress ✗ (irreversible)
```

### 5.2 Session State Machine

```
    ┌──────────────┐
    │ NOT LOGGED IN│
    │   (Login page│
    │   visible)   │
    └────┬─────────┘
         │ [Credentials valid]
         ▼
    ┌──────────────┐
    │  LOGGED IN   │
    │  (Token in LS│
    │  Dashboard   │
    │  accessible) │
    └────┬─────────┬──────────────┐
         │         │              │
         │ [Logout]│ [30 min idle] │[Token invalid]
         ▼         ▼              ▼
    [Return to] [Session] [Redirect to]
    [Login]     [Expired]  [Login + msg]
         │         │              │
         └─────────┴──────────────┘
              │
              ▼
    ┌──────────────┐
    │ NOT LOGGED IN│
    │ (Start over) │
    └──────────────┘
```

---

## 6. Swimlane: Multi-Actor Complaint Resolution

```
┌────────────────┬───────────────┬─────────────────┬─────────────────┐
│ CITIZEN        │ ADMIN PANEL   │ WORKER          │ SYSTEM          │
├────────────────┼───────────────┼─────────────────┼─────────────────┤
│                │               │                 │                 │
│ Reports Issue  │               │                 │                 │
│      │─────────┼──► Created    │                 │                 │
│      │         │   Status: Pending              │                 │
│      │         │               │                 │                 │
│      │         │   [Notification/               │                 │
│      │         │    Assignment]                │                 │
│      │         │       │       ├───────────────►│Update D store   │
│      │         │       │       │                │                 │
│      │         │   [Admin]     │                │                 │
│      │         │   Assigns to: │                │                 │
│      │         │   Worker1     │                │                 │
│      │         │       │───────┼───────────────►│                 │
│      │         │       │       │                │                 │
│      │         │       │       ◄────────────────┤ Receive Notif   │
│      │         │       │       │                │                 │
│      │         │       │   [Working]            │                 │
│      │         │       │   Status: In-Progress  │                 │
│      │         │       │       │                │                 │
│      │    [Admin]      │   [Review]             │                 │
│      │    Updates      │   Submit Results       │                 │
│      │    Status       │       │───────────────►│                 │
│      │      │──────────┼──────►Review & Resolve│Update Status    │
│      │      │          │       │                │                 │
│      │      │   [Notify]      │                │                 │
│      │      │   Citizen       │                │                 │
│ Sees result   │   Closed       │                │                 │
│      │◄──────────────────────────────────────────────────────────┘
│      │        │               │
│ Rates         │               │
│ Solution      │               │
│      │        │ [Feedback]    │
│      └───────►└──────────────►│ [Update Rating]
│              │                │─────────────────►Update Worker Rating
│              │                │                 │
└──────────────┴───────────────┴─────────────────┴─────────────────┘

Process End: Complaint Resolved & Closed
```

---

## 7. Summary: Key Decision Points

| Decision Point | Options | Impact |
|---|---|---|
| **USE_MOCK Flag** | Mock data / Real API | Determines data source |
| **Department Filter** | Applied at API or UI | Data isolation & security |
| **Status Transition** | Progressive only | Data consistency |
| **Worker Assignment** | Any dept worker / Same dept only | Business rule validation |
| **Shift Conflict** | Allow / Prevent (Phase 2) | Scheduling reliability |
| **Authentication** | Success / Failure | Entire app access gate |

---

**Document End**  
*For visual process diagrams, see `docs/diagrams/Process_Flowcharts.drawio`*
