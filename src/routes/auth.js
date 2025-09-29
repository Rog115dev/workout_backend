"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const promise_1 = require("mysql2/promise");
const router = express_1.default.Router();
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
function getConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, promise_1.createConnection)({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port,
            database: dbConfig.database
        });
    });
}
// Helper function to create user profile (without password)
function createUserProfile(user) {
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
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
// POST /auth/register
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, confirmPassword } = req.body;
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
        const connection = yield getConnection();
        // Check if user already exists
        const [existingUsers] = yield connection.execute('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            yield connection.end();
            return res.status(409).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        // Create user
        const [result] = yield connection.execute(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword]);
        const insertResult = result;
        const userId = insertResult.insertId;
        // Get created user
        const [users] = yield connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
        const user = users[0];
        const userProfile = createUserProfile(user);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        yield connection.end();
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userProfile,
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}));
// POST /auth/login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        const connection = yield getConnection();
        // Find user by email
        const [users] = yield connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (!Array.isArray(users) || users.length === 0) {
            yield connection.end();
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const user = users[0];
        // Verify password
        const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            yield connection.end();
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const userProfile = createUserProfile(user);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        yield connection.end();
        res.json({
            success: true,
            message: 'Login successful',
            user: userProfile,
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}));
// GET /auth/profile
router.get('/profile', exports.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield getConnection();
        const [users] = yield connection.execute('SELECT * FROM users WHERE id = ?', [req.user.userId]);
        if (!Array.isArray(users) || users.length === 0) {
            yield connection.end();
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const user = users[0];
        const userProfile = createUserProfile(user);
        yield connection.end();
        res.json({
            success: true,
            user: userProfile
        });
    }
    catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}));
// PUT /auth/profile
router.put('/profile', exports.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, bio, phone, address, social } = req.body;
        const connection = yield getConnection();
        // Check if email is already taken by another user
        if (email) {
            const [existingUsers] = yield connection.execute('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.userId]);
            if (Array.isArray(existingUsers) && existingUsers.length > 0) {
                yield connection.end();
                return res.status(409).json({
                    success: false,
                    message: 'Email is already taken by another user'
                });
            }
        }
        // Check if username is already taken by another user
        if (username) {
            const [existingUsers] = yield connection.execute('SELECT id FROM users WHERE username = ? AND id != ?', [username, req.user.userId]);
            if (Array.isArray(existingUsers) && existingUsers.length > 0) {
                yield connection.end();
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
            yield connection.end();
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        updateValues.push(req.user.userId);
        yield connection.execute(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
        // Get updated user
        const [users] = yield connection.execute('SELECT * FROM users WHERE id = ?', [req.user.userId]);
        const user = users[0];
        const userProfile = createUserProfile(user);
        yield connection.end();
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: userProfile
        });
    }
    catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}));
// PUT /auth/password
router.put('/password', exports.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
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
        const connection = yield getConnection();
        // Get current user
        const [users] = yield connection.execute('SELECT password FROM users WHERE id = ?', [req.user.userId]);
        if (!Array.isArray(users) || users.length === 0) {
            yield connection.end();
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const user = users[0];
        // Verify current password
        const isValidPassword = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            yield connection.end();
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        // Hash new password
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 12);
        // Update password
        yield connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.user.userId]);
        yield connection.end();
        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    }
    catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}));
exports.default = router;
