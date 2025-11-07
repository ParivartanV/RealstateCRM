# Ghosh Properties Real Estate CRM MVP

## Overview
This project is a comprehensive Real Estate CRM system for Ghosh Properties, designed to manage post-sales operations. It tracks projects, properties, clients, automates AI-powered document generation, monitors construction milestones, and manages payment schedules. The system aims to streamline real estate business operations, enhance client communication, and provide robust management tools for various user roles.

## User Preferences
- Professional, clean interface suitable for real estate business operations
- Focus on data density and information hierarchy
- Clear visual distinction between different property statuses (available, booked, sold)
- Role-based UI that shows relevant features based on user permissions

## System Architecture

### Tech Stack
-   **Frontend:** React + TypeScript, Vite, TailwindCSS, shadcn/ui components
-   **Backend:** Express.js + TypeScript
-   **Database:** PostgreSQL (Neon) via Drizzle ORM
-   **Authentication:** Replit Auth (OpenID Connect)
-   **AI Integration:** OpenAI API for document generation
-   **State Management:** TanStack Query v5

### Project Structure
The project is organized into `client/`, `server/`, and `shared/` directories. `client/` handles the frontend, `server/` contains backend logic including API routes, storage, authorization, and AI document generation, while `shared/` holds common TypeScript types and Drizzle schemas.

### Database Schema
The database includes tables for `users`, `projects`, `buildings`, `floors`, `properties`, `clients`, `documents`, `payments`, `milestones`, and `activity_logs`. This schema supports detailed tracking of real estate assets, client information, financial transactions, and project progress.

### User Roles & Permissions
The system implements a robust Role-Based Access Control (RBAC) with four distinct roles:
1.  **Partner/Owner:** Full access to all features, including creation, editing, and deletion across all modules.
2.  **Sales & Marketing:** Manages projects, properties, and clients; generates documents; views payments and milestones.
3.  **Finance & Accounting:** Records and tracks payments; generates payment demand documents; views projects, properties, and clients.
4.  **Client:** Read-only access to their own properties, documents, and payment schedules, and construction milestones.

Permissions are enforced via backend middleware and reflected in the frontend UI.

### AI Document Generation
The system leverages OpenAI GPT-4 to generate professional real estate documents such as Booking Forms, Allotment Letters, Sales Agreements, and Payment Demands, customized with property, client, and transaction data, adhering to Indian legal formatting.

### UI/UX Decisions
-   **Color Scheme:** Material Design 3 inspired, with a focus on professional real estate aesthetics.
-   **Typography:** Inter for UI elements and Roboto Mono for code/data display.
-   **Components:** Utilizes shadcn/ui library built on Radix UI primitives for consistent and accessible components.
-   **Responsiveness:** Mobile-first design approach implemented with Tailwind CSS.
-   **Theming:** Full dark mode support with a theme toggle.

## External Dependencies
-   **PostgreSQL (Neon):** Primary database for data storage.
-   **OpenAI API:** Used for AI-powered document generation.
-   **Replit Auth:** For user authentication and identity management (OpenID Connect).

## Role-Based Access Control (RBAC) Implementation

### Overview
As of October 29, 2025, the system has a comprehensive RBAC implementation meeting functional requirements FR-1.2.2 (Role Permission Matrix), FR-1.2.4 (UI Permission Controls), and FR-1.2.5 (Backend Authorization Middleware).

### RBAC Components

#### 1. Backend Authorization Middleware (`server/authorization.ts`)
All mutation endpoints (POST/PATCH/DELETE) are protected by role-based middleware functions:

**Authorization Functions:**
- `requireRole(...allowedRoles)`: Core middleware that validates user role against allowed roles
- `canManageProjects()`: Allows partner_owner, sales_marketing
- `canManageProperties()`: Allows partner_owner, sales_marketing
- `canManageClients()`: Allows partner_owner, sales_marketing
- `canManageDocuments()`: Allows partner_owner, sales_marketing, finance_accounting
- `canManagePayments()`: Allows partner_owner, finance_accounting
- `canManageMilestones()`: Allows partner_owner, sales_marketing
- `isPartnerOwner()`: Allows partner_owner only (used for user management)

**Endpoint Protection (all mutation routes secured):**
- Projects: POST, PATCH, DELETE → canManageProjects()
- Buildings: POST → canManageProjects()
- Floors: POST → canManageProjects()
- Properties: POST, PATCH, DELETE → canManageProperties()
- Clients: POST, PATCH, DELETE → canManageClients()
- Documents: POST, PATCH, DELETE, /generate → canManageDocuments()
- Payments: POST, PATCH → canManagePayments()
- Milestones: POST, PATCH → canManageMilestones()
- Users: POST, PATCH → isPartnerOwner()

All middleware validates:
1. User is authenticated (isAuthenticated)
2. User exists in database
3. User role matches one of the allowed roles
4. Returns 403 Forbidden if unauthorized

#### 2. Frontend Permission Hook (`client/src/hooks/usePermissions.ts`)
Centralized permission logic providing boolean checks for UI controls based on user role:

**Provides permissions for:**
- Projects: canCreateProject, canEditProject, canDeleteProject
- Properties: canCreateProperty, canEditProperty, canDeleteProperty
- Clients: canCreateClient, canEditClient, canDeleteClient
- Documents: canGenerateDocument, canEditDocument, canDeleteDocument
- Payments: canCreatePayment, canEditPayment, canDeletePayment
- Milestones: canCreateMilestone, canEditMilestone, canDeleteMilestone
- Users: canManageUsers, canCreateUser, canEditUser, canDeactivateUser
- Activity Logs: canViewActivityLogs

Hook returns boolean flags based on current user's role, matching the backend permission matrix exactly.

#### 3. UI Permission Controls (FR-1.2.4)

**Implemented (MVP Scope):**
All create/add buttons are conditionally rendered based on user permissions:
- Projects page: "New Project" button (visible only to Partners, Sales)
- Properties page: "Add Property" button (visible only to Partners, Sales)
- Clients page: "Add Client" button (visible only to Partners, Sales)
- Documents page: "Generate Document" button (visible only to Partners, Sales, Finance)
- Milestones page: "Add Milestone" button (visible only to Partners, Sales)
- Payments page: "Record Payment" button (visible only to Partners, Finance)
- Users page: "Create User" button (visible only to Partners)

**Known Limitations (Deferred from MVP):**
- Edit/delete buttons within item cards/tables are still visible to all users (backend still enforces authorization)
- Child components (e.g., PaymentScheduleTable) don't receive permission props
- No disabled state for actions (buttons are hidden entirely vs. visually disabled)
- Backend protection ensures these limitations don't create security vulnerabilities

### FR-1.2.2 Role Permission Matrix

| Feature | Partner/Owner | Sales & Marketing | Finance & Accounting | Client |
|---------|--------------|------------------|---------------------|---------|
| **Projects** | Create, Edit, Delete | Create, Edit | View Only | View Only |
| **Properties** | Create, Edit, Delete | Create, Edit | View Only | View Only |
| **Clients** | Create, Edit, Delete | Create, Edit | View Only | View Only |
| **Documents** | Generate, Edit, Delete | Generate, Edit | Generate, Edit | View Only |
| **Payments** | Create, Edit, Delete | View Only | Create, Edit | View Only |
| **Milestones** | Create, Edit, Delete | Create, Edit | View Only | View Only |
| **Users** | Create, Edit, Deactivate | View Only | View Only | No Access |
| **Activity Logs** | View All | View All | View All | No Access |

### User Management (FR-1.3)

**Features Implemented:**
- Create users with role assignment (partner_owner only)
- Edit user details with immutable field protection (id, oidcUserId, createdAt cannot be modified)
- Email uniqueness validation with 409 Conflict responses
- Activate/deactivate users (partner_owner only)
- Role-based access to user management page

**Validation Schemas:**
- `insertUserSchema`: Used for creating new users (from shared/schema.ts)
- `updateUserSchema`: Separate schema preventing immutable field overwrites
- Email uniqueness enforced at database layer (unique constraint) and application layer (409 responses)

**Implementation Details:**
- POST /api/users validates email uniqueness before insertion
- PATCH /api/users/:id uses updateUserSchema to prevent overwriting immutable fields
- All user management endpoints require isPartnerOwner() middleware
- Frontend Users page only accessible to partner_owner role

### Security Notes

**Implemented Security Measures:**
- ✅ Backend endpoints fully protected - unauthorized users receive 403 Forbidden
- ✅ Frontend/backend permission matrices aligned and verified by architect
- ✅ All mutation operations require authentication (isAuthenticated middleware)
- ✅ React hooks rules followed (no conditional hook calls that could cause crashes)
- ✅ Email uniqueness enforced to prevent duplicate accounts
- ✅ Immutable field protection in user updates

**Known Risks & Mitigations:**
- ⚠️ UI edit/delete buttons still visible to unauthorized users
  - **Mitigation:** Backend enforces authorization; unauthorized requests return 403
  - **Future Work:** Hide edit/delete buttons based on permissions for better UX
- ⚠️ No disabled states for unauthorized actions
  - **Mitigation:** Buttons are hidden entirely instead
  - **Future Work:** Consider showing disabled states for better discoverability

### Verification & Testing Status

**Architect Reviews Completed:**
1. ✅ User Management (FR-1.3) - Approved with updateUserSchema design
2. ✅ UI Permission Controls (FR-1.2.4) - Approved with documented MVP scope limitations
3. ✅ Backend Authorization (FR-1.2.5) - Approved after fixing canManageClients() permission matrix violation

**Permission Matrix Corrections:**
- Fixed: canManageClients() incorrectly granted finance_accounting mutation access
- Correction: Removed finance_accounting from canManageClients() to align with FR-1.2.2
- Frontend usePermissions hook was already correct

**Production Readiness:**
- ✅ All mutation endpoints have proper authorization middleware
- ✅ Frontend permission checks prevent unauthorized UI access to create actions
- ✅ Backend protection ensures security even if UI controls are bypassed
- ✅ No security vulnerabilities identified by architect reviews
- ✅ System is production-ready for MVP deployment with documented limitations

### Future Enhancements (Optional)
1. Extend UI permission controls to hide edit/delete buttons in cards/tables
2. Add disabled states for unauthorized actions instead of hiding entirely
3. Thread permission props into child components (tables, cards, dialogs)
4. Add automated tests (Playwright) to validate RBAC enforcement end-to-end
5. Implement audit logging for all permission checks and authorization failures