-- Migration: Add spam quarantine fields
-- Run this on the production database to enable spam flagging.
--
-- For inquiries: adds spam_suspect boolean column
-- For landing_page_leads: adds 'suspect' as a valid status value
--
-- Usage: psql -h <host> -U <user> -d <dbname> -f add_spam_fields.sql

BEGIN;

-- 1. Add spam_suspect flag to inquiries table
ALTER TABLE inquiries
    ADD COLUMN IF NOT EXISTS spam_suspect BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Add a comment for documentation
COMMENT ON COLUMN inquiries.spam_suspect IS 
    'TRUE if this inquiry is flagged as suspicious/spam. Set automatically or manually by admin.';

-- 3. Create index for efficient admin filtering of suspect inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_spam_suspect
    ON inquiries (spam_suspect, created_at DESC)
    WHERE spam_suspect = TRUE;

-- 4. For landing_page_leads: the status column already accepts free text.
--    Add 'suspect' as an explicit allowed value via a CHECK constraint update.
--    First, drop existing check constraint if any (safe if it doesn't exist).
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'landing_page_leads_status_check'
    ) THEN
        ALTER TABLE landing_page_leads DROP CONSTRAINT landing_page_leads_status_check;
    END IF;
END $$;

-- Re-add constraint with 'suspect' included
ALTER TABLE landing_page_leads
    ADD CONSTRAINT landing_page_leads_status_check
    CHECK (status IN ('new', 'suspect', 'contacted', 'qualified', 'converted', 'closed'));

-- 5. Create index for filtering suspect LP leads
CREATE INDEX IF NOT EXISTS idx_lp_leads_status
    ON landing_page_leads (status, created_at DESC);

-- 6. Add spam_suspect flag to landing_page_leads as well for direct querying
ALTER TABLE landing_page_leads
    ADD COLUMN IF NOT EXISTS spam_suspect BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN landing_page_leads.spam_suspect IS
    'TRUE if this lead is flagged as suspicious/spam.';

COMMIT;

-- Verify
SELECT 
    'inquiries' AS table_name,
    COUNT(*) AS total_rows,
    COUNT(*) FILTER (WHERE spam_suspect = TRUE) AS suspect_count
FROM inquiries
UNION ALL
SELECT 
    'landing_page_leads',
    COUNT(*),
    COUNT(*) FILTER (WHERE spam_suspect = TRUE)
FROM landing_page_leads;
