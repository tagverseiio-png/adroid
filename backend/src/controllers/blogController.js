const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { generateUniqueSlug } = require('../utils/slugify');
const fileService = require('../services/fileService');

const MAIN_INSIGHTS_CATEGORY = 'Insights';

const normalizeSubCategory = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'trends') return 'Trends';
  return 'Insights';
};

/**
 * Get all blog posts
 */
exports.getAllPosts = async (req, res) => {
  try {
    const { category, sub_category, published, page = 1, limit = 10 } = req.query;
    const safePage = Number.parseInt(page, 10) || 1;
    const safeLimit = Number.parseInt(limit, 10) || 10;
    const offset = (safePage - 1) * safeLimit;

    const where = ['1=1'];
    const params = [];

    if (category) {
      params.push(category);
      where.push(`category = $${params.length}`);
    }

    if (sub_category) {
      params.push(sub_category);
      where.push(`sub_category = $${params.length}`);
    }

    if (published !== undefined) {
      params.push(published === 'true');
      where.push(`published = $${params.length}`);
    }

    const queryText = `
      SELECT * FROM blog_posts
      WHERE ${where.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const result = await query(queryText, [...params, safeLimit, offset]);

    const normalizedRows = result.rows.map((post) => ({
      ...post,
      featured_image: fileService.normalizePublicUrl(post.featured_image, req)
    }));

    const countQuery = `SELECT COUNT(*) FROM blog_posts WHERE ${where.join(' AND ')}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    paginatedResponse(res, normalizedRows, safePage, safeLimit, total);
  } catch (error) {
    console.error('Get blog posts error:', error);
    errorResponse(res, 'Failed to fetch blog posts', 500);
  }
};

/**
 * Get single blog post by slug
 */
exports.getPost = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await query(
      'SELECT * FROM blog_posts WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Blog post not found', 404);
    }

    // Increment views
    await query(
      'UPDATE blog_posts SET views = views + 1 WHERE id = $1',
      [result.rows[0].id]
    );

    successResponse(res, {
      ...result.rows[0],
      featured_image: fileService.normalizePublicUrl(result.rows[0].featured_image, req)
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    errorResponse(res, 'Failed to fetch blog post', 500);
  }
};

/**
 * Create blog post
 */
exports.createPost = async (req, res) => {
  try {
    const {
      title, sub_category, author, excerpt, content,
      featured_image, tags, published = true
    } = req.body;

    const finalCategory = MAIN_INSIGHTS_CATEGORY;
    const finalSubCategory = normalizeSubCategory(sub_category);

    // Generate unique slug
    const checkSlugExists = async (slug) => {
      const result = await query('SELECT id FROM blog_posts WHERE slug = $1', [slug]);
      return result.rows.length > 0;
    };

    const slug = await generateUniqueSlug(title, checkSlugExists);

    const result = await query(
      `INSERT INTO blog_posts 
       (title, slug, category, sub_category, author, excerpt, content, featured_image, tags, published) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [title, slug, finalCategory, finalSubCategory, author, excerpt, content, featured_image, tags, published]
    );

    successResponse(res, result.rows[0], 'Blog post created successfully', 201);
  } catch (error) {
    console.error('Create blog post error:', error);
    errorResponse(res, 'Failed to create blog post', 500);
  }
};

/**
 * Update blog post
 */
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(updates, 'category')) {
      updates.category = MAIN_INSIGHTS_CATEGORY;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'sub_category')) {
      updates.sub_category = normalizeSubCategory(updates.sub_category);
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'category') && !Object.prototype.hasOwnProperty.call(updates, 'sub_category')) {
      updates.sub_category = 'Insights';
    }

    const fields = Object.keys(updates).filter((key) => key !== 'id');
    if (fields.length === 0) {
      return errorResponse(res, 'No fields provided for update', 400);
    }
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(id);

    const queryText = `
      UPDATE blog_posts 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $${values.length} 
      RETURNING *
    `;

    const result = await query(queryText, values);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Blog post not found', 404);
    }

    successResponse(res, result.rows[0], 'Blog post updated successfully');
  } catch (error) {
    console.error('Update blog post error:', error);
    errorResponse(res, 'Failed to update blog post', 500);
  }
};

/**
 * Delete blog post
 */
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Blog post not found', 404);
    }

    successResponse(res, null, 'Blog post deleted successfully');
  } catch (error) {
    console.error('Delete blog post error:', error);
    errorResponse(res, 'Failed to delete blog post', 500);
  }
};

/**
 * Toggle publish status
 */
exports.togglePublish = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE blog_posts SET published = NOT published, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Blog post not found', 404);
    }

    successResponse(res, result.rows[0], 'Publish status updated');
  } catch (error) {
    console.error('Toggle publish error:', error);
    errorResponse(res, 'Failed to update publish status', 500);
  }
};
/**
 * Get comments for a post
 */
exports.getComments = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await query(
      "SELECT id, name, message, created_at FROM inquiries WHERE type = 'comment' AND subject = $1 AND status = 'Published' ORDER BY created_at DESC",
      [slug]
    );
    successResponse(res, result.rows);
  } catch (error) {
    console.error('Get comments error:', error);
    errorResponse(res, 'Failed to fetch comments', 500);
  }
};

/**
 * Add a comment to a post
 */
exports.addComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    await query(
      "INSERT INTO inquiries (name, email, message, subject, type, status) VALUES ($1, $2, $3, $4, 'comment', 'New')",
      [name, email, message, slug]
    );

    successResponse(res, null, 'Comment submitted for review', 201);
  } catch (error) {
    console.error('Add comment error:', error);
    errorResponse(res, 'Failed to submit comment', 500);
  }
};
