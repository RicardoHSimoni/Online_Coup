import Sala from "../classes/sala.js";
import Jogador from "../classes/jogador.js";

export function inicializarMainPage(socket) {

    const nomeInputCriar = document.getElementById('nomeJogadorCriar');
    const button = document.getElementById('criarSala');
    // Habilita/desabilita o botão conforme o input
    nomeInputCriar.addEventListener('input', () => {
        button.disabled = nomeInputCriar.value.trim() === '';
    });

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
        console.log('Você clicou no botão de entrar na sala');
    };

    // Criação de sala
    document.getElementById('criarSala').onclick = () => {
        console.log('Você clicou no botão de criar sala');
        socket.emit('criar-sala', nomeJogadorCriar.value);
    }

}
    // const criarSala = document.getElementById('criarSala');

    // criarSala.addEventListener('click', () => {
    //     const jogador = new Jogador();

    //     const sala = new Sala();
    //     sala.id = Array.from({length: 4}, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join(''); // Gera um código de 4 letras maiúsculas para a sala
    //     sala.vip = jogador; // Define o jogador como VIP
    //     sala.numeroJogadores = 1; // Define o número de jogadores como 1
    //     sala.jogadores.push(jogador); // Adiciona o jogador à sala

    //     console.log('Criando sala:', sala);
    //     window.socket.emit('criar-sala', sala); // Envia a sala para o servidor
    //     window.location.href = `lobby.html?sala=${sala.id}`;
    // });

    // const input = document.getElementById('salaId');
    // const btn = document.getElementById('entrarSala');
    // input.addEventListener('input', () => {
    //     btn.disabled = input.value.trim() === '';
    // });

    // btn.addEventListener('click', () => {
    //     console.log('Entrando na sala:', input.value);
    // });


    

