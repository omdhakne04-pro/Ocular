const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'ocular_development_jwt_secret_key_2026_secure';

/**
 * Register a new user
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', normalizedEmail)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
      })
      .select('id, name, email, created_at')
      .single();

    if (insertError) {
      console.error('[Auth] Error inserting new user:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create user account.',
      });
    }

    // Issue JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during registration.',
    });
  }
}

/**
 * Authenticate existing user & return JWT
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, name, email, password_hash, created_at')
      .eq('email', normalizedEmail)
      .single();

    if (findError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials.',
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials.',
      });
    }

    // Issue JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during login.',
    });
  }
}

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
async function getMe(req, res) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('[Auth Me Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile.',
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
};
