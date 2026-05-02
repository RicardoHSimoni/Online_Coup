import { atualizarListaJogadoresLobby, inicializarLobbyPage } from "./js/ui/lobby.js";
import { inicializarMainPage } from "./js/ui/mainPage.js";
import { atualizarPartidaPage, selecionarJogada, jogadaSelecionada, mostrarJogada, mostrarJogadaBloqueada, mostrarJogadaContestada, selecionarJogadorAlvo } from "./js/ui/partida.js";


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
  atualizarPartidaPage(socket, sala); // Inicializa a tela de partida
  // O turno é iniciado automaticamente pelo servidor
});
     
socket.on('seu-turno', async (sala) => {
  let moedas = sala.jogadores.find(jogador => jogador.id === socket.id)?.moedas || 0; // Obtém as moedas do jogador atual
  const jogada = await selecionarJogada(moedas);
  //ToDo: Validar a jogada, atualizar o estado do jogo, etc.
  jogadaSelecionada();

  let alvo = null;

  if (['capitao', 'assassino', 'golpe'].includes(jogada)) {
    alvo = await selecionarJogadorAlvo(socket, sala);
  }

  socket.emit('jogada', sala.id, jogada, alvo?.id); // Emite a jogada selecionada para o servidor
});

  
socket.on('mostrar-jogada', (jogadaAtual) => {
  mostrarJogada(jogadaAtual.tipo, jogadaAtual.jogador, jogadaAtual.alvo);
});

document.addEventListener('jogada-bloquear', (event) => {
  const salaId = event.detail;
  socket.emit('jogada-bloqueada', salaId);
});

document.addEventListener('jogada-contestar', (event) => {
  const salaId  = event.detail;
  socket.emit('jogada-contestada', salaId);
});

socket.on('mostrar-jogada-bloqueada', (jogadaAtual) => {
  // Implementar lógica para mostrar que a jogada foi bloqueada, quem bloqueou, etc.
  mostrarJogadaBloqueada(jogadaAtual.tipo, jogadaAtual.jogador, jogadaAtual.bloqueador);
});

socket.on('mostrar-jogada-contestada', (jogadaAtual) => {
  // Implementar lógica para mostrar que a jogada foi contestada, quem contestou, etc.
  mostrarJogadaContestada(jogadaAtual.tipo, jogadaAtual.jogador, jogadaAtual.contestador);
});
  


socket.on('atualizar-sala-Lobby', (sala) => {
  atualizarListaJogadoresLobby(sala.jogadores); // Atualiza a lista de jogadores na tela do lobby
});

socket.on('atualizar-sala-Partida', (sala) => {
  // Implementar lógica para atualizar a interface da partida com os dados da sala atualizada
  atualizarListaJogadoresPartida(sala.jogadores); 
});