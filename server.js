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

function enviarTurnoJogador(sala) {
  sala.estado = 'AGUARDANDO_JOGADA';
  if (!sala) {
    console.error('Sala não encontrada ou indefinida em enviarTurnoJogador');
    return;
  }
  const turno = sala.turnoAtual; // Obtém o turno atual da sala
  if (sala.jogadores.length > 0) {
    console.log('Turno atual no enviarTurno:', turno);
    const jogador = sala.jogadores[turno];
    console.log('Enviando turno apenas para:', jogador.id);
    io.to(sala.id).emit('atualizar-sala-Partida', sala);
    io.to(jogador.id).emit('seu-turno', sala);
    //nao precisa atualizar a sala para os outros jogadores, pois eles só precisam saber que não é o turno deles, o que já é indicado na interface do usuário. Se quiser atualizar a sala para os outros jogadores, pode emitir um evento separado para indicar que é o turno de outro jogador, mas isso não é estritamente necessário.
    
  }
}

function proximoTurno(sala) {
  if (!sala) {
    console.error('Sala não encontrada ou indefinida em proximoTurno');
    return;
  }
  sala.turnoAtual = (sala.turnoAtual + 1) % sala.jogadores.length;
  enviarTurnoJogador(sala);
}

function iniciarJanelaReacao(sala) {
  sala.timerReacao = setTimeout(() => {
    resolverJogada(sala);
  }, 3000); // 3 segundos para bloquear/contestar
}

function resolverJogada(sala) {
  sala.estado = 'RESOLVENDO_JOGADA';

  const jogada = sala.jogadaAtual;

  if (jogada.bloqueada || jogada.contestada) {
    console.log('Jogada foi bloqueada ou contestada');
    // NÃO aplica efeito
  } else {
    aplicarEfeitoJogada(jogada);
  }

  finalizarTurno(sala);
}

function resolverContestacao(sala) {
  const jogada = sala.jogadaAtual;

  const temCarta = verificarCarta(jogada.jogador, jogada.tipo);

  if (temCarta) {
    // contestador perde carta
    penalizar(jogada.contestador);
  } else {
    // jogador mentiu
    penalizar(jogada.jogador);
    jogada.cancelada = true;
  }

  finalizarTurno(sala);
}

function aplicarEfeitoJogada(jogada) {
  const jogador = jogada.jogador;
  const alvo = jogada.alvo;

  switch (jogada.tipo) {
    case 'renda':
      jogador.moedas += 1;
      break;

    case 'ajuda':
      jogador.moedas += 2;
      break;

    case 'duque':
      jogador.moedas += 3;
      break;

    case 'capitao':
      jogador.moedas += 2;
      alvo.moedas -= 2;
      break;  

    case 'assassino':
      jogador.moedas -= 3;
      //logica para alvo escolher carta para perder
      break;

    case 'embaixador':
      // lógica para trocar cartas
      break;

    case 'golpe':
      jogador.moedas -= 7;
      //logica para alvo escolher carta para perder]
      break;

  }
}

function finalizarTurno(sala) {
  sala.jogadaAtual = null;
  sala.estado = 'PROXIMO_TURNO';

  proximoTurno(sala);
}

io.on('connection', (socket) => {

    console.log('Novo cliente conectado:', socket.id);

    socket.on('criar-sala', (nome) => {
        const sala = new Sala();
        const jogador = new Jogador(socket.id, nome); // Cria um novo jogador com o ID do socket
        
        salas.set(sala.id, sala); // Armazena a sala no mapa de salas
        jogadores.set(socket.id, jogador); // Armazena o jogador no mapa de jogadores
        
        socket.join(sala.id); // Adiciona o socket à sala do Socket.IO

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
      sala.turnoAtual = 0; // Inicia o turno no primeiro jogador
      io.to(sala.id).emit('partidaConfigurada', sala); 
      enviarTurnoJogador(sala); // Envia o turno inicial
    });

    socket.on('comecarTurno', (sala) => {
      enviarTurnoJogador(sala); // Envia o turno para os jogadores
    });

    socket.on('jogada', (salaId, jogada, alvo) => {
      const sala = salas.get(salaId);
      const jogador = jogadores.get(socket.id);
      const alvoJogador = jogadores.get(alvo);

      sala.estado = 'AGUARDANDO_REACAO';

      sala.jogadaAtual = {
        tipo: jogada,
        jogador,
        alvo: alvoJogador,
        bloqueada: false,
        contestada: false
      };

      io.to(sala.id).emit('mostrar-jogada', sala.jogadaAtual); // Emite um evento para mostrar a jogada realizada

      iniciarJanelaReacao(sala);
    }); 

    socket.on('jogada-bloqueada', (salaId) => {
      const sala = salas.get(salaId);
      const bloqueador = jogadores.get(socket.id);

      if (sala.estado !== 'AGUARDANDO_REACAO') return;

      sala.jogadaAtual.bloqueada = true;
      sala.jogadaAtual.bloqueador = bloqueador;

      clearTimeout(sala.timerReacao);

      io.to(sala.id).emit(
        'mostrar-jogada-bloqueada',
        sala.jogadaAtual
      );

      resolverJogada(sala);
    });

    socket.on('jogada-contestada', (salaId) => {
      const sala = salas.get(salaId);
      const contestador = jogadores.get(socket.id);

      if (sala.estado !== 'AGUARDANDO_REACAO') return;

      sala.jogadaAtual.contestada = true;
      sala.jogadaAtual.contestador = contestador;

      clearTimeout(sala.timerReacao);

      resolverContestacao(sala);
    });

    socket.on('jogada-renda', (salaId) => {
      const sala = salas.get(salaId);
      const jogador = jogadores.get(socket.id);
      jogador.moedas += 1; 
      console.log(`${jogador.nome} fez a jogada: Renda`);
      io.to(sala.id).emit('mostrar-jogada', 'Renda', jogador); // Emite um evento para mostrar a jogada realizada
    });

    socket.on('proximo-turno', (salaId) => {
      const sala = salas.get(salaId);
      proximoTurno(sala);
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