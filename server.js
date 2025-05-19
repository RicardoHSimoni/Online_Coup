import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { configurarPartida } from "./public/js/game/mecanicaJogo.js";

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

function enviarTurno(sala) {
  const turno = sala.turnoAtual; // Obtém o turno atual da sala
  if (sala.jogadores.length > 0) {
    console.log('Turno atual no enviarTurno:', turno);
    const jogador = sala.jogadores[turno];
    io.emit('turno', jogador.id);
  }
}


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

      if (sala) {
        sala.jogadores.push(jogador); // Adiciona o jogador à sala
        sala.numeroJogadores = sala.jogadores.length; // Atualiza o número de jogadores
        socket.emit('sala-criada', sala); // Envia a sala criada de volta para o cliente
        io.emit('atualizarListaJogadores', sala.jogadores.map(jogador => jogador.nome)); // Atualiza a lista de jogadores para todos os clientes
      } else {
        console.error('Sala não encontrada:', id);
      }
    })
   
    socket.on('configurarPartida', (sala) => {
      configurarPartida(sala); // Chama a função para configurar a partida
      io.emit('iniciarPartida', sala); 
    });

    socket.on('comecarTurno', (sala) => {
      enviarTurno(sala); // Envia o turno para os jogadores
    });

    socket.on('jogada', (jogador) => {
    console.log(`${jogador.nome} fez uma jogada`);

    const sala = salasAtivas.find(sala => sala.jogadores.some(j => j.id === jogador.id)); // Encontra a sala do jogador

    // Avança para o próximo turno
    console.log('Turno atual:', sala.turnoAtual);
    sala.turnoAtual = (sala.turnoAtual + 1) % sala.jogadores.length;
    console.log('Próximo turno:', sala.turnoAtual);
    enviarTurno(sala);
  });
    
  
});

io.on('disconnect', (socket) => {
    console.log('Cliente desconectado:', socket.id);
    // Aqui você pode adicionar lógica para remover o jogador da sala, se necessário
});
  
  server.listen(3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000');
  });