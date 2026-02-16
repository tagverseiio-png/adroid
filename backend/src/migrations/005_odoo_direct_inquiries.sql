-- Migration: Odoo-Direct Inquiries Architecture
-- Removes local inquiries table since all inquiries now go directly to Odoo
-- NOTE: Run AFTER backing up any important inquiry data

-- Option 1: DROP the inquiries table entirely (if you don't need local backup)
DROP TABLE IF EXISTS inquiries CASCADE;

-- Option 2: IF YOU WANT TO KEEP LOCAL DATA AS ARCHIVE
-- Uncomment this and comment out DROP above to keep historical data
-- ALTER TABLE inquiries RENAME TO inquiries_archive;
-- CREATE TABLE inquiries AS SELECT * FROM inquiries_archive WHERE 1=0;

-- Remove Odoo sync columns from projects (no longer needed for inquiries)
ALTER TABLE projects 
DROP COLUMN IF EXISTS odoo_lead_id,
DROP COLUMN IF EXISTS odoo_customer_id,
DROP COLUMN IF EXISTS odoo_synced_at,
DROP COLUMN IF EXISTS odoo_sync_status;

-- Drop indexes related to inquiries (if they exist)
DROP INDEX IF EXISTS idx_inquiries_odoo_lead_id;
DROP INDEX IF EXISTS idx_inquiries_odoo_sync_status;
DROP INDEX IF EXISTS idx_inquiries_status;
DROP INDEX IF EXISTS idx_inquiries_type;
DROP INDEX IF EXISTS idx_inquiries_created;

-- Drop odoo_sync_logs table (no longer needed for inquiries)
-- Only keep projects sync logs if you still want to track project syncs
ALTER TABLE odoo_sync_logs DROP CONSTRAINT IF EXISTS unique_sync_log;

DELETE FROM odoo_sync_logs WHERE entity_type = 'inquiry';

-- Update constraint to remove inquiry references
ALTER TABLE odoo_sync_logs 
ADD CONSTRAINT unique_sync_log_v2 UNIQUE (entity_type, entity_id, odoo_id);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database migrated to Odoo-direct inquiries architecture!';
    RAISE NOTICE 'All inquiries now go directly to Odoo CRM';
    RAISE NOTICE 'Local PostgreSQL is used for: Projects, Blog, Analytics only';
    RAISE NOTICE 'Inquiries are managed in: Odoo CRM (crm.lead)';
END $$;
