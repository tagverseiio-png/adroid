-- ============================================================
-- Migration 007: E-Commerce Shop Schema
-- ============================================================

-- Shop Categories
CREATE TABLE IF NOT EXISTS shop_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Shop Products
CREATE TABLE IF NOT EXISTS shop_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    category_id INTEGER REFERENCES shop_categories(id) ON DELETE SET NULL,
    short_description TEXT,
    description TEXT,
    specifications JSONB DEFAULT '{}',
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    sale_price NUMERIC(12, 2),
    stock_qty INTEGER NOT NULL DEFAULT 0,
    weight_grams INTEGER DEFAULT 0,
    dimensions JSONB DEFAULT '{}',
    cover_image VARCHAR(500),
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    total_sales INTEGER DEFAULT 0,
    average_rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Shop Product Images (gallery)
CREATE TABLE IF NOT EXISTS shop_product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES shop_products(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Shop Coupons
CREATE TABLE IF NOT EXISTS shop_coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percent', 'flat')),
    value NUMERIC(12, 2) NOT NULL,
    min_order_value NUMERIC(12, 2) DEFAULT 0,
    max_discount NUMERIC(12, 2),
    max_uses INTEGER DEFAULT 0,
    used_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    expiry_date TIMESTAMP,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Shop Orders
CREATE TABLE IF NOT EXISTS shop_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    -- Customer Info
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    -- Shipping Address
    shipping_address JSONB NOT NULL DEFAULT '{}',
    -- Items snapshot (JSON array of { product_id, name, sku, qty, unit_price, total_price })
    items JSONB NOT NULL DEFAULT '[]',
    -- Pricing
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    coupon_code VARCHAR(50),
    shipping_charge NUMERIC(12, 2) DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    -- Payment
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
    payment_txn_id VARCHAR(255),
    payment_method VARCHAR(50),
    payu_mihpayid VARCHAR(255),
    payu_response JSONB,
    -- Shiprocket / Shipping
    shiprocket_order_id VARCHAR(100),
    shipment_id VARCHAR(100),
    tracking_number VARCHAR(100),
    courier_name VARCHAR(100),
    awb_code VARCHAR(100),
    -- Status
    order_status VARCHAR(30) DEFAULT 'placed' CHECK (order_status IN ('placed','confirmed','processing','shipped','delivered','cancelled','returned')),
    notes TEXT,
    -- Meta
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Shop Reviews
CREATE TABLE IF NOT EXISTS shop_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES shop_products(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES shop_orders(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    body TEXT,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_shop_products_slug ON shop_products(slug);
CREATE INDEX IF NOT EXISTS idx_shop_products_category ON shop_products(category_id);
CREATE INDEX IF NOT EXISTS idx_shop_products_published ON shop_products(published);
CREATE INDEX IF NOT EXISTS idx_shop_products_featured ON shop_products(featured);
CREATE INDEX IF NOT EXISTS idx_shop_products_price ON shop_products(price);

CREATE INDEX IF NOT EXISTS idx_shop_orders_number ON shop_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_shop_orders_email ON shop_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_shop_orders_status ON shop_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_shop_orders_payment ON shop_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_shop_orders_created ON shop_orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shop_reviews_product ON shop_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_shop_reviews_approved ON shop_reviews(approved);

CREATE INDEX IF NOT EXISTS idx_shop_coupons_code ON shop_coupons(code);

-- ── Seed initial categories ───────────────────────────────────────────────────

INSERT INTO shop_categories (name, slug, description, display_order) VALUES
    ('Furniture', 'furniture', 'Premium handcrafted and designer furniture pieces', 1),
    ('Decor', 'decor', 'Curated home and office décor accessories', 2),
    ('Lighting', 'lighting', 'Architectural and ambient lighting solutions', 3),
    ('Textiles', 'textiles', 'Luxury cushions, rugs and upholstery', 4),
    ('Art & Prints', 'art-prints', 'Original art, architectural prints and wall décor', 5),
    ('Materials', 'materials', 'Premium materials, tiles and surfaces samples', 6)
ON CONFLICT (slug) DO NOTHING;

-- ── Function: auto-update updated_at ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_shop_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_shop_products_updated
    BEFORE UPDATE ON shop_products
    FOR EACH ROW EXECUTE FUNCTION update_shop_timestamp();

CREATE OR REPLACE TRIGGER trg_shop_orders_updated
    BEFORE UPDATE ON shop_orders
    FOR EACH ROW EXECUTE FUNCTION update_shop_timestamp();

CREATE OR REPLACE TRIGGER trg_shop_coupons_updated
    BEFORE UPDATE ON shop_coupons
    FOR EACH ROW EXECUTE FUNCTION update_shop_timestamp();

DO $$
BEGIN
    RAISE NOTICE 'Shop schema migration 007 completed successfully!';
END $$;
