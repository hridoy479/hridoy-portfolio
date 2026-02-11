-- ============================================
-- PRODUCTION DATABASE SETUP
-- Portfolio Website - Complete Database Schema
-- ============================================
-- Run this file in Supabase SQL Editor to set up your database
-- Make sure to create your admin account first, then run this script

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  type TEXT NOT NULL,
  title_part1 TEXT NOT NULL,
  title_part2 TEXT NOT NULL,
  image_src TEXT,
  image_alt TEXT NOT NULL,
  gradient_class TEXT,
  ai_powered BOOLEAN DEFAULT FALSE,
  tech_icons TEXT[],
  likes INTEGER DEFAULT 0,
  github_url TEXT,
  demo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  date DATE NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  section TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Likes Table (for persistent likes)
CREATE TABLE IF NOT EXISTS user_likes (
  id SERIAL PRIMARY KEY,
  user_identifier TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_identifier, content_type, content_id)
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  proficiency INTEGER DEFAULT 5 CHECK (proficiency >= 1 AND proficiency <= 5),
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date DESC);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(year DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(date DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_user_likes_identifier ON user_likes(user_identifier);
CREATE INDEX IF NOT EXISTS idx_user_likes_content ON user_likes(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_visible ON skills(is_visible);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(display_order);

-- ============================================
-- 3. CREATE FUNCTIONS
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Like increment/decrement functions
CREATE OR REPLACE FUNCTION increment_blog_likes(blog_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blogs SET likes = likes + 1 WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_blog_likes(blog_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blogs SET likes = GREATEST(likes - 1, 0) WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_project_likes(project_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE projects SET likes = likes + 1 WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_project_likes(project_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE projects SET likes = GREATEST(likes - 1, 0) WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_blog_likes(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION decrement_blog_likes(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_project_likes(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION decrement_project_likes(INTEGER) TO anon, authenticated;

-- ============================================
-- 4. CREATE TRIGGERS
-- ============================================

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. CREATE RLS POLICIES
-- ============================================

-- Blogs Policies
CREATE POLICY "Anyone can view blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Only admin can insert blogs" ON blogs FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admin can update blogs" ON blogs FOR UPDATE USING (is_admin());
CREATE POLICY "Only admin can delete blogs" ON blogs FOR DELETE USING (is_admin());

-- Projects Policies
CREATE POLICY "Anyone can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Only admin can insert projects" ON projects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admin can update projects" ON projects FOR UPDATE USING (is_admin());
CREATE POLICY "Only admin can delete projects" ON projects FOR DELETE USING (is_admin());

-- Messages Policies
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admin can view messages" ON messages FOR SELECT USING (is_admin());
CREATE POLICY "Only admin can update messages" ON messages FOR UPDATE USING (is_admin());
CREATE POLICY "Only admin can delete messages" ON messages FOR DELETE USING (is_admin());

-- Reviews Policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Only admin can insert reviews" ON reviews FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admin can update reviews" ON reviews FOR UPDATE USING (is_admin());
CREATE POLICY "Only admin can delete reviews" ON reviews FOR DELETE USING (is_admin());

-- Site Settings Policies
CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Only admin can update site settings" ON site_settings FOR UPDATE USING (is_admin());

-- User Likes Policies
CREATE POLICY "Anyone can view likes" ON user_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert likes" ON user_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete their likes" ON user_likes FOR DELETE USING (true);

-- Admin Users Policies
CREATE POLICY "Only admins can view admin users" ON admin_users FOR SELECT USING (auth.uid() = user_id);

-- Skills Policies
CREATE POLICY "Anyone can view visible skills" ON skills FOR SELECT USING (is_visible = true);
CREATE POLICY "Only admins can insert skills" ON skills FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update skills" ON skills FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete skills" ON skills FOR DELETE USING (is_admin());

-- ============================================
-- 7. STORAGE BUCKETS
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND is_admin());

CREATE POLICY "Admins can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND is_admin());

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND is_admin());

CREATE POLICY "Admins can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND is_admin());

-- ============================================
-- 8. INSERT DEFAULT DATA
-- ============================================

-- Default Site Settings
INSERT INTO site_settings (section, data) VALUES
('hero', '{
  "name": "Hridoy",
  "title": "JavaScript Developer",
  "description": "I design and build modern web applications with React, Next.js, and Tailwind CSS — focused on performance, clarity, and impact.",
  "profileImage": "/profile-pic.avif",
  "badge": "Portfolio"
}'::jsonb),
('about', '{
  "badge": "About Me",
  "title": "Who is Hridoy?",
  "paragraph1": "I am a passionate JavaScript Developer with expertise in building modern web applications. My journey in web development began with a fascination for creating intuitive user experiences and robust, scalable backend systems. I specialize in React, Next.js, and Tailwind CSS, always striving for performance, clarity, and impactful digital solutions.",
  "paragraph2": "Beyond coding, I enjoy exploring new technologies, contributing to open-source projects, and continuously learning to refine my craft. Let''s build something amazing together!"
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- ============================================
-- 9. ADD ADMIN USER
-- ============================================
-- IMPORTANT: Create your account at /auth/login first, then run this

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'hridoymolla479@gmail.com';
  
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO admin_users (user_id, email)
    VALUES (admin_user_id, 'hridoymolla479@gmail.com')
    ON CONFLICT (email) DO NOTHING;
    
    RAISE NOTICE 'Admin user added successfully!';
  ELSE
    RAISE NOTICE 'Please create your account first at /auth/login';
  END IF;
END $$;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Run database/seed.sql to add demo data (optional)
-- 2. Update your .env.local with Supabase credentials
-- 3. Start your development server: npm run dev
