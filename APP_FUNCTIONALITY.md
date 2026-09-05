# DesignHQ — Complete App Functionality & Feature Guide

Welcome to the complete functionality guide for **DesignHQ** (Beba App). This document details every feature, workflow, AI capability, data storage mechanism, and export utility built into the platform.

---

## Executive Summary
**DesignHQ** is an end-to-end digital workspace tailored specifically for fashion designers, fashion students, and atelier directors. It unifies collection management, AI-driven mood board curation, interactive garment sketching, digital fabric inventory, project task tracking, and public portfolio publishing into a seamless glassmorphic interface.

---

## Table of Contents
1. [User Authentication & Security](#1-user-authentication--security)
2. [Project & Collection Management](#2-project--collection-management)
3. [AI-Powered Mood Boards](#3-ai-powered-mood-boards)
4. [Interactive HTML5 Sketchbook & AI Critique](#4-interactive-html5-sketchbook--ai-critique)
5. [Digital Fabric & Material Swatch Library](#5-digital-fabric--material-swatch-library)
6. [Kanban Project Task Board](#6-kanban-project-task-board)
7. [Design Notes & Fitting Log](#7-design-notes--fitting-log)
8. [Portfolio Builder & Public Shareable Web Page](#8-portfolio-builder--public-shareable-web-page)
9. [Export Engine (PDF & PNG Lookbooks)](#9-export-engine-pdf--png-lookbooks)
10. [Global Search, Notifications & Glass Theme Engine](#10-global-search-notifications--glass-theme-engine)
11. [Database Schema & Row-Level Security (RLS)](#11-database-schema--row-level-security-rls)

---

## 1. User Authentication & Security

- **Supabase Auth Integration**: Secure login and sign-up with email and password (`useAuth` hook).
- **Auto-Provisioned Profiles**: SQL trigger (`handle_new_user`) automatically provisions a user profile in PostgreSQL upon sign-up.
- **Password Reset Workflow**: Forgot password screen sending secure reset emails via Supabase Auth.
- **Session Persistence & Auto Refresh**: JWT auth tokens auto-refresh and persist across browser sessions.
- **Profile Customization**: Users can edit their display name, full name, university/institution, bio, and upload custom profile avatars stored in Supabase Storage.

---

## 2. Project & Collection Management

- **Collection Organization**: Categorize fashion projects under `Assignment`, `Personal`, `Collection`, `Collaboration`, or `Competition`.
- **Project Lifecycle Tracking**: Move projects through 9 distinct stage milestones:
  1. `Ideation`
  2. `Moodboarding`
  3. `Sketching`
  4. `Fabrication`
  5. `Patternmaking`
  6. `Sampling`
  7. `Fitting`
  8. `Production`
  9. `Completed`
- **Progress Tracking**: Automatic progress bar percentage computed from completed lifecycle stages.
- **Collection Metadata**: Track collection titles, design themes, target completion dates, descriptions, custom color label swatches (`Crimson`, `Burgundy`, `Rose`, `Blush`, `Mauve`, `Plum`), and tag lists.
- **Project Detail Suite**:
  - **Garment List & Tech Packs**: Track garments within a collection, sample approvals, and fitting statuses.
  - **Attached Media**: Linked sketches, fabric swatches, and mood boards per project.

---

## 3. AI-Powered Mood Boards

- **Inspiration Canvas**: Create visual collage mood boards per project or as standalone boards.
- **Image Upload & Cloud Storage**: Multi-image upload direct to Supabase Cloud Storage (`moodboard-images` bucket).
- **Google Gemini 2.0 AI Vision Analysis**:
  - Automatically analyzes mood board images using Gemini AI.
  - Extracts **Garment Type** (e.g. outerwear, gown, trousers, tailored suit).
  - Extracts **Style Aesthetic** (e.g. minimalist, avant-garde, bohemian, romantic, edgy).
  - Extracts **Dominant Colors**: Auto-generates exact HSL/Hex color codes.
  - Detects **Mood & Emotional Tone** (e.g. ethereal, dramatic, dark romance).
  - Identifies **Target Season** (e.g. SS25, AW25, Resort, All-Season).
- **Color Palette Extraction**: Automatically creates project color swatches from uploaded imagery.

---

## 4. Interactive HTML5 Sketchbook & AI Critique

- **Canvas Drawing Suite**:
  - **Drawing Tools**: Freehand Pen/Pencil brush, Eraser, Straight Line tool, Rectangle & Ellipse shape tools.
  - **Stroke Control**: Dynamic brush size slider (1px to 50px).
  - **Color Picker**: Color swatch palette + standard HTML5 color picker.
  - **Canvas History**: Undo and Redo stack for drawing operations.
  - **Canvas Clear & Save**: One-click canvas clearing and image export.
- **AI Design Critique (Gemini AI Mentor)**:
  - Captures current canvas drawing as Base64 image and passes it to Google Gemini 2.0 Flash.
  - Returns a structured fashion professor critique JSON:
    - **`works_well`**: Bullet points detailing strong proportions, line work, and silhouetting.
    - **`improvements`**: Actionable design advice (collar alignment, fabric drape notes, seam placement).
    - **`overall`**: Supportive mentor feedback encouraging student development.

---

## 5. Digital Fabric & Material Swatch Library

- **Textile Inventory Cataloging**: Manage all fabrics, raw materials, hardware, and trims.
- **Detailed Specifications**:
  - **Material Properties**: Fabric Name, Composition (e.g. 100% Mulberry Silk, Heavy Wool Tweed), Weight (GSM), Texture, Stretch (None, 2-way, 4-way).
  - **Seasonality & Usage**: Season tagging (Spring/Summer, Autumn/Winter).
  - **Cost & Supplier Info**: Cost per meter, Currency (PKR, USD, EUR), Supplier Name, Supplier Website URL.
  - **Inventory & Care**: Availability status (`in_stock`, `low_stock`, `ordered`, `out_of_stock`), Care Instructions (e.g. Dry Clean Only), Custom notes.
- **Visual Swatches**: Upload texture image swatches or tag with visual color dots.
- **Lookbook Generator**: Export entire fabric library as a formatted PDF lookbook.

---

## 6. Kanban Project Task Board

- **4 Task Columns**:
  1. `To Do`
  2. `In Progress`
  3. `Review`
  4. `Completed`
- **Task Management**:
  - Create tasks assigned to specific projects.
  - Priority levels (`Low`, `Medium`, `High`) with status badges.
  - Subtask checklists with progress counters.
  - Due date countdowns and assignees.
  - Drag-and-drop or modal status switching.

---

## 7. Design Notes & Fitting Log

- **Digital Notebook**: Dedicated area for raw collection concepts, fitting session notes, pattern adjustments, and supplier contacts.
- **Organization**:
  - Pin important notes to top of workspace.
  - Color-coded labels matching project color swatches.
  - Filter notes by tags or associated project.
  - Instant client-side search across titles and note contents.

---

## 8. Portfolio Builder & Public Shareable Web Page

- **Portfolio Curation**: Toggle projects as `portfolio_ready` with custom display ordering and editorial descriptions.
- **Designer Profile Branding**: Public portfolio title, custom editorial bio, contact email, and layout selector (`Editorial`, `Grid`, `Lookbook`).
- **Public Share Endpoint (`/portfolio/public/:id`)**:
  - Generates a public, unauthenticated shareable webpage link.
  - Perfect for sharing with buyers, fashion week judges, university professors, or recruiters.
  - High-end showcase presenting designer bio, project collections, sketches, and fabric specifications.

---

## 9. Export Engine (PDF & PNG Lookbooks)

- **PNG Export**: Save any canvas sketch, tech pack, or mood board as a high-resolution PNG (`exportAsPNG`).
- **PDF Document Export**: Convert UI elements into formatted PDF documents using `html2canvas` and `jsPDF`.
- **Multi-Page Portfolio PDF**: Render full collection portfolio books into A4 portrait multi-page PDF documents (`exportPortfolioPDF`).
- **Fabric Lookbook Export**: Single-click PDF export of the entire digital fabric inventory.

---

## 10. Global Search, Notifications & Glass Theme Engine

- **Global Search (`Ctrl + K`)**: Modal search index scanning projects, mood boards, sketches, fabrics, and notes in real time.
- **Smart Notification Bell**:
  - Calculates deadline urgency across all active projects and tasks.
  - Color-coded urgency alerts:
    - 🔴 **1 Day / Overdue**: Red danger warning
    - 🟠 **< 7 Days**: Amber warning badge
    - 🟢 **> 7 Days**: Green status pill
- **Glassmorphism Theme System**:
  - Instant Dark Mode / Light Mode toggle (`useDarkMode`).
  - HSL-driven translucent surfaces (`backdrop-filter: blur(20px)`).
  - Smooth Framer Motion transitions across sidebars, modals, toasts, and cards.

---

## 11. Database Schema & Row-Level Security (RLS)

- **PostgreSQL Tables (Supabase)**:
  - `profiles`: User account data and portfolio settings.
  - `projects`: Collection metadata, lifecycle status, color labels.
  - `mood_boards` & `mood_board_images`: Canvas layout, images, and AI tags.
  - `sketches`: Canvas JSON data, thumbnail URLs, version history.
  - `fabrics`: Textile inventory, costs, suppliers, compositions.
  - `notes`: Pinned notes, content JSON, project links.
  - `color_palettes`: Saved collection color palettes.
  - `style_guides`: AI-generated style guide JSON outputs.
- **Row-Level Security (RLS)**: Enforces strict data isolation using `auth.uid() = user_id`, guaranteeing users can only access their own records.
- **Public RLS Exception**: `projects` table allows public read access (`SELECT`) *only* when `portfolio_ready = true` for public portfolio links.

---

*Functionality Specification created for DesignHQ.*
