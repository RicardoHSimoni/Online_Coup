const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const baralhoOriginal = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

let sala = []; // guarda os sockets dos jogadores

io.on('connection', (socket) => {
  console.log('Um jogador conectou:', socket.id);
  sala.push(socket);

  if (sala.length === 2) {
    const baralho = embaralhar([...baralhoOriginal]);
    const jogador1Cartas = baralho.splice(0, 5);
    const jogador2Cartas = baralho.splice(0, 5);

    sala[0].emit('iniciar-partida', { suasCartas: jogador1Cartas });
    sala[1].emit('iniciar-partida', { suasCartas: jogador2Cartas });

    sala = []; // limpa a sala para próxima partida
  }

  socket.on('disconnect', () => {
    console.log('Jogador saiu:', socket.id);
    sala = sala.filter(s => s.id !== socket.id);
  });
});

server.listen(3000, () => {
  console.log('Servidor ouvindo em http://localhost:3000');
});

/*definição das cartas
var banqueiro = document.getElementById('banqueiro');
var ladrao = document.getElementById('ladrao');
var medico = document.getElementById('medico');
var assassino = document.getElementById('assassino');
var diplomata = document.getElementById('diplomata');

//definição da quantidade de cartas no baralho
let baralho;

if (numeroJogadores < 6) {
    baralho = {
        banqueiro: 3,
        ladrao: 3,
        medico: 3,
        assassino: 3,
        diplomata: 3,
    };
}
else if (numeroJogadores < 8) {
    baralho = {
        banqueiro: 4,
        ladrao: 4,
        medico: 4,
        assassino: 4,
        diplomata: 4,
    };
}
else if (numeroJogadores < 10) {
    baralho = {
        banqueiro: 5,
        ladrao: 5,
        medico: 5,
        assassino: 5,
        diplomata: 5,
    };
}*/


