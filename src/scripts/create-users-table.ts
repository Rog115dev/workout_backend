import dotenv from 'dotenv';
import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'workout',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function createUsersTable() {
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
    connection = await createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    console.log('✅ Connected to MySQL server');
    
    // Use the database
    await connection.query(`USE \`${dbConfig.database}\``);
    
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
    
    await connection.query(createTableQuery);
    console.log('✅ Table users created/verified');
    
    // Insert default test user
    const hashedPassword = await bcrypt.hash('password123', 12);
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
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [defaultUser.email]
    );
    
    if (Array.isArray(existing) && existing.length === 0) {
      await connection.execute(
        `INSERT INTO users (id, username, email, password, avatar, bio, phone, address, social) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          defaultUser.id,
          defaultUser.username,
          defaultUser.email,
          defaultUser.password,
          defaultUser.avatar,
          defaultUser.bio,
          defaultUser.phone,
          defaultUser.address,
          defaultUser.social
        ]
      );
      console.log('✅ Default user inserted');
    } else {
      console.log('ℹ️  Default user already exists, skipping insert');
    }
    
    console.log('🎉 Users table creation completed successfully!');
    
  } catch (error) {
    console.error('❌ Users table creation failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

// Run creation
createUsersTable();
