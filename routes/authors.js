const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors');
const { validateAuthor, validateId } = require('../middleware/validation');

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     description: Retrieve a list of all authors in the database
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: A list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         description: Server error
 */
router.get('/', authorsController.getAllAuthors);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     description: Retrieve a single author by their unique ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author ID (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Author found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.get('/:id', validateId, authorsController.getAuthorById);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author
 *     description: Add a new author to the database
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *               - nationality
 *               - biography
 *             properties:
 *               name:
 *                 type: string
 *                 example: F. Scott Fitzgerald
 *               birthYear:
 *                 type: integer
 *                 example: 1896
 *               nationality:
 *                 type: string
 *                 example: American
 *               biography:
 *                 type: string
 *                 example: Francis Scott Key Fitzgerald was an American novelist.
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["The Great Gatsby", "Tender Is the Night"]
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 authorId:
 *                   type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', validateAuthor, authorsController.createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update an author
 *     description: Update an existing author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *               - nationality
 *               - biography
 *             properties:
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *               nationality:
 *                 type: string
 *               biography:
 *                 type: string
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.put('/:id', validateId, validateAuthor, authorsController.updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     description: Remove an author from the database by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author ID
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', validateId, authorsController.deleteAuthor);

module.exports = router;
