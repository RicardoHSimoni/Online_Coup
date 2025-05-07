import Jogador from './jogador.js';
import Baralho from './baralho.js';

document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Conecta ao servidor Socket.IO
    const nomeInput = document.getElementById('apelido');

    nomeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const nome = nomeInput.value; // Obtém o nome do jogador
        const jogador = new Jogador(socket.id, nome); // Cria uma nova instância de Jogador
        console.log('Jogador criado:', jogador); // Exibe o jogador no console
        socket.emit('novo-jogador', { jogador }); // Envia o jogador para o servidor
      }
    });

    socket.on('jogador-adicionado', (data) => {
      console.log('Jogador adicionado:', data.jogador.nome); // Exibe o jogador adicionado no console
    });


})
