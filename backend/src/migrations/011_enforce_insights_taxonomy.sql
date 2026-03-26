-- ============================================================
-- Migration 011: Enforce Insights Main Category Taxonomy
-- ============================================================

UPDATE blog_posts
SET category = 'Insights'
WHERE category IS DISTINCT FROM 'Insights';

UPDATE blog_posts
SET sub_category = CASE
    WHEN LOWER(COALESCE(sub_category, '')) = 'trends' THEN 'Trends'
    ELSE 'Insights'
END
WHERE sub_category IS NULL
   OR BTRIM(sub_category) = ''
   OR LOWER(sub_category) NOT IN ('trends', 'insights');

DO $$
BEGIN
    RAISE NOTICE 'Migration 011 completed: blog taxonomy set to Insights + (Trends|Insights).';
END $$;
