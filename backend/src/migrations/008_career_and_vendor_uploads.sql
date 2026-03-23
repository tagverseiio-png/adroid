-- Migration 008: Add file upload support for Career and Vendor registrations
-- Also adds roles for better career tracking

ALTER TABLE inquiries 
ADD COLUMN IF NOT EXISTS file_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS roles VARCHAR(255), -- For career role selection
ADD COLUMN IF NOT EXISTS applicant_type VARCHAR(100); -- Internship vs Career

-- Index for file management
CREATE INDEX IF NOT EXISTS idx_inquiries_file ON inquiries(file_path) WHERE file_path IS NOT NULL;
