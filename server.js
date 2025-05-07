const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/iniciar-partida', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'iniciar-partida.html'));
});

let sala = []; // guarda os sockets dos jogadores

io.on('connection', (socket) => {
    console.log('Um jogador conectou:', socket.id);
   

    socket.on('novo-jogador', (data) => {
    const jogador = data
    console.log('Novo jogador:', jogador.nome);
      sala.push(jogador); // Adiciona o jogador à sala
      socket.emit('jogador-adicionado', { jogador }); // Envia o ID e nome do jogador de volta para o cliente
    });
  
    socket.on('disconnect', () => {
      console.log('Jogador saiu:', socket.id);
      sala = sala.filter(s => s.id !== socket.id);
    });
});
  
  server.listen(3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000');
  });