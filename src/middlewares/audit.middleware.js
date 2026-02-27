const { query } = require('../config/db');

const logAction = (action) => {
  return async (req, res, next) => {
    // Guardamos la respuesta original para saber si la acción fue exitosa
    const originalSend = res.send;
    
    res.send = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user ? req.user.id : null;
        const username = req.user ? req.user.username : 'Sistema';
        const details = `Método: ${req.method} en ${req.originalUrl}`;
        const ip = req.ip || req.connection.remoteAddress;

        query(
          'INSERT INTO audit_logs (user_id, username, action, details, ip_address) VALUES ($1, $2, $3, $4, $5)',
          [userId, username, action, details, ip]
        ).catch(err => console.error('Error en auditoría:', err));
      }
      originalSend.call(this, body);
    };
    next();
  };
};

module.exports = logAction;