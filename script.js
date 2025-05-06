const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const Baralho = require('./baralho.js'); // Importa a classe Baralho

app.use(express.static(path.join(__dirname, 'public')));

var baralho = new Baralho(6);
console.log(baralho.cartas); // Exibe as cartas do baralho no console

app.get('/iniciar-partida', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'iniciar-partida.html'));
});



let sala = []; // guarda os sockets dos jogadores

io.on('connection', (socket) => {
  console.log('Um jogador conectou:', socket.id);
  sala.push(socket);


  if ( sala.length === 2) {

    sala[0].emit('iniciar-partida', { suasCartas: jogador1Cartas });
    sala[1].emit('iniciar-partida', { suasCartas: jogador2Cartas });
    const jogador1Cartas = baralho.cartas.splice(0, 5);
    const jogador2Cartas = baralho.cartas.splice(0, 5);
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
// Removido código duplicado de definição de baralho, pois já existe uma instância de Baralho
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


