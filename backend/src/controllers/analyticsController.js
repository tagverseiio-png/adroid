const { query } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get dashboard analytics
 */
exports.getDashboard = async (req, res) => {
  try {
    // Get counts
    const projectsCount = await query('SELECT COUNT(*) as count FROM projects');
    const blogCount = await query('SELECT COUNT(*) as count FROM blog_posts');
    const inquiriesCount = await query('SELECT COUNT(*) as count FROM inquiries WHERE status = \'New\'');
    const totalViews = await query('SELECT SUM(views) as total FROM blog_posts');

    // Get recent inquiries
    const recentInquiries = await query(
      'SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5'
    );

    // Get recent projects
    const recentProjects = await query(
      'SELECT id, title, category, created_at FROM projects ORDER BY created_at DESC LIMIT 5'
    );

    const analytics = {
      stats: {
        totalProjects: parseInt(projectsCount.rows[0].count),
        totalBlogPosts: parseInt(blogCount.rows[0].count),
        newInquiries: parseInt(inquiriesCount.rows[0].count),
        totalBlogViews: parseInt(totalViews.rows[0].total) || 0
      },
      recentInquiries: recentInquiries.rows,
      recentProjects: recentProjects.rows
    };

    successResponse(res, analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    errorResponse(res, 'Failed to fetch analytics', 500);
  }
};
