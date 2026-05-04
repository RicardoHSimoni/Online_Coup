
// Duration (in milliseconds) for which the modal is displayed after a play is shown.
// Change this value to adjust how long the modal remains visible.
const MODAL_TIMEOUT_MS = 3000; // 3 seconds

const jogadasBloqueaveis = ['ajuda', 'capitao', 'assassino'];

const jogadasContestaveis = ['duque', 'capitao', 'assassino', 'condessa', 'embaixador'];

export function atualizarPartidaPage(socket, jogadores) {

    const listaJogadores = jogadores.map((jogador) => jogador.nome);
    const container = document.getElementById('containerJogadoresPartida');
    container.innerHTML = ''; // Limpa a lista atual
    listaJogadores.forEach((jogador) => {
        const div = document.createElement('div');
        div.classList.add('jogador');
        div.textContent = jogador;
        container.appendChild(div);
    });

    const jogador = jogadores.find((jogador) => jogador.id === socket.id);
    if (!jogador) {
        console.error('Jogador não encontrado');
        return;
    }
    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    
    
    card1.textContent = jogador.cartas[0] || '';
    card2.textContent = jogador.cartas[1] || '';

    const statusEl = document.getElementById("status");
    let souMeuTurno = false;

    const moedas =  document.getElementById("moedas");
    moedas.textContent = `${jogador.moedas}`;
    

    statusEl.textContent = "Aguardando turno...";

    desativarSidebar(); // Desativa a sidebar inicialmente

}

export function selecionarJogadorAlvo(socket, jogadores) {
    return new Promise((resolve) => {

        const modal = document.getElementById("modal-alvo");
        const lista = document.getElementById("lista-alvos");

        // limpa lista anterior
        lista.innerHTML = "";

        const jogadores = jogadores.filter(j => j.id !== socket.id);

        jogadores.forEach(jogador => {
            const btn = document.createElement("button");
            btn.classList.add("alvo-btn");
            btn.textContent = jogador.nome;

            btn.onclick = () => {
                fecharModalAlvo();
                resolve(jogador);
            };

            lista.appendChild(btn);
        });

        abrirModalAlvo();
    });
}

export function selecionarCartaPerder(socket, cartas) {
    return new Promise((resolve) => {

        const modal = document.getElementById("modal-escolher-carta");
        const lista = document.getElementById("lista-cartas-perder");

        // limpa lista anterior
        lista.innerHTML = "";

        cartas.forEach(carta => {
            const btn = document.createElement("button");
            btn.classList.add("carta-perder-btn");
            btn.textContent = carta;

            btn.onclick = () => {
                fecharModalEscolherCarta();
                resolve(carta);
            };

            lista.appendChild(btn);
        });

        abrirModalEscolherCarta();
    });

}

export function selecionarJogada(moedas) {
    // ToDo: passar alguns parametros para habilitar apenas as opções de jogada válidas, como moedas, cartas, etc.
    const statusEl = document.getElementById("status");
    statusEl.textContent = "Sua vez! Selecione sua jogada.";
    ativarSidebar(moedas); // Ativa a sidebar para permitir a seleção da jogada
    return new Promise((resolve) => {
        document.querySelectorAll(".sidebar-item").forEach(item => {
            item.addEventListener("click", () => {
                let jogada = item.id; // Exemplo: "renda", "ajuda", etc
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

export function mostrarJogada(jogada, jogador, alvo, oMesmo) {
    const modalText = document.getElementById("modal-text");
    const botaoBloquear = document.getElementById("bloquear");
    const botaoContestar = document.getElementById("contestar");

    limparAcoesModal();

    let mensagem = "";

    if (oMesmo) {
        mensagem = `Você usou ${jogada}`;
    } else {
        mensagem = `${jogador.nome} usou ${jogada}`;
    }

    if (alvo) {
        mensagem += oMesmo 
          ? ` em ${alvo.nome}`
          : ` em você`; // opcional: inverter perspectiva
    }

    modalText.textContent = mensagem;

    const podeBloquear = jogadasBloqueaveis.includes(jogada);
    const podeContestar = jogadasContestaveis.includes(jogada);

    if (podeBloquear && !oMesmo) {
        botaoBloquear.classList.remove("hidden");
        botaoBloquear.onclick = () => {
            document.dispatchEvent(new CustomEvent('jogada-bloquear', {
                detail: jogador.sala
            }));
            fecharModal();
            limparAcoesModal();
        };
    }

    if (podeContestar && !oMesmo) {
        botaoContestar.classList.remove("hidden");
        botaoContestar.onclick = () => {
            document.dispatchEvent(new CustomEvent('jogada-contestar', {
                detail: jogador.sala
            }));
            fecharModal();
            limparAcoesModal();
        };
    }

    abrirModal();
    setTimeout(() => {
        fecharModal();
        limparAcoesModal();
    }, MODAL_TIMEOUT_MS);
}


function limparAcoesModal() {
    const botaoBloquear = document.getElementById("bloquear");
    const botaoContestar = document.getElementById("contestar");
    botaoBloquear.classList.add("hidden");
    botaoContestar.classList.add("hidden");
    botaoBloquear.onclick = null;
    botaoContestar.onclick = null;
}

export function mostrarJogadaBloqueada(jogada, jogador, bloqueador) {
    const modalText = document.getElementById("modal-text");
    modalText.textContent = `${jogador.nome} tentou ${jogada}, mas foi bloqueado por ${bloqueador.nome}!`;

    const botaoContestar = document.getElementById("contestar");
    botaoContestar.classList.remove("hidden");  
    botaoContestar.onclick = () => {
        document.dispatchEvent(new CustomEvent('jogada-contestar', {
            detail: jogador.sala
        }));
        fecharModal();
        limparAcoesModal();
    };

    abrirModal();
}

export function mostrarJogadaContestada(jogada, jogador, contestador) {
    const modalText = document.getElementById("modal-text");
    modalText.textContent = `${jogador.nome} tentou ${jogada}, mas foi contestado por ${contestador.nome}!`;
    abrirModal();
}

function abrirModal() {
  document.getElementById("modal").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

function abrirModalAlvo() {
    document.getElementById("modal-alvo").classList.remove("hidden");
}

function fecharModalAlvo() {
    document.getElementById("modal-alvo").classList.add("hidden");
}

function abrirModalEscolherCarta() {
    document.getElementById("modal-escolher-carta").classList.remove("hidden");
}

function fecharModalEscolherCarta() {
    document.getElementById("modal-escolher-carta").classList.add("hidden");
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

  // Ativa todos os itens da sidebar, mas habilita assassino apenas com moedas >= 3 e golpe apenas com moedas >= 7
  function ativarSidebar(moedas) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('disabled');
      if ((item.id === 'assassino' && moedas < 3) || (item.id === 'golpe' && moedas < 7)) {
        item.classList.add('disabled');
      }
    });
  }

  function atualizarSidebar(ativo) {
      document.querySelectorAll(".sidebar-item").forEach(item => {
          item.classList.toggle("disabled", !ativo);
      });
  }
