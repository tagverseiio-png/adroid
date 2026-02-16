const { query } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { generateUniqueSlug } = require('../utils/slugify');
const fileService = require('../services/fileService');

/**
 * Get all projects with filtering
 */
exports.getAllProjects = async (req, res) => {
  try {
    const { type, category, published, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM projects WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (type) {
      queryText += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

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

    const normalizedRows = result.rows.map((project) => ({
      ...project,
      cover_image: fileService.normalizePublicUrl(project.cover_image, req)
    }));

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM projects WHERE 1=1';
    const countParams = params.slice(0, -2);
    if (type) countQuery += ' AND type = $1';
    if (category) countQuery += ` AND category = $${countParams.length}`;
    if (published !== undefined) countQuery += ` AND published = $${countParams.length}`;
    
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    paginatedResponse(res, normalizedRows, page, limit, total);
  } catch (error) {
    console.error('Get projects error:', error);
    errorResponse(res, 'Failed to fetch projects', 500);
  }
};

/**
 * Get single project by slug
 */
exports.getProject = async (req, res) => {
  try {
    const { slug } = req.params;

    const projectResult = await query(
      'SELECT * FROM projects WHERE slug = $1',
      [slug]
    );

    if (projectResult.rows.length === 0) {
      return errorResponse(res, 'Project not found', 404);
    }

    // Get project images
    const imagesResult = await query(
      'SELECT * FROM project_images WHERE project_id = $1 ORDER BY display_order ASC',
      [projectResult.rows[0].id]
    );

    const project = {
      ...projectResult.rows[0],
      cover_image: fileService.normalizePublicUrl(projectResult.rows[0].cover_image, req),
      images: imagesResult.rows.map((image) => ({
        ...image,
        file_path: fileService.normalizePublicUrl(image.file_path, req),
        thumbnail_path: fileService.normalizePublicUrl(image.thumbnail_path, req)
      }))
    };

    successResponse(res, project);
  } catch (error) {
    console.error('Get project error:', error);
    errorResponse(res, 'Failed to fetch project', 500);
  }
};

/**
 * Create project
 */
exports.createProject = async (req, res) => {
  try {
    const {
      title, category, type, location, year, area, client,
      status, design_style, cover_image, description,
      highlights, scope
    } = req.body;

    // Generate unique slug
    const checkSlugExists = async (slug) => {
      const result = await query('SELECT id FROM projects WHERE slug = $1', [slug]);
      return result.rows.length > 0;
    };

    const slug = await generateUniqueSlug(title, checkSlugExists);

    const result = await query(
      `INSERT INTO projects 
       (title, slug, category, type, location, year, area, client, status, design_style, 
        cover_image, description, highlights, scope, published) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, false) 
       RETURNING *`,
      [title, slug, category, type, location, year, area, client, status, design_style,
       cover_image, description, highlights, scope]
    );

    successResponse(res, result.rows[0], 'Project created successfully', 201);
  } catch (error) {
    console.error('Create project error:', error);
    errorResponse(res, 'Failed to create project', 500);
  }
};

/**
 * Update project
 */
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return errorResponse(res, 'Invalid project ID', 400);
    }

    // List of allowed fields to update
    const allowedFields = [
      'title', 'category', 'type', 'location', 'year', 'area', 'client',
      'status', 'design_style', 'cover_image', 'description', 'published',
      'highlights', 'scope', 'is_featured', 'featured_order'
    ];

    // Filter updates to only allowed fields
    const fields = Object.keys(updates)
      .filter(key => allowedFields.includes(key) && key !== 'id');

    if (fields.length === 0) {
      return errorResponse(res, 'No valid fields to update', 400);
    }

    // Build dynamic update query with proper parameterization
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = fields.map(field => {
      // Handle type conversion for boolean fields
      if (field === 'published' || field === 'is_featured') {
        return updates[field] === true || updates[field] === 'true';
      }
      return updates[field];
    });
    
    values.push(parseInt(id));

    const queryText = `
      UPDATE projects 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $${values.length} 
      RETURNING *
    `;

    console.log('Update query:', queryText);
    console.log('Update values:', values);

    const result = await query(queryText, values);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Project not found', 404);
    }

    successResponse(res, result.rows[0], 'Project updated successfully');
  } catch (error) {
    console.error('Update project error:', error);
    errorResponse(res, `Failed to update project: ${error.message}`, 500);
  }
};

/**
 * Delete project
 */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM projects WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Project not found', 404);
    }

    successResponse(res, null, 'Project deleted successfully');
  } catch (error) {
    console.error('Delete project error:', error);
    errorResponse(res, 'Failed to delete project', 500);
  }
};

/**
 * Toggle project featured status
 */
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured, featured_order } = req.body;

    const result = await query(
      `UPDATE projects 
       SET is_featured = $1, featured_order = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING *`,
      [is_featured, featured_order || 0, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Project not found', 404);
    }

    successResponse(res, result.rows[0], 'Featured status updated successfully');
  } catch (error) {
    console.error('Toggle featured error:', error);
    errorResponse(res, 'Failed to update featured status', 500);
  }
};

/**
 * Get featured/selected projects
 */
exports.getFeaturedProjects = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const result = await query(
      `SELECT * FROM projects 
       WHERE is_featured = true AND published = true 
       ORDER BY featured_order ASC, created_at DESC 
       LIMIT $1`,
      [limit]
    );

    const normalizedRows = result.rows.map((project) => ({
      ...project,
      cover_image: fileService.normalizePublicUrl(project.cover_image, req)
    }));

    successResponse(res, normalizedRows);
  } catch (error) {
    console.error('Get featured projects error:', error);
    errorResponse(res, 'Failed to fetch featured projects', 500);
  }
};

/**
 * Add project images
 */
exports.addProjectImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body; // Array of { file_path, thumbnail_path, display_order }

    const values = images.map((img, index) => 
      `($1, '${img.file_path}', '${img.thumbnail_path || ''}', ${img.display_order || index})`
    ).join(', ');

    const queryText = `
      INSERT INTO project_images (project_id, file_path, thumbnail_path, display_order)
      VALUES ${values}
      RETURNING *
    `;

    const result = await query(queryText.replace(/\$1/g, id));

    successResponse(res, result.rows, 'Images added successfully', 201);
  } catch (error) {
    console.error('Add images error:', error);
    errorResponse(res, 'Failed to add images', 500);
  }
};
