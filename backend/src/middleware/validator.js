const { body, param, validationResult } = require('express-validator');

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(e => e.msg).join(', ');
    console.error('Validation failed:', errorMessages);
    console.error('Request body:', req.body);
    return res.status(400).json({
      success: false,
      message: errorMessages || 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Project validation rules
const validateProject = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('type').isIn(['ARCHITECTURE', 'INTERIOR']).withMessage('Invalid project type'),
  body('location').optional().trim(),
  body('year').optional().trim(),
  body('area').optional().trim(),
  validate
];

// Blog validation rules
const validateBlog = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('excerpt').optional().trim(),
  body('category').optional().trim(),
  body('author').optional().trim(),
  validate
];

// Inquiry validation rules
const validateInquiry = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('phone').optional().trim(),
  body('subject').optional().trim(),
  validate
];

// Login validation rules
const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

module.exports = {
  validate,
  validateProject,
  validateBlog,
  validateInquiry,
  validateLogin
};
