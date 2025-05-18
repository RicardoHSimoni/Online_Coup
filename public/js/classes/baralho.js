

export default class Baralho {
    constructor(numeroJogadores) {
        if (numeroJogadores <= 6) {
            this.copias = 3;
        }
        else if (numeroJogadores <= 8) {
            this.copias = 4;
        }
        else {
            this.copias = 5;
        }
        this.valores = ['assassino', 'diplomata', 'ladrao', 'medico', 'banqueiro'];
        this.cartas = [];
        this.iniciarBaralho();
        this.embaralhar();
    }

    iniciarBaralho() {
        for (let i = 0; i < this.copias; i++) {
            for (const valor of this.valores) {
                this.cartas.push(valor);
            }
        }
    }

    embaralhar() {
        for (let i = this.cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
        }
    }
}

