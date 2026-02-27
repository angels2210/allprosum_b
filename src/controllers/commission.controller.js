const { query } = require('../config/db');

const commissionController = {
  // Obtener comisiones de un vendedor específico
  getSellerCommissions: async (req, res) => {
    const { seller_id } = req.params;
    try {
      const result = await query(
        `SELECT c.*, o.total as order_total, o.created_at 
         FROM commissions c 
         JOIN orders o ON c.order_id = o.id 
         WHERE c.seller_id = $1 ORDER BY c.created_at DESC`,
        [seller_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Resumen general para el administrador
  getAllStats: async (req, res) => {
    try {
      const result = await query(
        `SELECT u.username, SUM(c.amount) as total_earned, COUNT(c.id) as total_sales
         FROM admin_users u
         LEFT JOIN commissions c ON u.id = c.seller_id
         GROUP BY u.id`
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = commissionController;