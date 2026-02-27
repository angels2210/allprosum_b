const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

const clientController = {
  create: async (req, res) => {
    const { name, email, password, phone, address, type } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await query(
        `INSERT INTO clients (name, email, password, phone, address, type) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email`,
        [name, email, hashedPassword, phone, address, type || 'natural']
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    const result = await query('SELECT id, name, email, type FROM clients');
    res.json(result.rows);
  }
};

module.exports = clientController;