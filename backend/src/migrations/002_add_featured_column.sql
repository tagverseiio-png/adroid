-- Migration: Add featured/selected works functionality
-- This allows admins to curate excellent projects for homepage display

-- Add is_featured column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add index for better performance when querying featured projects
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);

-- Add featured_order column to control display order of featured projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Add comment explaining the feature
COMMENT ON COLUMN projects.is_featured IS 'Marks project as featured/selected work for homepage display';
COMMENT ON COLUMN projects.featured_order IS 'Display order for featured projects (lower numbers appear first)';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Featured works columns added successfully!';
    RAISE NOTICE 'Projects can now be marked as "Selected Works" or "Curated Excellence"';
END $$;
