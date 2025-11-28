const { ObjectId } = require('mongodb');
const { getDatabase } = require('../models/db');

// GET all authors
const getAllAuthors = async (req, res) => {
  try {
    const db = getDatabase();
    const authors = await db.collection('authors').find().toArray();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch authors', message: error.message });
  }
};

// GET single author by ID
const getAuthorById = async (req, res) => {
  try {
    const db = getDatabase();
    const authorId = req.params.id;
    
    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID format' });
    }
    
    const author = await db.collection('authors').findOne({ _id: new ObjectId(authorId) });
    
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch author', message: error.message });
  }
};

// POST create a new author
const createAuthor = async (req, res) => {
  try {
    const db = getDatabase();
    const newAuthor = {
      name: req.body.name,
      birthYear: req.body.birthYear,
      nationality: req.body.nationality,
      biography: req.body.biography,
      books: req.body.books || [],
      createdAt: new Date()
    };
    
    const result = await db.collection('authors').insertOne(newAuthor);
    
    res.status(201).json({
      message: 'Author created successfully',
      authorId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create author', message: error.message });
  }
};

// PUT update an author
const updateAuthor = async (req, res) => {
  try {
    const db = getDatabase();
    const authorId = req.params.id;
    
    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID format' });
    }
    
    const updateData = {
      name: req.body.name,
      birthYear: req.body.birthYear,
      nationality: req.body.nationality,
      biography: req.body.biography,
      books: req.body.books,
      updatedAt: new Date()
    };
    
    const result = await db.collection('authors').updateOne(
      { _id: new ObjectId(authorId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    res.status(200).json({ message: 'Author updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update author', message: error.message });
  }
};

// DELETE an author
const deleteAuthor = async (req, res) => {
  try {
    const db = getDatabase();
    const authorId = req.params.id;
    
    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID format' });
    }
    
    const result = await db.collection('authors').deleteOne({ _id: new ObjectId(authorId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete author', message: error.message });
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};