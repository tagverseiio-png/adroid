-- ============================================================
-- Migration 012: Fulfillment Flow Enhancements
-- ============================================================

-- 1. Add new order statuses (expand the CHECK constraint)
ALTER TABLE shop_orders
    DROP CONSTRAINT IF EXISTS shop_orders_order_status_check;

ALTER TABLE shop_orders
    ADD CONSTRAINT shop_orders_order_status_check
    CHECK (order_status IN (
        'placed',           -- order created, payment pending
        'confirmed',        -- payment received (set by PayU callback)
        'preparing',        -- admin is preparing the order
        'ready',            -- admin marks ready → triggers Shiprocket pickup
        'shipped',          -- Shiprocket has picked up
        'out_for_delivery', -- Shiprocket out for delivery
        'delivered',        -- delivered to customer
        'cancelled',        -- cancelled (stock restored)
        'returned'          -- returned by customer
    ));

-- 2. Add pickup_location column to shop_orders
ALTER TABLE shop_orders
    ADD COLUMN IF NOT EXISTS pickup_location_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS shiprocket_response JSONB;

-- 3. Create pickup locations table
CREATE TABLE IF NOT EXISTS shop_pickup_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,          -- friendly name e.g. "Chennai Warehouse"
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(50) DEFAULT 'India',
    is_default BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    shiprocket_pickup_name VARCHAR(255),        -- exact name in Shiprocket dashboard
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Seed default pickup locations from existing Adroit offices
INSERT INTO shop_pickup_locations
    (name, contact_person, phone, address_line1, city, state, pincode, is_default, shiprocket_pickup_name)
VALUES
    (
        'Chennai Office',
        'Adroit Design',
        '+91 44 45561113',
        'No 8, MCN Nagar Extension, Thoraipakkam',
        'Chennai',
        'Tamil Nadu',
        '600097',
        true,
        'Primary'
    ),
    (
        'Bengaluru Office',
        'Adroit Design',
        '+91 804 1649813',
        'SFD, P DOT G EMERALD, 16th A Cross Rd, Karuna Nagar, Electronic City Phase 1',
        'Bengaluru',
        'Karnataka',
        '560100',
        false,
        'Primary'
    )
ON CONFLICT (name) DO NOTHING;

DO $$
BEGIN
    RAISE NOTICE 'Migration 012: Fulfillment flow enhancements applied successfully!';
END $$;
