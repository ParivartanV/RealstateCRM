# Real Estate CRM MVP - Comprehensive Design Guidelines

## Design Approach: Enterprise Design System

**Selected System:** Material Design 3 with enterprise customizations  
**Rationale:** This is a data-intensive, information-heavy CRM requiring clarity, efficiency, and professional presentation. Material Design 3 provides robust patterns for tables, forms, dashboards, and data visualization while maintaining modern aesthetics suitable for a real estate business context.

**Key Design Principles:**
1. **Information Hierarchy:** Clear visual distinction between primary actions, data displays, and supporting content
2. **Data Clarity:** Tables, cards, and forms designed for easy scanning and data entry
3. **Professional Polish:** Clean, trustworthy aesthetic appropriate for real estate transactions
4. **Efficient Workflows:** Minimize clicks, optimize for task completion speed

---

## Typography System

**Font Stack:** Google Fonts
- **Primary:** Inter (headings, UI elements, data) - weights 400, 500, 600, 700
- **Secondary:** Roboto Mono (data tables, numbers, IDs) - weights 400, 500

**Type Scale:**
- **Hero/Dashboard Title:** text-4xl (36px), font-bold, tracking-tight
- **Page Headers:** text-3xl (30px), font-semibold
- **Section Headers:** text-2xl (24px), font-semibold
- **Card/Module Titles:** text-xl (20px), font-semibold
- **Subsection Headers:** text-lg (18px), font-medium
- **Body/Forms:** text-base (16px), font-normal
- **Labels/Metadata:** text-sm (14px), font-medium
- **Captions/Hints:** text-xs (12px), font-normal
- **Table Data:** text-sm, font-mono for numbers/IDs

---

## Layout & Spacing System

**Tailwind Spacing Primitives:** Consistent use of 2, 4, 6, 8, 12, 16 units
- **Micro spacing (within components):** p-2, gap-2, space-x-2
- **Component padding:** p-4, p-6
- **Card/Section spacing:** p-6, p-8
- **Page-level margins:** p-8, p-12
- **Section separators:** my-8, my-12
- **Large gaps (dashboard grids):** gap-6, gap-8

**Layout Structure:**
- **Sidebar Navigation:** Fixed width 280px (w-70), full height, elevated with subtle shadow
- **Main Content Area:** flex-1 with max-w-7xl container, px-8 py-6
- **Dashboard Grid:** grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- **Data Tables:** Full width with horizontal scroll, sticky headers
- **Forms:** max-w-3xl centered for single-column, grid-cols-2 for multi-column with gap-6

---

## Component Library

### Navigation
**Sidebar (Desktop):**
- Vertical fixed sidebar with company branding at top
- Navigation items with icons (from Heroicons) and labels
- Active state: filled background, medium font weight
- Grouped sections: Projects, Clients, Documents, Payments, Administration
- User profile section at bottom with role badge
- Collapse/expand toggle for smaller screens

**Top Bar:**
- Fixed top bar with breadcrumb navigation
- Quick search input (w-96)
- Notification bell icon with badge
- User avatar dropdown for profile/logout

### Dashboard Components
**Stat Cards:**
- Elevated card (shadow-md, rounded-lg, p-6)
- Large metric number (text-4xl, font-bold)
- Descriptive label (text-sm, uppercase, tracking-wide)
- Trend indicator icon with percentage change
- Quick action link at bottom

**Data Tables:**
- Striped rows with hover states
- Sticky header row
- Sortable columns with arrow indicators
- Action buttons (view, edit, delete) in last column
- Pagination controls at bottom
- Filter chips above table
- Export button in table header

**Form Elements:**
- Labels above inputs (text-sm, font-medium, mb-2)
- Input fields: h-11, rounded-md, border-2, px-4
- Required asterisk in label text
- Helper text below input (text-xs)
- Error states with border change and error message
- Multi-select dropdowns with chips
- File upload areas with drag-and-drop zones
- Date pickers with calendar overlay

### Cards & Containers
**Property Cards:**
- Image thumbnail at top (aspect-ratio-16/9)
- Property ID and status badge
- Title (text-lg, font-semibold)
- Key details grid (2 columns)
- Price prominently displayed (text-xl, font-bold)
- Action buttons at bottom (full width or split)

**Project Cards:**
- Horizontal layout with image left (w-48)
- Project name and location (text-xl, font-semibold)
- Progress bar showing completion percentage
- Stats row: Total units, Sold, Available
- View details button

**Client Profile Cards:**
- Avatar/initials circle at top
- Client name (text-2xl, font-semibold)
- Contact information with icons
- Associated properties list
- Payment status overview
- Last activity timestamp

### Document Management
**Document List Items:**
- Icon indicating document type
- Document name and description
- Metadata: Created date, created by, version
- File size and format
- Download and share action buttons
- Preview thumbnail for PDFs

**Document Generation Interface:**
- Template selection cards with preview
- Step-by-step wizard with progress indicator
- Data auto-population with validation
- Preview pane showing generated document
- Generate and download buttons

### Payment Components
**Payment Schedule Table:**
- Milestone column with date
- Amount column (font-mono for numbers)
- Status badges (Pending, Paid, Overdue)
- Payment date column
- Action column for record payment
- Outstanding balance row at bottom (highlighted)

**Payment Recording Form:**
- Payment method selection
- Amount input with currency symbol
- Date picker for payment date
- Transaction reference field
- Receipt upload area
- Confirmation summary before save

### Modals & Overlays
**Modal Windows:**
- Centered overlay with backdrop blur
- Max width constraints (max-w-2xl for forms, max-w-4xl for data)
- Header with title and close button
- Content area with appropriate padding (p-6)
- Footer with action buttons (right-aligned)

**Toast Notifications:**
- Fixed position top-right
- Success, warning, error, info variants
- Auto-dismiss after 5 seconds
- Manual dismiss button
- Stacked for multiple notifications

### Status Indicators
**Badges:**
- Rounded-full px-3 py-1 text-xs font-medium
- Property Status: Available, Booked, Sold
- Payment Status: Pending, Paid, Partial, Overdue
- User Status: Active, Inactive
- Milestone Status: Not Started, In Progress, Completed

**Progress Indicators:**
- Linear progress bars with percentage labels
- Circular progress for milestone completion
- Step indicators for multi-step processes

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px - Single column, collapsed sidebar (hamburger menu)
- Tablet: 768px - 1024px - 2-column grids, visible sidebar toggle
- Desktop: > 1024px - Full sidebar, 3-column grids, optimal spacing

**Mobile Adaptations:**
- Sidebar converts to slide-out drawer
- Data tables scroll horizontally with sticky first column
- Dashboard cards stack vertically
- Forms remain single column
- Touch-friendly button sizes (min h-12)

---

## Animation & Interactions

**Minimal, Purposeful Animations:**
- Sidebar transitions: 200ms ease-in-out
- Modal fade-in: 150ms
- Dropdown menus: slide-down 100ms
- Tab switches: crossfade 200ms
- Toast notifications: slide-in from right 200ms
- NO scroll-triggered animations, parallax effects, or decorative motion

---

## Images

**Hero Section (Login/Landing Page):**
- Full-width hero image showing modern real estate development
- Semi-transparent overlay for text readability
- Centered login form with blurred background (backdrop-blur-md)
- Professional photography of residential buildings/amenities

**Dashboard Images:**
- Project thumbnail images in cards (16:9 aspect ratio)
- Property images in listings (square or 4:3 ratio)
- User avatars (circular, 40px default size)
- Empty state illustrations for no data scenarios

**Document Preview:**
- PDF thumbnails for document lists
- Floor plan images in property details

**Image Placement:**
- All property and project images should be placeholders with clear dimension requirements
- Use CDN-hosted placeholder services initially
- Support image upload with size validation (max 5MB)

---

## Accessibility Standards

- Minimum contrast ratio 4.5:1 for normal text, 3:1 for large text
- All interactive elements keyboard accessible with visible focus states
- ARIA labels for icon-only buttons
- Form inputs associated with labels via for/id
- Skip navigation link for screen readers
- Alt text required for all images
- Focus trap in modal dialogs
- Consistent tab order throughout application

This design system ensures a professional, efficient, and scalable CRM that prioritizes data clarity and user productivity while maintaining modern aesthetic standards appropriate for real estate business operations.