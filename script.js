/**
 * Jogo da Memória - Lógica Principal
 * 
 * Este script gerencia toda a interatividade do jogo, incluindo:
 * - Geração e embaralhamento das cartas
 * - Controle de cliques e verificação de pares
 * - Contagem de movimentos e tempo
 * - Detecção de fim de jogo
 */

// --- Configuração e Dados ---

// Lista de emojis para usar nas cartas (8 pares = 16 cartas no total)
const cardEmojis = ['🚀', '🌟', '🎮', '🍕', '🐱', '🌺', '💎', '🎈'];

// Duplica o array para formar os pares
const cardsArray = [...cardEmojis, ...cardEmojis];

// --- Estado do Jogo ---

let firstCard = null;        // Armazena a primeira carta clicada da rodada
let secondCard = null;       // Armazena a segunda carta clicada da rodada
let lockBoard = false;       // Impede cliques enquanto verifica pares
let moves = 0;               // Contador de movimentos
let matchedPairs = 0;        // Contador de pares encontrados
let timerInterval = null;    // Referência para o setInterval do tempo
let seconds = 0;             // Segundos decorridos
let gameStarted = false;     // Flag para iniciar o timer no primeiro clique

// --- Referências do DOM ---

const gameBoard = document.getElementById('game-board');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const victoryModal = document.getElementById('victory-modal');
const finalTimeElement = document.getElementById('final-time');
const finalMovesElement = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

// --- Funções Principais ---

/**
 * Inicializa ou reinicia o jogo.
 */
function initGame() {
    // Resetar variáveis de estado
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedPairs = 0;
    seconds = 0;
    gameStarted = false;

    // Atualizar UI
    movesElement.textContent = moves;
    timerElement.textContent = '00:00';
    victoryModal.classList.add('hidden');
    victoryModal.classList.remove('visible');
    
    // Parar timer anterior se houver
    stopTimer();

    // Limpar tabuleiro e gerar novas cartas
    gameBoard.innerHTML = '';
    createCards();
}

/**
 * Cria as cartas HTML, embaralha e adiciona ao tabuleiro.
 */
function createCards() {
    // 1. Embaralhar o array
    shuffle(cardsArray);

    // 2. Gerar HTML para cada carta
    cardsArray.forEach((emoji, index) => {
        // Cria container da carta
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.pair = emoji; // Identificador do par
        card.dataset.id = index;   // Identificador único (opcional, mas bom pra debug)

        // Cria frente da carta (com emoji)
        const frontFace = document.createElement('div');
        frontFace.classList.add('card-face', 'card-back'); // card-back é a face com o conteúdo
        frontFace.textContent = emoji;

        // Cria verso da carta (padrão visível inicialmente)
        const backFace = document.createElement('div');
        backFace.classList.add('card-face', 'card-front'); // card-front é o verso "escondido"
        backFace.textContent = '?';

        // Monta a estrutura
        card.appendChild(frontFace);
        card.appendChild(backFace);

        // Adiciona evento de clique
        card.addEventListener('click', flipCard);

        // Adiciona ao tabuleiro
        gameBoard.appendChild(card);
    });
}

/**
 * Algoritmo Fisher-Yates para embaralhamento imparcial.
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Lógica executada ao clicar em uma carta.
 */
function flipCard() {
    // Impede clique se tabuleiro bloqueado ou se clicar na mesma carta
    if (lockBoard) return;
    if (this === firstCard) return;

    // Inicia timer no primeiro clique
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    // Adiciona classe para rotacionar
    this.classList.add('flip');

    if (!firstCard) {
        // Primeiro clique da rodada
        firstCard = this;
        return;
    }

    // Segundo clique da rodada
    secondCard = this;
    incrementMoves();
    checkForMatch();
}

/**
 * Verifica se as duas cartas viradas são iguais.
 */
function checkForMatch() {
    const isMatch = firstCard.dataset.pair === secondCard.dataset.pair;

    isMatch ? disableCards() : unflipCards();
}

/**
 * Chamada quando as cartas são iguais.
 * Mantém viradas, remove eventos e verifica vitória.
 */
function disableCards() {
    // Marca visualmente como combinadas (opcional)
    firstCard.classList.add('match');
    secondCard.classList.add('match');

    // Remove listener para evitar cliques futuros
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++; // Incrementa pares encontrados

    resetBoard(); // Prepara para próxima rodada

    // Verifica fim de jogo
    if (matchedPairs === cardEmojis.length) {
        setTimeout(endGame, 500);
    }
}

/**
 * Chamada quando as cartas são diferentes.
 * Aguarda um pouco e desvira as cartas.
 */
function unflipCards() {
    lockBoard = true; // Bloqueia tabuleiro durante o delay

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard(); // Desbloqueia e limpa referências
    }, 1000); // 1 segundo de delay
}

/**
 * Reseta as variáveis de controle da rodada.
 */
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

/**
 * Incrementa contador de movimentos e atualiza UI.
 */
function incrementMoves() {
    moves++;
    movesElement.textContent = moves;
}

// --- Controle de Tempo ---

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(totalSeconds) {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${pad(min)}:${pad(sec)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

// --- Fim de Jogo ---

function endGame() {
    stopTimer();
    
    // Atualiza modal com stats finais
    finalTimeElement.textContent = formatTime(seconds);
    finalMovesElement.textContent = moves;

    // Exibe modal
    victoryModal.classList.remove('hidden');
    // Pequeno delay para permitir transição CSS se necessário
    setTimeout(() => victoryModal.classList.add('visible'), 10);
}

// --- Event Listeners Globais ---

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// --- Inicialização Automática ---

document.addEventListener('DOMContentLoaded', initGame);
