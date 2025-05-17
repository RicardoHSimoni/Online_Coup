import { inicializarMainPage } from "./js/ui/mainPage.js";

const socket = io(); // Conexão global única

// Controle de telas SPA
function mostrar(tela) {
  document.querySelectorAll('.tela').forEach(div => div.style.display = 'none');
  document.getElementById(tela).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarMainPage(socket); // Inicializa a tela principal
});

socket.on('sala-criada', (nomeJogador) => {
    mostrar('lobbyPage'); // Muda para a tela de lobby
    console.log('jogador que chegou no lobby', nomeJogador);
});
   

// Enviar mensagem
document.getElementById('enviar').onclick = () => {
  const msg = document.getElementById('msg').value;
  if (msg.trim()) {
    socket.emit('mensagem', msg);
    document.getElementById('msg').value = '';
  }
};

// Receber mensagens
socket.on('mensagem', (texto) => {
  const div = document.createElement('div');
  div.textContent = texto;
  document.getElementById('mensagens').appendChild(div);
});
