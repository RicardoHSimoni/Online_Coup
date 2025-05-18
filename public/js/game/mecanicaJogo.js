import Baralho from '../classes/baralho.js';

export function configurarPartida(sala) {
    if (sala.baralho) {
        console.log('Baralho já existe:', sala.baralho);
        return; // Se já existe, não cria um novo
    }
    else{
        const baralho = new Baralho(sala.numeroJogadores);
        console.log('Baralho criado:', baralho);
        sala.baralho = baralho; // Adiciona o baralho à sala
        distribuirCartas(sala.jogadores, sala.baralho); // Distribui as cartas para os jogadores
        console.log('Cartas distribuídas:', sala.jogadores);
        console.log('Baralho após distribuição:', sala.baralho);
    }
    
    
}

export function distribuirCartas(listaJogadores, baralho) {
    // Distribui duas cartas para cada jogador
    for (let i = 0; i < listaJogadores.length; i++) {
        const jogador = listaJogadores[i];
        jogador.cartas = baralho.cartas.splice(0, 2); // Remove as duas primeiras cartas do baralho e atribui ao jogador

    }
}