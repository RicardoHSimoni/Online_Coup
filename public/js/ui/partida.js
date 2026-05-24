
// Duration (in milliseconds) for which the modal is displayed after a play is shown.
// Change this value to adjust how long the modal remains visible.
const MODAL_TIMEOUT_MS = 3000; // 3 seconds

const jogadasBloqueaveis = ['ajuda', 'capitao', 'assassino'];

const jogadasContestaveis = ['duque', 'capitao', 'assassino', 'condessa', 'embaixador'];

export function atualizarPartidaPage(socket, jogadores) {

    const listaJogadores = jogadores.map((jogador) => jogador.nome);
    const container = document.getElementById('containerJogadoresPartida');
    container.innerHTML = ''; // Limpa a lista atual
    jogadores.forEach((jogador) => {
        const div = document.createElement('div');
        div.classList.add('jogador');
        const nomeEl = document.createElement('div');
        nomeEl.textContent = jogador.nome;
        const moedasEl = document.createElement('div');
        moedasEl.textContent = `Moedas: ${jogador.moedas}`;
        div.appendChild(nomeEl);
        div.appendChild(moedasEl);
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

export function selecionarJogadorAlvo(socket, jogadoresSala) {
    return new Promise((resolve) => {

        const modal = document.getElementById("modal-alvo");
        const lista = document.getElementById("lista-alvos");

        // limpa lista anterior
        lista.innerHTML = "";

        const jogadores = jogadoresSala.filter(j => j.id !== socket.id);

        jogadores.forEach(jogador => {
            const btn = document.createElement("button");
            btn.classList.add("alvo-btn");
            btn.textContent = jogador.nome;

            btn.onclick = () => {
                alterarModal("modal-alvo", false);
                resolve(jogador);
            };

            lista.appendChild(btn);
        });

        alterarModal("modal-alvo", true);
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
                alterarModal("modal-escolher-carta", false);
                resolve(carta);
            };

            lista.appendChild(btn);
        });

        alterarModal("modal-escolher-carta", true);
    });

}

export function selecionarCartasTrocar(socket, cartas, maxSelecionar = 2) {
    return new Promise((resolve) => {
        const modal = document.getElementById("modal-trocar-cartas");
        const lista = document.getElementById("lista-cartas-trocar");
        const selecionadas = new Set();

        lista.innerHTML = "";

        cartas.forEach((carta, index) => {
            const btn = document.createElement("button");
            btn.classList.add("carta-trocar-btn");
            btn.textContent = carta;

            btn.onclick = () => {
                if (selecionadas.has(index)) {
                    selecionadas.delete(index);
                    btn.classList.remove("selected");
                } else if (selecionadas.size < maxSelecionar) {
                    selecionadas.add(index);
                    btn.classList.add("selected");
                }

                if (selecionadas.size === maxSelecionar) {
                    const cartasEscolhidas = Array.from(selecionadas).map(i => cartas[i]);
                    alterarModal("modal-trocar-cartas", false);
                    resolve(cartasEscolhidas);
                }
            };

            lista.appendChild(btn);
        });

        alterarModal("modal-trocar-cartas", true);
    });
}

export function selecionarJogada(socket, moedas, jogadores) {
    // ToDo: passar alguns parametros para habilitar apenas as opções de jogada válidas, como moedas, cartas, etc.
    const statusEl = document.getElementById("status");
    statusEl.textContent = "Sua vez! Selecione sua jogada.";

    const alguemPodeSerRoubado = jogadores.some(jogador => jogador.id !== socket.id && jogador.moedas >= 2);
    ativarSidebar(moedas, alguemPodeSerRoubado); // Ativa a sidebar para permitir a seleção da jogada
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
            alterarModal("modal", false);
            limparAcoesModal();
        };
    }

    if (podeContestar && !oMesmo) {
        botaoContestar.classList.remove("hidden");
        botaoContestar.onclick = () => {
            document.dispatchEvent(new CustomEvent('jogada-contestar', {
                detail: jogador.sala
            }));
            alterarModal("modal", false);
            limparAcoesModal();
        };
    }

    alterarModal("modal", true);
    setTimeout(() => {
        alterarModal("modal", false);
        limparAcoesModal();
    }, MODAL_TIMEOUT_MS);
}

export function mostrarTelaVitoria(nomeJogador) {
    console.log(`Mostrando tela de vitória para ${nomeJogador}`);
    alterarModal("modal", false);
    alterarModal("modal-alvo", false);
    alterarModal("modal-escolher-carta", false);
    limparAcoesModal();

    const modal = document.getElementById("modalFinalPartida");
    const modalText = document.getElementById("modalFinalPartida-text");
    modalText.textContent = `Jogador ${nomeJogador} venceu!`;

    modal.style.maxWidth = "90vw";
    modal.style.width = "90vw";
    modal.style.height = "auto";

    const botaoVoltar = document.getElementById("voltar");
    botaoVoltar.classList.remove("hidden");
    botaoVoltar.onclick = () => {
        document.dispatchEvent(new CustomEvent('voltar-lobby'));
        alterarModal("modalFinalPartida", false);
        modal.style.width = "";
        modal.style.maxWidth = "";
        modal.style.height = "";
        botaoVoltar.classList.add("hidden");
    };

    alterarModal("modalFinalPartida", true);
}

function limparAcoesModal() {
    const botaoBloquear = document.getElementById("bloquear");
    const botaoContestar = document.getElementById("contestar");
    botaoBloquear.classList.add("hidden");
    botaoContestar.classList.add("hidden");
    botaoBloquear.onclick = null;
    botaoContestar.onclick = null;
}

export function mostrarJogadaBloqueada(jogada, nomeJogador, nomeBloqueador, oMesmo) {
    const modalText = document.getElementById("modal-text");
    
    let mensagem = "";
    if (oMesmo) {
        mensagem = `Você tentou ${jogada}, mas foi bloqueado por ${nomeBloqueador}!`;
    } else {
        mensagem = `${nomeJogador} tentou ${jogada}, mas foi bloqueado por ${nomeBloqueador}!`;
    }
    
    modalText.textContent = mensagem;

    const botaoContestar = document.getElementById("contestar");
    
    limparAcoesModal();
    
    if (!oMesmo) {
        botaoContestar.classList.remove("hidden");  
        botaoContestar.onclick = () => {
            document.dispatchEvent(new CustomEvent('bloqueio-contestar', {
                detail: jogador.sala
            }));
            alterarModal("modal", false);
            limparAcoesModal();
        };
    }

    alterarModal("modal", true);
}

export function mostrarJogadaContestada(jogada, jogador, contestador, oMesmo) {
    const modalText = document.getElementById("modal-text");
    let mensagem;
    
    if (oMesmo) {
        mensagem = `Você tentou ${jogada}, mas foi contestado por ${contestador.nome}!`;
    } else {
        mensagem = `${jogador.nome} tentou ${jogada}, mas foi contestado por ${contestador.nome}!`;
    }
    
    modalText.textContent = mensagem;
    alterarModal("modal", true);
}

function alterarModal(modalId, abrir) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.toggle("hidden", !abrir);
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
  function ativarSidebar(moedas, alguemPodeSerRoubado) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('disabled');
      if ((item.id === 'assassino' && moedas < 3) || (item.id === 'golpe' && moedas < 7) || (item.id === 'capitao' && !alguemPodeSerRoubado)) {
        item.classList.add('disabled');
      }
    });
  }

  function atualizarSidebar(ativo) {
      document.querySelectorAll(".sidebar-item").forEach(item => {
          item.classList.toggle("disabled", !ativo);
      });
  }
