const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { generateUniqueSlug } = require('../utils/slugify');
const fileService = require('../services/fileService');

/**
 * Get all blog posts
 */
exports.getAllPosts = async (req, res) => {
  try {
    const { category, published, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category) {
      queryText += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (published !== undefined) {
      queryText += ` AND published = $${paramIndex}`;
      params.push(published === 'true');
      paramIndex++;
    }

    queryText += ' ORDER BY created_at DESC';
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    const normalizedRows = result.rows.map((post) => ({
      ...post,
      featured_image: fileService.normalizePublicUrl(post.featured_image, req)
    }));

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM blog_posts WHERE 1=1';
    const countParams = params.slice(0, -2);
    if (category) countQuery += ' AND category = $1';
    if (published !== undefined) countQuery += ` AND published = $${countParams.length}`;
    
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    paginatedResponse(res, normalizedRows, page, limit, total);
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
      title, category, author, excerpt, content,
      featured_image, tags, published = true
    } = req.body;

    // Generate unique slug
    const checkSlugExists = async (slug) => {
      const result = await query('SELECT id FROM blog_posts WHERE slug = $1', [slug]);
      return result.rows.length > 0;
    };

    const slug = await generateUniqueSlug(title, checkSlugExists);

    const result = await query(
      `INSERT INTO blog_posts 
       (title, slug, category, author, excerpt, content, featured_image, tags, published) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [title, slug, category, author, excerpt, content, featured_image, tags, published]
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
    const updates = req.body;

    const fields = Object.keys(updates).filter(key => key !== 'id');
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
