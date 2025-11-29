const { getDatabase } = require('./db');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user with hashed password
  static async create(userData) {
    const db = getDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      email: userData.email 
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash the password (10 rounds of salting)
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = {
      email: userData.email,
      password: hashedPassword,
      displayName: userData.displayName,
      authProvider: 'local', // 'local' for email/password, 'google' for OAuth
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return { ...userWithoutPassword, _id: result.insertedId };
  }
  
  // Find user by email
  static async findByEmail(email) {
    const db = getDatabase();
    return await db.collection('users').findOne({ email });
  }
  
  // Find user by ID
  static async findById(id) {
    const db = getDatabase();
    const { ObjectId } = require('mongodb');
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  }
  
  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  // Create or update Google OAuth user
  static async findOrCreateGoogleUser(profile) {
    const db = getDatabase();
    
    const email = profile.emails[0].value;
    let user = await db.collection('users').findOne({ email });
    
    if (user) {
      // Update existing user
      await db.collection('users').updateOne(
        { email },
        { 
          $set: { 
            googleId: profile.id,
            displayName: profile.displayName,
            photo: profile.photos[0].value,
            authProvider: 'google',
            updatedAt: new Date()
          } 
        }
      );
      return await db.collection('users').findOne({ email });
    } else {
      // Create new user
      const newUser = {
        googleId: profile.id,
        email: email,
        displayName: profile.displayName,
        photo: profile.photos[0].value,
        authProvider: 'google',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('users').insertOne(newUser);
      return { ...newUser, _id: result.insertedId };
    }
  }
}

module.exports = User;