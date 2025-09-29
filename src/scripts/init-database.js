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
// Load environment variables
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'workout',
    port: parseInt(process.env.DB_PORT || '3306'),
};
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            console.log('🚀 Initializing MySQL database...');
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
            // Create database if it doesn't exist
            yield connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
            console.log(`✅ Database '${dbConfig.database}' created/verified`);
            // Use the database
            yield connection.query(`USE \`${dbConfig.database}\``);
            // Create user_settings table
            const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        table_colors JSON NOT NULL,
        button_colors JSON NOT NULL,
        favorites JSON NOT NULL,
        languages JSON NOT NULL,
        my_best TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
            yield connection.query(createTableQuery);
            console.log('✅ Table user_settings created/verified');
            // Insert default settings for testing
            const defaultSettings = {
                userId: 'user-123',
                tableColors: {
                    workoutHome: {
                        header: '#f7f7f7',
                        active: '#fef9c3',
                        alter: '#e1e1e1',
                        textTh: '#000000',
                        textTd: '#000000'
                    },
                    workouts: {
                        header: '#e0e0e0',
                        active: '#fef9c3',
                        alter: '#e1e1e1',
                        textTh: '#000000',
                        textTd: '#000000'
                    },
                    moveframes: {
                        header: '#e0e0e0',
                        active: '#fef9c3',
                        alter: '#e1e1e1',
                        textTh: '#000000',
                        textTd: '#000000'
                    },
                    movelaps: {
                        header: '#e0e0e0',
                        active: '#fef9c3',
                        alter: '#e1e1e1',
                        textTh: '#000000',
                        textTd: '#000000'
                    }
                },
                buttonColors: {
                    add: '#4ade80',
                    edit: '#60a5fa',
                    delete: '#f87171'
                },
                favorites: [],
                languages: ['English', 'Spanish'],
                myBest: ''
            };
            // Check if user already exists
            const [existing] = yield connection.execute('SELECT id FROM user_settings WHERE user_id = ?', [defaultSettings.userId]);
            if (Array.isArray(existing) && existing.length === 0) {
                yield connection.execute(`INSERT INTO user_settings (user_id, table_colors, button_colors, favorites, languages, my_best) 
         VALUES (?, ?, ?, ?, ?, ?)`, [
                    defaultSettings.userId,
                    JSON.stringify(defaultSettings.tableColors),
                    JSON.stringify(defaultSettings.buttonColors),
                    JSON.stringify(defaultSettings.favorites),
                    JSON.stringify(defaultSettings.languages),
                    defaultSettings.myBest
                ]);
                console.log('✅ Default settings inserted for user-123');
            }
            else {
                console.log('ℹ️  User settings already exist, skipping default insert');
            }
            console.log('🎉 Database initialization completed successfully!');
        }
        catch (error) {
            console.error('❌ Database initialization failed:', error);
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
// Run initialization
initializeDatabase();
