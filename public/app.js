import { inicializarLobbyPage } from "./js/ui/lobby.js";
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

socket.on('sala-criada', (sala) => {
    mostrar('lobbyPage'); // Muda para a tela de lobby
    inicializarLobbyPage(socket, sala); // Inicializa a tela de lobby
    //console.log('sala no lobby', sala);
});

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


socket.on('iniciarPartida', (sala) => {
  mostrar('partidaPage'); // Muda para a tela de partida
  console.log('sala no partida', sala);
  inicializarPartidaPage(socket, sala); // Inicializa a tela de partida
  


});
     
