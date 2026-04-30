import { atualizarListaJogadoresLobby, inicializarLobbyPage } from "./js/ui/lobby.js";
import { inicializarMainPage } from "./js/ui/mainPage.js";
import { atualizarPartidaPage, selecionarJogada, jogadaSelecionada, mostrarJogada, mostrarJogadaBloqueada } from "./js/ui/partida.js";


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
  console.log('Partida configurada com a sala:', sala);
  mostrar('partidaPage'); // Muda para a tela de partida
  atualizarPartidaPage(socket, sala); // Inicializa a tela de partida
  // O turno é iniciado automaticamente pelo servidor
});
     
socket.on('seu-turno', (sala) => {
  console.log('Recebido evento de turno para a sala:', sala.id);
  selecionarJogada().then(jogada => {
    console.log('Jogada selecionada:', jogada);
    //ToDo: Validar a jogada, atualizar o estado do jogo, etc.
    jogadaSelecionada();
    socket.emit('jogada', sala.id, jogada); // Emite a jogada selecionada para o servidor
  });
});
  
socket.on('mostrar-jogada', (jogada, jogador) => {
  mostrarJogada(jogada, jogador);
  //socket.emit('proximo-turno', jogador.sala); // Emite um evento para avançar para o próximo turno
});

socket.on('mostrar-jogada-bloqueada', (jogada, jogador, bloqueador) => {
  // Implementar lógica para mostrar que a jogada foi bloqueada, quem bloqueou, etc.
  mostrarJogadaBloqueada(jogada, jogador, bloqueador);
});
  


socket.on('atualizar-sala-Lobby', (sala) => {
  atualizarListaJogadoresLobby(sala.jogadores); // Atualiza a lista de jogadores na tela do lobby
});

socket.on('atualizar-sala-Partida', (sala) => {
  // Implementar lógica para atualizar a interface da partida com os dados da sala atualizada
  atualizarListaJogadoresPartida(sala.jogadores); 
});