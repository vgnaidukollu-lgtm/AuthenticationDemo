const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'crud_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    const databaseName = process.env.DB_NAME || 'crud_app';
    
    // Ensure tables exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Ensure todos.user_id column exists for legacy databases (older table without user_id)
    const [userIdCol] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'todos' AND COLUMN_NAME = 'user_id'`,
      [databaseName]
    );
    if (userIdCol.length === 0) {
      console.warn('Missing column todos.user_id detected. Altering table to add user_id (NULLable)...');
      await connection.query(`ALTER TABLE todos ADD COLUMN user_id INT NULL AFTER id`);
      // Try to add a foreign key if not present (optional)
      const [fk] = await connection.query(
        `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'todos' AND COLUMN_NAME = 'user_id' AND REFERENCED_TABLE_NAME = 'users'`,
        [databaseName]
      );
      if (fk.length === 0) {
        try {
          await connection.query(
            `ALTER TABLE todos ADD CONSTRAINT fk_todos_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL`
          );
        } catch (fkErr) {
          console.warn('Could not add foreign key for todos.user_id (continuing):', fkErr.message);
        }
      }
    }
    
    // Seed a default user for demo if not present
    const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@example.com';
    const demoPassword = process.env.DEMO_USER_PASSWORD || 'DemoPass123';
    const [existingDemo] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [demoEmail]
    );
    if (existingDemo.length === 0) {
      const hash = await bcrypt.hash(demoPassword, 10);
      const username = 'demo';
      await connection.query(
        'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
        [demoEmail, username, hash]
      );
      console.log(`Seeded demo user -> email: ${demoEmail}, password: ${demoPassword}`);
    }
    
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;
