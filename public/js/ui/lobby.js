let lobbyStartButton = null;
let lobbySocketId = null;
let lobbyVipId = null;

function atualizarBotaoIniciar(jogadores) {
  if (!lobbyStartButton) return;
  const quantidade = jogadores?.length || 0;
  lobbyStartButton.disabled = lobbySocketId !== lobbyVipId || quantidade < 2;
}

// Função para inicializar a página do lobby
export function inicializarLobbyPage(socket, sala, onIniciarPartida) {
  lobbySocketId = socket.id;
  lobbyVipId = sala.vip;
  lobbyStartButton = document.getElementById('iniciarPartida');

  atualizarListaJogadoresLobby(sala.jogadores); // Atualiza a lista de jogadores ao entrar no lobby
  atualizarBotaoIniciar(sala.jogadores);

  const codigoSala = document.getElementById('codigoSala');
  codigoSala.textContent = sala.id;

  lobbyStartButton.onclick = () => {
    console.log('Botao iniciar partida clicado');
    onIniciarPartida(sala.id);
  };
}

// Função para atualizar a lista de jogadores
export function atualizarListaJogadoresLobby(jogadores) {
  const listaJogadores = jogadores?.map(j => j.nome) || [];
  const container = document.getElementById('containerJogadoresLobby');
  
  // Limpa a lista atual
  container.innerHTML = '';
  
  // Adiciona os jogadores atualizados
  listaJogadores.forEach((jogador) => {
    const div = document.createElement('div');
    div.classList.add('jogador');
    div.textContent = jogador;
    container.appendChild(div);
  });

  atualizarBotaoIniciar(jogadores);
}