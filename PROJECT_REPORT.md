# Project Report: Ganpati Gauseva Donation Collection and Management Platform

Generated on: 2026-06-04  
Audit scope: `PRD.md`, `backend/`, and `frontend/` source code.

## Executive Summary

The backend is substantially implemented for the Phase 1 PRD. It includes the Prisma data model, admin authentication, donation order creation, Razorpay integration, webhook processing, receipt generation, email workflows, campaign management, animal management, expense ledger, exports, dashboard metrics, and configuration APIs.

The frontend is visually broad and includes public pages plus an admin portal, but it is not production-compatible with the backend yet. Most frontend workflows are mock or `localStorage` based. The public donation page does not call the backend donation APIs or open Razorpay Checkout. Admin login is wired to `/api/v1/auth/login`, but expects the wrong response shape and token handling model. Admin dashboard, donations, animals, expenses, settings, volunteers, and newsletter pages mostly do not call backend APIs.

Overall readiness:

| Area | Status | Notes |
| --- | --- | --- |
| Backend core API | Mostly implemented | Strong coverage of PRD Phase 1 backend requirements. |
| Razorpay order creation | Implemented and previously tested | Test order creation worked after backend restart with updated keys. |
| Webhook/payment capture | Implemented in backend, not fully end-to-end verified | Requires real Razorpay test checkout with public webhook URL or signed local webhook simulation. |
| Receipt generation | Implemented | PDF generated after successful payment webhook/finalization. |
| Frontend public donation flow | Not implemented | Current flow is a mock alert only. |
| Frontend admin compatibility | Not compatible yet | Uses mock/localStorage data and mismatched auth contract. |
| Campaign frontend | Mostly missing | Public and admin campaign pages are marked coming soon. |
| Build verification | Blocked | Frontend dependencies are not installed, so `npm run build` fails because `tsc` is unavailable. |

## Repository Overview

### Backend

Backend stack:

- Express 5 API.
- Prisma with PostgreSQL.
- Razorpay SDK.
- Nodemailer SMTP.
- PDFKit for receipt PDFs.
- XLSX for exports.
- Zod validation.
- Cookie/JWT session authentication.

Important backend files:

- API app setup: `backend/src/app.js`
- API route mounting: `backend/src/routes/index.js`
- Prisma schema: `backend/prisma/schema.prisma`
- Donation/payment logic: `backend/src/services/donation.service.js`
- Campaign logic: `backend/src/services/campaign.service.js`
- Animal logic: `backend/src/services/animal.service.js`
- Expense logic: `backend/src/services/expense.service.js`
- Auth/session logic: `backend/src/services/auth.service.js`
- Receipt PDF utilities: `backend/src/utils/receipt.js`

### Frontend

Frontend stack:

- Vite.
- React 19.
- React Router.
- React Hook Form.
- Zustand.
- Axios.
- React Helmet Async.
- Tailwind CSS.
- Lucide icons.

Important frontend files:

- Route tree: `frontend/src/App.tsx`
- Public donation page: `frontend/src/pages/Donate.tsx`
- Admin login: `frontend/src/pages/admin/Login.tsx`
- Admin layout/auth guard: `frontend/src/layouts/AdminLayout.tsx`
- Admin auth store: `frontend/src/store/useAuthStore.ts`
- Admin dashboard: `frontend/src/pages/admin/Dashboard.tsx`
- Admin donations: `frontend/src/pages/admin/DonationsList.tsx`
- Admin animals: `frontend/src/pages/admin/AnimalsList.tsx`
- Admin expenses: `frontend/src/pages/admin/ExpensesList.tsx`
- Admin settings: `frontend/src/pages/admin/Settings.tsx`

## Backend Implementation Report

### Implemented Backend Features

#### App and Routing

Implemented:

- Health route: `GET /health`.
- API base: `/api/v1`.
- Public routes:
  - `/api/v1/donations`
  - `/api/v1/campaigns`
  - `/api/v1/animals`
  - `/api/v1/site`
  - `/api/v1/receipts`
- Admin routes:
  - `/api/v1/admin/dashboard`
  - `/api/v1/admin/donations`
  - `/api/v1/admin/campaigns`
  - `/api/v1/admin/animals`
  - `/api/v1/admin/expenses`
  - `/api/v1/admin/config`
- Razorpay webhook route uses raw request body before JSON middleware, which is required for signature verification.

Evidence:

- `backend/src/app.js`
- `backend/src/routes/index.js`
- `backend/src/routes/webhook.routes.js`

#### Database Schema

Implemented Prisma models:

- `AdminUser`
- `AdminSession`
- `Donor`
- `Campaign`
- `CampaignImage`
- `CampaignUpdate`
- `CampaignComment`
- `Animal`
- `AnimalImage`
- `AnimalMedicalRecord`
- `Donation`
- `Receipt`
- `ExpenseLedger`
- `NotificationConfig`
- `SystemConfig`
- `PaymentWebhookEvent`

Implemented enums:

- `DonationType`
- `DonationStatus`
- `CampaignStatus`
- `AnimalStatus`
- `ExpenseCategory`

The schema matches the PRD conceptual model very closely.

Evidence:

- `backend/prisma/schema.prisma`

#### Admin Authentication

Implemented:

- Admin login.
- Admin logout.
- Current admin session check.
- HTTP-only session cookie.
- JWT-backed session token.
- Session stored in DB by token hash.
- One active admin session enforced by revoking previous sessions.
- Login rate limiting.

Important compatibility note:

- The backend does not return the token in JSON. It sets an HTTP-only cookie and returns `{ message, admin }`.
- This is good security practice, but the frontend currently expects a token in `response.data.data.token`, so frontend login currently cannot work as written.

Evidence:

- `backend/src/controllers/auth.controller.js`
- `backend/src/services/auth.service.js`
- `backend/src/middleware/auth.js`
- `backend/src/middleware/rate-limit.js`

#### Donation and Razorpay Flow

Implemented:

- `POST /api/v1/donations/create-order`
- `POST /api/v1/donations/verify`
- `GET /api/v1/donations/:id/public-status`
- `POST /api/v1/webhooks/razorpay`
- Razorpay Orders API integration.
- Razorpay checkout callback signature verification.
- Webhook signature verification.
- Webhook event persistence.
- Duplicate webhook protection.
- Payment success handling for `payment.captured` and `order.paid`.
- Payment failure handling for `payment.failed`.
- Donation status lifecycle: `CREATED`, `ATTEMPTED`, `PAID`, `FAILED`.
- Donation validation:
  - `amount >= 1`
  - `campaignId` required for campaign donation
  - email required when tax receipt is requested
- Campaign donation fallback to general donation when campaign is inactive, missing, closed, or already at target.

Evidence:

- `backend/src/routes/donation.routes.js`
- `backend/src/controllers/donation.controller.js`
- `backend/src/services/donation.service.js`
- `backend/src/validators/donation.validator.js`

#### Receipt Generation

Implemented:

- Receipt number generation using configurable prefix and sequence.
- Receipt record stored in DB.
- PDF receipt generation via PDFKit.
- Public receipt download by signed token.
- Donor email with receipt attachment when email exists.
- 80G placeholder text and registration fields.

Evidence:

- `backend/src/utils/receipt.js`
- `backend/src/services/donation.service.js`
- `backend/src/routes/receipt.routes.js`

#### Campaign Management

Implemented:

- Public campaign list.
- Public campaign detail by slug.
- Public campaign comments.
- Admin campaign list.
- Admin campaign create/update/detail.
- Campaign status update.
- Campaign image upload.
- Campaign update posts.
- Comment moderation.
- Comments enabled/disabled toggle.
- Auto-close on target amount after paid donation sync.

Evidence:

- `backend/src/routes/campaign.routes.js`
- `backend/src/services/campaign.service.js`
- `backend/src/validators/campaign.validator.js`

#### Animal Management

Implemented:

- Public animal list/detail.
- Admin animal create/list/detail/update.
- Animal image upload.
- Max 5 images per animal.
- Medical record creation.
- Animal Excel export.
- Filters by status, breed, and health status.

Evidence:

- `backend/src/routes/animal.routes.js`
- `backend/src/services/animal.service.js`
- `backend/src/validators/animal.validator.js`

#### Expense Ledger

Implemented:

- Admin expense create/list/update/delete.
- Expense filters by date range, category, animal, campaign.
- Expense Excel export.
- Optional `attachmentUrl` field.

Evidence:

- `backend/src/routes/expense.routes.js`
- `backend/src/services/expense.service.js`
- `backend/src/validators/expense.validator.js`

#### Admin Config

Implemented:

- Notification config read/update.
- Donation email toggle.
- Notification email.
- Threshold settings.
- Send-all vs threshold-only setting.
- System config read/update.
- Receipt prefix.
- Legal 80G text and registration placeholders.
- Policy page content fields.
- Public site config endpoint.

Evidence:

- `backend/src/routes/config.routes.js`
- `backend/src/services/config.service.js`
- `backend/src/validators/config.validator.js`

#### Dashboard and Analytics

Implemented:

- Today donation aggregate.
- Month donation aggregate.
- Year donation aggregate.
- Donation status counts.
- Campaign progress stats.
- Expense category distribution.
- Animal status distribution.
- Donor total/new/repeat estimate.

Partially missing compared to PRD:

- Week donation aggregate.
- Average donation amount.
- High-value donation count.
- Donation trend line by day.
- Top campaigns by donation volume.

Evidence:

- `backend/src/services/dashboard.service.js`
- PRD section `14.1 Dashboard KPIs`

#### Export Support

Implemented:

- Donation Excel export.
- Animal Excel export.
- Expense Excel export.

Note:

- PRD asks for weekly/monthly/yearly/custom exports. Backend supports date filters and Excel output, but does not explicitly implement a `period=week|month|year|custom` parser. The frontend currently exports CSV locally instead of using backend Excel endpoints.

Evidence:

- `backend/src/services/donation.service.js`
- `backend/src/services/animal.service.js`
- `backend/src/services/expense.service.js`

## Backend Missing or Incomplete Items

### High Priority Backend Gaps

1. Consent is not stored for donations.
   - PRD requires terms/privacy consent checkbox.
   - Frontend has `consent`.
   - Backend validator and schema do not store consent.
   - Files:
     - `PRD.md`
     - `frontend/src/pages/Donate.tsx`
     - `backend/src/validators/donation.validator.js`
     - `backend/prisma/schema.prisma`

2. Expense and medical attachment upload routes are not wired.
   - Backend has multer helpers for expense and medical attachments.
   - Expense and medical validators only accept `attachmentUrl`.
   - There is no actual upload route for expense bills or medical record attachments.
   - Files:
     - `backend/src/middleware/upload.js`
     - `backend/src/routes/expense.routes.js`
     - `backend/src/routes/animal.routes.js`

3. Public campaign detail can expose non-active campaigns.
   - Public campaign list filters `status: ACTIVE`.
   - Public campaign detail fetches by slug without status filtering.
   - Draft/archived campaigns can be fetched if slug is known.
   - File:
     - `backend/src/services/campaign.service.js`

4. Campaign primary image is not enforced.
   - PRD requires primary image for campaign creation.
   - Backend campaign creation does not require an image.
   - File:
     - `backend/src/validators/campaign.validator.js`

5. Production secrets are not fail-fast.
   - `JWT_SECRET` falls back to `dev-secret-change-me`.
   - In production, startup should fail if required secrets are missing or default.
   - File:
     - `backend/src/config/env.js`

6. Backup/restore is not implemented.
   - PRD requires daily automated DB backups, restore testing, and backup encryption.
   - No backup scripts or operational docs were found.

7. Logging/monitoring is minimal.
   - PRD mentions auth attempts, donation flow events, webhook failures, email outcomes, and backup failures.
   - Current implementation logs unhandled errors and mailer skip warnings, but does not implement structured operational logging or monitoring hooks.

### Medium Priority Backend Gaps

1. Dashboard KPIs are incomplete.
   - Missing week totals, average donation, high-value donations, daily trend, and top campaign volume.

2. Export period parameter is not explicitly supported.
   - PRD describes `period=week|month|year|custom`.
   - Backend supports date range filters but not period parsing.

3. Webhook event id is synthetic.
   - The backend uses event/payment-derived IDs rather than a Razorpay event id from headers/body.
   - Duplicate protection likely works for payment ids, but should be reviewed against actual Razorpay payload shape.

4. No automated tests.
   - Backend `package.json` has no `test` script.
   - Payment, webhook, receipt, auth, and export flows are important enough to need automated tests.

5. Public animal detail is not restricted to active animals.
   - Public animal list filters active animals.
   - Public animal detail fetches by id without public/active restriction.

6. Image filenames are sanitized only for spaces/lowercase.
   - Upload handler does not strongly sanitize unusual filename characters.

7. Uploaded files are stored locally.
   - Fine for local deployment, but production deployment should define persistent storage strategy.

## Frontend Implementation Report

### Implemented Frontend Features

#### Public Pages

Implemented:

- Home page.
- Donate page UI.
- About page.
- Contact page.
- Blog page.
- Volunteer page.
- Terms page.
- Privacy page.
- Refund policy page.
- Public layout.
- Navbar/footer.
- Basic page-level SEO tags using `react-helmet-async`.

Evidence:

- `frontend/src/App.tsx`
- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/Donate.tsx`
- `frontend/src/pages/Volunteer.tsx`
- `frontend/src/pages/Terms.tsx`
- `frontend/src/pages/PrivacyPolicy.tsx`
- `frontend/src/pages/RefundPolicy.tsx`

#### Admin UI

Implemented visually:

- Admin login page.
- Admin dashboard.
- Admin donations page.
- Admin expenses page.
- Admin volunteers page.
- Admin animals list.
- Add animal page.
- Edit animal page.
- Newsletter page.
- Settings page.
- Admin sidebar layout.

Evidence:

- `frontend/src/pages/admin/Login.tsx`
- `frontend/src/layouts/AdminLayout.tsx`
- `frontend/src/pages/admin/Dashboard.tsx`
- `frontend/src/pages/admin/DonationsList.tsx`
- `frontend/src/pages/admin/ExpensesList.tsx`
- `frontend/src/pages/admin/AnimalsList.tsx`
- `frontend/src/pages/admin/AddAnimal.tsx`
- `frontend/src/pages/admin/EditAnimal.tsx`
- `frontend/src/pages/admin/Settings.tsx`

#### Dev Proxy

Implemented:

- Vite proxy from `/api` to `http://localhost:4000`.

Evidence:

- `frontend/vite.config.ts`

## Frontend Missing or Incomplete Items

### Critical Frontend Gaps

1. Donation payment flow is not implemented.
   - Current `Donate.tsx` only shows a mock alert.
   - It does not call `/api/v1/donations/create-order`.
   - It does not load Razorpay Checkout.
   - It does not call `/api/v1/donations/verify`.
   - It does not show a real thank-you/status polling page.
   - It does not render receipt download link after payment.

2. Campaign selector is missing from donation form.
   - PRD requires campaign selector when donation type is `CAMPAIGN`.
   - Backend requires `campaignId` for campaign donations.
   - Frontend allows selecting `Specific Campaign` but provides no campaign dropdown/list and no `campaignId`.

3. Public campaign pages are missing.
   - `/campaigns` route shows `Campaigns List (Coming Soon)`.
   - No campaign detail page exists.
   - No public comments UI exists.
   - No campaign updates/timeline UI exists.
   - No progress bar data is fetched from backend campaigns API.

4. Admin campaign management is missing.
   - `/admin/campaigns` route shows `Campaigns Management (Coming Soon)`.
   - No admin campaign CRUD UI.
   - No campaign status UI.
   - No campaign image upload UI.
   - No campaign update posts UI.
   - No campaign comment moderation UI.

5. Admin authentication is incompatible with backend.
   - Frontend expects:
     - `response.data.success`
     - `response.data.data.token`
   - Backend returns:
     - `{ message: "Login successful", admin: { ... } }`
     - HTTP-only cookie.
   - Frontend stores `adminToken` in localStorage.
   - Backend expects cookie or bearer token, but frontend never receives the token.
   - Admin login will show "Login failed" even if backend successfully authenticates and sets the cookie.

6. Admin protected routes are not actually backend-verified.
   - `AdminLayout` checks only local Zustand/localStorage state.
   - It does not call `/api/v1/auth/me`.
   - It does not handle expired/revoked backend sessions.
   - It does not send logout request to `/api/v1/auth/logout`.

7. Admin dashboard is mock/static.
   - It does not call `/api/v1/admin/dashboard`.
   - Displayed totals are hard-coded.

8. Admin donation page is mock/localStorage.
   - It does not call `/api/v1/admin/donations`.
   - It does not use backend filters.
   - It does not use `/api/v1/admin/donations/export`.
   - It exports CSV locally instead of backend XLSX.
   - It uses frontend status names `Success/Pending/Failed`, while backend uses `PAID/CREATED/ATTEMPTED/FAILED`.

9. Admin animal pages are mock/localStorage.
   - They do not call `/api/v1/admin/animals`.
   - They do not call `/api/v1/admin/animals/:id`.
   - They do not call create/update endpoints.
   - They do not upload images to backend.
   - They use fields that do not match backend schema.

10. Admin expense page is mock/localStorage.
   - It does not call `/api/v1/admin/expenses`.
   - It does not call update/delete/export endpoints.
   - It stores receipt files as base64 locally instead of backend attachment storage.
   - It uses frontend categories that do not match backend enum values.

11. Admin settings page is not connected.
   - It does not call `/api/v1/admin/config/notifications`.
   - It does not call `/api/v1/admin/config/system`.
   - It only logs form data and shows a saved message.

12. Frontend type definitions do not match backend models.
   - Donation fields differ.
   - Campaign fields differ.
   - Animal fields differ.
   - Expense fields differ.
   - Config fields differ.
   - This will cause integration bugs unless normalized.

### Medium Priority Frontend Gaps

1. No API client abstraction.
   - There is no shared Axios instance with `withCredentials: true`.
   - There is no central response/error handling.

2. No public config usage.
   - Backend exposes `/api/v1/site/config`.
   - Frontend uses hard-coded org, policy, and content values.

3. Newsletter and volunteer are outside backend scope.
   - Frontend has newsletter and volunteer storage in `localStorage`.
   - Backend has no newsletter or volunteer models/routes.
   - If these are required project features, backend support is missing.

4. Public animals are not backend-driven.
   - Home page reads featured animals from `localStorage`.
   - It does not fetch `/api/v1/animals`.

5. SEO baseline is incomplete.
   - Some pages use `Helmet`.
   - No sitemap generation found.
   - No `robots.txt` found.
   - No structured data/schema JSON-LD found.

6. Hindi/English language switch is incomplete.
   - PRD requires bilingual public UI with language switch.
   - Frontend includes some Hindi text, but no real global language toggle/state.
   - Backend supports language fields in campaign/config, but frontend does not use them.

7. Some admin sidebar routes have no matching route.
   - Sidebar links include `/admin/blog` and `/admin/gallery`.
   - `App.tsx` does not define those routes.

8. Some footer links have no matching route.
   - Footer links include `/work`, `/animals`, and `/services`.
   - `App.tsx` does not define those public routes.

9. Frontend dependency installation is missing.
   - `frontend/node_modules` does not exist.
   - `npm run build` failed because `tsc` was not found.

## Frontend-Backend Compatibility Matrix

| Feature | Backend Status | Frontend Status | Compatibility |
| --- | --- | --- | --- |
| Health check | Implemented | Not used | Fine, optional. |
| Admin login | Implemented with HTTP-only cookie | Calls endpoint but expects token JSON | Broken. |
| Admin logout | Implemented | Only clears localStorage | Broken. |
| Admin session check | Implemented `/auth/me` | Not used | Broken/incomplete. |
| Donation create order | Implemented | Not called | Missing integration. |
| Razorpay Checkout | Backend supports order flow | Not implemented | Missing integration. |
| Payment verify | Implemented | Not called | Missing integration. |
| Webhook capture | Implemented backend only | N/A | Needs external Razorpay/public URL or simulation. |
| Thank-you/status page | Backend has status endpoint | No page/polling | Missing integration. |
| Receipt download | Backend has signed PDF download | Not used | Missing integration. |
| Public campaign list | Implemented | Route says coming soon | Missing integration. |
| Campaign detail | Implemented | Missing | Missing integration. |
| Campaign comments | Implemented | Missing | Missing integration. |
| Admin campaign CRUD | Implemented | Route says coming soon | Missing integration. |
| Admin campaign updates | Implemented | Missing | Missing integration. |
| Admin comment moderation | Implemented | Missing | Missing integration. |
| Public animals | Implemented | Home uses localStorage/defaults | Missing integration. |
| Admin animal CRUD | Implemented | Uses localStorage | Missing integration and field mismatch. |
| Animal image upload | Implemented | Uses object URLs/localStorage | Missing integration. |
| Medical records | Implemented | No real UI integration | Missing/incomplete. |
| Admin donations list | Implemented | Uses localStorage | Missing integration. |
| Donation export | Implemented XLSX | Frontend exports CSV local | Mismatch. |
| Admin expenses CRUD | Implemented | Uses localStorage | Missing integration and enum mismatch. |
| Expense export | Implemented XLSX | Frontend exports CSV local | Mismatch. |
| Expense attachment | Backend partial | Frontend base64 local | Broken/incomplete. |
| Notification settings | Implemented | UI not connected | Missing integration. |
| System/80G settings | Implemented | UI not connected | Missing integration. |
| Dashboard metrics | Backend partial | Frontend static | Missing integration. |
| SEO | Backend not involved | Partial Helmet only | Incomplete. |
| Bilingual support | Backend data fields exist | No global language switch | Incomplete. |

## Key Data Contract Mismatches

### Auth Contract

Backend login response:

```json
{
  "message": "Login successful",
  "admin": {
    "id": "...",
    "username": "..."
  }
}
```

Frontend currently expects:

```json
{
  "success": true,
  "data": {
    "token": "..."
  }
}
```

Required fix:

- Use cookie-based auth on frontend.
- Set Axios `withCredentials: true`.
- Treat HTTP 200 from login as success.
- Store admin identity, not raw token.
- Call `/api/v1/auth/me` on admin app load.
- Call `/api/v1/auth/logout` on logout.

### Donation Contract

Backend create-order request:

```json
{
  "donationType": "GENERAL",
  "amount": 501,
  "currency": "INR",
  "donor": {
    "fullName": "Name",
    "phone": "9876543210",
    "email": "user@example.com",
    "isAnonymousPublic": false
  },
  "taxReceiptRequested": false
}
```

Frontend form currently produces flat fields:

```json
{
  "donationType": "GENERAL",
  "amount": "501",
  "fullName": "...",
  "phone": "...",
  "email": "...",
  "taxReceiptRequested": false,
  "isAnonymousPublic": false,
  "consent": true
}
```

Required fix:

- Transform frontend form data into backend payload.
- Add campaign selector and send `campaignId` for campaign donations.
- Call backend create-order.
- Open Razorpay Checkout with returned `keyId`, `razorpayOrderId`, amount, and currency.
- Call backend verify on Razorpay success callback.
- Poll public status until `PAID` or `FAILED`.
- Show receipt download when available.

### Donation Status Contract

Backend statuses:

- `CREATED`
- `ATTEMPTED`
- `PAID`
- `FAILED`

Frontend statuses:

- `Pending`
- `Success`
- `Failed`

Required fix:

- Map backend statuses to UI labels.
- Do not use local-only status enums in shared types.

### Animal Contract

Backend animal fields:

- `tagId`
- `name`
- `ageMonths`
- `gender`
- `breed`
- `healthStatus`
- `rescueDate`
- `shedLocation`
- `notes`
- `status`

Frontend animal fields:

- `nameEn`
- `nameHi`
- `tag`
- `species`
- `healthStatus`
- `rescueLocation`
- `urgencyLevel`
- `cost`
- `featureHomepage`
- `showPublic`

Required fix:

- Either adapt frontend to backend schema or extend backend schema for frontend-specific fields.
- Upload animal images with multipart `images`.
- Convert age years/months consistently.
- Map frontend statuses to backend `AnimalStatus` enum.

### Expense Contract

Backend expense categories:

- `FODDER`
- `MEDICINE`
- `STAFF`
- `TRANSPORT`
- `MAINTENANCE`
- `UTILITIES`
- `INFRASTRUCTURE`
- `OTHER`

Frontend categories:

- `Animal Feed`
- `Medical`
- `Staff Salary`
- `Maintenance`
- `Electricity`
- `Water`
- `Equipment`
- `Other`

Required fix:

- Add category mapping.
- Send backend fields:
  - `expenseDate`
  - `amount`
  - `category`
  - `vendorName`
  - `notes`
  - `attachmentUrl`
  - `animalId`
  - `campaignId`
- Use backend XLSX export endpoint instead of local CSV if PRD export requirement must be met exactly.

### Config Contract

Backend notification config fields:

- `donationEmailEnabled`
- `notificationEmail`
- `thresholdEnabled`
- `thresholdAmount`
- `sendAllSuccessfulDonations`

Frontend settings fields:

- `alertEmail`
- `enableAlerts`
- `alertThreshold`

Backend system config fields:

- `orgName`
- `defaultLanguage`
- `supportedLanguages`
- `commentsDefaultEnabled`
- `receiptPrefix`
- `legal80GText`
- `legal80GNumber`
- `legal80GValidity`
- policy content fields

Frontend settings fields:

- `registration80G`
- `validity80G`
- `legalDeclaration`

Required fix:

- Map frontend field names to backend field names.
- Load existing config on page mount.
- Save notification and system config through separate backend endpoints.

## PRD Coverage Report

### 5.1 Public Website and Donation Experience

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| General donation | Implemented | UI only | Partial. |
| Campaign donation | Implemented | No campaign selector/API | Partial. |
| Razorpay Orders flow | Implemented | Not wired | Partial. |
| Checkout callback verify | Implemented | Not wired | Partial. |
| Webhook final success | Implemented | N/A | Backend only; needs end-to-end verification. |
| Thank-you status page | Status API exists | Missing | Incomplete. |
| Receipt download | API exists | Missing | Incomplete. |
| Email receipt | Backend implemented | N/A | Backend only. |
| Consent checkbox | Frontend only | Backend missing storage | Incomplete. |

### 5.2 Admin Donation Management

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| View donations | Implemented | Mock/localStorage | Backend ready, frontend not integrated. |
| Filters | Implemented | Local-only simplified | Partial. |
| Detail view | Implemented | Missing real detail | Partial. |
| Excel export | Implemented | Local CSV | Mismatch. |

### 5.3 Campaign Management

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| Campaign CRUD | Implemented | Coming soon | Backend ready, frontend missing. |
| Target/progress | Implemented | Static home section only | Partial. |
| Campaign updates | Implemented | Missing | Backend ready, frontend missing. |
| Comments/moderation | Implemented | Missing | Backend ready, frontend missing. |
| Comments toggle | Implemented | Missing UI | Backend ready, frontend missing. |
| Public campaign pages | Implemented API | Coming soon | Frontend missing. |

### 5.4 Animal Management

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| Animal CRUD | Implemented | LocalStorage only | Backend ready, frontend not integrated. |
| Up to 5 images | Implemented | Local preview only | Backend ready, frontend not integrated. |
| Medical history | Implemented | Missing/limited UI | Partial. |
| Export animals | Implemented XLSX | Local CSV | Mismatch. |

### 5.5 Expense Ledger Management

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| Expense CRUD | Implemented | LocalStorage only | Backend ready, frontend not integrated. |
| Filters | Implemented | Local-only simplified | Partial. |
| Optional attachment | Backend partial | Local base64 only | Incomplete. |
| Export expenses | Implemented XLSX | Local CSV | Mismatch. |

### 5.6 Admin Email Alerts

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| Alert email setting | Implemented | UI only | Backend ready, frontend not integrated. |
| Toggle | Implemented | UI only | Backend ready, frontend not integrated. |
| Threshold | Implemented | UI only | Backend ready, frontend not integrated. |
| Send-all/threshold-only | Implemented | Missing UI | Partial. |

### 5.7 Authentication and Session Rules

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| Username/password login | Implemented | Calls endpoint incorrectly | Broken compatibility. |
| Single active session | Implemented | Not aware | Backend ready. |
| Secure session | Implemented cookie | Frontend expects token | Broken compatibility. |

### 13 Receipt Specification

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| Receipt number | Implemented | Not displayed | Partial. |
| Donation details | Implemented in PDF | Not displayed | Partial. |
| 80G placeholder | Implemented | Settings not wired | Partial. |
| PDF generation | Implemented | Not linked from UI | Partial. |
| Email attachment | Implemented | N/A | Backend only. |

### 14 Reporting and Analytics

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| Dashboard KPIs | Partial | Static | Incomplete. |
| Donation exports | Implemented | Local CSV | Mismatch. |
| Animal exports | Implemented | Local CSV | Mismatch. |
| Expense exports | Implemented | Local CSV | Mismatch. |
| Charts | Backend aggregate partial | Frontend static/mock | Incomplete. |

### 15 Email Workflows

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| Donor thank-you email | Implemented | N/A | Backend ready. |
| Receipt email | Implemented | N/A | Backend ready. |
| Admin email alert | Implemented | Settings UI not wired | Partial. |

### SEO and Accessibility

| Requirement | Backend | Frontend | Status |
| --- | --- | --- | --- |
| Meta tags | N/A | Partial via Helmet | Partial. |
| Sitemap | N/A | Not found | Missing. |
| Robots.txt | N/A | Not found | Missing. |
| Structured data | N/A | Not found | Missing. |
| Image alt text | N/A | Partial | Partial. |
| Bilingual switch | Config exists | Missing global switch | Incomplete. |

## Verification Results

### Performed

- Static audit of PRD, backend routes, backend services, backend validators, Prisma schema, and frontend source.
- Checked frontend API usage.
- Checked frontend build command.
- Checked backend health endpoint availability.

### Results

1. Frontend build could not run:

```text
npm run build
> tsc -b && vite build
'tsc' is not recognized as an internal or external command
```

Cause:

- `frontend/node_modules` is not installed.
- `frontend/package.json` lists TypeScript, but local dependency binaries are missing.

2. Backend health check was not reachable during this audit:

```text
http://localhost:4000/health
Unable to connect to the remote server
```

Cause:

- Backend server was not running at the time of this audit.
- This does not mean backend code is broken; it means runtime verification was not available.

3. Backend has no test script.

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate:dev": "prisma migrate dev",
  "prisma:studio": "prisma studio"
}
```

4. Frontend has no real API integration layer.

- Only admin login uses Axios.
- Other pages use static data, alerts, or `localStorage`.

## Prioritized Action Plan

### Priority 0: Make Frontend Buildable

1. Run `npm install` inside `frontend/`.
2. Run `npm run build`.
3. Fix any TypeScript/Vite errors.
4. Add CI-style build verification before deployment.

### Priority 1: Fix Admin Auth Compatibility

1. Change frontend login success handling to accept backend response.
2. Configure Axios with `withCredentials: true`.
3. Remove token expectation from frontend.
4. Replace `localStorage` auth source with `/api/v1/auth/me`.
5. Make logout call `/api/v1/auth/logout`.
6. Keep only admin identity in frontend state.

### Priority 2: Wire Donation + Razorpay Checkout

1. Add shared API client.
2. Transform donation form payload to backend shape.
3. Fetch active campaigns for campaign donations.
4. Add campaign selector.
5. Call `/api/v1/donations/create-order`.
6. Load Razorpay Checkout script.
7. Open Razorpay Checkout.
8. Call `/api/v1/donations/verify` on checkout success.
9. Add thank-you/status page.
10. Poll `/api/v1/donations/:id/public-status`.
11. Show receipt download when available.

### Priority 3: Wire Admin Data Pages

1. Dashboard -> `/api/v1/admin/dashboard`.
2. Donations -> `/api/v1/admin/donations`.
3. Donation export -> `/api/v1/admin/donations/export`.
4. Animals -> `/api/v1/admin/animals`.
5. Animal create/update/image upload -> backend animal endpoints.
6. Expenses -> `/api/v1/admin/expenses`.
7. Expense export -> `/api/v1/admin/expenses/export`.
8. Settings -> `/api/v1/admin/config/notifications` and `/api/v1/admin/config/system`.

### Priority 4: Implement Campaign Frontend

1. Public campaign listing.
2. Campaign detail by slug.
3. Campaign progress display.
4. Campaign comments and comment submission.
5. Admin campaign list/create/edit/status.
6. Campaign image upload.
7. Campaign updates.
8. Comment moderation.

### Priority 5: Backend Hardening

1. Add donation consent storage if legally required.
2. Add real expense/medical attachment upload routes.
3. Restrict public campaign detail to active campaigns.
4. Restrict public animal detail to active animals.
5. Fail startup in production when secrets are missing/default.
6. Add dashboard missing KPIs.
7. Add explicit export period parsing.
8. Add structured logging for auth/payment/email/webhook flows.
9. Add backup scripts/docs.
10. Add automated tests for auth, donation, webhook, receipt, exports, and CRUD.

### Priority 6: SEO, Language, and Content Polish

1. Add `robots.txt`.
2. Add sitemap generation.
3. Add JSON-LD structured data.
4. Add global EN/HI language switch.
5. Fetch bilingual campaign content from backend.
6. Replace static impact numbers with backend or CMS data.
7. Ensure every public route has accurate meta title/description.

## Deployment Readiness Checklist

Before production launch:

- [ ] Frontend dependencies installed and build passes.
- [ ] Backend starts successfully with production `.env`.
- [ ] Database migrations applied.
- [ ] Prisma client generated.
- [ ] Razorpay live keys configured.
- [ ] Razorpay webhook URL configured with public HTTPS URL.
- [ ] Razorpay webhook secret matches backend `.env`.
- [ ] SMTP verified with real sender.
- [ ] Admin default password changed.
- [ ] `JWT_SECRET` strong and non-default.
- [ ] `CORS_ORIGINS` set to production frontend domain.
- [ ] Donation flow tested end-to-end in Razorpay test mode.
- [ ] Webhook payment capture tested.
- [ ] Receipt download tested.
- [ ] Donor email receipt tested.
- [ ] Admin donation alert tested.
- [ ] Frontend admin auth fixed and tested.
- [ ] Frontend admin CRUD pages connected to backend.
- [ ] Campaign public/admin pages implemented.
- [ ] Backup process configured.
- [ ] Logs are monitored.
- [ ] `robots.txt`, sitemap, and structured data added.

## Final Assessment

The backend is close to Phase 1 backend completeness. It needs hardening, a few missing operational features, and runtime verification, but the core architecture and API surface are solid.

The frontend is not yet compatible with the backend as a production application. It is mostly a UI prototype with local state. The biggest blockers are admin authentication mismatch, donation/Razorpay not being wired, campaign pages missing, and admin data pages bypassing backend APIs.

The project should not be considered fully complete until the frontend is integrated with backend APIs and the full Razorpay checkout plus webhook payment lifecycle is verified end-to-end.
