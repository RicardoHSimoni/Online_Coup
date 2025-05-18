
export default class Jogador {
    constructor(){
        this.id = Math.random().toString(36).substr(2, 9); // ID único simples do jogador
        this.nome = null; // Nome do jogador
        this.cartas = []; // Cartas do jogador
        this.moedas = 2; // Moedas do jogador
    }

}

