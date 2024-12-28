// server.js (Node.js)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY; // misma clave que en Flask

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Token requerido'));
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return next(new Error('Token inválido'));
    socket.user_id = decoded.user_id;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.user_id}`);
  socket.on('message', (msg) => {
    io.emit('message', { user: socket.user_id, message: msg });
  });
});

server.listen(4000, () => console.log('Servidor Node.js en puerto 4000'));
