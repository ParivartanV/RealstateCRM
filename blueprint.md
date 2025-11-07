# Ghosh Housing CRM MVP - Development Blueprint

**Last Updated**: November 5, 2025  
**Status**: In Development - 65% Complete (Cleanup Phase Required)

---

## 🎯 Project Overview

Full-stack Real Estate CRM for Ghosh Housing with RBAC, AI document generation, payment tracking, and construction milestone management.

**Tech Stack**: React + TypeScript, Express, PostgreSQL (Neon), Drizzle ORM, shadcn/ui, OpenAI API

**Current State**: Migrated from Replit - requires cleanup and standard auth implementation

---

## 📊 Module Completion Status

| Module | Status | Priority | Location |
|--------|--------|----------|----------|
| **Auth System Migration** | ⚠️ 0% | **CRITICAL** | Replace Replit Auth with JWT (cookie-based) |
| **Client Verification** | ❌ 0% | **CRITICAL** | SMS/Email OTP verification |
| User Management (RBAC) | ✅ 95% | High | `server/authorization.ts`, `hooks/usePermissions.ts`, `pages/Users.tsx` |
| Projects | ✅ 90% | Complete | `pages/Projects.tsx` |
| Properties | ✅ 85% | Complete | `pages/Properties.tsx` |
| Milestones | ✅ 85% | High | `pages/Milestones.tsx` |
| Documents (AI Gen) | ✅ 80% | High | `server/documentGenerator.ts`, `pages/Documents.tsx` |
| **Booking Form** | ⚠️ 80% | **HIGH** | `pages/BookingForm.tsx` |
| **Payments** | ⚠️ 60% | **CRITICAL** | Backend only - UI missing |
| Dashboard | ⚠️ 40% | Medium | `pages/Dashboard.tsx` - missing analytics |
| Notifications | ❌ 0% | Low | Deferred |
| Search/Filters | ⚠️ 30% | Low | Basic only |
| Analytics | ⚠️ 20% | Medium | Charts missing |

**Note**: Client Portal deprioritized - internal users will manage all client data

---

## 🚨 Critical Gaps

### 1. Replit Migration & Cleanup (0% Complete)
**What's Missing**:
- Replace Replit Auth (`server/replitAuth.ts`) with JWT (cookie-based; no Passport)
- Remove Replit-specific dependencies (openid-client, passport) and express-session usage
- Implement cookie-based JWT: httpOnly, Secure, SameSite=Lax + refresh token rotation
- Add CSRF protections (SameSite + Origin/Referer checks for state-changing routes)
- Database already migrated to Neon PostgreSQL ✅
- Update environment variables (remove REPL_ID, ISSUER_URL)
- Clean up Replit-specific configurations

**Current Dependencies to Remove**:
- `openid-client`: ^6.8.1
- `passport`: ^0.7.0
- `connect-pg-simple`: ^10.0.0 (session store)

**Files to Modify**:
- `server/replitAuth.ts` → Replace with `server/auth.ts`
- `server/routes.ts` → Update auth middleware imports
- `server/index.ts` → Remove express-session/Replit session setup
- `package.json` → Remove Replit dependencies

**Files to Create**:
- `server/auth.ts` (JWT-based authentication; issues access+refresh tokens via cookies)
- `server/middleware/authMiddleware.ts` (JWT verification middleware)

---

### 2. Client Verification System (0% Complete)
**What's Missing**:
- SMS OTP verification for phone numbers during client creation
- Email verification with OTP/magic link
- Verification status tracking in database
- Resend verification code functionality
- Rate limiting for verification attempts

**Database Schema Updates Needed**:
```ts
// Add to clients table:
phoneVerified: boolean (default: false)
emailVerified: boolean (default: false)
phoneVerificationCode: text (nullable)
emailVerificationCode: text (nullable)
verificationCodeExpiry: timestamp (nullable)
verificationAttempts: integer (default: 0)
```

**Integration Services (Chosen/Recommended)**:
- SMS: MSG91 (recommended for India)
- Email: Resend

**Files to Create**:
- `server/services/smsService.ts` (SMS OTP sending via MSG91)
- `server/services/emailService.ts` (Email verification via Resend)
- `server/routes/verification.ts` (Verification endpoints)
- `client/src/components/ClientVerificationForm.tsx` (UI component)

**Workflow**:
1. User creates client with phone/email
2. System sends separate 6-digit OTPs (10-min expiry) to phone and email
3. User enters OTP codes to verify
4. Client marked verified only after both checks pass
---

### 3. Payment Management UI (60% Complete)
**What's Missing**:
- Dedicated payments page UI
- Payment recording form with receipt upload
- Payment history view per property/client
- Outstanding balance calculations & display
- Payment reminders/notifications

**What Exists**:
- Database schema (payments, paymentSchedules tables)
- Backend routes in `server/routes.ts`
- Basic payment schedule generation

**Files to Create**:
- `client/src/pages/Payments.tsx` (new)

---

### 4. Booking Workflow Integration (80% Complete)
**What's Missing**:
- Property → Booking form navigation flow
- Actual file upload implementation (cloud storage)
- Email notifications on booking submission
- Booking confirmation document generation
- Auto-update property status to "booked"
- Initial payment schedule creation on booking

**What Exists**:
- Complete booking form UI (`pages/BookingForm.tsx`)
- Database schema (bookings, coApplicants, bookingDocuments)
- Aadhaar/PAN validation

**Files to Modify**:
- `client/src/pages/BookingForm.tsx`
- `client/src/pages/Properties.tsx`
- `server/routes.ts`

**Dependencies**:
- File storage service (S3/Cloudinary)
- Email service (SendGrid/Resend)

---

### 5. Analytics Dashboard (20% Complete)
**What's Missing**:
- Revenue analytics charts
- Payment collection reports
- Project-wise financial breakdown
- Sales pipeline metrics
- Occupancy rates
- Export functionality (CSV/PDF)

**What Exists**:
- Basic stat cards
- Recent activity feed
- Tab structure for analytics

**Files to Modify**:
- `client/src/pages/Dashboard.tsx`

**Dependencies**:
- Chart library (add Recharts or Chart.js)

---

---

## 📋 Development Roadmap

### **Phase 0: Replit Cleanup & Migration**
#### Critical: Remove Replit Dependencies & Implement Standard Auth
**Goal**: Remove all Replit-specific code and implement cookie-based JWT authentication (stateless backend)

**Tasks**:
- [ ] Create JWT auth: access (10–15 min) + refresh (12-24 h) tokens
- [ ] Issue tokens as httpOnly, Secure, SameSite=Lax cookies
- [ ] Build endpoints:
  - POST `/api/auth/login`
  - POST `/api/auth/refresh`
  - POST `/api/auth/logout`
  - POST `/api/auth/register` (internal-only, optional)
- [ ] Hash passwords with bcrypt (users.passwordHash)
- [ ] Add JWT middleware for protected routes
- [ ] Remove Replit auth files and express-session setup
- [ ] Add CSRF protections for cookie-based auth (Origin/Referer checks)
- [ ] Update env vars and dependencies
- [ ] Test authentication flow end-to-end

**Files to Delete**:
- `server/replitAuth.ts`

**Files to Create**:
```
server/auth.ts
server/middleware/authMiddleware.ts
client/src/pages/RegisterPage.tsx (if needed)
```

**Files to Modify**:
- `server/routes.ts` (swap to JWT auth middleware)
- `server/index.ts` (remove sessions)
- `package.json` (remove: openid-client, passport, connect-pg-simple)
- `.env` (remove: REPL_ID, ISSUER_URL; add: JWT vars)

**Dependencies to Add**:
```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

**Dependencies to Remove**:
```bash
npm uninstall openid-client passport connect-pg-simple
npm uninstall --save-dev @types/passport @types/connect-pg-simple
```

**Schema Updates Required**:
```ts
// users table:
passwordHash: text (nullable initially for legacy rows; required going forward)
```

---

### **Phase 1: Client Verification System** (Week 2)

#### Implement SMS & Email OTP Verification for Client Creation
**Goal**: Verify client phone numbers and emails during creation workflow

**Tasks**:
- [ ] Update database schema for verification fields
- [ ] Choose and integrate SMS provider (MSG91 recommended for India)
- [ ] Choose and integrate Email provider (Resend recommended)
- [ ] Create verification service modules
- [ ] Create verification API endpoints
- [ ] Build verification UI components
- [ ] Add verification step to client creation workflow
- [ ] Implement rate limiting for OTP requests
- [ ] Add resend OTP functionality

**Schema Updates**:
```sql
ALTER TABLE clients ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE clients ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE clients ADD COLUMN phone_verification_code TEXT;
ALTER TABLE clients ADD COLUMN email_verification_code TEXT;
ALTER TABLE clients ADD COLUMN verification_code_expiry TIMESTAMP;
ALTER TABLE clients ADD COLUMN verification_attempts INTEGER DEFAULT 0;
```

**Files to Create**:
```
server/services/smsService.ts
server/services/emailService.ts
server/routes/verification.ts
client/src/components/VerificationCodeInput.tsx
client/src/components/ClientVerificationModal.tsx
```

**Files to Modify**:
- `shared/schema.ts` (add verification fields to clients table)
- `server/routes.ts` (add verification routes)
- `client/src/pages/Clients.tsx` (integrate verification modal)

**Dependencies to Add**:
```bash
npm install msg91 resend
```

**Environment Variables to Add**:
```env
MSG91_AUTH_KEY=your_key_here
RESEND_API_KEY=your_key_here
```

**Verification Workflow**:
1. Internal user creates client with phone/email
2. System generates 6-digit OTP codes (separate for phone and email)
3. System sends OTP via SMS and Email
4. Verification modal appears with two input fields
5. User enters both OTP codes
6. System verifies codes (with 10-minute expiry)
7. Client record updated: `phoneVerified=true`, `emailVerified=true`
8. Client creation completes

---

### **Phase 2: Payment Management UI** (Week 3)

#### Build Complete Payment Management Interface
**Goal**: Create dedicated payments page with full CRUD operations

**Tasks**:
- [ ] Create main Payments page with tabs layout
- [ ] Build payment recording form with receipt upload placeholder
- [ ] Create payment history table with filters
- [ ] Implement outstanding balance calculations
- [ ] Add payment schedule visualization
- [ ] Integrate RBAC (Finance + Partner Owner only)
- [ ] Add payment status tracking (pending/completed/overdue)
- [ ] Create payment analytics cards

**Files to Create**:
```
client/src/pages/Payments.tsx
client/src/components/PaymentRecordForm.tsx
client/src/components/PaymentHistoryTable.tsx
client/src/components/OutstandingBalanceSummary.tsx
```

**API Endpoints to Use** (already exist):
- `POST /api/payments`
- `GET /api/payments` (all payments)
- `GET /api/payments/:propertyId`
- `GET /api/payment-schedules/:propertyId`
- `PATCH /api/payments/:id`

**No New Dependencies Needed**

---

### **Phase 3: Booking Workflow Completion** (Week 4)

#### Complete End-to-End Booking Flow
**Goal**: Connect property browsing to booking submission with all integrations

**Tasks**:
- [ ] Add "Book Property" button to property cards
- [ ] Integrate file upload with cloud storage (AWS S3/Cloudinary)
- [ ] Implement document upload for booking
- [ ] Generate booking confirmation document (AI)
- [ ] Send email notification on booking submission
- [ ] Auto-update property status to "booked"
- [ ] Create initial payment schedule on booking
- [ ] Add booking success page/modal

**Files to Create**:
```
server/services/fileStorage.ts
server/services/emailService.ts (if not done in Phase 1)
client/src/components/BookingSuccessModal.tsx
```

**Files to Modify**:
- `client/src/pages/Properties.tsx` (add "Book" button)
- `client/src/pages/BookingForm.tsx` (add file upload, email trigger)
- `server/routes.ts` (enhance booking endpoint)

**Dependencies to Add**:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
# OR
npm install cloudinary
```

**Environment Variables**:
```env
AWS_S3_BUCKET=your_bucket
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
```

---

### **Phase 4: Dashboard Analytics** (Week 5)
- [ ] Install Recharts/Chart.js
- [ ] Create revenue analytics chart component
- [ ] Add payment collection metrics
- [ ] Build project-wise financial reports
- [ ] Implement export to CSV/PDF
- [ ] Add date range filters for reports

---

### **Phase 5: UX Enhancements** (Week 6)

#### Advanced Search & Filtering
- [ ] Implement price range sliders
- [ ] Add multi-select for amenities/BHK
- [ ] Create saved filter presets
- [ ] Build global search component
- [ ] Add filter state persistence

#### Notification System
- [ ] Set up email service (SendGrid/Resend)
- [ ] Create email templates (booking, payment reminder, milestone update)
- [ ] Implement notification triggers in backend routes
- [ ] Build in-app notification center UI
- [ ] Add notification preferences page

---

### **Phase 6: Production Readiness** (Week 7)

#### Testing & QA
- [ ] Unit tests for business logic (payments, bookings)
- [ ] E2E tests for main workflows (Playwright/Cypress)
- [ ] Security audit (SQL injection, XSS, CSRF)
- [ ] RBAC scenario testing (all 4 roles)
- [ ] Database query optimization & indexing

#### Deployment
- [ ] User manuals for each role
- [ ] API endpoint documentation
- [ ] CI/CD pipeline setup
- [ ] Production environment variables
- [ ] Database backup strategy

---

## 🔧 Technical Debt & Improvements

### 1. File Storage (HIGH PRIORITY)
**Current**: Placeholder only  
**Needed**: AWS S3 or Cloudinary integration

```typescript
// Create: server/fileStorage.ts
export async function uploadFile(file: Buffer, filename: string): Promise<string>
export async function deleteFile(fileUrl: string): Promise<void>
```

**Usage**: Booking documents, payment receipts, generated PDFs

---

### 2. Email Service (HIGH PRIORITY)
**Current**: Not implemented  
**Needed**: SendGrid, AWS SES, or Resend integration

```typescript
// Create: server/emailService.ts
export async function sendBookingConfirmation(booking: Booking): Promise<void>
export async function sendPaymentReminder(payment: Payment): Promise<void>
export async function sendMilestoneUpdate(milestone: Milestone): Promise<void>
```

---

### 3. Performance Optimizations
- [ ] Add database indexes on: `propertyId`, `clientId`, `projectId`, `bookingId`
- [ ] Implement pagination for all list views (current: loading all records)
- [ ] Add loading skeletons for better perceived performance
- [ ] Optimize images (lazy loading, WebP format)
- [ ] Implement query result caching for dashboard stats

---

### 4. Error Handling
- [ ] Add global error boundary in React (`App.tsx`)
- [ ] Improve user-facing error messages (replace generic errors)
- [ ] Integrate error logging service (Sentry)
- [ ] Create fallback UI for network errors
- [ ] Add retry mechanism for failed API calls

---

## 🗂️ Database Schema Reference

### Core Tables (Implemented)
- `users` - RBAC with 4 roles (partner_owner, sales_marketing, finance_accounting, client)
- `projects` - Buildings with floors, amenities, status tracking
- `properties` - Units within projects (bhk, area, price, status)
- `clients` - Client info with Aadhaar/PAN
- `bookings` - Booking applications with co-applicants
- `payments` - Payment records with mode, status, receipt
- `paymentSchedules` - Milestone-based payment schedules
- `milestones` - Construction milestones with progress tracking
- `documents` - AI-generated documents (4 types)
- `activityLogs` - Comprehensive audit trail

### Missing Tables
- `notifications` - In-app notifications (to be added in Phase 3)
- `emailQueue` - Email sending queue (to be added in Phase 3)

---

## 🔐 Role-Based Access Control (RBAC)

### Roles & Permissions Matrix

| Feature | Partner/Owner | Sales & Marketing | Finance & Accounting | Client |
|---------|---------------|-------------------|----------------------|--------|
| User Management | ✅ Full | ❌ | ❌ | ❌ |
| Projects | ✅ Full | ✅ View | ✅ View | ❌ |
| Properties | ✅ Full | ✅ Full | ✅ View | 🔒 Own Only (View) |
| Clients | ✅ Full | ✅ Full | ✅ View | 🔒 Own Profile (Edit) |
| Bookings | ✅ Full | ✅ Full | ✅ View | 🔒 Own Only (View) |
| Payments | ✅ Full | ❌ | ✅ Full | 🔒 Own Only (View) |
| Documents | ✅ Full | ✅ Full | ✅ View | 🔒 Own Only (View) |
| Milestones | ✅ Full | ✅ View | ✅ View | 🔒 Project-specific (View) |

**Implementation**: 
- Backend: `server/authorization.ts` middleware
- Frontend: `hooks/usePermissions.ts` hook

---

## 🎨 UI Components Library

### Custom Components (Implemented)
- `ActivityLogItem` - Activity feed item with icons
- `AppSidebar` - Role-based navigation
- `ClientCard` - Client info card with actions
- `DocumentItem` - Document card with download
- `MilestoneProgress` - Progress bar with status
- `PaymentScheduleTable` - Payment schedule display
- `ProjectCard` - Project summary card
- `PropertyCard` - Property listing card
- `StatCard` - Dashboard metric card
- `ProtectedRoute` - Route guard with RBAC

### shadcn/ui Components (Available)
All 40+ components imported in `client/src/components/ui/`

---

## 📦 Dependencies to Add

### Phase 0 (Auth Migration)
```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2"
}
```

```json
// DevDependencies
{
  "@types/bcryptjs": "^2.4.6",
  "@types/jsonwebtoken": "^9.0.5"
}
```

### Phase 1 (Client Verification)
```json
{
  "msg91": "^1.0.0", // or "twilio": "^5.x"
  "resend": "^3.x" // or "@sendgrid/mail": "^8.x"
}
```

### Phase 3 (File Storage)
```json
{
  "@aws-sdk/client-s3": "^3.x",
  "@aws-sdk/s3-request-presigner": "^3.x"
  // OR "cloudinary": "^1.x"
}
```

### Phase 4 (Analytics)
```json
{
  "recharts": "^2.x", // Already installed ✅
  "date-fns": "^3.x" // Already installed ✅
}
```

### Phase 6 (Testing)
```json
{
  "@playwright/test": "^1.x",
  "vitest": "^1.x",
  "@sentry/react": "^7.x" // optional
}
```

### Dependencies to REMOVE (Phase 0)
```bash
npm uninstall openid-client passport connect-pg-simple
npm uninstall --save-dev @types/passport @types/connect-pg-simple @types/memoizee
```

---

## 🚀 Quick Start Commands

### Development
```bash
npm install
npm run dev          # Start both client & server
```

### Database
```bash
npm run db:push      # Push schema changes to DB
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed initial data
```

### Build
```bash
npm run build        # Production build
npm start            # Start production server
```

---

## 📝 Key Files Reference

### Core Configuration
- `shared/schema.ts` - Database schema (Drizzle)
- `server/routes.ts` - API routes
- `server/authorization.ts` - RBAC middleware
- `server/documentGenerator.ts` - OpenAI integration
- `client/src/App.tsx` - Route definitions

### Environment Variables Required
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
JWT_SECRET=your_secret_key_here

# To add in Phase 1:
MSG91_AUTH_KEY=...
RESEND_API_KEY=...

# To add in Phase 3:
AWS_S3_BUCKET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
```

---

## 🌐 Hosting & Auth Strategy (Internal-Only App)

**Auth Workflow (Chosen)**:
- App-issued JWT (access + refresh) via httpOnly, Secure, SameSite=Lax cookies
- Optional: Add TOTP 2FA for employees (Phase later)

**Database**:
- Neon PostgreSQL (keep Drizzle ORM)

**Hosting**:
- Frontend: Static hosting (Vercel/Netlify or Hostinger static)
- Backend API: Render/Railway/Fly.io, or Hostinger VPS (Docker with Nginx reverse proxy)
- Domain: Keep DNS at Hostinger; point `app.yourdomain.com` (frontend) and `api.yourdomain.com` (backend)

**Optional Zero-Trust Gate (Highly Recommended)**:
- Cloudflare Access in front of both frontend and API; SSO with Google/Microsoft without app changes

**Why**:
- Simple, low-ops, minimal lock-in, secure defaults suitable for internal use

---

## 🎯 Immediate Next Steps (Phase 0)

### Day 1-2: Remove Replit Auth Dependencies
1. ✅ Database already migrated to Neon PostgreSQL
2. Create new `server/auth.ts` with cookie-based JWT (access/refresh + rotation)
3. Create `server/middleware/authMiddleware.ts` for JWT verification
4. Add `passwordHash` field to users table in `shared/schema.ts`

### Day 3-4: Implement New Authentication
1. Build login/register endpoints with bcrypt password hashing
2. Implement JWT token generation and verification
3. Update `server/routes.ts` to use new auth middleware
4. Test authentication flow end-to-end

### Day 5: Cleanup & Testing
1. Remove `server/replitAuth.ts` file
2. Update `server/index.ts` to remove Replit session setup
3. Remove unused dependencies from `package.json`
4. Update `.env` file (remove REPL_ID, ISSUER_URL; add JWT_SECRET)
5. Test all existing features with new auth system

**Estimated Time to Full MVP**: 7 weeks

---

## 📞 Support & References

- **Design Guidelines**: `design_guidelines.md`
- **Component Examples**: `client/src/components/examples/`
- **Database Studio**: Run `npm run db:studio`
- **Replit Deployment**: See `replit.md`

---

*This blueprint is a living document. Update as features are implemented.*