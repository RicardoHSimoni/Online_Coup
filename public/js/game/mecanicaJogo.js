import Baralho from '../classes/baralho.js';

export function configurarPartida(sala) {
    if (sala.baralho) {
        console.log('Baralho já existe:', sala.baralho);
        return; // Se já existe, não cria um novo
    }
    else{
        const baralho = new Baralho(sala.numeroJogadores);
        sala.baralho = baralho; // Adiciona o baralho à sala
        distribuirCartas(sala.jogadores, sala.baralho); // Distribui as cartas para os jogadores
        sala.rodada = 1; // Inicia a rodada
        sala.turnoAtual = 0; // Inicia o turno
        inicializarJogadores(sala.jogadores); // Define as moedas iniciais para os jogadores
    }
}

export function distribuirCartas(listaJogadores, baralho) {
    // Distribui duas cartas para cada jogador
    for (let i = 0; i < listaJogadores.length; i++) {
        const jogador = listaJogadores[i];
        jogador.cartas = baralho.cartas.splice(0, 2); // Remove as duas primeiras cartas do baralho e atribui ao jogador

    }
}

export function inicializarJogadores(listaJogadores) {
    // Define as moedas iniciais para cada jogador
    for (let i = 0; i < listaJogadores.length; i++) {
        const jogador = listaJogadores[i];
        jogador.moedas = 2; // Cada jogador começa com 2 moedas
        jogador.estaVivo = true; // Define o status de vivo para cada jogador
    }
}