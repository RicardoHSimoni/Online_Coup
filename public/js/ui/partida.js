
export function atualizarPartidaPage(socket, sala) {

    const listaJogadores = sala.jogadores.map((jogador) => jogador.nome);
    const container = document.getElementById('containerJogadoresPartida');
    container.innerHTML = ''; // Limpa a lista atual
    listaJogadores.forEach((jogador) => {
        const div = document.createElement('div');
        div.classList.add('jogador');
        div.textContent = jogador;
        container.appendChild(div);
    });

    const jogador = sala.jogadores.find((jogador) => jogador.id === socket.id);
    if (!jogador) {
        console.error('Jogador não encontrado');
        return;
    }
    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    if (Array.isArray(jogador.cartas) && jogador.cartas.length >= 2) {
        card1.textContent = jogador.cartas[0];
        card2.textContent = jogador.cartas[1];
    } else {
        card1.textContent = '';
        card2.textContent = '';
        console.warn('Cartas do jogador estão ausentes ou incompletas.');
    }

    const statusEl = document.getElementById("status");
    let souMeuTurno = false;

    statusEl.textContent = "Aguardando turno...";

    desativarSidebar(); // Desativa a sidebar inicialmente


    /*socket.on('turno', (jogadorId) => {
      souMeuTurno = jogadorId === socket.id;
      statusEl.textContent = souMeuTurno ? "Seu turno!" : "Aguardando turno...";
      atualizarSidebar(souMeuTurno);
    });

    document.querySelectorAll(".sidebar-item").forEach(item => {
      item.addEventListener("click", () => {
        if (!souMeuTurno) return;
        let jogada = item.id; // Exemplo: "renda", "ajuda", etc.
        socket.emit('jogada', jogador, jogada); 
      });
    });*/
}

export function selecionarJogada() {
    // ToDo: passar alguns parametros para habilitar apenas as opções de jogada válidas, como moedas, cartas, etc.
    const statusEl = document.getElementById("status");
    statusEl.textContent = "Sua vez! Selecione sua jogada.";
    ativarSidebar(); // Ativa a sidebar para permitir a seleção da jogada
    return new Promise((resolve) => {
        document.querySelectorAll(".sidebar-item").forEach(item => {
            item.addEventListener("click", () => {
                let jogada = item.id; // Exemplo: "renda", "ajuda", etc.
                resolve(jogada); // Resolve a promessa com a jogada selecionada
            }, { once: true }); // Garante que o evento seja ouvido apenas uma vez
        });
    });
}

export function jogadaSelecionada() {
    const statusEl = document.getElementById("status");
    statusEl.textContent = "Aguardando turno...";
    desativarSidebar(); // Desativa a sidebar após a seleção da jogada
}

function atualizarDadosJogador(jogador) {
    //implementar lógica para atualizar os dados do jogador na interface, como cartas, moedas, etc.
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
