-- ============================================================
-- Migration 010: Add Blog Sub Category For Insights Posting
-- ============================================================

ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS sub_category VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_blog_sub_category ON blog_posts(sub_category);

UPDATE blog_posts
SET sub_category = CASE
    WHEN LOWER(COALESCE(category, '')) IN ('trends', 'trend') THEN 'Trends'
    WHEN LOWER(COALESCE(category, '')) IN ('insights', 'insight', 'blog') THEN 'Insights'
    ELSE 'General'
END
WHERE sub_category IS NULL OR BTRIM(sub_category) = '';

DO $$
BEGIN
    RAISE NOTICE 'Migration 010 completed: blog_posts.sub_category added and normalized.';
END $$;
