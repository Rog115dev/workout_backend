import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createConnection } from 'mysql2/promise';
import { User, UserProfile, LoginRequest, RegisterRequest, AuthResponse, ProfileUpdateRequest, PasswordChangeRequest } from '../types/auth';

const router = express.Router();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'workout',
  port: parseInt(process.env.DB_PORT || '3306'),
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Helper function to get database connection
async function getConnection() {
  return await createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port,
    database: dbConfig.database
  });
}

// Helper function to create user profile (without password)
function createUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    phone: user.phone,
    address: user.address,
    social: user.social,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

// Middleware to verify JWT token
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword }: RegisterRequest = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const connection = await getConnection();

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      await connection.end();
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [result] = await connection.execute(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword]
    );

    const insertResult = result as any;
    const userId = insertResult.insertId;

    // Get created user
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    const user = (users as User[])[0];
    const userProfile = createUserProfile(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await connection.end();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userProfile,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const connection = await getConnection();

    // Find user by email
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      await connection.end();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = (users as User[])[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await connection.end();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const userProfile = createUserProfile(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await connection.end();

    res.json({
      success: true,
      message: 'Login successful',
      user: userProfile,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /auth/profile
router.get('/profile', authenticateToken, async (req: any, res) => {
  try {
    const connection = await getConnection();

    const [users] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = (users as User[])[0];
    const userProfile = createUserProfile(user);

    await connection.end();

    res.json({
      success: true,
      user: userProfile
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /auth/profile
router.put('/profile', authenticateToken, async (req: any, res) => {
  try {
    const { username, email, bio, phone, address, social }: ProfileUpdateRequest = req.body;
    const connection = await getConnection();

    // Check if email is already taken by another user
    if (email) {
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.userId]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        await connection.end();
        return res.status(409).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    // Check if username is already taken by another user
    if (username) {
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, req.user.userId]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        await connection.end();
        return res.status(409).json({
          success: false,
          message: 'Username is already taken by another user'
        });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (social !== undefined) {
      updateFields.push('social = ?');
      updateValues.push(JSON.stringify(social));
    }

    if (updateFields.length === 0) {
      await connection.end();
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(req.user.userId);

    await connection.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated user
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.user.userId]
    );

    const user = (users as User[])[0];
    const userProfile = createUserProfile(user);

    await connection.end();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userProfile
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /auth/password
router.put('/password', authenticateToken, async (req: any, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword }: PasswordChangeRequest = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const connection = await getConnection();

    // Get current user
    const [users] = await connection.execute(
      'SELECT password FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = (users as User[])[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      await connection.end();
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await connection.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, req.user.userId]
    );

    await connection.end();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
