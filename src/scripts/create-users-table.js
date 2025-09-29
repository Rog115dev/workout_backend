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
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = require("mysql2/promise");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Load environment variables
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'workout',
    port: parseInt(process.env.DB_PORT || '3306'),
};
function createUsersTable() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            console.log('🚀 Creating users table...');
            console.log('📋 Database config:', {
                host: dbConfig.host,
                port: dbConfig.port,
                user: dbConfig.user,
                database: dbConfig.database
            });
            // Connect to MySQL server
            connection = yield (0, promise_1.createConnection)({
                host: dbConfig.host,
                user: dbConfig.user,
                password: dbConfig.password,
                port: dbConfig.port
            });
            console.log('✅ Connected to MySQL server');
            // Use the database
            yield connection.query(`USE \`${dbConfig.database}\``);
            // Create users table
            const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255) DEFAULT NULL,
        bio TEXT DEFAULT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        address TEXT DEFAULT NULL,
        social JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
            yield connection.query(createTableQuery);
            console.log('✅ Table users created/verified');
            // Insert default test user
            const hashedPassword = yield bcryptjs_1.default.hash('password123', 12);
            const defaultUser = {
                id: 'user-123',
                username: 'eliouser',
                email: 'elio@movebook.com',
                password: hashedPassword,
                avatar: '/img/avatars/elio.jpg',
                bio: 'Fitness enthusiast. Love to Sport and share my journey.',
                phone: '+1-555-123-4567',
                address: '123 Fitness St, Workout City, Country',
                social: JSON.stringify({
                    twitter: '@elioIron',
                    instagram: 'elio.movebook',
                    facebook: 'elio.movebook'
                })
            };
            // Check if user already exists
            const [existing] = yield connection.execute('SELECT id FROM users WHERE email = ?', [defaultUser.email]);
            if (Array.isArray(existing) && existing.length === 0) {
                yield connection.execute(`INSERT INTO users (id, username, email, password, avatar, bio, phone, address, social) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    defaultUser.id,
                    defaultUser.username,
                    defaultUser.email,
                    defaultUser.password,
                    defaultUser.avatar,
                    defaultUser.bio,
                    defaultUser.phone,
                    defaultUser.address,
                    defaultUser.social
                ]);
                console.log('✅ Default user inserted');
            }
            else {
                console.log('ℹ️  Default user already exists, skipping insert');
            }
            console.log('🎉 Users table creation completed successfully!');
        }
        catch (error) {
            console.error('❌ Users table creation failed:', error);
            process.exit(1);
        }
        finally {
            if (connection) {
                yield connection.end();
                console.log('✅ Database connection closed');
            }
        }
    });
}
// Run creation
createUsersTable();
