import { atualizarListaJogadoresLobby, inicializarLobbyPage } from "./js/ui/lobby.js";
import { inicializarMainPage } from "./js/ui/mainPage.js";
import { inicializarPartidaPage } from "./js/ui/partida.js";


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

socket.on('iniciarPartida', (salaId) => {
  mostrar('partidaPage'); // Muda para a tela de partida
  socket.emit("obter-sala-Partida", salaId);
});

socket.on("dados-sala-Partida", (sala) => {
  inicializarPartidaPage(socket, sala, comecarTurno); // Inicializa a tela de partida
  
});

function comecarTurno(sala) {
  socket.emit('comecarTurno', sala); // Emite o evento para começar o turno
}
     
socket.on('atualizar-sala-Lobby', (sala) => {
  atualizarListaJogadoresLobby(sala.jogadores); // Atualiza a lista de jogadores na tela do lobby
});

socket.on('atualizar-sala-Partida', (sala) => {
  // Implementar lógica para atualizar a interface da partida com os dados da sala atualizada
  atualizarListaJogadoresPartida(sala.jogadores); 
});