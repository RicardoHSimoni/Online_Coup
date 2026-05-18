
export default class Jogador {
    constructor(id, nome){
        this.id = id
        this.nome = nome; // Nome do jogador
        this.cartas = []; // Cartas do jogador
        this.moedas = 2; // Moedas do jogador
        this.sala = null; // Sala do jogador
        this.estaVivo = true; // Status de vida do jogador
    }

}

