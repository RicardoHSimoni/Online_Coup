import Jogador from '../classes/jogador.js';
import Sala from '../classes/sala.js';

export function inicializarLobbyPage(socket, sala) {
  const listajogadores = sala.jogadores.map((jogador) => jogador.nome);
  const container = document.getElementById('containerJogadores');

  listajogadores.forEach((jogador) => {
    const div = document.createElement('div');
    div.classList.add('jogador');
    div.textContent = jogador;
    container.appendChild(div);
  });

  const codigoSala = document.getElementById('codigoSala');
  codigoSala.textContent = sala.id;

  const button = document.getElementById('iniciarPartida');
  button.disabled = listajogadores.length < 2; // Desabilita o botão se houver menos de 2 jogadores
  button.onclick = () => {
    socket.emit('iniciarPartida', sala);
  };
  



}