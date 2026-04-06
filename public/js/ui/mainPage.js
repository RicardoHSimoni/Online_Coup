
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
    const valorSalaId = document.getElementById('salaId');
    const buttonEntrar = document.getElementById('entrarSala');
    const toggleEntrarButton = () => {
        buttonEntrar.disabled = nomeInputEntrar.value.trim() === '' || valorSalaId.value.trim() === '';
    };

    nomeInputEntrar.addEventListener('input', toggleEntrarButton);
    salaId.addEventListener('input', toggleEntrarButton);

    // Inicializa o estado do botão ao carregar a página
    toggleEntrarButton();

    // Entrada na sala
    document.getElementById('entrarSala').onclick = () => {
        
        const nome = nomeInputEntrar.value; 
        const salaIdValue = valorSalaId.value; // Garante que o ID da sala seja em maiúsculas   
        
        socket.emit('entrar-sala', {
            salaId: salaIdValue, 
            nome: nome 
        });

    };

    // Criação de sala
    document.getElementById('criarSala').onclick = () => {
        const nome = nomeInputCriar.value; // Define o nome do jogador
        socket.emit('criar-sala', nome);
    }

}
    
