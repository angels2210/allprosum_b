// src/config/init-db.js
const { pool } = require('./db');

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY, 
      name VARCHAR(255) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY, 
      name VARCHAR(255) NOT NULL, 
      description TEXT, 
      price DECIMAL(10,2) NOT NULL, 
      image_url TEXT, 
      stock INTEGER DEFAULT 0, 
      category VARCHAR(255), 
      commission_rate DECIMAL(4,2) DEFAULT 0.05
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY, 
      username VARCHAR(255) UNIQUE NOT NULL, 
      password VARCHAR(255) NOT NULL, 
      role VARCHAR(50) DEFAULT 'administrador', 
      seller_code VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role VARCHAR(50) NOT NULL, 
      permission VARCHAR(50) NOT NULL, 
      PRIMARY KEY (role, permission)
    );

    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY, 
      name VARCHAR(255) NOT NULL, 
      email VARCHAR(255) UNIQUE NOT NULL, 
      password VARCHAR(255) NOT NULL, 
      phone VARCHAR(50), 
      address TEXT, 
      type VARCHAR(50) DEFAULT 'natural', 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY, 
      client_id INTEGER REFERENCES clients(id), 
      customer_name VARCHAR(255) NOT NULL, 
      customer_phone VARCHAR(50) NOT NULL, 
      customer_id_number VARCHAR(50), 
      business_name VARCHAR(255), 
      address TEXT, 
      manager_name VARCHAR(255), 
      seller_name_code VARCHAR(50), 
      total DECIMAL(10,2) NOT NULL, 
      payment_method VARCHAR(50) NOT NULL, 
      payment_reference VARCHAR(255), 
      payment_receipt TEXT, 
      credit_days INTEGER, 
      status VARCHAR(50) DEFAULT 'pending', 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      seller_id INTEGER REFERENCES admin_users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY, 
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, 
      product_id INTEGER REFERENCES products(id), 
      quantity INTEGER, 
      price DECIMAL(10,2), 
      name VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS commissions (
      id SERIAL PRIMARY KEY, 
      order_id INTEGER REFERENCES orders(id), 
      seller_id INTEGER REFERENCES admin_users(id), 
      amount DECIMAL(10,2), 
      status VARCHAR(50) DEFAULT 'pending', 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY, 
      session_id VARCHAR(255) NOT NULL, 
      role VARCHAR(50) NOT NULL, 
      content TEXT NOT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY, 
      user_id INTEGER REFERENCES admin_users(id), 
      username VARCHAR(255), 
      action VARCHAR(255) NOT NULL, 
      details TEXT, 
      ip_address VARCHAR(50), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(255) PRIMARY KEY, 
      value TEXT
    );
  `;

  try {
    await pool.query(queryText);
    console.log("🚀 Todas las tablas han sido creadas exitosamente.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creando las tablas:", err);
    process.exit(1);
  }
};

createTables();