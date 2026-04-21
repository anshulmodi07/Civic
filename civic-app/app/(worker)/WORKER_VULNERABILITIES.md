# Worker App Vulnerabilities

## Summary
This document lists worker-app-specific risks discovered in `civic-app/app/(worker)` and the worker task flow.
These are primarily client-side issues and design observations that should be addressed in the backend or by adding stronger validation.

## Authorization and Access Control
- `user.department` filtering is only applied in the UI.
  - Risk: a user could see or act on tasks from other departments if backend authorization is not enforced.
  - Recommendation: enforce department and worker assignment checks server-side for all task endpoints.

- Task actions depend on task status transitions in the UI.
  - Risk: if backend endpoints do not validate current status and worker ownership, a worker could accept/start/complete tasks they should not.
  - Recommendation: backend should verify `workerId`, current task status, and valid transitions at each PATCH endpoint.

## Trusting Client-Side Data
- `TaskDetail` receives serialized task data through route params and parses it with `JSON.parse()`.
  - Risk: malformed or manipulated route params may crash the screen or expose stale data.
  - Recommendation: use a task ID plus a backend detail fetch instead of trusting serialized JSON.

- `TaskDetail` reloads task state by combining `getAllTasks()` and `getMyTasks()`.
  - Risk: if backend task state changes while a worker is viewing a task, the displayed data may be outdated.
  - Recommendation: add a dedicated `GET /tasks/:id` endpoint or refresh task details at load time.

## Input Validation and Proof Requirements
- Task completion requires a photo only in the UI layer.
  - Risk: a malicious client could skip image proof or submit invalid payloads if the backend does not validate `proofImages`.
  - Recommendation: backend must require and validate proof image upload for complete/incomplete actions.

- Notes are accepted without sanitization or length limits.
  - Risk: overly long or malicious note content may cause issues if not validated server-side.
  - Recommendation: validate `notes` length and content on the backend.

## Demo Mode and Local State
- `EXPO_PUBLIC_USE_DEMO_API` enables a client-side demo task store.
  - Risk: demo mode should never be enabled in production because it bypasses backend security completely.
  - Recommendation: keep demo mode isolated and clearly documented as non-production.

- Demo store state is local and in-memory.
  - Risk: it does not simulate real authentication, task ownership, or concurrency.
  - Recommendation: use demo mode only for UI prototyping, not for security testing.

## UI/UX and Reliability Risks
- `All Tasks` and `Dashboard` both filter by department, but the backend may still return all tasks.
  - Risk: inconsistent results or data leakage if the backend response changes format.

- `My Tasks` hides incomplete tasks completely from the main task list.
  - Risk: workers may lose track of incomplete tasks if they do not regularly check the separate screen.
  - Recommendation: consider surfacing incomplete tasks alongside active tasks or add stronger reminders.

- Error handling is minimal in key screens.
  - Risk: API failures may leave the UI silently stale or show empty states incorrectly.
  - Recommendation: add explicit user-facing error messages and retry logic for network issues.

## Recommended Security Checklist
- [ ] Backend verifies authenticated worker identity for each task endpoint.
- [ ] Backend enforces department-level access for `/tasks/available` and `/tasks/my`.
- [ ] Backend validates task status transitions (`pending → accepted → in-progress → completed/incomplete`).
- [ ] Backend validates `proofImages` and `notes` in `/tasks/:id/complete`.
- [ ] Frontend route navigation passes minimal data (IDs only) and avoids JSON serialization of task payloads.
- [ ] Demo mode is disabled in production builds and documented clearly.
- [ ] Add user-visible error / retry states for task actions.

## High-Risk Items
1. client-side department filtering only
2. route param JSON parsing for tasks
3. UI-only image proof requirement
4. incomplete backend task-status enforcement
5. insecure demo mode if accidentally shipped
