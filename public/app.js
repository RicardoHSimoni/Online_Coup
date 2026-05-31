import { atualizarListaJogadoresLobby, inicializarLobbyPage } from "./js/ui/lobby.js";
import { inicializarMainPage } from "./js/ui/mainPage.js";
import { atualizarPartidaPage, selecionarJogada, jogadaSelecionada, mostrarJogada, mostrarJogadaBloqueada, mostrarJogadaContestada, selecionarJogadorAlvo, selecionarCartaPerder, selecionarCartasTrocar, mostrarTelaVitoria, adicionarLinhaLog } from "./js/ui/partida.js";

const jogadasDirecionadas = ['capitao', 'assassino', 'golpe']; // Exemplo de jogadas que precisam de alvo

const socket = io(); // Conexão global única

// Controle de telas SPA
function mostrar(tela) {
  document.querySelectorAll('.tela').forEach(div => div.style.display = 'none');
  document.getElementById(tela).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarMainPage(socket); // Inicializa a tela principal
});

socket.on('sala-criada', (salaId) => {
    mostrar('lobbyPage'); // Muda para a tela de lobby
    socket.emit("obter-sala-Lobby", salaId);
});

socket.on("dados-sala-Lobby", (sala) => {
    inicializarLobbyPage(socket, sala, iniciarPartida);
});

function iniciarPartida(salaId) {
    socket.emit('configurarPartida', salaId); // Emite o evento para configurar a partida
}


socket.on('atualizarListaJogadores', (lista) => {
  const container = document.getElementById('containerJogadoresLobby');
  container.innerHTML = ''; // Limpa a lista atual
  lista.forEach(nome => {
    const div = document.createElement('div');
    div.classList.add('jogador');
    div.textContent = nome;
    container.appendChild(div);
  });
});

socket.on('partidaConfigurada', (sala) => {
  mostrar('partidaPage'); // Muda para a tela de partida
  atualizarPartidaPage(socket, sala.jogadores); // Inicializa a tela de partida
  // O turno é iniciado automaticamente pelo servidor
});
     
socket.on('seu-turno', async (moedas, jogadores) => {
  const jogada = await selecionarJogada(socket, moedas, jogadores);
  //ToDo: Validar a jogada, atualizar o estado do jogo, etc.
  jogadaSelecionada();

  let alvo = null;

  if (jogadasDirecionadas.includes(jogada)) {
    if (jogada === 'capitao') {
      // Filtra os jogadores que têm moedas para serem roubados
      jogadores = jogadores.filter(jogador => jogador.id !== socket.id && jogador.moedas >= 2);
    }
    alvo = await selecionarJogadorAlvo(socket, jogadores);
  }

  socket.emit('jogada', jogada, alvo?.id); // Emite a jogada selecionada para o servidor
});

socket.on('escolher-carta-perder', async (dados) => {
  // Implementar lógica para mostrar a janela de escolha de carta a perder
  const carta = await selecionarCartaPerder(socket, dados.cartas);
  
  socket.emit('carta-selecionada', carta);
});

socket.on('trocarCartas', async (dados) => {
  const cartas = await selecionarCartasTrocar(socket, dados.cartas, dados.maxSelecionar);
  socket.emit('cartas-trocadas', cartas);
});

socket.on('jogador-venceu', (nomeJogador) => {
  adicionarLinhaLog(`Jogador ${nomeJogador} venceu a partida!`);
  mostrarTelaVitoria(nomeJogador);
});

socket.on('mostrar-jogada', (jogada, jogador, alvo) => {
  const oMesmo = jogador.id === socket.id;
  mostrarJogada(jogada, jogador, alvo, oMesmo);

  let mensagem = `Jogador ${jogador.nome} fez ${jogada}`;
  if (alvo) {
    mensagem += ` em ${alvo.nome}`;
  }
  adicionarLinhaLog(mensagem + '.');
});

socket.on('mostrar-jogada-bloqueada', (jogada, jogador, bloqueador, bloqueadorId) => {
  const oMesmo = bloqueadorId === socket.id;
  mostrarJogadaBloqueada(jogada, jogador, bloqueador, oMesmo);
  adicionarLinhaLog(`Jogador ${jogador} tentou ${jogada} mas foi bloqueado por ${bloqueador}.`);
});

socket.on('mostrar-jogada-contestada', (jogada, jogador, contestador) => {
  const jogadorNome = typeof jogador === 'string' ? jogador : jogador.nome;
  const contestadorNome = typeof contestador === 'string' ? contestador : contestador.nome;
  const oMesmo = typeof jogador !== 'string' && jogador.id === socket.id;
  mostrarJogadaContestada(jogada, jogador, contestador, oMesmo);
  adicionarLinhaLog(`Jogador ${jogadorNome} tentou ${jogada} mas foi contestado por ${contestadorNome}.`);
});

socket.on('jogador-perdeu-carta', (nomeJogador, carta) => {
  adicionarLinhaLog(`Jogador ${nomeJogador} perdeu a carta ${carta}.`);
});

socket.on('jogador-perdeu-contestacao', (nomeJogador, carta) => {
  adicionarLinhaLog(`Jogador ${nomeJogador} perdeu a contestação e perdeu a carta ${carta}.`);
});

socket.on('jogador-eliminado', (nomeJogador) => {
  adicionarLinhaLog(`Jogador ${nomeJogador} foi eliminado da partida.`);
});

document.addEventListener('jogada-bloquear', (event) => {
  const salaId = event.detail;
  socket.emit('jogada-bloqueada', salaId);
});

document.addEventListener('jogada-contestar', (event) => {
  const salaId  = event.detail;
  socket.emit('jogada-contestada', salaId);
});

document.addEventListener('bloqueio-contestar', (event) => {
  const salaId  = event.detail;
  socket.emit('bloqueio-contestado', salaId);
});

document.addEventListener('voltar-lobby', (event) => {
  socket.emit('voltar-lobby');
});

  

socket.on('atualizar-sala-Lobby', (jogadores) => {
  atualizarListaJogadoresLobby(jogadores); // Atualiza a lista de jogadores na tela do lobby
});

socket.on('atualizar-sala-Partida', (jogadores) => {
  // Implementar lógica para atualizar a interface da partida com os dados da sala atualizada
  atualizarPartidaPage(socket, jogadores); 
});