const { query } = require('../config/db');

const chatController = {
  // Envío de mensaje desde el cliente
  sendMessage: async (req, res) => {
    const { session_id, content } = req.body;
    const message = content.toLowerCase();
    
    const transferKeywords = ['humano', 'ayuda', 'soporte', 'vendedor', 'atención'];
    const wantsHuman = transferKeywords.some(keyword => message.includes(keyword));

    try {
      await query(
        'INSERT INTO chat_messages (session_id, role, content, needs_attention) VALUES ($1, $2, $3, $4)',
        [session_id, 'user', content, wantsHuman]
      );

      let responseMessage = wantsHuman 
        ? "He notificado a un asesor. Por favor, espera un momento." 
        : "Hola, soy el asistente automático. Escribe 'Soporte' para hablar con una persona.";

      await query(
        'INSERT INTO chat_messages (session_id, role, content, needs_attention) VALUES ($1, $2, $3, $4)',
        [session_id, 'model', responseMessage, wantsHuman]
      );

      res.json({ response: responseMessage, transfered: wantsHuman });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener chats que piden humano (Para el Admin)
  getPendingChats: async (req, res) => {
    try {
      const result = await query(
        `SELECT DISTINCT ON (session_id) session_id, content, created_at 
         FROM chat_messages 
         WHERE needs_attention = true 
         ORDER BY session_id, created_at DESC`
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Respuesta manual del administrador
  adminReply: async (req, res) => {
    const { session_id, content } = req.body;
    const io = req.app.get('socketio');

    try {
      const result = await query(
        'INSERT INTO chat_messages (session_id, role, content, needs_attention) VALUES ($1, $2, $3, $4) RETURNING *',
        [session_id, 'admin', content, true]
      );

      if (io) {
        io.to(session_id).emit('receive_message', result.rows[0]);
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener historial de una sesión
  getHistory: async (req, res) => {
    const { session_id } = req.params;
    try {
      const result = await query(
        'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
        [session_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = chatController;