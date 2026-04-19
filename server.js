import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { configurarPartida } from "./public/js/game/mecanicaJogo.js";
import Sala from "./public/js/classes/sala.js";
import Jogador from "./public/js/classes/jogador.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const jogadores = new Map(); // socket.id -> jogador
const salas = new Map();     // salaId -> sala

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

    socket.on('criar-sala', (nome) => {
        const sala = new Sala();
        const jogador = new Jogador(socket.id, nome); // Cria um novo jogador com o ID do socket
        
        salas.set(sala.id, sala); // Armazena a sala no mapa de salas
        jogadores.set(socket.id, jogador); // Armazena o jogador no mapa de jogadores
        
        socket.join(sala.id); // Adiciona o socket à sala do Socket.IO
        console.log(`Socket ${socket.id} criou e entrou na sala ${sala.id}. Sockets na sala:`, Array.from(io.sockets.adapter.rooms.get(sala.id) || []));

        jogador.sala = sala.id; // Define a sala do jogador
        sala.jogadores.push(jogador); // Adiciona o jogador à sala
        sala.vip = jogador; // Define o jogador como VIP
        sala.numeroJogadores = 1; // Define o número de jogadores como 1
        //salasAtivas.push(sala); // Adiciona a sala à lista de salas ativas
        socket.emit('sala-criada', sala.id); // Envia a sala criada de volta para o cliente
    })

    socket.on('entrar-sala', ({ salaId, nome }) => {
      const sala = salas.get(salaId); // Busca a sala pelo ID

      if (sala) {
        const jogador = new Jogador(socket.id, nome); // Cria um novo jogador com o ID do socket e o nome recebido
        jogadores.set(socket.id, jogador);
        jogador.sala = salaId; // Define a sala do jogador
        sala.jogadores.push(jogador); // Adiciona o jogador à sala
        sala.numeroJogadores = sala.jogadores.length; // Atualiza o número de jogadores
        socket.join(sala.id); // Adiciona o socket à sala do Socket.IO
        console.log(`Socket ${socket.id} entrou na sala ${sala.id}. Sockets na sala:`, Array.from(io.sockets.adapter.rooms.get(sala.id) || []));
        io.to(sala.id).emit('atualizar-sala-Lobby', sala); // Atualiza a lista de jogadores para todos os clientes
        socket.emit('sala-criada', sala.id); // Envia a sala criada de volta para o cliente
        
      } else {
        console.error('Sala não encontrada:', salaId);
      } 
    })

    socket.on("obter-sala-Lobby", (salaId) => {
      const sala = salas.get(salaId);
      socket.emit("dados-sala-Lobby", sala);
    }); 

    socket.on("obter-sala-Partida", (salaId) => {
      const sala = salas.get(salaId);
      socket.emit("dados-sala-Partida", sala);
    });
   
    socket.on('configurarPartida', (salaId) => {
      const sala = salas.get(salaId);
      configurarPartida(sala); // Chama a função para configurar a partida
      console.log('Sala configurada:', sala);
      io.to(sala.id).emit('iniciarPartida', sala); 
    });

    socket.on('comecarTurno', (sala) => {
      enviarTurno(sala); // Envia o turno para os jogadores
    });

    socket.on('jogada', (jogador, jogada) => {
      console.log(`${jogador.nome} fez uma jogada: ${jogada}`);

      const sala = salas.get(jogador.sala); // Obtém a sala do jogador

      // Avança para o próximo turno
      console.log('Turno atual:', sala.turnoAtual);
      sala.turnoAtual = (sala.turnoAtual + 1) % sala.jogadores.length;
      console.log('Próximo turno:', sala.turnoAtual);
      enviarTurno(sala);
    });

    socket.on("disconnect", () => {
      const jogador = jogadores.get(socket.id);
    
      if (!jogador) return;

      const sala = salas.get(jogador.sala);

      if (sala) {
        console.log(`Removendo jogador da sala ${sala.id}`);
        sala.jogadores = sala.jogadores.filter(j => j.id !== socket.id);

        if (sala.jogadores.length === 0) {
            console.log(`Sala ${sala.id} deletada (sem jogadores)`);
            salas.delete(sala.id);
        } else {
            console.log(`Atualizando sala ${sala.id}: ${sala.jogadores.length} jogadores restantes`);
            if(sala.pagina === 'lobby') {
              io.to(sala.id).emit("atualizar-sala-Lobby", sala);
            } else if(sala.pagina === 'partida') {
              io.to(sala.id).emit("atualizar-sala-Partida", sala);
            }
        }
      }

      jogadores.delete(socket.id);
    });
    
  
});

  
  server.listen(3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000');
  });