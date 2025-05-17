import Jogador from '../classes/jogador.js';

document.addEventListener('DOMContentLoaded', () => {
    const nomeInput = document.getElementById('apelido');
    
    nomeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const nome = nomeInput.value; // Obtém o nome do jogador
        const jogador = new Jogador(socket.id); // Cria uma nova instância de Jogador
        jogador.nome = nome; // Define o nome do jogador
        socket.emit('novo-jogador', jogador); // Envia o jogador para o servidor
      }
    });

    console.log('Instância do socket no lobby:', window.socket);

    if (window.socket) {
        window.socket.on('sala-criada', (sala) => {
            if (sala === undefined || sala === null) {
                console.error('Erro: parâmetro "sala" não recebido corretamente:', sala);
            } else {
                console.log('Sala criada(no lobby):', sala);
                // Atualize a interface do lobby aqui
            }
        });
        // Outros listeners do lobby
    } else {
        console.error('Erro: Instância do socket não encontrada no lobby.');
    }


    socket.on('jogador-adicionado', (data) => {
      const jogadoresList = document.getElementById('jogadores-list');
    
      if (!Array.isArray(data)) {
        console.error('Dados recebidos não são uma lista de jogadores:', data);
        return;
      }
    
      // Criar um Set com os nomes recebidos
      const novosJogadores = new Set(data.map(j => j.nome));
    
      // Criar um Set com os nomes já presentes na lista
      const itensAtuais = jogadoresList.querySelectorAll('li');
      const jogadoresAtuais = new Set();
      itensAtuais.forEach(item => jogadoresAtuais.add(item.textContent));
    
      // Remover jogadores que não estão mais na nova lista
      itensAtuais.forEach(item => {
        if (!novosJogadores.has(item.textContent)) {
          jogadoresList.removeChild(item);
        }
      });
    
      // Adicionar jogadores novos
      novosJogadores.forEach(nome => {
        if (!jogadoresAtuais.has(nome)) {
          const li = document.createElement('li');
          li.textContent = nome;
          jogadoresList.appendChild(li);
        }
      });
    });

    socket.on('jogador-removido', (data) => {
      const jogadoresList = document.getElementById('jogadores-list');
      const itensAtuais = jogadoresList.querySelectorAll('li');
    
      // Criar um Set com os nomes recebidos
      const jogadoresRemovidos = new Set(data.map(j => j.nome));
    
      // Remover jogadores que não estão mais na nova lista
      itensAtuais.forEach(item => {
        if (jogadoresRemovidos.has(item.textContent)) {
          jogadoresList.removeChild(item);
        }
      });
    });

})
