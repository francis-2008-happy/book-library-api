const { MongoClient } = require('mongodb');
require('dotenv').config();

let database;

const connectToDatabase = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    database = client.db('bookLibrary');
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not connected!');
  }
  return database;
};

module.exports = { connectToDatabase, getDatabase };