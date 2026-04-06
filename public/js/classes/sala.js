export default class Sala {
    constructor() {
        this.id = Array.from({length: 4}, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join(''); // Gera um código de 4 letras maiúsculas para a sala
        this.numeroJogadores = 0; // Número de jogadores na sala
        this.jogadores = []; // Array para armazenar os jogadores
        this.baralho = null; // Baralho da sala
        this.rodada = 0; // Rodada atual
        this.vencedores = []; // Array para armazenar os vencedores
        this.vip = null; // Jogador VIP
        this.turnoAtual = 0; // Índice do jogador que está na vez
        this.pagina = 'lobby'; // Página atual da sala (lobby ou partida)
    }
}
