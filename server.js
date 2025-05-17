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

    socket.on('criar-sala', (sala) => {
       //console.log('sala recebida no servidor:', sala);
       salasAtivas.push(sala); // Adiciona a sala à lista de salas ativas
       socket.emit('sala-criada', sala); // Envia a sala criada de volta para o cliente
    })

    socket.on('entrar-sala', (data) => {
      const { id, jogador } = data; // Desestrutura os dados recebidos

      const sala = salasAtivas.find(sala => sala.id === id); // Busca a sala pelo ID
      if (!sala) {
        console.log('Sala com id não encontrada.');
      }

      if (sala) {
        sala.jogadores.push(jogador); // Adiciona o jogador à sala
        console.log('Sala atual:', sala); // Exibe a sala no console
        socket.emit('sala-criada', sala); // Envia a sala criada de volta para o cliente
        io.emit('atualizarListaJogadores', sala.jogadores.map(jogador => jogador.nome)); // Atualiza a lista de jogadores para todos os clientes
      } else {
        console.error('Sala não encontrada:', id);
      }
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