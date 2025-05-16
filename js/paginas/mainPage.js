import Sala from "../classes/sala.js";
import Jogador from "../classes/jogador.js";

document.addEventListener('DOMContentLoaded', () => {
    const criarSala = document.getElementById('criarSala');

    criarSala.addEventListener('click', () => {
        const jogador = new Jogador();

        const sala = new Sala();
        sala.id = Array.from({length: 4}, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join(''); // Gera um código de 4 letras maiúsculas para a sala
        sala.vip = jogador; // Define o jogador como VIP
        sala.numeroJogadores = 1; // Define o número de jogadores como 1
        sala.jogadores.push(jogador); // Adiciona o jogador à sala

        const socket = io(); // Conecta ao servidor Socket.IO
        socket.emit('criar-sala', sala); // Envia a sala para o servidor
        window.location.href = `lobby.html?sala=${sala.id}`;
    });

    const input = document.getElementById('salaId');
    const btn = document.getElementById('entrarSala');
    input.addEventListener('input', () => {
        btn.disabled = input.value.trim() === '';
    });

    btn.addEventListener('click', () => {
        
    });


    

})