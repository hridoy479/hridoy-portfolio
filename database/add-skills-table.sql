-- ============================================
-- ADD SKILLS TABLE FOR DYNAMIC SKILLS SECTION
-- ============================================

-- Create Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'Frontend', 'Backend', 'Database', 'DevOps', 'Tools'
  icon TEXT, -- Optional emoji or icon
  proficiency INTEGER DEFAULT 5 CHECK (proficiency >= 1 AND proficiency <= 5), -- 1-5 rating
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_visible ON skills(is_visible);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(display_order);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read visible skills
CREATE POLICY "Anyone can view visible skills" ON skills 
  FOR SELECT 
  USING (is_visible = true);

-- Only admins can manage skills
CREATE POLICY "Only admins can insert skills" ON skills 
  FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update skills" ON skills 
  FOR UPDATE 
  USING (is_admin());

CREATE POLICY "Only admins can delete skills" ON skills 
  FOR DELETE 
  USING (is_admin());

-- Add trigger to auto-update updated_at
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default skills
INSERT INTO skills (name, category, icon, proficiency, display_order) VALUES
-- Frontend
('JavaScript', 'Frontend', '🟨', 5, 1),
('TypeScript', 'Frontend', '🔷', 5, 2),
('React', 'Frontend', '⚛️', 5, 3),
('Next.js', 'Frontend', '▲', 5, 4),
('Tailwind CSS', 'Frontend', '🎨', 5, 5),
('Shadcn UI', 'Frontend', '🎭', 4, 6),

-- Backend
('Node.js', 'Backend', '🟢', 5, 7),
('Express.js', 'Backend', '🚂', 4, 8),
('REST APIs', 'Backend', '🔌', 5, 9),
('GraphQL', 'Backend', '◈', 4, 10),

-- Database
('MongoDB', 'Database', '🍃', 4, 11),
('PostgreSQL', 'Database', '🐘', 4, 12),
('Supabase', 'Database', '⚡', 5, 13),

-- DevOps & Tools
('Git', 'DevOps', '📦', 5, 14),
('Docker', 'DevOps', '🐳', 4, 15),
('AWS', 'DevOps', '☁️', 3, 16),
('Vercel', 'DevOps', '▲', 5, 17);

-- Verify the data
SELECT id, name, category, icon, proficiency, is_visible 
FROM skills 
ORDER BY display_order;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Now you can manage skills from the dashboard
