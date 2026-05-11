class Jogada {
    constructor(tipo, jogador, alvo = null, carta = null) {
        this.tipo = tipo; // ex: 'taxação', 'assassinato', 'bloqueio', 'coup'
        this.jogador = jogador;
        this.alvo = alvo;
        this.carta = carta;
        this.data = new Date();
        this.bloqueada = false;
        this.bloqueador = null;
        this.contestada = false;
        this.contestador = null;
        this.cartaJaPerdida = false; // Para controlar se a carta já foi perdida após um bloqueio ou contestação
    }

    toJSON() {
        return {
            tipo: this.tipo,
            jogador: this.jogador,
            alvo: this.alvo,
            carta: this.carta,
            data: this.data.toISOString(),
        };
    }

    static fromJSON(data) {
        const jogada = new Jogada(data.tipo, data.jogador, data.alvo, data.carta);
        jogada.data = new Date(data.data);
        return jogada;
    }

    descricao() {
        if (this.alvo) {
            return `${this.jogador} fez ${this.tipo} em ${this.alvo}`;
        }
        return `${this.jogador} fez ${this.tipo}`;
    }
}

export default Jogada;
