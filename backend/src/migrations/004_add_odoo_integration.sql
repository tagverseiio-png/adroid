-- Migration: Add Odoo Integration Columns
-- This migration adds Odoo IDs and sync tracking to tables

-- Add Odoo sync columns to inquiries table
ALTER TABLE inquiries 
ADD COLUMN IF NOT EXISTS odoo_lead_id INTEGER,
ADD COLUMN IF NOT EXISTS odoo_customer_id INTEGER,
ADD COLUMN IF NOT EXISTS odoo_synced_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS odoo_sync_status VARCHAR(50) DEFAULT 'pending';

-- Add Odoo sync columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS odoo_project_id INTEGER,
ADD COLUMN IF NOT EXISTS odoo_synced_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS odoo_sync_status VARCHAR(50) DEFAULT 'pending';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inquiries_odoo_lead_id ON inquiries(odoo_lead_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_odoo_sync_status ON inquiries(odoo_sync_status);
CREATE INDEX IF NOT EXISTS idx_projects_odoo_project_id ON projects(odoo_project_id);
CREATE INDEX IF NOT EXISTS idx_projects_odoo_sync_status ON projects(odoo_sync_status);

-- Create Odoo sync log table for tracking all sync operations
CREATE TABLE IF NOT EXISTS odoo_sync_logs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'inquiry', 'project', 'customer'
    entity_id INTEGER NOT NULL,
    odoo_id INTEGER,
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'success', 'failed'
    error_message TEXT,
    sync_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_sync_log UNIQUE (entity_type, entity_id, odoo_id)
);

CREATE INDEX IF NOT EXISTS idx_odoo_sync_logs_status ON odoo_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_odoo_sync_logs_entity ON odoo_sync_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_odoo_sync_logs_created ON odoo_sync_logs(created_at DESC);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Odoo integration columns added successfully!';
    RAISE NOTICE 'Inquiries and projects can now be synced to Odoo';
END $$;
