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
  if (!sala) {
    console.error('Sala não encontrada ou indefinida em enviarTurnoJogador');
    return;
  }
  sala.estado = 'AGUARDANDO_JOGADA';
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

function perderCarta(jogador) {
  if (jogador.cartas.length > 0) {
    const sala = salas.get(jogador.sala);
    iniciarJanelaReacaoEscolherCarta(sala); // Inicia a janela de reação para escolher a carta a perder
    io.to(jogador.id).emit('escolher-carta-perder', { cartas: jogador.cartas }); // Envia um evento para o jogador escolher a carta a perder

    if (jogador.cartas.length === 0) {
      // Jogador eliminado, pode implementar lógica adicional aqui (ex: remover da sala, etc.)
      console.log(`${jogador.nome} foi eliminado!`);
    }
  }
}

function iniciarJanelaReacao(sala) {
  sala.timerReacao = setTimeout(() => {
    resolverJogada(sala);
  }, 3000); // 3 segundos para bloquear/contestar
}

function iniciarJanelaReacaoEscolherCarta(sala) {
  sala.timerReacao = setTimeout(() => {
    // Se o jogador não escolher a carta a tempo, penaliza ele automaticamente (perde a carta mais à direita, por exemplo)
    const jogador = sala.jogadaAtual.alvo;
    perderCartaAutomatico(jogador);
    finalizarTurno(sala);
  }, 10000); // 10 segundos para escolher a carta a perder
}

function perderCartaAutomatico(jogador) {
  jogador.cartas.pop();
}


function resolverJogada(sala) {
  const jogada = sala.jogadaAtual;

  // Se precisa perder carta e ainda não perdeu
  if (
    (jogada.tipo === 'assassino' || jogada.tipo === 'golpe') &&
    !jogada.cartaJaPerdida
  ) {
    jogada.cartaJaPerdida = true;

    perderCarta(jogada.alvo);
    return; // ⛔ PARA aqui
  }

  // Agora sim resolve de verdade
  aplicarEfeitoJogada(jogada);

  finalizarTurno(sala);
}

function resolverContestacao(sala) {
  const jogada = sala.jogadaAtual;

  const temCarta = verificarCarta(jogada.jogador, jogada.tipo);

  if (temCarta) {
    // contestador perde carta
    perderCarta(jogada.contestador);
  } else {
    // jogador mentiu
    perderCarta(jogada.jogador);
    jogada.cancelada = true;
  }

  finalizarTurno(sala);
}

function verificarCarta(jogador, tipo) {
  return jogador.cartas.includes(tipo);
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
      console.log('Jogada é direcionada, aplicando efeito e fazendo alvo perder carta');
      break;

    case 'embaixador':
      // TODO: lógica para trocar cartas
      break;

    case 'golpe':
      jogador.moedas -= 7;
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

      if (!sala) return;
      if (sala.estado !== 'AGUARDANDO_JOGADA') return;

      sala.estado = 'AGUARDANDO_REACAO';

      sala.jogadaAtual = {
        tipo: jogada,
        jogador,
        alvo: alvoJogador,
        bloqueada: false,
        contestada: false,
        cartaJaPerdida: false
      };

      io.to(sala.id).emit('mostrar-jogada', jogada, jogador, alvoJogador); // Emite um evento para mostrar a jogada realizada

      iniciarJanelaReacao(sala);
    }); 

    socket.on('carta-selecionada', (carta) => {

      const jogador = jogadores.get(socket.id);

      const sala = salas.get(jogador.sala);

      clearTimeout(sala.timerReacao); // Limpa o timer de reação para escolher carta

      // Remove a carta selecionada do jogador
      const index = jogador.cartas.indexOf(carta);
      if (index > -1) {
        jogador.cartas.splice(index, 1);
        console.log(`${jogador.nome} perdeu a carta: ${carta}`);
      } else {
        console.warn(`Carta ${carta} não encontrada para o jogador ${jogador.nome}`);
      } 
      
      resolverJogada(sala);

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
        sala.jogadaAtual.tipo,
        sala.jogadaAtual.jogador,
        sala.jogadaAtual.bloqueador
      );

      finalizarTurno(sala);
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