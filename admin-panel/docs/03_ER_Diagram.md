# Entity-Relationship Diagram (ER Model)
## Civic Infrastructure Admin Panel

**Document Version:** 1.0  
**Date:** April 15, 2026  
**Status:** Approved  

---

## 1. Introduction

### 1.1 Purpose
This document describes the Entity-Relationship (ER) model for the Civic Infrastructure Admin Panel. It defines all data entities, their attributes, relationships, and constraints.

### 1.2 Audience
- Database designers and backend developers
- Data architects
- Integration engineers

---

## 2. ER Model Overview

### 2.1 Entities

The system contains **5 primary entities**:

```
┌─────────────┐         ┌──────────────┐         ┌─────────┐
│    USER     │1────────│ DEPARTMENT   │────────1│ COMPLAINT
└─────────────┘         └──────────────┘         └─────────┘
      │                                               │
      │ 1                                             │
      │                                               │
      └─────────────────┬──────────────────────────────┘
                        M
                   ┌─────────────┐
                   │   WORKER    │
                   └─────────────┘
                        │
                        │ 1
                        │
                   ┌───────────┐
                   │   SHIFT   │
                   └───────────┘
```

### 2.2 Entity Definitions

---

## 3. Detailed Entity Specifications

### 3.1 Department Entity

**Description:** Service category or division within civic infrastructure.

**Attributes:**

| Attribute | Type | Constraint | Description |
|---|---|---|---|
| `dept_id` | VARCHAR(20) | PRIMARY KEY | Unique department identifier |
| `dept_name` | VARCHAR(100) | NOT NULL, UNIQUE | Department display name |
| `description` | VARCHAR(500) | - | Department purpose and scope |
| `contact_email` | VARCHAR(100) | - | Department email for alerts |
| `head_name` | VARCHAR(100) | - | Department head name |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last modification time |

**Valid Values (Fixed):**
```
technician, plumbing, sanitation, hvac, network, construction
```

**Primary Key:** `dept_id`  
**Unique Keys:** `dept_name`

**Sample Data:**
```javascript
{
  dept_id: 'TECH',
  dept_name: 'Technician',
  description: 'General maintenance and repair services',
  contact_email: 'tech@civic.com',
  head_name: 'Rahul Sharma',
  created_at: '2026-01-01T00:00:00Z'
}
```

---

### 3.2 User Entity

**Description:** Administrator account for accessing the admin panel.

**Attributes:**

| Attribute | Type | Constraint | Description |
|---|---|---|---|
| `user_id` | VARCHAR(20) | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Email address (login credential) |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt-hashed password |
| `first_name` | VARCHAR(50) | NOT NULL | User's first name |
| `last_name` | VARCHAR(50) | NOT NULL | User's last name |
| `dept_id` | VARCHAR(20) | NOT NULL, FK | Department assignment |
| `role` | ENUM | DEFAULT 'admin' | User role (admin, manager, supervisor) |
| `phone` | VARCHAR(15) | - | Contact phone number |
| `is_active` | BOOLEAN | DEFAULT true | Account active status |
| `last_login` | TIMESTAMP | - | Last successful login time |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last modification time |

**Primary Key:** `user_id`  
**Unique Keys:** `email`  
**Foreign Keys:**
- `dept_id` → `Department.dept_id` (NOT NULL, CASCADE on delete)

**Relationships:**
- 1 User : Many Complaints (user creates/updates complaints)
- 1 User : 1 Department (user belongs to exactly one department)
- 1 User : Many Audit Logs (Phase 2)

**Sample Data:**
```javascript
{
  user_id: 'USR001',
  email: 'tech@civic.com',
  password_hash: '$2b$10$...',
  first_name: 'Rahul',
  last_name: 'Sharma',
  dept_id: 'TECH',
  role: 'admin',
  phone: '+91-9876543210',
  is_active: true,
  last_login: '2026-04-15T14:30:00Z',
  created_at: '2026-01-01T00:00:00Z'
}
```

---

### 3.3 Complaint Entity

**Description:** Civic maintenance issue reported by citizens or internally.

**Attributes:**

| Attribute | Type | Constraint | Description |
|---|---|---|---|
| `complaint_id` | VARCHAR(20) | PRIMARY KEY | Unique complaint identifier |
| `title` | VARCHAR(255) | NOT NULL | Brief complaint title |
| `description` | VARCHAR(2000) | - | Detailed description |
| `location` | VARCHAR(255) | NOT NULL | Physical location of issue |
| `latitude` | DECIMAL(10,8) | - | GPS latitude (Phase 2) |
| `longitude` | DECIMAL(11,8) | - | GPS longitude (Phase 2) |
| `dept_id` | VARCHAR(20) | NOT NULL, FK | Responsible department |
| `status` | ENUM | DEFAULT 'pending' | Status: pending, in-progress, resolved |
| `priority` | ENUM | DEFAULT 'normal' | Priority: low, normal, high, critical |
| `assigned_worker_id` | VARCHAR(20) | - | FK to Worker (nullable = unassigned) |
| `created_by_user_id` | VARCHAR(20) | NOT NULL | FK to User who created/reported |
| `votes` | INTEGER | DEFAULT 0 | Community votes (popularity metric) |
| `color_bg` | VARCHAR(20) | - | UI color for status display |
| `color_text` | VARCHAR(20) | - | UI text color |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Report creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last status update time |
| `resolved_at` | TIMESTAMP | - | Time marked as resolved |

**Primary Key:** `complaint_id`  
**Foreign Keys:**
- `dept_id` → `Department.dept_id` (NOT NULL)
- `assigned_worker_id` → `Worker.worker_id` (nullable, optional assignment)
- `created_by_user_id` → `User.user_id` (NOT NULL)

**Unique Keys:** None

**Indexes:**
- `dept_id` (frequent filtering)
- `status` (frequent filtering)
- `created_at` (sorting by date)
- `assigned_worker_id` (worker workload tracking)

**Status Workflow:**
```
pending → in-progress → resolved
         Cannot regress (only forward)
```

**Sample Data:**
```javascript
{
  complaint_id: 'CMP001',
  title: 'Road pothole near market',
  description: 'Large pothole creates water hazard during rain',
  location: 'City Center Market',
  latitude: 28.5355,
  longitude: 77.3910,
  dept_id: 'TECH',
  status: 'pending',
  priority: 'high',
  assigned_worker_id: 'WKR001',
  created_by_user_id: 'USR001',
  votes: 45,
  color_bg: '#FEF3C7',
  color_text: '#F59E0B',
  created_at: '2026-04-15T10:30:00Z',
  updated_at: '2026-04-15T10:30:00Z'
}
```

---

### 3.4 Worker Entity

**Description:** Field service personnel who resolve complaints.

**Attributes:**

| Attribute | Type | Constraint | Description |
|---|---|---|---|
| `worker_id` | VARCHAR(20) | PRIMARY KEY | Unique worker identifier |
| `first_name` | VARCHAR(50) | NOT NULL | Worker first name |
| `last_name` | VARCHAR(50) | NOT NULL | Worker last name |
| `dept_id` | VARCHAR(20) | NOT NULL, FK | Department assignment |
| `email` | VARCHAR(100) | - | Work email address |
| `phone` | VARCHAR(15) | NOT NULL | Contact phone number |
| `online_status` | BOOLEAN | DEFAULT false | Currently online/available |
| `current_shift` | ENUM | - | Current shift: morning, evening, night |
| `salary_grade` | VARCHAR(10) | - | Pay grade (Phase 2) |
| `experience_years` | INTEGER | DEFAULT 0 | Years of experience |
| `certification` | VARCHAR(500) | - | Technical certifications |
| `skills` | VARCHAR(1000) | - | Comma-separated skills list |
| `location` | VARCHAR(255) | - | Current work location |
| `photo_url` | VARCHAR(500) | - | Profile photo URL |
| `rating` | DECIMAL(3,2) | DEFAULT 0.00 | Average customer rating (0-5) |
| `tasks_completed` | INTEGER | DEFAULT 0 | Total complaints resolved |
| `tasks_pending` | INTEGER | DEFAULT 0 | Currently assigned unresolved |
| `average_response_time_hours` | DECIMAL(10,2) | - | Avg hours from assignment to start |
| `is_active` | BOOLEAN | DEFAULT true | Employment status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Hire date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last profile update |

**Primary Key:** `worker_id`  
**Foreign Keys:**
- `dept_id` → `Department.dept_id` (NOT NULL)

**Relationships:**
- 1 Worker : Many Complaints (assigned to multiple complaints over time)
- 1 Worker : Many Shifts (works multiple shifts per week)
- 1 Worker : 1 Department (belongs to one department)

**Performance Metrics:**
- `tasks_completed`: Sum of resolved complaints
- `tasks_pending`: Count of assigned non-resolved complaints
- `rating`: Average of feedback scores from complaints
- `average_response_time_hours`: Calculated from complaint timestamps

**Sample Data:**
```javascript
{
  worker_id: 'WKR001',
  first_name: 'Rajesh',
  last_name: 'Kumar',
  dept_id: 'TECH',
  email: 'rajesh@civic.com',
  phone: '+91-9876543211',
  online_status: true,
  current_shift: 'morning',
  experience_years: 5,
  certification: 'Electrical Safety Level 1, Plumbing Basics',
  skills: 'electrical repairs,plumbing,general maintenance',
  location: 'City Center Zone 1',
  photo_url: 'https://cdn.example.com/workers/wkr001.jpg',
  rating: 4.5,
  tasks_completed: 87,
  tasks_pending: 3,
  average_response_time_hours: 1.2,
  is_active: true,
  created_at: '2025-01-15T08:00:00Z'
}
```

---

### 3.5 Shift Entity

**Description:** Worker scheduling and time assignment.

**Attributes:**

| Attribute | Type | Constraint | Description |
|---|---|---|---|
| `shift_id` | VARCHAR(20) | PRIMARY KEY | Unique shift record identifier |
| `worker_id` | VARCHAR(20) | NOT NULL, FK | Assigned worker |
| `shift_date` | DATE | NOT NULL | Specific date of shift |
| `shift_type` | ENUM | NOT NULL | Type: morning, evening, night, off |
| `start_time` | TIME | - | Shift start time (HH:MM) |
| `end_time` | TIME | - | Shift end time (HH:MM) |
| `dept_id` | VARCHAR(20) | NOT NULL, FK | Department assignment |
| `status` | ENUM | DEFAULT 'scheduled' | Status: scheduled, started, completed, cancelled |
| `notes` | VARCHAR(500) | - | Admin or worker notes |
| `created_by_user_id` | VARCHAR(20) | NOT NULL, FK | Admin who created shift |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last modification time |

**Primary Key:** `shift_id`  
**Composite Key:** `(worker_id, shift_date)` — No two shifts for same worker on same date

**Foreign Keys:**
- `worker_id` → `Worker.worker_id` (NOT NULL, CASCADE delete)
- `dept_id` → `Department.dept_id` (NOT NULL)
- `created_by_user_id` → `User.user_id` (NOT NULL)

**Unique Keys:**
- `UNIQUE(worker_id, shift_date)` — Prevent double-booking

**Indexes:**
- `worker_id` (query shifts by worker)
- `shift_date` (query shifts by week/month)
- `dept_id` (filter by department)

**Shift Types and Times:**
```
Morning:   06:00 - 14:00 (8 hours)
Evening:   14:00 - 22:00 (8 hours)
Night:     22:00 - 06:00 (8 hours)
Off:       No scheduled hours
```

**Sample Data:**
```javascript
{
  shift_id: 'SHFT001',
  worker_id: 'WKR001',
  shift_date: '2026-04-21',
  shift_type: 'morning',
  start_time: '06:00',
  end_time: '14:00',
  dept_id: 'TECH',
  status: 'scheduled',
  notes: 'Training session 10-11 AM',
  created_by_user_id: 'USR001',
  created_at: '2026-04-15T08:00:00Z'
}
```

---

## 4. Relationships & Cardinality

### 4.1 Relationship Matrix

| From Entity | To Entity | Cardinality | Type | Foreign Key | On Delete |
|---|---|---|---|---|---|
| User | Department | N:1 | belongs_to | `User.dept_id` | RESTRICT |
| User | Complaint | 1:N | creates/updates | `Complaint.created_by_user_id` | RESTRICT |
| Complaint | Department | N:1 | assigned_to | `Complaint.dept_id` | RESTRICT |
| Complaint | Worker | N:1 | assigned_to | `Complaint.assigned_worker_id` | SET NULL |
| Worker | Department | N:1 | belongs_to | `Worker.dept_id` | RESTRICT |
| Worker | Shift | 1:N | has_many | `Shift.worker_id` | CASCADE |
| Shift | Department | N:1 | belongs_to | `Shift.dept_id` | RESTRICT |
| Shift | User | N:1 | created_by | `Shift.created_by_user_id` | RESTRICT |

### 4.2 Relationship Descriptions

**User ↔ Department (N:1)**
- **Description:** Each user belongs to exactly one department; one department has many users
- **Cardinality:** N:1
- **Mandatory:** Yes (user must have department)
- **Foreign Key:** `User.dept_id`

**Complaint ↔ Worker (N:1, Optional)**
- **Description:** Each complaint may be assigned to one worker; one worker can handle many complaints
- **Cardinality:** N:1
- **Mandatory:** No (complaint can be unassigned)
- **Foreign Key:** `Complaint.assigned_worker_id` (nullable)
- **Behavior:** SET NULL if worker record deleted

**Complaint ↔ Department (N:1)**
- **Description:** Each complaint belongs to one department; department has many complaints
- **Cardinality:** N:1
- **Mandatory:** Yes
- **Foreign Key:** `Complaint.dept_id`

**Shift ↔ Worker (N:1)**
- **Description:** Each shift assigned to one worker; one worker has many shifts
- **Cardinality:** N:1
- **Mandatory:** Yes
- **Foreign Key:** `Shift.worker_id`
- **Behavior:** CASCADE delete (delete all shifts if worker deleted)

---

## 5. Data Types & Constraints

### 5.1 Data Type Mapping

| SQL Type | Description | Max Size | Uses |
|---|---|---|---|
| VARCHAR(n) | Variable character string | Up to n chars | IDs, names, descriptions |
| TEXT | Long text | 65,535 bytes | Detailed descriptions |
| INTEGER | Whole number | -2^31 to 2^31-1 | Counts, votes |
| DECIMAL(p,s) | Fixed-point decimal | Precision p, scale s | Ratings (3,2), coordinates |
| TIMESTAMP | Date and time | Microsecond precision | Audit timestamps |
| DATE | Date only | - | Shift dates |
| TIME | Time only | - | Shift times |
| BOOLEAN | True/False | 1 byte | Flags (online, active) |
| ENUM | Enumerated type | List of values | Status, priority, role |

### 5.2 Column Constraints

**Common Constraints:**
- `NOT NULL` — Value must be provided
- `UNIQUE` — Value must be unique in table
- `PRIMARY KEY` — Unique identifier; NOT NULL
- `FOREIGN KEY` — Reference to another table's PK
- `DEFAULT` — Default value if not provided
- `CHECK` — Value must satisfy condition
- `AUTO_INCREMENT` — Auto-generate next integer value

**Applied Constraints:**
- User `email`: UNIQUE, NOT NULL
- Department `dept_name`: UNIQUE, NOT NULL
- Complaint `status`: CHECK(status IN ('pending', 'in-progress', 'resolved'))
- Worker `rating`: CHECK (rating >= 0 AND rating <= 5)
- Shift `(worker_id, shift_date)`: UNIQUE (composite)

---

## 6. Normalization

### 6.1 Normalization Level: 3NF (Third Normal Form)

**Status:** ✅ All entities are in 3NF

**Explanation:**
- ✅ **1NF (Atomic Values):** All attributes contain single values (no arrays/lists in DB)
- ✅ **2NF (No Partial Dependencies):** No non-key attribute depends on only part of composite key
- ✅ **3NF (No Transitive Dependencies):** Non-key attributes don't depend on other non-key attributes

**Example:**
```
❌ Bad (Violates 1NF):
  Worker { skills: ['electrical', 'plumbing', 'carpentry'] } -- Array in column

✅ Good (1NF):
  Worker { skills: 'electrical,plumbing,carpentry' } -- Comma-separated string
  
  OR (for Phase 2):
  Worker_Skill { worker_id, skill_id } -- Separate junction table
```

### 6.2 Denormalization Decisions

Minor denormalization for performance:

| Denormalized Column | Reason | Frequency |
|---|---|---|
| `Worker.tasks_completed` | Avoid expensive COUNT queries | Updated on complaint resolved |
| `Worker.tasks_pending` | Quick workload assessment | Updated on assignment/resolution |
| `Worker.rating` | Display on worker list | Recalculated monthly (batch job) |
| `Complaint.color_bg`, `color_text` | Avoid join for UI rendering | Set at creation time |

---

## 7. Sample Database Schema (SQL)

### 7.1 Table Definitions

```sql
-- Department Table
CREATE TABLE Department (
  dept_id VARCHAR(20) PRIMARY KEY,
  dept_name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  contact_email VARCHAR(100),
  head_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User/Admin Table
CREATE TABLE `User` (
  user_id VARCHAR(20) PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  dept_id VARCHAR(20) NOT NULL,
  role ENUM('admin', 'manager', 'supervisor') DEFAULT 'admin',
  phone VARCHAR(15),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES Department(dept_id) ON DELETE RESTRICT,
  INDEX idx_dept_id (dept_id),
  INDEX idx_email (email)
);

-- Complaint Table
CREATE TABLE Complaint (
  complaint_id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(2000),
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  dept_id VARCHAR(20) NOT NULL,
  status ENUM('pending', 'in-progress', 'resolved') DEFAULT 'pending',
  priority ENUM('low', 'normal', 'high', 'critical') DEFAULT 'normal',
  assigned_worker_id VARCHAR(20),
  created_by_user_id VARCHAR(20) NOT NULL,
  votes INT DEFAULT 0,
  color_bg VARCHAR(20),
  color_text VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES Department(dept_id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_worker_id) REFERENCES Worker(worker_id) ON DELETE SET NULL,
  FOREIGN KEY (created_by_user_id) REFERENCES `User`(user_id) ON DELETE RESTRICT,
  INDEX idx_dept_id (dept_id),
  INDEX idx_status (status),
  INDEX idx_assigned_worker_id (assigned_worker_id),
  INDEX idx_created_at (created_at)
);

-- Worker Table
CREATE TABLE Worker (
  worker_id VARCHAR(20) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  dept_id VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(15) NOT NULL,
  online_status BOOLEAN DEFAULT FALSE,
  current_shift ENUM('morning', 'evening', 'night'),
  salary_grade VARCHAR(10),
  experience_years INT DEFAULT 0,
  certification VARCHAR(500),
  skills VARCHAR(1000),
  location VARCHAR(255),
  photo_url VARCHAR(500),
  rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  tasks_completed INT DEFAULT 0,
  tasks_pending INT DEFAULT 0,
  average_response_time_hours DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES Department(dept_id) ON DELETE RESTRICT,
  INDEX idx_dept_id (dept_id),
  INDEX idx_online_status (online_status)
);

-- Shift Table
CREATE TABLE Shift (
  shift_id VARCHAR(20) PRIMARY KEY,
  worker_id VARCHAR(20) NOT NULL,
  shift_date DATE NOT NULL,
  shift_type ENUM('morning', 'evening', 'night', 'off') NOT NULL,
  start_time TIME,
  end_time TIME,
  dept_id VARCHAR(20) NOT NULL,
  status ENUM('scheduled', 'started', 'completed', 'cancelled') DEFAULT 'scheduled',
  notes VARCHAR(500),
  created_by_user_id VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (worker_id) REFERENCES Worker(worker_id) ON DELETE CASCADE,
  FOREIGN KEY (dept_id) REFERENCES Department(dept_id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by_user_id) REFERENCES `User`(user_id) ON DELETE RESTRICT,
  UNIQUE KEY uq_worker_date (worker_id, shift_date),
  INDEX idx_shift_date (shift_date),
  INDEX idx_dept_id (dept_id)
);
```

---

## 8. Query Examples (Common Use Cases)

### 8.1 Retrieve All Complaints for a Department

```sql
SELECT c.complaint_id, c.title, c.status, w.first_name AS worker_name, c.created_at
FROM Complaint c
LEFT JOIN Worker w ON c.assigned_worker_id = w.worker_id
WHERE c.dept_id = 'TECH'
ORDER BY c.created_at DESC;
```

### 8.2 Get Worker Workload (Current Assignments)

```sql
SELECT w.worker_id, w.first_name, w.last_name, COUNT(c.complaint_id) AS pending_complaints
FROM Worker w
LEFT JOIN Complaint c ON w.worker_id = c.assigned_worker_id AND c.status != 'resolved'
WHERE w.dept_id = 'TECH' AND w.is_active = TRUE
GROUP BY w.worker_id
ORDER BY pending_complaints DESC;
```

### 8.3 Check Weekly Shift Schedule

```sql
SELECT w.first_name, w.last_name, s.shift_date, s.shift_type
FROM Shift s
JOIN Worker w ON s.worker_id = w.worker_id
WHERE s.dept_id = 'TECH' AND WEEK(s.shift_date) = WEEK(NOW())
ORDER BY s.shift_date, w.first_name;
```

### 8.4 Complaint Statistics by Department

```sql
SELECT 
  c.dept_id,
  COUNT(*) AS total_complaints,
  SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) AS resolved,
  SUM(CASE WHEN c.status = 'pending' THEN 1 ELSE 0 END) AS pending,
  SUM(CASE WHEN c.status = 'in-progress' THEN 1 ELSE 0 END) AS in_progress
FROM Complaint c
GROUP BY c.dept_id;
```

---

## 9. ER Diagram Visualization

**See related file:** `ER_Model.drawio` (in `docs/diagrams/` folder)

The diagram shows:
- 5 entity boxes with attributes
- Relationship lines with cardinality symbols (1:N, N:1, etc.)
- Primary keys marked with (PK)
- Foreign keys marked with (FK)
- Nullable relationships shown with dashed lines

---

## 10. Future Enhancements (Phase 2+)

| Enhancement | Reason | Impact |
|---|---|---|
| **Audit Log Entity** | Compliance; track all admin actions | +1 table, +indexing |
| **Feedback Entity** | Capture user satisfaction ratings | +1 table; denormalize Worker.rating |
| **Complaint Comments** | Internal notes on complaint resolution | +1 table (Complaint_Comment) |
| **Worker Skills Junction** | Normalize skills (vs. denormalized string) | +1 junction table (Worker_Skill) |
| **Complaint History** | Track status change timeline | +1 table (Complaint_Status_History) |
| **Location/Zone Entity** | Geographic organization | +1 table; add FK to Complaint & Worker |
| **SLA/Target Times** | Define service level agreements | +1 table (Department_SLA) |

---

**Document End**  
*For Draw.io source file and visual diagram, see `docs/diagrams/ER_Model.drawio`*
