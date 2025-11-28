const { body, param, validationResult } = require('express-validator');

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Book validation rules
const validateBook = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  
  body('author')
    .notEmpty().withMessage('Author is required')
    .isString().withMessage('Author must be a string')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Author must be between 1 and 100 characters'),
  
  body('isbn')
    .notEmpty().withMessage('ISBN is required')
    .isString().withMessage('ISBN must be a string')
    .trim()
    .isISBN().withMessage('Invalid ISBN format. Must be a valid ISBN-10 or ISBN-13.'),
  
  body('publishYear')
    .notEmpty().withMessage('Publish year is required')
    .isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Publish year must be a valid year'),
  
  body('genre')
    .notEmpty().withMessage('Genre is required')
    .isString().withMessage('Genre must be a string')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Genre must be between 1 and 50 characters'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  
  body('availableCopies')
    .notEmpty().withMessage('Available copies is required')
    .isInt({ min: 0 }).withMessage('Available copies must be a non-negative integer'),
  
  body('totalCopies')
    .notEmpty().withMessage('Total copies is required')
    .isInt({ min: 1 }).withMessage('Total copies must be a positive integer')
    .custom((value, { req }) => {
      if (value < req.body.availableCopies) {
        throw new Error('Total copies cannot be less than available copies');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Author validation rules
const validateAuthor = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  
  body('birthYear')
    .notEmpty().withMessage('Birth year is required')
    .isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Birth year must be a valid year'),
  
  body('nationality')
    .notEmpty().withMessage('Nationality is required')
    .isString().withMessage('Nationality must be a string')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Nationality must be between 1 and 50 characters'),
  
  body('biography')
    .notEmpty().withMessage('Biography is required')
    .isString().withMessage('Biography must be a string')
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Biography must be between 10 and 2000 characters'),
  
  body('books')
    .optional()
    .isArray().withMessage('Books must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        const allStrings = value.every(book => typeof book === 'string');
        if (!allStrings) {
          throw new Error('All books must be strings');
        }
      }
      return true;
    }),
  
  handleValidationErrors
];

// ID validation
const validateId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  
  handleValidationErrors
];

module.exports = {
  validateBook,
  validateAuthor,
  validateId
};