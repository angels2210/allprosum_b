const { query } = require('../config/db');

const categoryController = {
  // Obtener todas las categorías
  getAll: async (req, res) => {
    try {
      const result = await query('SELECT * FROM categories ORDER BY name ASC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear una nueva categoría
  create: async (req, res) => {
    const { name } = req.body;
    try {
      const result = await query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING *',
        [name]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'La categoría ya existe' });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = categoryController;