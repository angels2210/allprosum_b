const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Rutas para el Cliente
router.post('/send', chatController.sendMessage);
router.get('/history/:session_id', chatController.getHistory);

// Rutas para el Administrador (Protegidas)
router.get('/pending', verifyToken, chatController.getPendingChats);
router.post('/admin-reply', verifyToken, chatController.adminReply);

module.exports = router;