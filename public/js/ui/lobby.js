// Função para inicializar a página do lobby
export function inicializarLobbyPage(socket, sala, onIniciarPartida) {
  atualizarListaJogadoresLobby(sala.jogadores); // Atualiza a lista de jogadores ao entrar no lobby

  const codigoSala = document.getElementById('codigoSala');
  codigoSala.textContent = sala.id;

  const button = document.getElementById('iniciarPartida');
  button.disabled = socket.id !== sala.vip.id; // Habilita apenas para o jogador VIP
  button.onclick = () => {
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
}