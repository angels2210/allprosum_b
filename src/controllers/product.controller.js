const { query } = require('../config/db');

const productController = {
  // Listar todos los productos
  getAll: async (req, res) => {
    try {
      const result = await query('SELECT * FROM products ORDER BY id DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear producto
  create: async (req, res) => {
    const { name, description, price, image_url, stock, category, commission_rate } = req.body;
    try {
      const result = await query(
        `INSERT INTO products (name, description, price, image_url, stock, category, commission_rate) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, description, price, image_url, stock || 0, category, commission_rate || 0.05]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar Stock (Ruta crítica para ventas)
  updateStock: async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body; // Puede ser positivo o negativo
    try {
      const result = await query(
        'UPDATE products SET stock = stock + $1 WHERE id = $2 RETURNING *',
        [quantity, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productController;