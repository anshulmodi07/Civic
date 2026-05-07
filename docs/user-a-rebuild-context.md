# User A Rebuild Context

This document captures the state needed to rebuild the User A frontend and backend cleanly on top of fresh `origin/main`.

Current clean rebuild branch:

```text
rebuild/user-a-clean-fix
```

Reference branch:

```text
Devam
```

Reference stash containing the last unstable network-debug work:

```text
stash@{0}: On Devam: reference/devam-network-debug-before-user-a-rebuild
```

The rebuild should use `Devam` as a source of implementation ideas only. Do not blindly copy the final networking/debug changes from the stash.

## What Is Broken In Main

`main` has partial User A functionality, but the app is not production-functional for a normal user flow.

Authentication issues:

- User login is not a real password login. Backend `loginUser` accepts only email, creates a user if missing, and returns a token. This is effectively an auth bypass.
- Backend still keeps Google login as the main user auth route, but Google sign-in is unreliable outside Expo/native setup and should not be the User A primary auth path.
- `User` model has no `password`, so secure user registration/login cannot work.
- There is no reliable `/auth/me` route in `main`, so token restoration cannot be verified against the backend.
- Frontend stores both `token` and `user` directly in AsyncStorage and restores the user from cached JSON instead of asking the backend.
- Role naming is inconsistent: frontend uses `client`, backend JWT uses `user`, and some responses return `role: "user"`.

Frontend/API issues:

- `civic-app/src/api/axios.js` reads `EXPO_PUBLIC_API_URL` directly and does not normalize bad values such as a trailing `/api`.
- `main` logs token values to the console.
- User auth API shape is positional (`loginUser(email, password)`) while cleaner code should use object payloads.
- Login screen contains demo credentials and role handling mixed into the UI, without a clean backend-backed demo account.
- Frontend modules expect complaint APIs that are only partially aligned with backend response shapes.

Backend complaint/user issues:

- Complaint controller imports `../models/complaint.js`, while the repo has casing-sensitive `Complaint.js` in other branches. This can break outside Windows.
- Complaint create/read response shapes are inconsistent: some endpoints return raw arrays/documents while later frontend code expects `{ success, data }` or normalized records.
- Department lookup and department-backed complaint category handling are incomplete in `main`.
- Image upload handling and multipart normalization are not cleanly separated.

## What Was Fixed In Devam

The `Devam` branch contains a large set of backend and frontend fixes. Some are stable and worth porting, while some networking changes became unstable and should be rebuilt cleanly.

Stable auth fixes worth reusing:

- Added password-based user auth on backend:
  - `POST /auth/user/register`
  - `POST /auth/user/login`
  - `GET /auth/me`
- Added `password` to the `User` model.
- Normalized returned account shape to include role information.
- Used JWT payload role `user` while returning frontend role `client`.
- Updated frontend `AuthContext` to:
  - store only token;
  - restore session via `/auth/me`;
  - expose `isWorker` and `isUser`;
  - route worker and client flows based on backend-authenticated user.
- Reworked user login/register screens around email/password instead of Google sign-in.
- Added a demo user concept that fills fields but still uses real backend login.

Stable complaint/backend fixes worth reusing:

- Added `department.routes.js` and `department.controller.js`.
- Added upload middleware for complaint images.
- Added `complaint.service.js` to keep controller logic thinner.
- Added `validateComplaint.js` for hostel/campus validation.
- Improved complaint schema alignment for:
  - `type`
  - `visibility`
  - hostel fields: `hostelName`, `floor`, `roomNumber`, `landmark`
  - campus fields: `area`, `locationAddress`
  - `description`
  - `departmentId`
  - `location`
  - `images`
- Added aggregation/population style read APIs for complaint lists and details.
- Added interaction-backed support/upvote/comment handling.

Stable frontend fixes worth reusing:

- Added Expo Router auth register route:
  - `civic-app/app/(auth)/register.tsx`
- Updated client screens to use real APIs:
  - `app/(client)/index.tsx`
  - `app/(client)/browse.tsx`
  - `app/(client)/my-complaints.tsx`
  - `app/(client)/complaint-detail/[id].tsx`
  - `app/(client)/create-complaint.tsx`
  - `app/(client)/create-complaint-campus.tsx`
  - `app/(client)/create-complaint-hostel.tsx`
  - `app/(client)/complaint-map.tsx`
  - `app/(client)/complaint-map.web.tsx`
- Added API modules:
  - `src/api/department.api.js`
  - `src/api/dashboard.api.js`
  - updated `src/api/complaint.api.js`
- Aligned create complaint screens with FormData payloads accepted by backend.
- Improved list/detail screens to derive department names, status, upvotes/support count, and asset URLs.

## Modules Changed In Devam

Frontend auth/session:

- `civic-app/src/api/auth.api.js`
- `civic-app/src/api/axios.js`
- `civic-app/src/context/AuthContext.js`
- `civic-app/src/screens/common/LoginScreen.js`
- `civic-app/src/screens/common/RegisterScreen.js`
- `civic-app/app/(auth)/register.tsx`
- `civic-app/app/_layout.tsx`

Frontend User A/client screens:

- `civic-app/app/(client)/index.tsx`
- `civic-app/app/(client)/browse.tsx`
- `civic-app/app/(client)/my-complaints.tsx`
- `civic-app/app/(client)/complaint-detail/[id].tsx`
- `civic-app/app/(client)/complaint-map.tsx`
- `civic-app/app/(client)/complaint-map.web.tsx`
- `civic-app/app/(client)/create-complaint.tsx`
- `civic-app/app/(client)/create-complaint-campus.tsx`
- `civic-app/app/(client)/create-complaint-hostel.tsx`

Frontend API/support modules:

- `civic-app/src/api/complaint.api.js`
- `civic-app/src/api/department.api.js`
- `civic-app/src/api/dashboard.api.js`
- `civic-app/src/services/complaintValidation.service.js`
- `civic-app/src/utils/constants.js`

Backend auth/user:

- `backend/src/controllers/auth.controller.js`
- `backend/src/routes/auth.routes.js`
- `backend/src/models/User.js`
- `backend/src/middleware/auth.middleware.js`
- `backend/src/utils/jwt.js`
- `backend/seed.js`

Backend complaints:

- `backend/src/controllers/complaint.controller.js`
- `backend/src/routes/complaint.routes.js`
- `backend/src/models/Complaint.js`
- `backend/src/services/complaint.service.js`
- `backend/src/utils/validateComplaint.js`
- `backend/src/middleware/upload.middleware.js`

Backend departments/tasks that affect User A:

- `backend/src/controllers/department.controller.js`
- `backend/src/routes/department.routes.js`
- `backend/src/models/department.js`
- `backend/src/models/Task.js`
- `backend/src/controllers/task.controller.js`
- `backend/src/routes/task.routes.js`

## Current Intended API Flow

Use a clean API base with no `/api` suffix:

```text
http://<backend-host>:3000
```

Do not hard-code a local LAN IP in source code. Use `EXPO_PUBLIC_API_URL` for local Expo Go testing and keep the axios fallback simple.

Authentication:

```http
POST /auth/user/register
Content-Type: application/json

{
  "name": "Demo User",
  "email": "demo@nitdelhi.ac.in",
  "password": "123456"
}
```

Expected response:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "<mongo id>",
    "name": "Demo User",
    "email": "demo@nitdelhi.ac.in",
    "role": "client",
    "departmentId": null
  }
}
```

```http
POST /auth/user/login
Content-Type: application/json

{
  "email": "demo@nitdelhi.ac.in",
  "password": "123456"
}
```

Expected response is the same shape as registration.

```http
POST /auth/worker/login
Content-Type: application/json

{
  "email": "wifi@nitdelhi.ac.in",
  "password": "123456"
}
```

Expected response:

```json
{
  "token": "<jwt>",
  "worker": {
    "id": "<mongo id>",
    "name": "Worker Wifi",
    "email": "wifi@nitdelhi.ac.in",
    "role": "worker",
    "departmentId": "<department id>"
  }
}
```

Session restore:

```http
GET /auth/me
Authorization: Bearer <jwt>
```

Expected response:

```json
{
  "user": {
    "id": "<mongo id>",
    "name": "Demo User",
    "email": "demo@nitdelhi.ac.in",
    "role": "client",
    "departmentId": null
  }
}
```

Departments:

```http
GET /departments
```

Expected response:

```json
{
  "success": true,
  "data": [
    { "_id": "<id>", "name": "wifi" },
    { "_id": "<id>", "name": "plumber" }
  ]
}
```

Create complaint:

```http
POST /complaints
Authorization: Bearer <jwt>
Content-Type: multipart/form-data
```

Campus fields:

```text
type=campus
area=<campus area>
locationAddress=<specific location>
departmentId=<department id>
description=<20-500 chars>
visibility=public
location={"lat":28.545,"lng":77.192}
images[]=<optional files>
```

Hostel fields:

```text
type=hostel
hostelName=<hostel>
floor=<floor>
visibility=public|private
landmark=<required when public>
roomNumber=<required when private>
departmentId=<department id>
description=<20-500 chars>
location={"lat":28.545,"lng":77.192}
images[]=<optional files>
```

Complaint list/detail:

```http
GET /complaints
GET /complaints/my
GET /complaints/:id
GET /complaints/nearby?lat=<lat>&lng=<lng>&radiusKm=5
POST /complaints/:id/support
GET /complaints/:id/comments
POST /complaints/:id/comments
GET /complaints/:id/timeline
```

Preferred response shape for new clean work:

```json
{
  "success": true,
  "data": {}
}
```

Use a single `unwrap(res)` helper in frontend API modules:

```js
const unwrap = (res) => res.data?.data ?? res.data;
```

## Authentication And Session Handling

Clean target behavior:

- Login and register must call backend and receive a JWT.
- Store only `token` in AsyncStorage.
- On app start, if token exists, call `/auth/me`.
- If `/auth/me` fails with 401, remove token and send user to auth flow.
- Frontend role mapping:
  - backend JWT role `user` maps to frontend route role `client`;
  - backend role `worker` maps to worker tabs.
- Login autofill may exist, but it must only fill credentials. It must not bypass backend auth.

Do not restore `user` from AsyncStorage as the source of truth.

## Known Network Error Causes From Current Branch

The current `Devam` branch became inefficient to debug because several networking concerns were mixed with auth and UI changes.

Known causes and traps:

- `EXPO_PUBLIC_API_URL=http://localhost:3000/api` is wrong for Expo Go on a physical phone.
  - `localhost` means the phone itself.
  - `/api` is not mounted by the backend.
- `10.0.2.2` only works for Android emulator, not physical Expo Go.
- LAN IPs such as `http://10.201.89.114:3000` can work locally but should not be committed as source-code defaults.
- Expo Go can serve a stale JS bundle even after code changes. A line-number mismatch was observed: runtime logs pointed to old `auth.api.js` line numbers that did not match the file on disk.
- Excessive debug logging was added in the final unstable state. Do not port that logging wholesale.
- Backend request logs are useful during rebuild, but keep them minimal and removable.
- If phone Chrome opens `http://<lan-ip>:3000/` but axios in Expo Go still reports Network Error, check:
  - stale Expo bundle/cache;
  - cleartext HTTP restrictions;
  - wrong env loaded into bundle;
  - firewall only partially allowing browser but not app traffic;
  - using tunnel/LAN modes inconsistently.

Recommended clean networking strategy:

- Backend should listen on `0.0.0.0`.
- Frontend should use one central `src/api/axios.js`.
- `EXPO_PUBLIC_API_URL` should be documented in `.env.example`, not hard-coded into source.
- Axios should normalize trailing slash and accidental `/api`.
- Add a temporary `GET /health` endpoint during integration.
- Verify in order:
  1. Laptop: `GET http://localhost:3000/health`
  2. Phone browser: `GET http://<lan-ip>:3000/health`
  3. Expo logs show same base URL.
  4. Login request reaches backend terminal.

## Stable Parts Worth Reusing

Reuse from `Devam`:

- Password-based user auth controller shape.
- `/auth/me` session restore.
- `User.password` schema addition with hashing.
- Demo user as real seeded user, not bypass.
- Complaint validation rules.
- Multipart image upload middleware.
- Department API and frontend department picker loading.
- Client complaint list/detail/create screens after stripping debug noise.
- Asset URL helper that prefixes uploaded images with API base.
- Response unwrapping helper.

## Parts To Rebuild Cleanly

Rebuild, do not copy blindly:

- `src/api/axios.js`
  - Keep it minimal.
  - No noisy token logs.
  - No committed LAN IP.
  - Normalize env URL.
- `.env` handling
  - Add `.env.example`.
  - Keep developer-specific `.env` local.
- Login screen debugging additions from stash.
  - Keep user/worker selector and demo autofill if useful.
  - Remove line-by-line logs.
- Backend server debug logs.
  - Keep `GET /health`.
  - Avoid noisy logs after integration is stable.
- Large native `civic-app/android` directory from `Devam`.
  - Do not port unless a native build is explicitly needed.
- Google sign-in packages/config.
  - Remove from User A auth path unless product requirements change.

## Suggested Clean Rebuild Order

1. Backend auth only.
   - Add `User.password`.
   - Add user register/login/me.
   - Keep worker login untouched except response normalization if needed.
   - Verify with `Invoke-RestMethod` or curl before frontend work.

2. Frontend auth only.
   - Clean central axios.
   - Clean AuthContext.
   - Clean Login/Register.
   - Verify login on Expo Go before touching complaints.

3. Backend complaint API.
   - Port schema/service/controller changes in small chunks.
   - Verify each endpoint with token.

4. Frontend complaint API module.
   - Port `complaint.api.js`, `department.api.js`, `dashboard.api.js`.
   - Verify each API call from a simple screen/log before full UI.

5. Frontend User A screens.
   - Port create complaint host/campus flows.
   - Port my complaints/browse/detail/map.
   - Verify route by route.

6. Cleanup.
   - Remove debug logs.
   - Remove unused Google/demo bypass code.
   - Run typecheck and lint.

## Verification Checklist

Backend:

```powershell
cd C:\Projects\CivicMitra2\Civic\backend
node --check server.js
node --check src\controllers\auth.controller.js
node server.js
```

Auth API smoke tests:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health"
Invoke-RestMethod -Uri "http://localhost:3000/auth/user/login" -Method Post -ContentType "application/json" -Body '{"email":"demo@nitdelhi.ac.in","password":"123456"}'
```

Frontend:

```powershell
cd C:\Projects\CivicMitra2\Civic\civic-app
npx tsc --noEmit
npm run lint
npx expo start -c --lan
```

Expo Go:

- Confirm backend URL from `.env`.
- Confirm phone browser can open `/health`.
- Confirm login request reaches backend terminal.
- Confirm `/auth/me` works after app restart.

