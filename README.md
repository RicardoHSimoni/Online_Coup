# Online_Coup

Implementação online do jogo de blefe e estratégia **Coup**, desenvolvida com **Node.js**, **Express** e **Socket.IO**, permitindo partidas multiplayer em tempo real diretamente pelo navegador.

## Sobre o Projeto

Online Coup é uma adaptação digital do clássico jogo de cartas Coup. Os jogadores participam de partidas em salas privadas, realizam ações estratégicas, contestam adversários, bloqueiam habilidades e tentam eliminar os demais participantes até restar apenas um vencedor.

O projeto foi desenvolvido com foco em comunicação em tempo real utilizando WebSockets, permitindo uma experiência multiplayer fluida e responsiva.

---

## Funcionalidades Implementadas

### Sistema de Salas

* Criação de salas privadas.
* Entrada em salas existentes através de código.
* Controle de quantidade máxima de jogadores.
* Lobby antes do início da partida.

### Sistema de Partida

* Distribuição automática de cartas.
* Controle de turnos.
* Gerenciamento de moedas.
* Eliminação de jogadores.
* Verificação automática de vencedor.

### Mecânicas do Coup

* Renda.
* Ajuda Externa.
* Golpe.
* Impostos.
* Roubo.
* Assassinato.
* Troca de Cartas.
* Bloqueios.
* Contestações.

### Sistema de Reação

* Janela de tempo para bloqueios.
* Janela de tempo para contestações.
* Escolha de carta perdida.
* Seleção de cartas durante trocas.

### Interface

* Lobby de jogadores.
* Tela principal da partida.
* Exibição dinâmica das cartas.
* Modais de interação.
* Atualizações em tempo real para todos os participantes.

---

## Tecnologias Utilizadas

### Backend

* Node.js
* Express
* Socket.IO

### Frontend

* HTML5
* CSS3
* JavaScript ES6 Modules

### Comunicação

* WebSockets via Socket.IO

---

## Estrutura do Projeto

```text
Online_Coup
│
├── public
│   ├── assets
│   │   ├── assassino.png
│   │   ├── capitao.png
│   │   ├── condessa.png
│   │   ├── duque.png
│   │   ├── embaixador.png
│   │   └── verso.png
│   │
│   ├── css
│   │   └── style.css
│   │
│   ├── js
│   │   ├── classes
│   │   │   ├── baralho.js
│   │   │   ├── jogador.js
│   │   │   ├── jogada.js
│   │   │   └── sala.js
│   │   │
│   │   ├── game
│   │   │   └── mecanicaJogo.js
│   │   │
│   │   └── ui
│   │       ├── lobby.js
│   │       ├── mainPage.js
│   │       └── partida.js
│   │
│   ├── app.js
│   └── index.html
│
├── server.js
├── package.json
└── README.md
```

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/RicardoHSimoni/Online_Coup.git
```

Acesse a pasta do projeto:

```bash
cd Online_Coup
```

Instale as dependências:

```bash
npm install
```

---

## Executando o Projeto

Inicie o servidor:

```bash
npm start
```

Por padrão, a aplicação estará disponível em:

```text
http://localhost:3000
```

---

## Fluxo Básico da Partida

1. Um jogador cria uma sala.
2. Outros jogadores entram utilizando o código da sala.
3. O anfitrião inicia a partida.
4. Cada jogador recebe duas cartas.
5. Os turnos são executados sequencialmente.
6. Os demais jogadores podem bloquear ou contestar ações.
7. Jogadores eliminados perdem todas as cartas.
8. O último jogador restante vence a partida.

---

## Objetivos Acadêmicos

Este projeto também serve como estudo prático de:

* Programação Web Multiplayer.
* Comunicação em tempo real com WebSockets.
* Arquitetura Cliente-Servidor.
* Engenharia de Software.
* Modelagem UML.
* BPMN.
* Desenvolvimento de Jogos Digitais.

---

## Melhorias Futuras

* Chat durante a partida.
* Reconexão automática de jogadores.
* Histórico de ações.
* Sistema de ranking.
* Estatísticas de partidas.
* Responsividade para dispositivos móveis.
* Persistência de dados em banco de dados.
* Sistema de autenticação de usuários.

---

## Autor

Ricardo Henrique Simoni

Desenvolvido como projeto de estudo e pesquisa em desenvolvimento de jogos multiplayer online.
