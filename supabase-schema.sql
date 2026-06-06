-- ═══════════════════════════════════════════════════════════════
-- Ibrahim Younes Engineering Portfolio — Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Categories ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Projects ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  challenge TEXT,
  solution TEXT,
  process TEXT,
  results TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  cover_image TEXT,
  client_name TEXT,
  location TEXT,
  duration TEXT,
  completion_date DATE,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  before_image TEXT,
  after_image TEXT,
  technical_specs TEXT,
  youtube_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Project Media ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  file_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ─── Technologies ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS technologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_name TEXT NOT NULL
);

-- ─── Materials ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL
);

-- ─── Messages ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Testimonials ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Site Settings ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT,
  hero_description TEXT,
  about_content TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_project_media_project ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_technologies_project ON technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_materials_project ON materials(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ─── Updated At Trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ────────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public READ policies (anon can read published content)
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read project media"
  ON project_media FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_media.project_id AND projects.status = 'published')
  );

CREATE POLICY "Public can read technologies"
  ON technologies FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = technologies.project_id AND projects.status = 'published')
  );

CREATE POLICY "Public can read materials"
  ON materials FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = materials.project_id AND projects.status = 'published')
  );

CREATE POLICY "Public can read testimonials"
  ON testimonials FOR SELECT USING (true);

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT USING (true);

-- Public INSERT for messages (contact form)
CREATE POLICY "Public can submit messages"
  ON messages FOR INSERT WITH CHECK (true);

-- Service role (admin) has full access via bypassing RLS
-- No additional policies needed for admin — use supabase service role key
