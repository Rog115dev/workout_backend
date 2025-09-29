import dotenv from 'dotenv';
import { createConnection } from 'mysql2/promise';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'workout',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function resetDatabase() {
  let connection;
  
  try {
    console.log('🔄 Resetting MySQL database...');
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
    
    // Drop and recreate database
    await connection.query(`DROP DATABASE IF EXISTS \`${dbConfig.database}\``);
    console.log(`✅ Database '${dbConfig.database}' dropped`);
    
    await connection.query(`CREATE DATABASE \`${dbConfig.database}\``);
    console.log(`✅ Database '${dbConfig.database}' created`);
    
    // Use the database
    await connection.query(`USE \`${dbConfig.database}\``);
    
    // Create user_settings table
    const createTableQuery = `
      CREATE TABLE user_settings (
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
    
    await connection.query(createTableQuery);
    console.log('✅ Table user_settings created');
    
    // Insert default settings
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
    
    await connection.execute(
      `INSERT INTO user_settings (user_id, table_colors, button_colors, favorites, languages, my_best) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        defaultSettings.userId,
        JSON.stringify(defaultSettings.tableColors),
        JSON.stringify(defaultSettings.buttonColors),
        JSON.stringify(defaultSettings.favorites),
        JSON.stringify(defaultSettings.languages),
        defaultSettings.myBest
      ]
    );
    console.log('✅ Default settings inserted for user-123');
    
    console.log('🎉 Database reset completed successfully!');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

// Run reset
resetDatabase();
