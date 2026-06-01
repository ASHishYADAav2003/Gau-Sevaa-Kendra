# Product Requirements Document (PRD)

## Project
- **Product Name:** Ganpati Gauseva Donation Collection and Management Platform
- **Document Version:** v1.0
- **Date:** June 1, 2026
- **Target Launch Date:** June 11, 2026
- **Owner / Final Scope Approver:** Project Founder (You)
- **Delivery Mode:** Single Phase (No multi-phase split)

---

## 1. Product Vision

Build a trustworthy, simple, and legally-compliant web platform for Ganpati Gauseva to:
- Collect online donations (general and animal-campaign specific).
- Manage animals, campaigns, and expense ledger in one admin panel.
- Generate donor receipts (with 80G-ready placeholders) and donor communication.
- Give clear analytics and exports for operations and accountability.

The platform must feel traditional, warm, and mission-focused while being fast, secure, and scalable for donation traffic.

---

## 2. Goals and Success Criteria

## 2.1 Primary Goals
- Increase donation completion rate with a low-friction checkout flow.
- Maintain complete records of all donations and trust operations.
- Enable transparent campaign tracking and communication.
- Ensure operational control for a single admin user.
- Support bilingual public UI (English primary, Hindi switchable).
- Maintain strong SEO and accessibility from day one.

## 2.2 Success Metrics
- Donation success rate (payment success / payment attempts) >= 85%.
- Checkout abandonment rate <= 30% within first 60 days.
- Page load for critical public pages (LCP) <= 2.5s on 4G median.
- Admin dashboard load <= 2s for common reports.
- Uptime target: 99.9%.
- Data durability: Daily backup success rate 100%.

---

## 3. Scope

## 3.1 In Scope (Phase 1, single release)
- Public donation experience (no donor login).
- Donation types:
  - General Donation.
  - Campaign Donation (one campaign linked to one animal).
- Razorpay integration with Orders flow.
- Webhook-based payment confirmation.
- Donation record management for admin.
- Campaign creation/management with target and progress bar.
- Campaign updates and donor comments.
- Campaign comment moderation + comments on/off toggle.
- Animal registration/management (with up to 5 images).
- Optional per-animal medical history and linked expenses.
- Expense ledger management.
- Excel exports for donations and animals (with filters).
- Admin email notifications for each successful donation (toggle + threshold setting).
- Tax receipt flow:
  - Donor can choose receipt requirement.
  - Email required if receipt requested.
  - Thank-you page with receipt download option.
  - Email receipt delivery.
- Legal pages with placeholders:
  - Terms.
  - Privacy.
  - Refund Policy.
- Bilingual public site (EN + HI).
- SEO and accessibility implementation.
- Single admin login with single active session enforcement.

## 3.2 Out of Scope (for now)
- Recurring donations (monthly auto debit).
- Refund workflows.
- Multi-admin role hierarchy.
- SMS/WhatsApp notifications.
- Native mobile app.
- Stored donor portal/login area.
- Monthly P&L statement module (explicitly not needed now).

---

## 4. Users and Roles

## 4.1 Roles
- **Donor (public user):**
  - No authentication.
  - Can donate to general fund or active campaign.
  - Can choose anonymous display preference.
  - Can request tax receipt.
  - Can comment on campaigns (when enabled).
- **Admin (single manager account):**
  - Auth required (username + password).
  - Only one active login session at a time.
  - Full access to all management modules.

## 4.2 Role Permission Matrix
- Public:
  - View campaigns, animals, trust pages, donation forms.
  - Submit donation.
  - Post comments (if campaign allows).
- Admin:
  - Dashboard + analytics.
  - Donation records view/search/export.
  - Campaign CRUD + update posts + comment moderation.
  - Animal CRUD + medical history.
  - Expense ledger CRUD (with caution prompts for edits/deletes).
  - Configuration settings (notification email, donation threshold, site toggles, branding text placeholders).

---

## 5. Functional Requirements

## 5.1 Public Website and Donation Experience

### 5.1.1 Donation Form
- Fields:
  - Donation Type: `GENERAL` or `CAMPAIGN`.
  - Campaign selector (required if `CAMPAIGN`).
  - Amount (custom input + quick amount chips like 501, 1100, 2100, 5100).
  - Donor Name (required for records; anonymous display toggle allowed).
  - Phone Number (optional; visible to admin if provided).
  - Email (optional unless tax receipt requested).
  - Tax Receipt Required (Yes/No).
  - Anonymous Display (Yes/No).
  - Consent checkbox (terms/privacy acknowledgement).
- Validation:
  - Amount minimum: follow Razorpay gateway minimum for INR orders (>= INR 1.00 at API level; business may set higher UI minimum later).
  - Email mandatory if Tax Receipt = Yes.
  - Name mandatory for operational record quality.

### 5.1.2 Payment Flow
- Create backend order via Razorpay Orders API.
- Open Razorpay checkout with order details.
- On client callback, verify with backend.
- Final donation status marked successful **only** after webhook or verified signature flow.
- If payment fails, donor gets retry option.

### 5.1.3 Thank-You and Receipt
- Thank-you page with status:
  - Success: summary, receipt download CTA.
  - Failure: retry CTA.
- If email available:
  - Send thank-you email.
  - Send receipt email attachment/link.
- If email not available:
  - Show immediate downloadable receipt on thank-you page.

### 5.1.4 Public Campaign Pages
- Campaign listing with progress bars.
- Campaign detail page:
  - Images, short summary, full details, required amount, raised amount, percentage.
  - Campaign updates/timeline.
  - Comments section (if enabled).
- If campaign reaches goal:
  - Auto-close campaign.
  - New donations routed to general fund (with user notice).

## 5.2 Admin Donation Management
- View recent donations:
  - Name (or "Anonymous" for public display; true donor identity always available to admin).
  - Phone.
  - Amount.
  - Type (General/Campaign).
  - Campaign (if applicable).
  - Status (created/attempted/paid/failed).
- Filters:
  - Date range.
  - Donation type.
  - Campaign.
  - Amount range.
  - Payment status.
- Export:
  - Weekly/Monthly/Yearly Excel export.

## 5.3 Campaign Management
- Create/edit/archive campaign.
- Required fields:
  - Name.
  - Short summary.
  - Target amount.
  - Primary image.
- Optional fields:
  - Full story.
  - Multiple images.
  - Start date, end date.
  - Comment enable toggle.
- One campaign maps to one animal.
- Progress tracking real-time from successful donations.
- Admin can:
  - Post campaign updates.
  - Moderate comments (hide/delete/approve).
  - Turn comments on/off anytime.

## 5.4 Animal Management
- Animal profile fields:
  - Name.
  - Unique tag/ID.
  - Age.
  - Gender.
  - Breed.
  - Health status.
  - Rescue date.
  - Shed/location.
  - Notes.
  - Status tags: active, adopted, deceased, under treatment.
- Up to 5 images per animal.
- Optional medical history entries.
- Optional linkage of expenses to animal.
- Export animals with filters to Excel.

## 5.5 Expense Ledger Management
- Add expense with fields:
  - Date (mandatory).
  - Amount (mandatory).
  - Category (mandatory).
  - Vendor (optional).
  - Notes (optional).
  - Attachment/bill upload (optional).
  - Linked animal/campaign (optional).
- Edit/delete allowed for admin with warning confirmation.
- Listing with filters and exports.

## 5.6 Admin Email Alerts
- Admin config panel:
  - Donation alert email address (customizable).
  - Toggle: on/off.
  - Alert threshold amount (e.g., send only if >= amount).
  - Option: all successful donations or threshold-only.
- On successful donation:
  - Email contains amount, type, donor name, phone, campaign/general info, timestamp.

## 5.7 Authentication and Session Rules
- Single admin username/password.
- Single active session enforced:
  - New login invalidates old session.
- Session timeout and secure cookie config.
- Brute force protection (rate limit + temporary lock).

---

## 6. Compliance and Policy Requirements

## 6.1 Donation and Payment Compliance
- Razorpay order amount for INR should satisfy minimum gateway constraints (>= INR 1.00 in payment order validation context).
- No refund policy in this phase (strict no refunds; reflect in Refund Policy page).

## 6.2 80G Compliance (Current State + Placeholder)
- 80G registration details are pending and will be inserted later.
- System must support placeholders for:
  - 80G registration number.
  - Approval validity dates.
  - Legal declaration text.
- Recommended donor data for 80G readiness:
  - Donor full name.
  - Donor email or phone for receipt delivery.
  - Donation amount/date/mode and transaction references.
  - Donation amount/date/mode.
- Note for product design:
  - Cash donations > INR 2,000 are not eligible for 80G deduction under prevailing rules; online gateway mode is compliant for digital mode capture.

## 6.3 Why Data Privacy Matters (DPDP explanation)
- Even with one admin, donor personal data (name, phone, email if collected) is sensitive.
- A privacy-compliant system reduces legal risk, donor trust risk, and operational risk.
- Minimum actions needed:
  - Privacy policy disclosure.
  - Secure data storage.
  - Access control.
  - Backup/restore safety.
  - Breach response readiness.

---

## 7. Non-Functional Requirements (NFR)

## 7.1 Performance
- Expected load:
  - ~5000 donors/month.
  - Peak concurrent users: ~30.
- Targets:
  - Public page TTFB <= 600ms (cached content).
  - Donation API p95 <= 800ms excluding payment gateway latency.
  - Admin dashboard initial load <= 2s for monthly data.

## 7.2 Availability
- SLA target: 99.9% uptime.
- Health checks and process restarts required.

## 7.3 Scalability
- Current scale can run without Redis initially.
- Optional Redis benefits (future):
  - Faster session and rate-limit storage.
  - Caching campaign stats.
  - Queue support for emails/exports.

## 7.4 Security
- HTTPS only.
- Password hash with bcrypt/argon2.
- JWT or secure server session with HTTP-only cookies.
- CSRF protection for admin routes if cookie-auth used.
- Input validation and sanitization everywhere.
- SQL injection prevention via Prisma + validation.
- Webhook signature verification mandatory.
- Secrets via environment variables.

## 7.5 Backup and Recovery
- Daily PostgreSQL backup.
- Minimum 30-day retention.
- Weekly restore test.
- Backup encryption at rest.

## 7.6 SEO and Accessibility
- SEO critical requirements:
  - Semantic HTML.
  - Page-specific title/meta descriptions.
  - OpenGraph tags.
  - Structured data for organization/campaign pages.
  - XML sitemap and robots.txt.
  - Canonical URLs.
  - Fast Core Web Vitals.
- Accessibility:
  - WCAG AA baseline.
  - Keyboard navigation.
  - Alt text for images.
  - Proper labels and focus states.
  - Language switch support for EN/HI.

---

## 8. Technical Architecture

## 8.1 Stack
- **Backend:** Node.js + Express.
- **Database:** PostgreSQL (Hostinger VPS).
- **ORM:** Prisma.
- **Frontend:** React + Axios + Zustand + Tailwind CSS.
- **Payments:** Razorpay Checkout + Orders API + Webhooks.
- **Emails:** Hostinger SMTP.
- **Exports:** XLSX generation library on backend.

## 8.2 Deployment
- Hosting: Hostinger VPS.
- Environments: `development` and `production`.
- Recommendation:
  - Docker is optional, not mandatory for this load.
  - You can deploy without Docker using PM2 + Nginx reverse proxy.
  - Docker improves reproducibility and easier migrations but adds setup complexity.

## 8.3 Suggested Runtime Topology
- Nginx (SSL termination, reverse proxy).
- Node app process via PM2.
- PostgreSQL (managed/self-hosted on VPS per plan).
- Cron jobs for backup and cleanup tasks.

---

## 9. Data Model (Conceptual)

Core modules:
- AdminAuth
- Donor
- Donation
- Campaign
- CampaignUpdate
- CampaignComment
- Animal
- AnimalMedicalRecord
- ExpenseLedger
- Receipt
- NotificationConfig
- SystemConfig
- ExportJob (optional immediate sync export in v1)

Key relations:
- Donation -> Donor (many-to-one).
- Donation -> Campaign (optional many-to-one).
- Campaign -> Animal (one-to-one active link).
- Campaign -> CampaignUpdate (one-to-many).
- Campaign -> CampaignComment (one-to-many).
- Animal -> AnimalMedicalRecord (one-to-many).
- ExpenseLedger -> Animal/Campaign (optional foreign keys).
- Donation -> Receipt (one-to-one logical link, generated record).

---

## 10. Detailed Database Schema (Prisma Draft)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum DonationType {
  GENERAL
  CAMPAIGN
}

enum DonationStatus {
  CREATED
  ATTEMPTED
  PAID
  FAILED
}

enum CampaignStatus {
  DRAFT
  ACTIVE
  CLOSED
  ARCHIVED
}

enum AnimalStatus {
  ACTIVE
  ADOPTED
  DECEASED
  UNDER_TREATMENT
}

enum ExpenseCategory {
  FODDER
  MEDICINE
  STAFF
  TRANSPORT
  MAINTENANCE
  UTILITIES
  INFRASTRUCTURE
  OTHER
}

model AdminUser {
  id                String   @id @default(cuid())
  username          String   @unique
  passwordHash      String
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastLoginAt       DateTime?
  currentSessionId  String?  @unique
}

model AdminSession {
  id           String   @id @default(cuid())
  adminUserId  String
  tokenHash    String   @unique
  ipAddress    String?
  userAgent    String?
  isRevoked    Boolean  @default(false)
  createdAt    DateTime @default(now())
  expiresAt    DateTime
  revokedAt    DateTime?

  adminUser    AdminUser @relation(fields: [adminUserId], references: [id], onDelete: Cascade)

  @@index([adminUserId, isRevoked])
  @@index([expiresAt])
}

model Donor {
  id                String   @id @default(cuid())
  fullName          String
  phone             String?
  email             String?
  isAnonymousPublic Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  donations         Donation[]

  @@index([phone])
  @@index([email])
  @@index([createdAt])
}

model Campaign {
  id                 String         @id @default(cuid())
  animalId           String?        @unique
  slug               String         @unique
  titleEn            String
  titleHi            String?
  shortSummaryEn     String
  shortSummaryHi     String?
  fullStoryEn        String?
  fullStoryHi        String?
  targetAmountPaise  Int
  raisedAmountPaise  Int            @default(0)
  status             CampaignStatus @default(DRAFT)
  startDate          DateTime?
  endDate            DateTime?
  commentsEnabled    Boolean        @default(true)
  autoCloseOnGoal    Boolean        @default(true)
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  animal             Animal?            @relation(fields: [animalId], references: [id], onDelete: SetNull)
  images             CampaignImage[]
  updates            CampaignUpdate[]
  comments           CampaignComment[]
  donations          Donation[]
  expenses           ExpenseLedger[]

  @@index([status])
  @@index([startDate, endDate])
  @@index([createdAt])
}

model CampaignImage {
  id           String   @id @default(cuid())
  campaignId   String
  imageUrl     String
  sortOrder    Int      @default(0)
  createdAt    DateTime @default(now())

  campaign     Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)

  @@index([campaignId, sortOrder])
}

model CampaignUpdate {
  id              String   @id @default(cuid())
  campaignId      String
  titleEn         String
  titleHi         String?
  bodyEn          String
  bodyHi          String?
  imageUrl        String?
  publishedAt     DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  campaign        Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)

  @@index([campaignId, publishedAt])
}

model CampaignComment {
  id                String   @id @default(cuid())
  campaignId        String
  donorName         String
  donorPhone        String?
  donorEmail        String?
  commentText       String
  isApproved        Boolean  @default(true)
  isHidden          Boolean  @default(false)
  createdAt         DateTime @default(now())
  moderatedAt       DateTime?

  campaign          Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)

  @@index([campaignId, createdAt])
  @@index([campaignId, isApproved, isHidden])
}

model Animal {
  id                 String       @id @default(cuid())
  tagId              String       @unique
  name               String
  ageMonths          Int?
  gender             String?
  breed              String?
  healthStatus       String?
  rescueDate         DateTime?
  shedLocation       String?
  notes              String?
  status             AnimalStatus @default(ACTIVE)
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  images             AnimalImage[]
  medicalRecords     AnimalMedicalRecord[]
  expenses           ExpenseLedger[]
  campaign           Campaign?

  @@index([status])
  @@index([name])
  @@index([createdAt])
}

model AnimalImage {
  id           String   @id @default(cuid())
  animalId      String
  imageUrl      String
  sortOrder     Int      @default(0)
  createdAt     DateTime @default(now())

  animal        Animal   @relation(fields: [animalId], references: [id], onDelete: Cascade)

  @@index([animalId, sortOrder])
}

model AnimalMedicalRecord {
  id                 String   @id @default(cuid())
  animalId            String
  recordDate          DateTime
  diagnosis           String?
  treatment           String?
  vetName             String?
  notes               String?
  attachmentUrl       String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  animal              Animal   @relation(fields: [animalId], references: [id], onDelete: Cascade)

  @@index([animalId, recordDate])
}

model Donation {
  id                          String         @id @default(cuid())
  donorId                     String
  campaignId                  String?
  donationType                DonationType
  amountPaise                 Int
  currency                    String         @default("INR")
  status                      DonationStatus @default(CREATED)
  razorpayOrderId             String         @unique
  razorpayPaymentId           String?        @unique
  razorpaySignature           String?
  paymentMethod               String?
  paymentCapturedAt           DateTime?
  paymentFailedReason         String?
  taxReceiptRequested         Boolean        @default(false)
  receiptNumber               String?        @unique
  isAnonymousPublic           Boolean        @default(false)
  donorDisplayName            String?
  notes                       String?
  createdAt                   DateTime       @default(now())
  updatedAt                   DateTime       @updatedAt

  donor                       Donor          @relation(fields: [donorId], references: [id], onDelete: Restrict)
  campaign                    Campaign?      @relation(fields: [campaignId], references: [id], onDelete: SetNull)
  receipt                     Receipt?

  @@index([status, createdAt])
  @@index([campaignId, createdAt])
  @@index([donorId, createdAt])
  @@index([donationType, createdAt])
}

model Receipt {
  id                    String   @id @default(cuid())
  donationId             String   @unique
  receiptNumber          String   @unique
  issuedAt               DateTime @default(now())
  sentToEmail            String?
  pdfChecksum            String?
  legalTextSnapshot      String?
  generatedBySystem      Boolean  @default(true)

  donation               Donation @relation(fields: [donationId], references: [id], onDelete: Cascade)

  @@index([issuedAt])
}

model ExpenseLedger {
  id                    String          @id @default(cuid())
  expenseDate            DateTime
  amountPaise            Int
  category               ExpenseCategory
  vendorName             String?
  notes                  String?
  attachmentUrl          String?
  animalId               String?
  campaignId             String?
  createdAt              DateTime        @default(now())
  updatedAt              DateTime        @updatedAt

  animal                 Animal?         @relation(fields: [animalId], references: [id], onDelete: SetNull)
  campaign               Campaign?       @relation(fields: [campaignId], references: [id], onDelete: SetNull)

  @@index([expenseDate])
  @@index([category, expenseDate])
  @@index([animalId])
  @@index([campaignId])
}

model NotificationConfig {
  id                          String   @id @default(cuid())
  donationEmailEnabled        Boolean  @default(true)
  notificationEmail           String?
  thresholdEnabled            Boolean  @default(false)
  thresholdAmountPaise        Int?     // if enabled, notify only at or above threshold
  sendAllSuccessfulDonations  Boolean  @default(true)
  updatedAt                   DateTime @updatedAt
}

model SystemConfig {
  id                        String   @id @default(cuid())
  orgName                   String   @default("Ganpati Gauseva")
  defaultLanguage           String   @default("en")
  supportedLanguages        String   @default("en,hi")
  commentsDefaultEnabled    Boolean  @default(true)
  receiptPrefix             String   @default("GSS")
  receiptSequenceNumber     Int      @default(0)
  legal80GText              String?  // placeholder until provided
  legal80GNumber            String?  // placeholder until provided
  legal80GValidity          String?  // placeholder until provided
  termsPageContent          String?
  privacyPageContent        String?
  refundPolicyContent       String?
  updatedAt                 DateTime @updatedAt
}

model PaymentWebhookEvent {
  id                 String   @id @default(cuid())
  razorpayEventId    String?  @unique
  eventType          String
  payloadJson        Json
  signatureHeader    String?
  isVerified         Boolean  @default(false)
  processed          Boolean  @default(false)
  processedAt        DateTime?
  createdAt          DateTime @default(now())

  @@index([eventType, createdAt])
  @@index([processed, createdAt])
}
```

## 10.1 Data Rules
- Store monetary values in paise (`Int`) to avoid floating-point errors.
- Use `receiptNumber` unique constraint.
- Do not store full receipt PDF permanently (as per current requirement); store metadata and regenerate/download at time of request.
- Enforce max 5 animal images via service-layer validation.

## 10.2 Important Indexing
- Donation queries by date, status, type, campaign.
- Campaign status and date range.
- Expense by date/category.
- Animal by status/tag/name.

---

## 11. API Contract (Detailed)

Base URL example: `/api/v1`

## 11.1 Auth APIs (Admin)

### POST `/auth/login`
- **Purpose:** Authenticate admin.
- **Request:**
```json
{
  "username": "admin_username",
  "password": "********"
}
```
- **Response (200):**
```json
{
  "message": "Login successful",
  "admin": {
    "id": "adm_123",
    "username": "admin_username"
  }
}
```
- **Notes:**
  - Creates new active session.
  - Revokes previous active session automatically.

### POST `/auth/logout`
- Revokes current session.

### GET `/auth/me`
- Returns current admin identity/session validity.

## 11.2 Public Donation APIs

### POST `/donations/create-order`
- **Purpose:** Create local donation record + Razorpay order.
- **Request:**
```json
{
  "donationType": "CAMPAIGN",
  "campaignId": "cmp_123",
  "amount": 1100,
  "currency": "INR",
  "donor": {
    "fullName": "Ravi Sharma",
    "phone": "9876543210",
    "email": "ravi@example.com",
    "isAnonymousPublic": false
  },
  "taxReceiptRequested": true
}
```
- **Validation:**
  - `amount >= 1`.
  - `campaignId` required if `donationType=CAMPAIGN`.
  - If `taxReceiptRequested=true`, email is mandatory.
- **Response (201):**
```json
{
  "donationId": "don_123",
  "razorpayOrderId": "order_xxx",
  "amountPaise": 110000,
  "currency": "INR",
  "keyId": "rzp_live_xxx"
}
```

### POST `/donations/verify`
- **Purpose:** Verify Razorpay signature (frontend callback).
- **Request:**
```json
{
  "donationId": "don_123",
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```
- **Response (200):**
```json
{
  "verified": true,
  "status": "ATTEMPTED",
  "message": "Verification accepted; final confirmation pending webhook"
}
```

### POST `/webhooks/razorpay`
- **Purpose:** Receive payment webhook events.
- **Security:** Verify `X-Razorpay-Signature` with webhook secret.
- **Behavior:**
  - Persist raw event.
  - Idempotent processing.
  - Mark donation `PAID` on success event.
  - Generate receipt number.
  - Trigger donor email + admin email rules.
- **Response:** `200 OK`.

### GET `/donations/:id/public-status`
- Returns donation status for thank-you page polling.

### GET `/receipts/:receiptNumber/download`
- Public download endpoint secured by signed token or short-lived receipt key.
- Returns PDF stream.

## 11.3 Public Campaign APIs

### GET `/campaigns`
- List active campaigns with pagination/filter.

### GET `/campaigns/:slug`
- Campaign details + updates + comment settings.

### GET `/campaigns/:id/comments`
- List approved, visible comments.

### POST `/campaigns/:id/comments`
- Add comment if comments enabled.
- Request:
```json
{
  "donorName": "Anita",
  "donorPhone": "9876500000",
  "donorEmail": "anita@example.com",
  "commentText": "Wishing speedy recovery."
}
```

## 11.4 Admin Donation APIs

### GET `/admin/donations`
- Filters:
  - `from`, `to`
  - `type`
  - `status`
  - `campaignId`
  - `minAmount`, `maxAmount`
  - `search` (name/phone/order/payment)
- Returns paginated list + summary totals.

### GET `/admin/donations/:id`
- Full donation detail with donor info and receipt metadata.

### GET `/admin/donations/export`
- Query:
  - `period=week|month|year|custom`
  - `format=xlsx`
- Returns Excel file.

## 11.5 Admin Campaign APIs

### POST `/admin/campaigns`
- Create campaign.

### PUT `/admin/campaigns/:id`
- Update campaign details.

### PATCH `/admin/campaigns/:id/status`
- Activate/close/archive campaign.

### POST `/admin/campaigns/:id/images`
- Upload images.

### POST `/admin/campaigns/:id/updates`
- Add campaign progress update.

### GET `/admin/campaigns/:id/comments`
- Fetch all comments including hidden/unapproved.

### PATCH `/admin/campaigns/:id/comments/:commentId`
- Moderate comment:
```json
{
  "isApproved": true,
  "isHidden": false
}
```

## 11.6 Admin Animal APIs

### POST `/admin/animals`
- Create animal profile.

### GET `/admin/animals`
- Filter by status, breed, health status, rescue date.

### PUT `/admin/animals/:id`
- Update animal profile.

### POST `/admin/animals/:id/images`
- Upload image (enforce max 5).

### POST `/admin/animals/:id/medical-records`
- Add medical record.

### GET `/admin/animals/export`
- Export filtered animals to Excel.

## 11.7 Admin Expense APIs

### POST `/admin/expenses`
- Create expense.
- Required: date, amount, category.

### GET `/admin/expenses`
- Filter by date, category, animal, campaign.

### PUT `/admin/expenses/:id`
- Update expense.

### DELETE `/admin/expenses/:id`
- Delete with warning confirmation in UI.

### GET `/admin/expenses/export`
- Excel export.

## 11.8 Admin Config APIs

### GET `/admin/config/notifications`
- Read admin donation notification settings.

### PUT `/admin/config/notifications`
- Update:
```json
{
  "donationEmailEnabled": true,
  "notificationEmail": "manager@gausevasadan.org",
  "thresholdEnabled": true,
  "thresholdAmount": 10000,
  "sendAllSuccessfulDonations": false
}
```

### GET `/admin/config/system`
- Read system config + placeholders.

### PUT `/admin/config/system`
- Update legal text placeholders, receipt prefix, default language, policy pages.

---

## 12. Business Rules

- One campaign can map to one animal.
- A donation can map to zero or one campaign.
- Successful donation updates campaign raised amount.
- If campaign target reached:
  - Campaign auto status to `CLOSED`.
  - Future donation attempts redirected to `GENERAL`.
- Anonymous toggle affects public display only; admin always sees actual donor.
- If receipt requested and no email provided => validation error.
- All receipts must have unique sequential receipt number format:
  - Example: `GSS/2026-27/000001`.
- No refund operations in product.
- Admin is single-user; one active session only.

---

## 13. Receipt Specification (80G-ready)

## 13.1 Receipt Fields
- Trust Name: Ganpati Gauseva.
- Receipt Number.
- Donation Date/Time.
- Donor Name.
- Donor Contact Details.
- Donation Type (General/Campaign).
- Campaign Name (if applicable).
- Amount (INR).
- Payment Mode (Online / Razorpay).
- Transaction IDs (order/payment).
- 80G placeholder legal text.
- Authorized digital signature/stamp.

## 13.2 PDF Generation
- Generate server-side at successful payment event.
- Provide:
  - Immediate download URL.
  - Email attachment/link.
- Persist metadata in DB; no full PDF archival required currently.

---

## 14. Reporting and Analytics

## 14.1 Dashboard KPIs
- Total donations today/week/month/year.
- Total successful vs failed payments.
- Campaign-wise raised vs target.
- Top campaigns by donation volume.
- Donor count (new vs repeat).
- Average donation amount.
- High-value donations count.
- Expense category distribution.
- Animal status distribution.

## 14.2 Export Requirements
- Donations:
  - Week/month/year/custom exports to Excel.
- Animals:
  - Filtered exports to Excel.
- Expenses:
  - Filtered exports to Excel.

## 14.3 Suggested Charting
- Donations trend line (daily).
- Campaign progress bars.
- Expense category pie/bar.

---

## 15. Email Workflows

## 15.1 Donor Emails
- Trigger: successful donation.
- If email present:
  - Send thank-you email.
  - Send receipt link/attachment.
- If receipt requested but email missing:
  - Block checkout before payment.

## 15.2 Admin Emails
- Trigger: successful donation.
- Conditions based on settings:
  - Enabled + send-all mode.
  - Enabled + threshold mode.
- Email payload:
  - Amount.
  - Donation type.
  - Donor name.
  - Donor phone.
  - Campaign/general info.
  - Timestamp.

---

## 16. Razorpay Setup Guide (for your question #19 and #20)

## 16.1 Account Setup Steps
1. Create Razorpay account.
2. Complete KYC for trust/legal entity.
3. Activate payment gateway (live mode approval).
4. Set settlement bank account.
5. Enable desired payment methods (cards, UPI, netbanking, wallets).
6. Generate API Key ID + Key Secret (test and live separately).
7. Configure webhook endpoint URL (production domain).
8. Set webhook secret.
9. Enable key operational webhooks:
   - `payment.captured`
   - `payment.failed`
   - `order.paid` (optional but useful)
10. Run test mode end-to-end before live go-live.

## 16.2 Webhook Secret and Key Management (In Depth)
- **What is webhook secret?**
  - A private string used to verify that webhook calls are truly from Razorpay.
- **Where stored?**
  - Only in backend environment variables (`RAZORPAY_WEBHOOK_SECRET`), never in frontend.
- **Who manages it?**
  - Admin/developer deployment owner.
- **Key rotation policy:**
  - Rotate API keys every 90-180 days or immediately on suspected leak.
  - Rotate webhook secret with short overlap window.
- **Verification rule:**
  - Reject webhook if signature mismatch.
- **Idempotency rule:**
  - Save Razorpay event ID; ignore duplicate events.

## 16.3 Required Environment Variables
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `DATABASE_URL`
- `JWT_SECRET` (or session secret)

---

## 17. SEO Plan (High Priority)

## 17.1 Technical SEO
- Server-side or pre-render strategy for critical public pages (campaign list/detail, animal stories, about pages).
- Clean slug URLs:
  - `/campaigns/<slug>`
  - `/animals/<slug-or-id>`
- XML sitemap auto-generate.
- robots.txt configured.
- Canonical tags.
- Language alternates (`hreflang` for `en-IN` and `hi-IN`).

## 17.2 Content SEO
- Hindi + English content fields for campaigns.
- Descriptive titles and summaries.
- Mission and trust transparency sections.
- Structured content updates for campaigns.

## 17.3 Schema Markup
- Organization schema for Ganpati Gauseva.
- Article/Update schema for campaign updates.
- Breadcrumb schema for navigation.

---

## 18. UX / UI Requirements

- Visual direction: traditional, warm colors, trust-oriented.
- Public UX:
  - Clear CTA to donate.
  - Campaign progress transparency.
  - Simple payment form.
  - Prominent language toggle (EN/HI).
- Admin UX:
  - Left navigation for modules.
  - Fast filters and exports.
  - Warning modals for destructive edits/deletes.

---

## 19. Operational Logging and Monitoring

- App logs:
  - Auth attempts.
  - Donation flow events.
  - Webhook processing outcomes.
  - Email send outcomes.
- Alerts:
  - Failed webhook verification spikes.
  - Email failures.
  - Backup failures.
- Metrics:
  - Payment success funnel.
  - API error rates.
  - Slow endpoint alerts.

---

## 20. Backup and Disaster Recovery

- Daily automated PostgreSQL backups.
- Separate backup storage target (not same disk only).
- 30-day retention.
- Monthly drill:
  - Restore latest backup to staging and verify integrity.
- RPO target: 24h.
- RTO target: 4h.

---

## 21. Delivery Plan (Single Phase, 10-Day Window)

## 21.1 Recommended Execution Sequence
1. Core backend models and auth.
2. Donation flow + Razorpay order + webhook.
3. Receipt generation + email integration.
4. Campaign + animal + ledger modules.
5. Admin dashboard + reports + exports.
6. Bilingual + SEO + legal pages.
7. Hardening, QA, performance tests, deployment.

## 21.2 Go-Live Checklist
- Live Razorpay keys set.
- Webhook verified in production.
- SMTP tested.
- Backup cron active.
- SSL active.
- Legal placeholders reviewed.
- Admin credentials rotated from default.

---

## 22. Risks and Mitigations

- **Risk:** Payment marked success before final confirmation.
  - **Mitigation:** Webhook-first final status update.
- **Risk:** Donation email deliverability issues.
  - **Mitigation:** SMTP SPF/DKIM setup + retry queue.
- **Risk:** Single admin credential compromise.
  - **Mitigation:** strong password policy + IP monitoring + periodic rotation.
- **Risk:** Receipt legal text changes after launch.
  - **Mitigation:** dynamic placeholders editable in admin config.
- **Risk:** Manual edits/deletes in expense ledger can create mistakes.
  - **Mitigation:** warning modals + confirmation + soft delete option if desired.

---

## 23. Open Items (To be provided later)

- Final 80G registration number and legal language.
- Final receipt template/layout from CA/legal team.
- Final organization branding pack (exact color and typography tokens).
- Final legal page text content.

---

## 24. Recommended Defaults for Pending Decisions

- Donor contact data:
  - Store only donor name, mobile (if provided), and email (if provided).
  - If receipt requested, email remains mandatory for delivery.
- Minimum donation amount:
  - UI default minimum INR 51 for dignity/usability (business rule).
  - Backend hard minimum follows Razorpay constraints.

---

## 25. Acceptance Criteria (High-Level)

- Donor can complete general donation and campaign donation end-to-end with Razorpay.
- Admin sees all successful donations with donor details and donation type.
- Receipt is generated and downloadable on success; emailed when email exists.
- Campaign progress updates with donation inflow.
- Campaign auto-closes at target and redirects future donations to general fund.
- Admin can create/manage animals and link optional medical records.
- Admin can create/manage expenses with required fields and optional attachments.
- Admin can export donation and animal data to Excel with filters.
- Admin email alerts work with on/off and threshold configuration.
- Site supports English primary and Hindi switch.
- SEO baseline artifacts are live (meta, sitemap, robots, structured data).

---

## 26. Reference Notes (for implementation team)

- Razorpay Orders API and webhook docs should be treated as source of truth for payment states and amount validation.
- 80G certificate handling should align with current Income Tax filing flow (Form 10BD/10BE process) once trust registration data is finalized.
