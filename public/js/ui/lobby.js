// Função para inicializar a página do lobby

export function inicializarLobbyPage(socket, sala) {
  const listaJogadores = sala.jogadores?.map(j => j.nome) || [];
  const container = document.getElementById('containerJogadoresLobby');

  listaJogadores.forEach((jogador) => {
    const div = document.createElement('div');
    div.classList.add('jogador');
    div.textContent = jogador;
    container.appendChild(div);
  });
  

  const codigoSala = document.getElementById('codigoSala');
  codigoSala.textContent = sala.id;

  const button = document.getElementById('iniciarPartida');
  //button.disabled = listajogadores.length < 2; // Desabilita o botão se houver menos de 2 jogadores
  button.onclick = () => {
    console.log('Botao iniciar partida clicado');
    socket.emit('configurarPartida', sala);
  };
}