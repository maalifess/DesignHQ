-- ============================================================
-- DesignHQ — Complete Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ── Profiles (extends Supabase auth.users) ────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  display_name TEXT,
  university TEXT,
  bio TEXT,
  avatar_url TEXT,
  portfolio_title TEXT,
  portfolio_bio TEXT,
  portfolio_email TEXT,
  portfolio_layout TEXT DEFAULT 'editorial',
  dark_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Projects ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  theme TEXT,
  category TEXT CHECK (category IN ('assignment','personal','collection','collaboration','competition')),
  status TEXT DEFAULT 'ideation',
  deadline DATE,
  cover_image_url TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  color_label TEXT,
  portfolio_ready BOOLEAN DEFAULT false,
  portfolio_order INT,
  portfolio_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Mood Boards ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mood_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Untitled Board',
  canvas_data JSONB,
  extracted_colors JSONB,
  ai_tags JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Mood Board Images ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mood_board_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mood_board_id UUID REFERENCES mood_boards(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  position JSONB,
  ai_tags JSONB,
  dominant_colors JSONB,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Sketches ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sketches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Untitled Sketch',
  canvas_data JSONB,
  thumbnail_url TEXT,
  annotations JSONB,
  version_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Fabric Library ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fabrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  type TEXT,
  texture TEXT,
  weight TEXT,
  seasons TEXT[] DEFAULT '{}',
  cost_per_meter NUMERIC,
  currency TEXT DEFAULT 'PKR',
  supplier_name TEXT,
  supplier_url TEXT,
  availability TEXT DEFAULT 'in_stock',
  care_instructions TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  dominant_colors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Design Notes ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Untitled Note',
  content JSONB,
  tags TEXT[] DEFAULT '{}',
  color_label TEXT,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Color Palettes ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS color_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  mood_board_id UUID REFERENCES mood_boards(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  colors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── AI Style Guides ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS style_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  input_data JSONB,
  output_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_boards      ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_board_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE sketches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_palettes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_guides     ENABLE ROW LEVEL SECURITY;

-- Profiles policy
CREATE POLICY "Users can manage their own profile"
  ON profiles FOR ALL USING (auth.uid() = id);

-- Projects policy
CREATE POLICY "Users can manage their own projects"
  ON projects FOR ALL USING (auth.uid() = user_id);

-- Mood boards policy
CREATE POLICY "Users can manage their own mood boards"
  ON mood_boards FOR ALL USING (auth.uid() = user_id);

-- Mood board images policy
CREATE POLICY "Users can manage their own mood board images"
  ON mood_board_images FOR ALL
  USING (mood_board_id IN (SELECT id FROM mood_boards WHERE user_id = auth.uid()));

-- Sketches policy
CREATE POLICY "Users can manage their own sketches"
  ON sketches FOR ALL USING (auth.uid() = user_id);

-- Fabrics policy
CREATE POLICY "Users can manage their own fabrics"
  ON fabrics FOR ALL USING (auth.uid() = user_id);

-- Notes policy
CREATE POLICY "Users can manage their own notes"
  ON notes FOR ALL USING (auth.uid() = user_id);

-- Color palettes policy
CREATE POLICY "Users can manage their own color palettes"
  ON color_palettes FOR ALL USING (auth.uid() = user_id);

-- Style guides policy
CREATE POLICY "Users can manage their own style guides"
  ON style_guides FOR ALL USING (auth.uid() = user_id);

-- Public portfolio read policy
CREATE POLICY "Anyone can view portfolio-ready projects"
  ON projects FOR SELECT USING (portfolio_ready = true);

-- ============================================================
-- STORAGE BUCKETS (create in Supabase dashboard or via SQL)
-- ============================================================

-- Run these to create buckets (if using storage admin)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('moodboard-images', 'moodboard-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('fabric-swatches', 'fabric-swatches', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('sketch-thumbnails', 'sketch-thumbnails', true);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_sketches_user_id ON sketches(user_id);
CREATE INDEX IF NOT EXISTS idx_sketches_project_id ON sketches(project_id);
CREATE INDEX IF NOT EXISTS idx_mood_boards_user_id ON mood_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_fabrics_user_id ON fabrics(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(pinned);
