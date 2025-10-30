const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Minimal register/login only
const config = require('../config');

// Register endpoint (minimal validation)
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'This email is already registered' });
    }

    const username = email.split('@')[0];
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hash]
    );

    const token = jwt.sign({ userId: result.insertId }, config.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: result.insertId, email, username }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Minimal auth: login is exposed

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    console.log('User lookup result:', { found: users.length > 0 });

    if (users.length === 0) {
      console.log('No user found with email:', email);
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const user = users[0];
    console.log('Found user:', { id: user.id, email: user.email });

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', validPassword);
    
    if (!validPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Token generated successfully');

        // Prepare user data for response
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username || email.split('@')[0]
    };
    console.log('Sending response:', { user: userData, hasToken: !!token });

    // Send success response
    res.status(200).json({
      success: true,
      token,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      error: 'Login failed. Please try again.'
    });
  }
});

// Logout (no-op for JWT; client should discard token)
router.post('/logout', async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: true });
  }
});


module.exports = router;