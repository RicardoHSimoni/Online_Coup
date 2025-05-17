export default class Sala {
    constructor(id) {
        this.id = id; // ID da sala
        this.numeroJogadores = 0; // Número de jogadores na sala
        this.jogadores = []; // Array para armazenar os jogadores
        this.baralho = null; // Baralho da sala
        this.rodada = 0; // Rodada atual
        this.vencedores = []; // Array para armazenar os vencedores
        this.vip = null; // Jogador VIP
    }
}
