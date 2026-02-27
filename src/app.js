const express = require('express');
const cors = require('cors');
const http = require('http'); // 1. Requerido para Sockets
const { Server } = require('socket.io'); // 2. Requerido para Sockets
require('dotenv').config();

const app = express();
const server = http.createServer(app); // 3. Creamos el servidor HTTP envolviendo express

// 4. Configuración de Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Permite la conexión desde tu React
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// 5. Hacer que 'io' sea accesible desde los controladores
app.set('socketio', io);

// 6. Lógica de conexión de Sockets
io.on('connection', (socket) => {
  console.log('👤 Usuario conectado al chat:', socket.id);

  // El cliente se une a una sala con su ID de sesión
  socket.on('join_chat', (sessionId) => {
    socket.join(sessionId);
    console.log(`Sala establecida para sesión: ${sessionId}`);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Rutas
app.get('/', (req, res) => {
  res.send('API de Ventas e Inventario funcionando con Sockets 🚀');
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/sales', require('./routes/sales.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/chat', require('./routes/chat.routes'));

const PORT = process.env.PORT || 5000;

// 7. IMPORTANTE: Cambiamos app.listen por server.listen
server.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});