import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir o arquivo mainPage.html na pasta public
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servir arquivos estáticos da pasta 'public' (incluindo socket.io.js)
app.use(express.static(path.join(__dirname, 'public')));

let salasAtivas = []; // guarda as salas ativas

io.on('connection', (socket) => {

    console.log('Novo cliente conectado:', socket.id);

    socket.on('criar-sala', (nomeJogador) => {
       console.log('Jogador recebido no servidor:', nomeJogador);
       socket.emit('sala-criada', nomeJogador); // Envia o nome do jogador de volta para o cliente
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
  
});
  
  server.listen(3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000');
  });