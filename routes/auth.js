const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignup:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - displayName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: mySecurePassword123
 *         displayName:
 *           type: string
 *           example: John Doe
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: mySecurePassword123
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         email:
 *           type: string
 *           example: user@example.com
 *         displayName:
 *           type: string
 *           example: John Doe
 *         authProvider:
 *           type: string
 *           enum: [local, google]
 *           example: local
 *         photo:
 *           type: string
 *           example: https://example.com/photo.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user account
 *     description: Register a new user with email and password. Password is hashed with bcrypt before storing.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    // Validation
    if (!email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Create user (password will be hashed in the User model)
    const user = await User.create({ email, password, displayName });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully. You can now log in.',
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    if (error.message === 'User with this email already exists') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     description: Authenticate user with email and password. Creates a session cookie.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Authentication error',
        message: err.message
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: info.message || 'Invalid credentials'
      });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Login failed',
          message: err.message
        });
      }
      
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          authProvider: user.authProvider,
          photo: user.photo
        }
      });
    });
  })(req, res, next);
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects user to Google login page for OAuth authentication
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback from Google after authentication
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to success or failure page
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

/**
 * @swagger
 * /auth/success:
 *   get:
 *     summary: Authentication success page
 *     description: Displays user info after successful login (Google or local)
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 */
router.get('/success', (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        _id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
        authProvider: req.user.authProvider,
        photo: req.user.photo
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

/**
 * @swagger
 * /auth/failure:
 *   get:
 *     summary: Authentication failure page
 *     description: Displays error message when authentication fails
 *     tags: [Authentication]
 *     responses:
 *       401:
 *         description: Authentication failed
 */
router.get('/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed'
  });
});

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Check authentication status
 *     description: Returns current user info if logged in, or indicates not authenticated
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns authentication status and user info if logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        _id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
        authProvider: req.user.authProvider,
        photo: req.user.photo
      }
    });
  } else {
    res.json({
      authenticated: false,
      message: 'Not logged in'
    });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     description: Logs out the current user and destroys the session
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to logout' 
      });
    }
    req.session.destroy();
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  });
});

module.exports = router;