// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const authController = {
  // Registro de Administradores/Vendedores
  register: async (req, res) => {
    const { username, password, role, seller_code } = req.body;
    try {
      // 1. Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 2. Guardar en DB
      const result = await query(
        'INSERT INTO admin_users (username, password, role, seller_code) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
        [username, hashedPassword, role || 'administrador', seller_code]
      );

      res.status(201).json({ message: 'Usuario creado', user: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Login
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await query('SELECT * FROM admin_users WHERE username = $1', [username]);
      
      if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

      const user = result.rows[0];

      // Verificar contraseña
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return res.status(401).json({ message: 'Contraseña incorrecta' });

      // Generar Token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        token,
        user: { id: user.id, username: user.username, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;