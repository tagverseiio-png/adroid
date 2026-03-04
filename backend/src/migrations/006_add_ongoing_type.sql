-- Migration: Add ONGOING to project types constraint
-- This drops the existing check constraint and adds a new one that allows 'ONGOING'

DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the check constraint name for the 'type' column on 'projects' table
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'projects'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%type%';

    -- If a constraint was found, drop it
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE projects DROP CONSTRAINT ' || quote_ident(constraint_name);
    END IF;

    -- Add the new constraint
    ALTER TABLE projects ADD CONSTRAINT projects_type_check CHECK (type IN ('ARCHITECTURE', 'INTERIOR', 'ONGOING'));
END $$;
