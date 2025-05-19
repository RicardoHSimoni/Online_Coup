

export function inicializarPartidaPage(socket, sala) {

    const listaJogadores = sala.jogadores.map((jogador) => jogador.nome);
    const container = document.getElementById('containerJogadoresPartida');
    container.innerHTML = ''; // Limpa a lista atual
    listaJogadores.forEach((jogador) => {
        const div = document.createElement('div');
        div.classList.add('jogador');
        div.textContent = jogador;
        container.appendChild(div);
    });

    socket.on('atualizarDadosJogador', (data) => {
        
    });

    const jogador = sala.jogadores.find((jogador) => jogador.id === socket.id);
    if (!jogador) {
        console.error('Jogador não encontrado');
        return;
    }
    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    card1.textContent = jogador.cartas[0];
    card2.textContent = jogador.cartas[1];

    const statusEl = document.getElementById("status");
    let souMeuTurno = false;

    socket.on('turno', (jogadorId) => {
      souMeuTurno = jogadorId === socket.id;
      statusEl.textContent = souMeuTurno ? "Seu turno!" : "Aguardando turno...";
      atualizarSidebar(souMeuTurno);
    });

    document.querySelectorAll(".sidebar-item").forEach(item => {
      item.addEventListener("click", () => {
        if (!souMeuTurno) return;
        socket.emit('jogada', jogador);
      });
    });

    
}

// Desativa todos os itens da sidebar
  function desativarSidebar() {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.add('disabled');
    });
  }

  // Ativa todos os itens da sidebar
  function ativarSidebar() {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('disabled');
    });
  }

    function atualizarSidebar(ativo) {
        document.querySelectorAll(".sidebar-item").forEach(item => {
            item.classList.toggle("disabled", !ativo);
        });
    }
