import Baralho from "../classes/baralho.js";

export function inicializarPartidaPage(socket, sala) {
    const baralho = new Baralho(sala.numeroJogadores);
    console.log('Baralho criado:', baralho);
    sala.baralho = baralho; // Adiciona o baralho à sala
    distribuirCartas(sala.jogadores, baralho); // Distribui as cartas para os jogadores
    console.log('Cartas distribuídas:', sala.jogadores);
    console.log('Baralho após distribuição:', baralho);
    //socket.emit('iniciarPartida', sala); // Inicia a partida

    const listaJogadores = sala.jogadores.map((jogador) => jogador.nome);
    const container = document.getElementById('containerJogadoresPartida');
    container.innerHTML = ''; // Limpa a lista atual
    listaJogadores.forEach((jogador) => {
        const div = document.createElement('div');
        div.classList.add('jogador');
        div.textContent = jogador;
        container.appendChild(div);
    });

    socket.on('atualizarDadosJogador', (data) => {
        
    });

    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    card1.textContent = jogador.cartas[0];
    card2.textContent = jogador.cartas[1];

    
}

function distribuirCartas(listaJogadores, baralho) {
    // Distribui duas cartas para cada jogador
    for (let i = 0; i < listaJogadores.length; i++) {
        const jogador = listaJogadores[i];
        jogador.cartas = baralho.cartas.slice(i * 2, i * 2 + 2);
        // Para remover elementos de um array, use o método splice.
        baralho.cartas.splice(i * 2, i * 2 + 2);
    }
}