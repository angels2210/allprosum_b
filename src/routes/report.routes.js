const express = require('express');
const router = express.Router();
const commissionController = require('../controllers/commission.controller');
const verifyToken = require('../middlewares/auth.middleware');
const { query } = require('../config/db');

// Ruta para ver logs de auditoría (Solo admin)
router.get('/audit', verifyToken, async (req, res) => {
  if (req.user.role !== 'administrador') return res.status(403).json({ message: 'No autorizado' });
  const result = await query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
  res.json(result.rows);
});

// Rutas de Comisiones
router.get('/commissions/stats', verifyToken, commissionController.getAllStats);
router.get('/commissions/seller/:seller_id', verifyToken, commissionController.getSellerCommissions);

module.exports = router;