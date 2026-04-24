-- ============================================================
-- Migration 013: Add tracking_url column to shop_orders
-- ============================================================

ALTER TABLE shop_orders
    ADD COLUMN IF NOT EXISTS tracking_url VARCHAR(500);

-- Add index on awb_code for webhook lookups
CREATE INDEX IF NOT EXISTS idx_shop_orders_awb ON shop_orders(awb_code);

DO $$
BEGIN
    RAISE NOTICE 'Migration 013: tracking_url column added successfully!';
END $$;
