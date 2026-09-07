-- ============================================================
-- Ariba's Atelier — Complete Supabase Schema, Constraint Drop & Cache Reload
-- Copy and paste this script directly into your Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New Query -> Run)
-- ============================================================

-- ── 1. Drop Legacy Check Constraints & Foreign Keys ──────────
ALTER TABLE IF EXISTS projects DROP CONSTRAINT IF EXISTS projects_category_check;
ALTER TABLE IF EXISTS projects DROP CONSTRAINT IF EXISTS projects_stage_check;
ALTER TABLE IF EXISTS sketches DROP CONSTRAINT IF EXISTS sketches_garment_type_check;
ALTER TABLE IF EXISTS sketches DROP CONSTRAINT IF EXISTS sketches_project_id_fkey;
ALTER TABLE IF EXISTS patterns DROP CONSTRAINT IF EXISTS patterns_category_check;
ALTER TABLE IF EXISTS patterns DROP CONSTRAINT IF EXISTS patterns_project_id_fkey;
ALTER TABLE IF EXISTS fabrics DROP CONSTRAINT IF EXISTS fabrics_availability_check;
ALTER TABLE IF EXISTS notes DROP CONSTRAINT IF EXISTS notes_category_check;
ALTER TABLE IF EXISTS notes DROP CONSTRAINT IF EXISTS notes_project_id_fkey;
ALTER TABLE IF EXISTS notes DROP CONSTRAINT IF EXISTS notes_collection_id_fkey;
ALTER TABLE IF EXISTS deadlines DROP CONSTRAINT IF EXISTS deadlines_urgency_check;
ALTER TABLE IF EXISTS deadlines DROP CONSTRAINT IF EXISTS deadlines_project_id_fkey;

-- ── 2. Profiles Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT DEFAULT 'Ariba',
  display_name TEXT DEFAULT 'Ariba',
  university TEXT DEFAULT 'Royal College of Art',
  bio TEXT DEFAULT 'Lead Couture Modéliste & Fashion Designer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT 'Ariba';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT 'Ariba';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS university TEXT DEFAULT 'Royal College of Art';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Lead Couture Modéliste & Fashion Designer';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ── 3. Collections / Projects Table ─────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  code TEXT NOT NULL DEFAULT '#CR-1001',
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Assignment',
  season TEXT DEFAULT 'Fashion Design 101',
  target_date TEXT DEFAULT '2026-11-18',
  stage TEXT DEFAULT 'Sampling (Phase 6 of 9)',
  stage_num INT DEFAULT 6,
  percent INT DEFAULT 75,
  palette JSONB DEFAULT '[{"name":"Haute Crimson","hex":"#800020"},{"name":"Merlot Velvet","hex":"#5C0016"},{"name":"Blush Satin","hex":"#C05070"}]'::jsonb,
  garments_count INT DEFAULT 0,
  description TEXT DEFAULT 'Bespoke atelier collection created by Ariba.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS code TEXT DEFAULT '#CR-1001';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Assignment';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS season TEXT DEFAULT 'Fashion Design 101';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_date TEXT DEFAULT '2026-11-18';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'Sampling (Phase 6 of 9)';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stage_num INT DEFAULT 6;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS percent INT DEFAULT 75;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS palette JSONB DEFAULT '[{"name":"Haute Crimson","hex":"#800020"},{"name":"Merlot Velvet","hex":"#5C0016"},{"name":"Blush Satin","hex":"#C05070"}]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS garments_count INT DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'Bespoke atelier collection created by Ariba.';

-- ── 4. Sketches Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS sketches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  project_id UUID,
  imported_from_id UUID,
  title TEXT NOT NULL DEFAULT 'Untitled Sketch',
  collection_title TEXT,
  garment_type TEXT DEFAULT 'Outerwear/Tailoring',
  fabric_name TEXT DEFAULT 'Silk Velvet',
  image_url TEXT NOT NULL,
  ai_critique TEXT DEFAULT 'Excellent tension along shoulder seam line.',
  score INT DEFAULT 95,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sketches ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE sketches ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE sketches ADD COLUMN IF NOT EXISTS imported_from_id UUID;
ALTER TABLE sketches ADD COLUMN IF NOT EXISTS collection_title TEXT;
ALTER TABLE sketches ADD COLUMN IF NOT EXISTS garment_type TEXT DEFAULT 'Outerwear/Tailoring';
ALTER TABLE sketches ADD COLUMN IF NOT EXISTS fabric_name TEXT DEFAULT 'Silk Velvet';
ALTER TABLE sketches ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE sketches ADD COLUMN IF NOT EXISTS ai_critique TEXT DEFAULT 'Excellent tension along shoulder seam line.';
ALTER TABLE sketches ADD COLUMN IF NOT EXISTS score INT DEFAULT 95;

-- ── 5. Patterns & Specs Table ────────────────────────────────
CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  project_id UUID,
  imported_from_id UUID,
  number TEXT DEFAULT '01',
  pattern_no TEXT DEFAULT 'PT-101',
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Outerwear',
  status TEXT DEFAULT 'Ready',
  status_type TEXT DEFAULT 'approved',
  fabric TEXT,
  notions TEXT,
  next_fitting TEXT,
  modeliste TEXT DEFAULT 'Ariba',
  pieces INT DEFAULT 1,
  description TEXT,
  measurements TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE patterns ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS imported_from_id UUID;
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS number TEXT DEFAULT '01';
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS pattern_no TEXT DEFAULT 'PT-101';
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Outerwear';
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Ready';
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS status_type TEXT DEFAULT 'approved';
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS fabric TEXT;
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS notions TEXT;
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS next_fitting TEXT;
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS modeliste TEXT DEFAULT 'Ariba';
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS pieces INT DEFAULT 1;
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS measurements TEXT;
ALTER TABLE patterns ADD COLUMN IF NOT EXISTS image TEXT;

-- ── 6. Textile Swatches & Fabrics Vault Table ───────────────
CREATE TABLE IF NOT EXISTS fabrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Silk Velvet',
  weight TEXT DEFAULT '320 GSM',
  origin TEXT DEFAULT 'Como, Italy',
  meters_left NUMERIC DEFAULT 25,
  availability TEXT DEFAULT 'In Stock',
  image_url TEXT,
  cost_per_meter NUMERIC DEFAULT 120,
  supplier TEXT DEFAULT 'Biella Textiles Milan',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Silk Velvet';
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS weight TEXT DEFAULT '320 GSM';
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'Como, Italy';
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS meters_left NUMERIC DEFAULT 25;
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'In Stock';
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS cost_per_meter NUMERIC DEFAULT 120;
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS supplier TEXT DEFAULT 'Biella Textiles Milan';

-- ── 7. Atelier Notes & Fitting Specifications Table ─────────
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  project_id UUID,
  collection_id UUID,
  imported_from_id UUID,
  title TEXT NOT NULL DEFAULT 'Fitting Note',
  category TEXT DEFAULT 'Fitting Notes',
  content TEXT NOT NULL,
  date TEXT DEFAULT 'Today',
  tag TEXT DEFAULT 'Fitting Spec',
  look_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notes ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS collection_id UUID;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS imported_from_id UUID;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Fitting Note';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Fitting Notes';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS date TEXT DEFAULT 'Today';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT 'Fitting Spec';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS look_ref TEXT;

-- ── 8. Atelier Production Deadlines Table ────────────────────
CREATE TABLE IF NOT EXISTS deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  project_id UUID,
  title TEXT NOT NULL,
  detail TEXT,
  days_left INT DEFAULT 3,
  urgency TEXT DEFAULT 'medium',
  date TEXT DEFAULT 'Upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deadlines ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE deadlines ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE deadlines ADD COLUMN IF NOT EXISTS detail TEXT;
ALTER TABLE deadlines ADD COLUMN IF NOT EXISTS days_left INT DEFAULT 3;
ALTER TABLE deadlines ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'medium';
ALTER TABLE deadlines ADD COLUMN IF NOT EXISTS date TEXT DEFAULT 'Upcoming';

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — Universal Multi-Browser Access
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sketches ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;

-- Clean up any old restrictive policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;
DROP POLICY IF EXISTS "Users can manage their own sketches" ON sketches;
DROP POLICY IF EXISTS "Users can manage their own patterns" ON patterns;
DROP POLICY IF EXISTS "Users can manage their own fabrics" ON fabrics;
DROP POLICY IF EXISTS "Users can manage their own notes" ON notes;
DROP POLICY IF EXISTS "Users can manage their own deadlines" ON deadlines;

DROP POLICY IF EXISTS "Allow all access on profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all access on projects" ON projects;
DROP POLICY IF EXISTS "Allow all access on sketches" ON sketches;
DROP POLICY IF EXISTS "Allow all access on patterns" ON patterns;
DROP POLICY IF EXISTS "Allow all access on fabrics" ON fabrics;
DROP POLICY IF EXISTS "Allow all access on notes" ON notes;
DROP POLICY IF EXISTS "Allow all access on deadlines" ON deadlines;

-- Universal Permissive Policies
CREATE POLICY "Allow all access on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on sketches" ON sketches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on patterns" ON patterns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on fabrics" ON fabrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on notes" ON notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on deadlines" ON deadlines FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- REALTIME MULTI-BROWSER PUBLISHING
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE projects, sketches, patterns, fabrics, notes, deadlines;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ============================================================
-- FORCE SUPABASE / POSTGREST SCHEMA CACHE RELOAD
-- ============================================================

NOTIFY pgrst, 'reload schema';
