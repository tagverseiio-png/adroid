const { pool } = require('../../config/database');

// ── Helpers ─────────────────────────────────────────────────────────────────

const slugify = (text) =>
    text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const generateSku = () => 'SKU-' + Date.now().toString(36).toUpperCase();

// ── Public Endpoints ─────────────────────────────────────────────────────────

// GET /api/shop/products
const getAll = async (req, res) => {
    try {
        const {
            category, search, min_price, max_price,
            sort = 'created_at', order = 'desc',
            featured, page = 1, limit = 24
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const conditions = ['p.published = true'];
        const params = [];
        let pi = 1;

        if (category) {
            params.push(category);
            conditions.push(`sc.slug = $${pi++}`);
        }
        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(p.name ILIKE $${pi++} OR p.short_description ILIKE $${pi - 1})`);
        }
        if (min_price) { params.push(parseFloat(min_price)); conditions.push(`p.price >= $${pi++}`); }
        if (max_price) { params.push(parseFloat(max_price)); conditions.push(`p.price <= $${pi++}`); }
        if (featured === 'true') conditions.push('p.featured = true');

        const sortMap = {
            created_at: 'p.created_at',
            price_asc: 'COALESCE(p.sale_price, p.price) ASC, p.id',
            price_desc: 'COALESCE(p.sale_price, p.price) DESC, p.id',
            popular: 'p.total_sales',
            rating: 'p.average_rating',
        };
        const orderBy = sortMap[sort] || 'p.created_at';
        const dir = order === 'asc' ? 'ASC' : 'DESC';

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        params.push(parseInt(limit));
        params.push(offset);

        const sql = `
            SELECT p.*, sc.name AS category_name, sc.slug AS category_slug
            FROM shop_products p
            LEFT JOIN shop_categories sc ON sc.id = p.category_id
            ${where}
            ORDER BY ${orderBy} ${dir}
            LIMIT $${pi++} OFFSET $${pi}
        `;

        const countSql = `
            SELECT COUNT(*) FROM shop_products p
            LEFT JOIN shop_categories sc ON sc.id = p.category_id
            ${where}
        `;

        const [result, countResult] = await Promise.all([
            pool.query(sql, params),
            pool.query(countSql, params.slice(0, -2)), // exclude limit/offset
        ]);

        res.json({
            success: true,
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (err) {
        console.error('getAll products error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

// GET /api/shop/products/:slug
const getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await pool.query(
            `SELECT p.*, sc.name AS category_name, sc.slug AS category_slug
             FROM shop_products p
             LEFT JOIN shop_categories sc ON sc.id = p.category_id
             WHERE p.slug = $1 AND p.published = true`,
            [slug]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Product not found' });

        const product = result.rows[0];

        // Fetch approved reviews
        const reviews = await pool.query(
            `SELECT * FROM shop_reviews WHERE product_id = $1 AND approved = true ORDER BY created_at DESC LIMIT 20`,
            [product.id]
        );

        // Related products (same category, excluding self)
        const related = await pool.query(
            `SELECT id, name, slug, cover_image, price, sale_price, average_rating
             FROM shop_products
             WHERE category_id = $1 AND id != $2 AND published = true LIMIT 4`,
            [product.category_id, product.id]
        );

        res.json({
            success: true,
            data: { ...product, reviews: reviews.rows, related: related.rows },
        });
    } catch (err) {
        console.error('getBySlug error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch product' });
    }
};

// ── Admin Endpoints ──────────────────────────────────────────────────────────

// GET /api/shop/products/admin/all
const getAdminAll = async (req, res) => {
    try {
        const { page = 1, limit = 50, search, category, published } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const conditions = [];
        const params = [];
        let pi = 1;

        if (search) { params.push(`%${search}%`); conditions.push(`(p.name ILIKE $${pi++} OR p.sku ILIKE $${pi - 1})`); }
        if (category) { params.push(parseInt(category)); conditions.push(`p.category_id = $${pi++}`); }
        if (published !== undefined) { params.push(published === 'true'); conditions.push(`p.published = $${pi++}`); }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        params.push(parseInt(limit)); params.push(offset);

        const result = await pool.query(
            `SELECT p.*, sc.name AS category_name FROM shop_products p
             LEFT JOIN shop_categories sc ON sc.id = p.category_id
             ${where}
             ORDER BY p.created_at DESC LIMIT $${pi++} OFFSET $${pi}`,
            params
        );

        const count = await pool.query(`SELECT COUNT(*) FROM shop_products p ${where}`, params.slice(0, -2));
        res.json({ success: true, data: result.rows, total: parseInt(count.rows[0].count) });
    } catch (err) {
        console.error('getAdminAll error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

// POST /api/shop/products
const create = async (req, res) => {
    try {
        const {
            name, category_id, short_description, description, specifications = {},
            price, sale_price, stock_qty = 0, weight_grams = 0, dimensions = {},
            cover_image, images = [], tags = [], published = false, featured = false, sku
        } = req.body;

        if (!name || !price) return res.status(400).json({ success: false, message: 'Name and price are required' });

        const slug = slugify(name) + '-' + Date.now().toString(36);
        const finalSku = sku || generateSku();

        const result = await pool.query(
            `INSERT INTO shop_products
             (name, slug, sku, category_id, short_description, description, specifications, price, sale_price,
              stock_qty, weight_grams, dimensions, cover_image, images, tags, published, featured)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
             RETURNING *`,
            [name, slug, finalSku, category_id || null, short_description, description,
             JSON.stringify(specifications), parseFloat(price), sale_price ? parseFloat(sale_price) : null,
             parseInt(stock_qty), parseInt(weight_grams), JSON.stringify(dimensions),
             cover_image, images, tags, published, featured]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('create product error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to create product' });
    }
};

// PUT /api/shop/products/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, category_id, short_description, description, specifications,
            price, sale_price, stock_qty, weight_grams, dimensions,
            cover_image, images, tags, published, featured, sku
        } = req.body;

        const result = await pool.query(
            `UPDATE shop_products SET
                name = COALESCE($1, name),
                slug = CASE WHEN $1 IS NOT NULL THEN $2 ELSE slug END,
                sku = COALESCE($3, sku),
                category_id = COALESCE($4, category_id),
                short_description = COALESCE($5, short_description),
                description = COALESCE($6, description),
                specifications = COALESCE($7::jsonb, specifications),
                price = COALESCE($8, price),
                sale_price = $9,
                stock_qty = COALESCE($10, stock_qty),
                weight_grams = COALESCE($11, weight_grams),
                dimensions = COALESCE($12::jsonb, dimensions),
                cover_image = COALESCE($13, cover_image),
                images = COALESCE($14, images),
                tags = COALESCE($15, tags),
                published = COALESCE($16, published),
                featured = COALESCE($17, featured),
                updated_at = NOW()
             WHERE id = $18
             RETURNING *`,
            [
                name || null,
                name ? slugify(name) + '-' + id : null,
                sku || null,
                category_id || null,
                short_description || null,
                description || null,
                specifications ? JSON.stringify(specifications) : null,
                price ? parseFloat(price) : null,
                sale_price ? parseFloat(sale_price) : null,
                stock_qty !== undefined ? parseInt(stock_qty) : null,
                weight_grams !== undefined ? parseInt(weight_grams) : null,
                dimensions ? JSON.stringify(dimensions) : null,
                cover_image || null,
                images || null,
                tags || null,
                published !== undefined ? published : null,
                featured !== undefined ? featured : null,
                id
            ]
        );

        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('update product error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to update product' });
    }
};

// PATCH /api/shop/products/:id/publish
const togglePublish = async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE shop_products SET published = NOT published, updated_at = NOW()
             WHERE id = $1 RETURNING id, published`,
            [req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to toggle publish' });
    }
};

// PATCH /api/shop/products/:id/featured
const toggleFeatured = async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE shop_products SET featured = NOT featured, updated_at = NOW()
             WHERE id = $1 RETURNING id, featured`,
            [req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to toggle featured' });
    }
};

// DELETE /api/shop/products/:id
const deleteProduct = async (req, res) => {
    try {
        const result = await pool.query(`DELETE FROM shop_products WHERE id = $1 RETURNING id`, [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
};

module.exports = { getAll, getBySlug, getAdminAll, create, update, togglePublish, toggleFeatured, deleteProduct };
