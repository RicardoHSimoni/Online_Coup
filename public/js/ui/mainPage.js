import Sala from "../classes/sala.js";
import Jogador from "../classes/jogador.js";

export function inicializarMainPage(socket) {

    const nomeInputCriar = document.getElementById('nomeJogadorCriar');
    const button = document.getElementById('criarSala');
    // Habilita/desabilita o botão conforme o input
    nomeInputCriar.addEventListener('input', () => {
        button.disabled = nomeInputCriar.value.trim() === '';
    });
    // Inicializa o estado do botão ao carregar a página
    button.disabled = nomeInputCriar.value.trim() === '';

    const nomeInputEntrar = document.getElementById('nomeJogadorEntrar');
    const salaId = document.getElementById('salaId');
    const buttonEntrar = document.getElementById('entrarSala');
    const toggleEntrarButton = () => {
        buttonEntrar.disabled = nomeInputEntrar.value.trim() === '' || salaId.value.trim() === '';
    };

    nomeInputEntrar.addEventListener('input', toggleEntrarButton);
    salaId.addEventListener('input', toggleEntrarButton);

    // Inicializa o estado do botão ao carregar a página
    toggleEntrarButton();

    // Entrada na sala
    document.getElementById('entrarSala').onclick = () => {
        const jogador = new Jogador(socket.id); // Cria um novo jogador com o ID do socket
        jogador.nome = nomeInputEntrar.value; // Define o nome do jogador
        
        socket.emit('entrar-sala', {
            id: salaId.value, // ID da sala
            jogador: jogador // Jogador que está entrando
        });

    };

    // Criação de sala
    document.getElementById('criarSala').onclick = () => {
        const jogador = new Jogador(socket.id); // Cria um novo jogador com o ID do socket
        jogador.nome = nomeInputCriar.value; // Define o nome do jogador
        const sala = new Sala();
        sala.jogadores.push(jogador); // Adiciona o jogador à sala
        sala.vip = jogador; // Define o jogador como VIP
        sala.numeroJogadores = 1; // Define o número de jogadores como 1
        //console.log('Criando sala:', sala);
        // Envia a sala para o servidor
        socket.emit('criar-sala', sala);
    }

}
    
