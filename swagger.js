const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Library API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing a book library system with books and authors collections. This API provides full CRUD operations with validation and error handling.',
      contact: {
        name: 'API Support',
        email: 'support@booklibrary.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://your-app-name.onrender.com',
        description: 'Production server (update this when you deploy)'
      }
    ],
    tags: [
      {
        name: 'Books',
        description: 'Operations related to books management'
      },
      {
        name: 'Authors',
        description: 'Operations related to authors management'
      }
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          required: ['title', 'author', 'isbn', 'publishYear', 'genre', 'description', 'availableCopies', 'totalCopies'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              description: 'Title of the book',
              minLength: 1,
              maxLength: 200,
              example: 'The Great Gatsby'
            },
            author: {
              type: 'string',
              description: 'Author of the book',
              minLength: 1,
              maxLength: 100,
              example: 'F. Scott Fitzgerald'
            },
            isbn: {
              type: 'string',
              description: 'International Standard Book Number',
              example: '978-0743273565'
            },
            publishYear: {
              type: 'integer',
              description: 'Year the book was published',
              minimum: 1000,
              example: 1925
            },
            genre: {
              type: 'string',
              description: 'Genre/category of the book',
              minLength: 1,
              maxLength: 50,
              example: 'Classic Fiction'
            },
            description: {
              type: 'string',
              description: 'Brief description of the book',
              minLength: 10,
              maxLength: 1000,
              example: 'A classic American novel set in the Jazz Age.'
            },
            availableCopies: {
              type: 'integer',
              description: 'Number of copies currently available',
              minimum: 0,
              example: 5
            },
            totalCopies: {
              type: 'integer',
              description: 'Total number of copies owned',
              minimum: 1,
              example: 5
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the book was added'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the book was last updated'
            }
          }
        },
        Author: {
          type: 'object',
          required: ['name', 'birthYear', 'nationality', 'biography'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'Full name of the author',
              minLength: 1,
              maxLength: 100,
              example: 'F. Scott Fitzgerald'
            },
            birthYear: {
              type: 'integer',
              description: 'Year the author was born',
              minimum: 1000,
              example: 1896
            },
            nationality: {
              type: 'string',
              description: 'Nationality of the author',
              minLength: 1,
              maxLength: 50,
              example: 'American'
            },
            biography: {
              type: 'string',
              description: 'Brief biography of the author',
              minLength: 10,
              maxLength: 2000,
              example: 'Francis Scott Key Fitzgerald was an American novelist and short story writer.'
            },
            books: {
              type: 'array',
              description: 'List of notable books by this author',
              items: {
                type: 'string'
              },
              example: ['The Great Gatsby', 'Tender Is the Night']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the author was added'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the author was last updated'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Failed to fetch books'
            },
            message: {
              type: 'string',
              description: 'Detailed error message',
              example: 'Database connection failed'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation failed'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string',
                    example: 'Title is required'
                  },
                  param: {
                    type: 'string',
                    example: 'title'
                  },
                  location: {
                    type: 'string',
                    example: 'body'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;