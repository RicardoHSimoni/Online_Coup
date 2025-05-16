import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // ou "http://127.0.0.1:5500"
    }
});

let salasAtivas = []; // guarda as salas ativas

io.on('connection', (socket) => {
    console.log('Um jogador conectou:', socket.id);

    socket.on('criar-sala', (sala) => {
        salasAtivas.push(sala); // Adiciona a nova sala à lista de salas ativas
        console.log('Sala criada:', sala);
        socket.emit('sala-criada', sala); // Envia a sala criada para o lobby
    })
   

    socket.on('novo-jogador', (data) => {
      if (data && data.nome) {
        sala.push(data); // Adiciona o jogador à sala
        console.log('Sala atual:', sala); // Exibe a sala no console
        io.emit('jogador-adicionado', sala); // Envia o ID e nome do jogador de volta para o cliente
      } else {
        console.error('Erro: Dados do jogador inválidos recebidos:', data);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Jogador saiu:', socket.id);
      sala = sala.filter(s => s.id !== socket.id);
      io.emit('jogador-removido', sala); // Atualiza a lista de jogadores para todos os clientes
    });
});
  
  server.listen(3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000');
  });