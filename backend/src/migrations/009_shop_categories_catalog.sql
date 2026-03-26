-- ============================================================
-- Migration 009: Standardize Shop Categories Catalog
-- ============================================================

WITH desired(name, slug, description, display_order) AS (
    VALUES
        ('Office Furniture', 'office-furniture', 'Workspace furniture solutions for modern offices', 1),
        ('Home Furniture', 'home-furniture', 'Functional and stylish furniture for homes', 2),
        ('Chairs', 'chairs', 'Task, lounge, dining and accent chairs', 3),
        ('Sofa', 'sofa', 'Contemporary and classic sofa collections', 4),
        ('Lighting', 'lighting', 'Decorative and architectural lighting products', 5),
        ('Fit Out Services', 'fit-out-services', 'End-to-end interior fit out services', 6),
        ('Office Gadgets', 'office-gadgets', 'Smart gadgets and tools for office productivity', 7),
        ('Home Gadgets', 'home-gadgets', 'Everyday gadgets and devices for homes', 8),
        ('Interior Products', 'interior-products', 'Accessories and products for interior styling', 9),
        ('Others', 'others', 'Other products and miscellaneous categories', 10)
),
upsert AS (
    INSERT INTO shop_categories (name, slug, description, display_order, active)
    SELECT name, slug, description, display_order, true
    FROM desired
    ON CONFLICT (slug)
    DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        display_order = EXCLUDED.display_order,
        active = true,
        updated_at = NOW()
    RETURNING slug
)
UPDATE shop_categories
SET
    active = false,
    updated_at = NOW()
WHERE slug NOT IN (SELECT slug FROM desired);

DO $$
BEGIN
    RAISE NOTICE 'Migration 009 completed: shop categories standardized.';
END $$;
