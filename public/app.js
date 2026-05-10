import { atualizarListaJogadoresLobby, inicializarLobbyPage } from "./js/ui/lobby.js";
import { inicializarMainPage } from "./js/ui/mainPage.js";
import { atualizarPartidaPage, selecionarJogada, jogadaSelecionada, mostrarJogada, mostrarJogadaBloqueada, mostrarJogadaContestada, selecionarJogadorAlvo, selecionarCartaPerder } from "./js/ui/partida.js";

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
  // const moedas = sala.jogadores.find(jogador => jogador.id === socket.id)?.moedas || 0; // Obtém as moedas do jogador atual
  const jogada = await selecionarJogada(moedas);
  //ToDo: Validar a jogada, atualizar o estado do jogo, etc.
  jogadaSelecionada();

  let alvo = null;

  if (jogadasDirecionadas.includes(jogada)) {
    alvo = await selecionarJogadorAlvo(socket, jogadores);
  }

  socket.emit('jogada', jogada, alvo?.id); // Emite a jogada selecionada para o servidor
});

socket.on('escolher-carta-perder', async (dados) => {
  // Implementar lógica para mostrar a janela de escolha de carta a perder
  const carta = await selecionarCartaPerder(socket, dados.cartas);
  
  socket.emit('carta-selecionada', carta);
});

socket.on('mostrar-jogada', (jogada, jogador, alvo) => {
  const oMesmo = jogador.id === socket.id;
  mostrarJogada(jogada, jogador, alvo, oMesmo);
});

document.addEventListener('jogada-bloquear', (event) => {
  const salaId = event.detail;
  socket.emit('jogada-bloqueada', salaId);
});

document.addEventListener('jogada-contestar', (event) => {
  const salaId  = event.detail;
  socket.emit('jogada-contestada', salaId);
});

socket.on('mostrar-jogada-bloqueada', (jogada, jogador, bloqueador) => {
  // Implementar lógica para mostrar que a jogada foi bloqueada, quem bloqueou, etc.
  mostrarJogadaBloqueada(jogada, jogador, bloqueador);
});

socket.on('mostrar-jogada-contestada', (jogada, jogador, contestador) => {
  // Implementar lógica para mostrar que a jogada foi contestada, quem contestou, etc.
  mostrarJogadaContestada(jogada, jogador, contestador);
});
  

socket.on('atualizar-sala-Lobby', (sala) => {
  atualizarListaJogadoresLobby(sala.jogadores); // Atualiza a lista de jogadores na tela do lobby
});

socket.on('atualizar-sala-Partida', (jogadores) => {
  // Implementar lógica para atualizar a interface da partida com os dados da sala atualizada
  atualizarPartidaPage(socket, jogadores); 
});