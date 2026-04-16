# Worker App Documentation

## Overview
The worker app is the maintenance-facing portion of CivicMitra. It enables campus workers to:
- view available tasks for their department
- accept work assignments
- start tasks and update progress
- upload proof of work with photos
- mark tasks completed or incomplete
- review incomplete tasks and worker notes

This module is designed for the worker tab flow inside `civic-app/app/(worker)/(tabs)`.

## Screens and Flow

### Dashboard
File: `civic-app/app/(worker)/(tabs)/dashboard.tsx`
- Loads `getMyTasks()` and `getAllTasks()`.
- Filters task lists by `user.department` from `AuthContext`.
- Displays counters for active, completed, pending, total, and incomplete tasks.
- Provides quick navigation to:
  - All Tasks
  - My Tasks
  - Incomplete Tasks
  - Profile

### All Tasks
File: `civic-app/app/(worker)/(tabs)/all-tasks.tsx`
- Uses `getAllTasks()` to fetch available tasks.
- Filters the tasks by `issueType === user.department`.
- Renders pending tasks only.
- Allows workers to accept tasks with `acceptTask(id)`.
- Refreshes the list after accepting a task.

### My Tasks
File: `civic-app/app/(worker)/(tabs)/my-tasks.tsx`
- Uses `getMyTasks()` to fetch the worker's assigned tasks.
- Excludes tasks with status `incomplete` from this view.
- Shows accepted, in-progress, and completed tasks.
- Allows transitioning an accepted task to in-progress via `startTask(id)`.
- Navigates to `TaskDetail` for each task.

### Incomplete Tasks
File: `civic-app/app/(worker)/(tabs)/incomplete-tasks.tsx`
- Uses `getMyTasks()` and filters `status === "incomplete"`.
- Displays tasks that require rework or follow-up.
- Shows worker notes explaining why the task was marked incomplete.

### Task Detail
File: `civic-app/app/(worker)/task-detail.tsx`
- Receives serialized task data via route params.
- Loads latest task data by combining `getAllTasks()` and `getMyTasks()`.
- Displays task details, location, description, and status badge.
- If task status is `accepted`, shows a `Start Task` action.
- If task status is `in-progress`, allows the worker to:
  - upload a proof image from gallery or camera
  - open a confirmation modal for `Completed` or `Incomplete`
  - enter an optional note
- Calls `completeTask(id, status, note, image)` to finalize the task.

### Profile
File: `civic-app/app/(worker)/(tabs)/profile.tsx`
- Displays a static worker profile card.
- Includes placeholder options for Edit Profile and Settings.
- Uses `router.push("/signout")` for logout.

## API Layer
File: `civic-app/src/api/tasks.api.ts`

### Task APIs
- `getAllTasks()`
  - Production: `GET /tasks/available`
  - Demo: returns pending tasks from local demo store.
- `getMyTasks()`
  - Production: `GET /tasks/my`
  - Demo: returns all non-pending tasks from local demo store.
- `acceptTask(id)`
  - Production: `PATCH /tasks/${id}/accept`
  - Demo: updates status from `pending` to `accepted`.
- `startTask(id)`
  - Production: `PATCH /tasks/${id}/start`
  - Demo: updates status from `accepted` to `in-progress`.
- `completeTask(id, status, note, image)`
  - Production: `PATCH /tasks/${id}/complete`
  - Payload: `{ proofImages: [image], notes: note }`
  - Demo: updates status from `in-progress` to `completed` or `incomplete`, and stores `note` plus `completedImage`.

### Demo Mode
- Controlled by `EXPO_PUBLIC_USE_DEMO_API` in `civic-app/src/api/config.js`.
- Demo mode uses an in-memory task store inside `tasks.api.ts`.
- Demo data includes sample tasks and task status transitions.
- Production mode uses the real backend via `civic-app/src/api/axios.js`.

## Task Status Lifecycle
The worker app currently models the following task status flow:
1. `pending` → available tasks a worker can accept
2. `accepted` → worker has claimed the task
3. `in-progress` → worker has started working on the task
4. `completed` → worker confirms task finished successfully
5. `incomplete` → worker marks the task as needing rework

## Data Model
Task shape is defined in `civic-app/src/types/task.ts`.
Important fields used by worker screens:
- `id`
- `issueType`
- `status`
- `type` (`campus` | `hostel`)
- location details: `landmark`, `address`, `hostelName`, `floor`, `room`
- `description`
- `reportedAt`
- `note`, `completedImage`, `completedAt`

## Routing
Worker routes include:
- `/(worker)/(tabs)/dashboard`
- `/(worker)/(tabs)/all-tasks`
- `/(worker)/(tabs)/my-tasks`
- `/(worker)/(tabs)/incomplete-tasks`
- `/(worker)/(tabs)/profile`
- `/(worker)/task-detail`
- `/(worker)/task-detail` uses serialized task data in route params.

## Developer Notes
- Department filtering is implemented client-side using `AuthContext.user.department`.
- `TaskDetail` refreshes task data by merging results from both available and assigned task endpoints.
- The worker app assumes UI state transitions are valid; the backend should enforce task ownership and valid status changes.
- The profile screen is currently visual-only and does not use live worker metadata.
- For reliability, confirm that all task endpoints return the same `id` values used by the app.

## Recommended Improvements
- Shift department-level task filtering to backend endpoints.
- Replace serialized task route params with a single task ID and fetch details from the backend.
- Add stronger error feedback for failed API operations.
- Validate note length and image upload before completing tasks.
- Add a retry/resubmit action for incomplete tasks if the worker fixes the issue.
- Populate profile screen dynamically from authenticated user data.
