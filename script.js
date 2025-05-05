// Seleciona o botão e o parágrafo pelo ID
const botao = document.getElementById('botao');
const mensagem = document.getElementById('mensagem');

// Adiciona um evento de clique ao botão
botao.addEventListener('click', () => {
    mensagem.textContent = 'Você clicou no botão! 🎉';
    botao.style.backgroundColor = '#28a745'; // Muda a cor do botão
});