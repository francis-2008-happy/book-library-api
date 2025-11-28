const { ObjectId } = require('mongodb');
const { getDatabase } = require('../models/db');

// GET all books
const getAllBooks = async (req, res) => {
  try {
    const db = getDatabase();
    const books = await db.collection('books').find().toArray();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books', message: error.message });
  }
};

// GET single book by ID
const getBookById = async (req, res) => {
  try {
    const db = getDatabase();
    const bookId = req.params.id;
    
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    
    const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book', message: error.message });
  }
};

// POST create a new book
const createBook = async (req, res) => {
  try {
    const db = getDatabase();
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      publishYear: req.body.publishYear,
      genre: req.body.genre,
      description: req.body.description,
      availableCopies: req.body.availableCopies,
      totalCopies: req.body.totalCopies,
      createdAt: new Date()
    };
    
    const result = await db.collection('books').insertOne(newBook);
    
    res.status(201).json({
      message: 'Book created successfully',
      bookId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book', message: error.message });
  }
};

// PUT update a book
const updateBook = async (req, res) => {
  try {
    const db = getDatabase();
    const bookId = req.params.id;
    
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    
    const updateData = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      publishYear: req.body.publishYear,
      genre: req.body.genre,
      description: req.body.description,
      availableCopies: req.body.availableCopies,
      totalCopies: req.body.totalCopies,
      updatedAt: new Date()
    };
    
    const result = await db.collection('books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.status(200).json({ message: 'Book updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book', message: error.message });
  }
};

// DELETE a book
const deleteBook = async (req, res) => {
  try {
    const db = getDatabase();
    const bookId = req.params.id;
    
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    
    const result = await db.collection('books').deleteOne({ _id: new ObjectId(bookId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book', message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};