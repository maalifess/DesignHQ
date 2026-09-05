# DesignHQ — UI Elements & Design System Documentation

Welcome to the comprehensive UI documentation for **DesignHQ** (Beba App), a modern glassmorphic web application built for fashion designers. This document provides an in-depth breakdown of every UI component, layout element, styling token, and view architecture in the codebase.

---

## Table of Contents
1. [Design System & Styling Architecture](#1-design-system--styling-architecture)
2. [Core Atomic UI Components (`src/components/ui/`)](#2-core-atomic-ui-components-srccomponentsui)
   - [Button & IconButton](#button--iconbutton)
   - [Badge & ColorBadge](#badge--colorbadge)
   - [GlassCard](#glasscard)
   - [GlassModal](#glassmodal)
   - [Form Primitives (Input, Textarea, Select)](#form-primitives-input-textarea-select)
   - [Toast & ToastContainer](#toast--toastcontainer)
3. [Layout Components (`src/components/layout/`)](#3-layout-components-srccomponentslayout)
   - [Layout Shell](#layout-shell)
   - [Sidebar](#sidebar)
   - [TopBar](#topbar)
4. [Dashboard & Feature Widgets (`src/components/dashboard/`, `src/components/projects/`)](#4-dashboard--feature-widgets)
   - [WelcomeStrip](#welcomestrip)
   - [StatCards](#statcards)
   - [ActiveProjects](#activeprojects)
   - [RecentSketches](#recentsketches)
   - [UpcomingDeadlines](#upcomingdeadlines)
   - [KanbanBoard](#kanbanboard)
5. [Page Views (`src/pages/`)](#5-page-views-srcpages)
   - [Dashboard View](#dashboard-view)
   - [Projects & Project Detail](#projects--project-detail)
   - [Mood Boards & Mood Board Detail](#mood-boards--mood-board-detail)
   - [Sketchbook (Interactive Canvas)](#sketchbook-interactive-canvas)
   - [Fabrics Swatch Library](#fabrics-swatch-library)
   - [Notes & Ideas](#notes--ideas)
   - [Portfolio & Public Share View](#portfolio--public-share-view)
   - [Settings & Account](#settings--account)
   - [Authentication (Login & Forgot Password)](#authentication-login--forgot-password)

---

## 1. Design System & Styling Architecture

The application utilizes a customized **Glassmorphic Design System** built with CSS Custom Properties (variables), dark/light mode theme toggling, and HSL color palettes tailored for luxury fashion aesthetics.

### Color Tokens & Variables (`src/styles/globals.css` / `index.css`)
- **Primary Accent (`--accent-primary`)**: `#800020` (Burgundy / Wine) — represents luxury, elegance, and fashion heritage.
- **Deep Accent (`--accent-deep`)**: `#5C0016` — used for gradients and pressed button states.
- **Light Accent (`--accent-light`)**: `rgba(128, 0, 32, 0.08)` — subtle hover backgrounds and active nav states.
- **Glass Surfaces (`--glass-bg`, `--glass-border`)**: Translucent background panels (`rgba(255, 255, 255, 0.65)` in light mode, `rgba(20, 16, 22, 0.75)` in dark mode) paired with `backdrop-filter: blur(20px)`.
- **Status Indicators**:
  - Success (`var(--status-success)`): `#2E7D32` (Emerald Green)
  - Warning (`var(--status-warning)`): `#ED6C02` (Warm Amber)
  - Danger (`var(--status-danger)`): `#D32F2F` (Crimson Red)
  - Muted (`var(--status-muted)`): `#757575` (Slate Gray)

### Typography Stack
- **Display Font (`--font-display`)**: Playfair Display / Cormorant Garamond / Outfit — serif elegance for titles, section headers, and brand marks.
- **UI & Body Font (`--font-ui`)**: Inter / Plus Jakarta Sans — crisp readability for inputs, tables, labels, and metadata.

---

## 2. Core Atomic UI Components (`src/components/ui/`)

### Button & IconButton
**File:** [Button.tsx](file:///d:/Beba%20App/src/components/ui/Button.tsx)

#### Description:
A versatile button primitive built with **Framer Motion** micro-interactions (`whileTap={{ y: 2 }}` for realistic tactile depth). Supports loading states, lead/trail icon slots, and multiple visual hierarchy variants.

#### Props & Types:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
}
```

#### Variants Detail:
1. `primary`: Solid burgundy gradient fill with white text. Used for main call-to-actions (e.g. "Create Project", "Save Fabric").
2. `secondary`: Muted glass border with neutral text.
3. `ghost`: Transparent background that gains subtle tint on hover.
4. `glass`: Semi-transparent glassmorphic button with backdrop blur and white border glow.
5. `danger`: Crimson fill for destructive actions (e.g. "Delete Sketch").
6. `IconButton`: Shorthand component for square icon-only buttons with built-in `aria-label` and hover tooltips.

---

### Badge & ColorBadge
**File:** [Badge.tsx](file:///d:/Beba%20App/src/components/ui/Badge.tsx)

#### Description:
Pill-shaped visual status chips used across project cards, task columns, and fabric categories. Also includes `ColorBadge` for displaying color swatch dots with labels.

#### Key Features:
- **Status Variants**: `accent`, `success`, `warning`, `danger`, `muted`.
- **Color Swatch Palette**: Preset curated fashion colors (`Crimson #800020`, `Burgundy #5C0016`, `Rose #A0002A`, `Blush #C05070`, `Mauve #8B4060`, `Plum #6B2050`).
- **Interactive Swatches**: Used in project tech packs and fabric color tagging.

---

### GlassCard
**File:** [GlassCard.tsx](file:///d:/Beba%20App/src/components/ui/GlassCard.tsx)

#### Description:
The fundamental container building block of DesignHQ. Wraps content inside a frosted-glass surface with smooth border highlights, inner padding options, and optional hover translation animations.

#### Features & Usage:
- `padding`: `none`, `sm` (16px), `md` (24px), `lg` (32px).
- `hover`: Enables `-2px` vertical lift animation (`whileHover={{ y: -2 }}`) when `onClick` handler is passed.
- Uses CSS class `.glass-card` which automatically adapts to dark/light theme shifts.

---

### GlassModal
**File:** [GlassModal.tsx](file:///d:/Beba%20App/src/components/ui/GlassModal.tsx)

#### Description:
Accessible dialog modal overlay with smooth spring-physics scale and fade animation (`AnimatePresence`).

#### Features:
- **Body Scroll Lock**: Automatically disables main document scroll (`overflow: hidden`) while open.
- **Keyboard Navigation**: Listens to `Escape` key events to dismiss modal.
- **Backdrop Dismiss**: Clicking the dimmed backdrop backdrop dismisses the dialog.
- **Sizes**: `sm` (480px), `md` (512px), `lg` (672px), `xl` (896px), `full` (1280px).

---

### Form Primitives (Input, Textarea, Select)
**File:** [Input.tsx](file:///d:/Beba%20App/src/components/ui/Input.tsx)

#### Description:
High-contrast, accessible form controls supporting floating labels, inline icon slots, focus glow, and inline field validation error indicators.

#### Highlights:
1. `Input`: Supports `leftIcon` and `rightIcon` slots (absolute positioned inside the field with correct inline padding calculations).
2. `Textarea`: Resizable vertical text input with dynamic border coloring on error.
3. `Select`: Custom-styled HTML select element with inline SVG dropdown arrow pointer (`appearance: none`).

---

### Toast & ToastContainer
**File:** [Toast.tsx](file:///d:/Beba%20App/src/components/ui/Toast.tsx)

#### Description:
Global notification system positioned in the top-right viewport corner (`z-index: var(--z-toast)`).

#### Features:
- **Toast Types**: `success`, `error`, `warning`, `info`.
- **Framer Motion Entrance**: Slide-in from right (`x: 60` to `x: 0`) with smooth popLayout exit transition.
- **Auto-Dismiss**: Managed globally through Zustand state store (`useAppStore`).

---

## 3. Layout Components (`src/components/layout/`)

### Layout Shell
**File:** [Layout.tsx](file:///d:/Beba%20App/src/components/layout/Layout.tsx)

Combines the fixed `Sidebar` and `TopBar` into a cohesive app shell. Adjusts `margin-left` dynamically depending on whether the sidebar is collapsed (64px) or expanded (240px).

### Sidebar
**File:** [Sidebar.tsx](file:///d:/Beba%20App/src/components/layout/Sidebar.tsx)

#### Key Elements:
- **Logo Mark**: Animated Scissors icon branding with gradient badge.
- **Navigation Links**:
  - `Dashboard` (`/`)
  - `Projects` (`/projects`)
  - `Mood Boards` (`/moodboards`)
  - `Sketchbook` (`/sketchbook`)
  - `Fabrics` (`/fabrics`)
  - `Notes` (`/notes`)
  - `Portfolio` (`/portfolio`)
- **Active Route Indicator**: Highlights active link with burgundy background tint (`var(--accent-light)`) and a 3px right border highlight.
- **Collapse Toggle**: Chevron button at the bottom toggling collapsed/expanded sidebar layout.
- **User Profile Strip**: Displays avatar, display name, user email, and direct Logout action.

### TopBar
**File:** [TopBar.tsx](file:///d:/Beba%20App/src/components/layout/TopBar.tsx)

#### Key Elements:
- **Global Search Field**: Live search bar with shortcut key indicators (`Ctrl + K`).
- **Quick Action Menu**: Button with modal triggers for creating new projects, uploading mood boards, or adding fabric swatches.
- **Theme Toggle**: Moon/Sun toggle switching between Light and Dark glassmorphic modes (`useDarkMode`).
- **Notifications Bell**: Bell button with active badge dot showing recent notifications.

---

## 4. Dashboard & Feature Widgets

### WelcomeStrip
**File:** [WelcomeStrip.tsx](file:///d:/Beba%20App/src/components/dashboard/WelcomeStrip.tsx)

Personalized greeting strip displaying designer's name, warm supportive subtitle, and current date indicator.

### StatCards
**File:** [StatCards.tsx](file:///d:/Beba%20App/src/components/dashboard/StatCards.tsx)

Grid of 4 key metric cards:
1. **Active Projects**: Count of ongoing fashion collections with percentage growth trend.
2. **Total Sketches**: Canvas drawings and uploaded garment illustrations.
3. **Fabric Swatches**: Cataloged textiles in the digital inventory.
4. **Upcoming Deadlines**: Near-term collection fitting and runway target dates.

### ActiveProjects
**File:** [ActiveProjects.tsx](file:///d:/Beba%20App/src/components/dashboard/ActiveProjects.tsx)

Collection of active project cards showcasing project status badges, completion percentage progress bar, target completion date, and tagged garment counts.

### RecentSketches
**File:** [RecentSketches.tsx](file:///d:/Beba%20App/src/components/dashboard/RecentSketches.tsx)

Visual thumbnail gallery of latest fashion drawings created in the Sketchbook tool.

### UpcomingDeadlines
**File:** [UpcomingDeadlines.tsx](file:///d:/Beba%20App/src/components/dashboard/UpcomingDeadlines.tsx)

Urgency-sorted task countdown list displaying days remaining, target collection, and color-coded status pills.

### KanbanBoard
**File:** [KanbanBoard.tsx](file:///d:/Beba%20App/src/components/projects/KanbanBoard.tsx)

Interactive column board (`To Do`, `In Progress`, `Review`, `Completed`) with task cards, assigned color tags, subtask progress indicators, and task creation modals.

---

## 5. Page Views (`src/pages/`)

### Dashboard View (`src/pages/Dashboard.tsx`)
The primary entry hub bringing together `WelcomeStrip`, `StatCards`, `ActiveProjects`, `RecentSketches`, and `UpcomingDeadlines`.

### Projects & Project Detail (`src/pages/Projects.tsx`, `ProjectDetail.tsx`)
- **Projects**: Grid and list view toggles, category filtering, search, and "New Collection" modal form.
- **Project Detail**: Comprehensive collection overview containing Tech Packs, garment lists, sample tracking status, fabric assignments, and attached mood boards.

### Mood Boards & Mood Board Detail (`src/pages/MoodBoards.tsx`, `MoodBoardDetail.tsx`)
- **Mood Boards**: Grid of visual inspiration boards with thumbnail collage previews.
- **Mood Board Detail**: Masonry image gallery supporting image upload, drag-and-drop arrangement, and **AI Gemini Analysis**:
  - Automatic extraction of garment types, style aesthetics, dominant HSL color hex codes, mood, and target season.

### Sketchbook (`src/pages/Sketchbook.tsx`)
Interactive HTML5 Canvas studio designed specifically for fashion illustration.
- **Canvas Tools**: Pen/Pencil brush, eraser, line tool, shape tool, brush size slider, color picker.
- **Layer & History**: Undo/Redo stack, canvas export to PNG/JPG.
- **AI Design Critique**: Integrates Google Gemini API to analyze the active sketch and return actionable critique (`Works Well`, `Areas for Improvement`, `Mentor Feedback`).

### Fabrics Swatch Library (`src/pages/Fabrics.tsx`)
Digital inventory manager for textiles and raw materials:
- **Fields**: Fabric name, composition (e.g. 100% Silk Chiffon), weight (gsm), texture, stretch properties, supplier info, yardage stock level, care instructions.
- **Visual Swatch Preview**: Color dot swatch and uploaded fabric texture image thumbnail.

### Notes & Ideas (`src/pages/Notes.tsx`)
Rich note-taking board with tagging, category filters, quick search, and pinned notes for fitting feedback and design inspiration.

### Portfolio & Public Share View (`src/pages/Portfolio.tsx`, `PortfolioPublic.tsx`)
- **Portfolio Manager**: Designer bio editor, public toggle, collection showcase configuration.
- **Public View (`/portfolio/public/:id`)**: Clean, external read-only public web page showcasing designer's collections, sketches, and contact details for buyers or fashion recruiters.

### Settings & Account (`src/pages/Settings.tsx`)
User profile editor (display name, full name, avatar URL upload), password security, theme preference toggle, and Supabase integration settings.

### Authentication (`src/pages/Login.tsx`, `ForgotPassword.tsx`)
Glassmorphic authentication forms with Supabase email/password login, account registration toggle, and password reset email handler.

---

*Documentation created for DesignHQ.*
