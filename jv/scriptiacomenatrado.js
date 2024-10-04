const board = document.getElementById('game-board'); 
// Seleciona o elemento HTML que contém o tabuleiro do jogo.

const cells = document.querySelectorAll('.cell'); 
// Seleciona todas as células do tabuleiro.

const resetButton = document.getElementById('reset-button'); 
// Seleciona o botão de reset.

let currentPlayer = 'X'; 
// Define o jogador atual, começando pelo 'X'.

let gameActive = true; 
// Controla se o jogo está ativo ou se já acabou.

let boardState = ['', '', '', '', '', '', '', '', '']; 
// Representa o estado atual do tabuleiro, armazenando as jogadas.

const winningConditions = [ 
// Define as condições de vitória com base nos índices das células.
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target; 
    // Identifica a célula clicada.

    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index')); 
    // Obtém o índice da célula clicada.

    if (boardState[clickedCellIndex] !== '' || !gameActive) { 
    // Verifica se a célula já foi jogada ou se o jogo acabou.
        return; 
        // Se sim, não faz nada.
    }

    updateCell(clickedCell, clickedCellIndex); 
    // Atualiza a célula clicada com a jogada do jogador atual.

    checkResult(); 
    // Verifica se alguém ganhou ou houve empate.

    if (gameActive) {
        switchPlayer(); 
        // Alterna o jogador.

        if (currentPlayer === 'O') { 
        // Se for a vez da IA, faz a jogada após um tempo.
            setTimeout(makeAIMove, 500); 
            // Pequeno atraso para parecer natural.
        }
    }
}

function updateCell(cell, index) { 
// Atualiza o conteúdo visual da célula e o estado do tabuleiro.
    boardState[index] = currentPlayer; 
    // Marca a jogada no estado do tabuleiro.
    cell.textContent = currentPlayer; 
    // Mostra a jogada na célula.
}

function switchPlayer() { 
// Alterna o jogador entre 'X' e 'O'.
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkResult() { 
// Verifica se há uma condição de vitória ou empate.
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];

        if (a === '' || b === '' || c === '') { 
        // Se algum dos espaços está vazio, continua a verificação.
            continue;
        }
        if (a === b && b === c) { 
        // Se todas as três células forem iguais, houve uma vitória.
            roundWon = true;
            break;
        }
    }

    if (roundWon) { 
    // Se alguém ganhou, o jogo para e uma mensagem aparece.
        gameActive = false;
        setTimeout(() => alert(`Jogador ${currentPlayer} venceu!`), 10);
        return;
    }

    let roundDraw = !boardState.includes(''); 
    // Verifica se todas as células estão preenchidas (empate).
    if (roundDraw) {
        gameActive = false;
        setTimeout(() => alert('Empate!'), 10);
        return;
    }
}

function makeAIMove() { 
// Faz a jogada da IA usando o algoritmo minimax.
    const bestMove = minimax(boardState, 'O').index; 
    // Calcula o melhor movimento.

    const cell = document.querySelector(`.cell[data-index='${bestMove}']`); 
    // Seleciona a célula correspondente ao melhor movimento.

    updateCell(cell, bestMove); 
    // Atualiza o tabuleiro com o movimento da IA.

    checkResult(); 
    // Verifica se a IA ganhou ou houve empate.

    if (gameActive) {
        switchPlayer(); 
        // Alterna para o próximo jogador.
    }
}

function minimax(newBoard, player) { 
// Algoritmo de IA que calcula o melhor movimento.
    const availSpots = emptyIndexes(newBoard); 
    // Encontra os espaços vazios.

    if (winning(newBoard, 'X')) {
        return { score: -10 }; 
        // Se o 'X' ganha, dá uma pontuação negativa.
    } else if (winning(newBoard, 'O')) {
        return { score: 10 }; 
        // Se o 'O' ganha, dá uma pontuação positiva.
    } else if (availSpots.length === 0) {
        return { score: 0 }; 
        // Se não há mais movimentos, é empate.
    }

    const moves = []; 
    // Armazena os possíveis movimentos.

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X'); 
            // Simula o próximo movimento do jogador 'X'.
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O'); 
            // Simula o próximo movimento da IA.
            move.score = result.score;
        }

        newBoard[availSpots[i]] = ''; 
        // Reseta a posição no tabuleiro.

        moves.push(move); 
        // Adiciona o movimento à lista.
    }

    let bestMove;

    if (player === 'O') { 
    // A IA (O) procura a pontuação máxima.
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else { 
    // O jogador humano (X) procura a pontuação mínima.
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove]; 
    // Retorna o melhor movimento.
}

function emptyIndexes(board) { 
// Retorna os índices das células vazias.
    return board.reduce((acc, elem, index) => elem === '' ? acc.concat(index) : acc, []);
}

function winning(board, player) { 
// Verifica se o jogador venceu.
    return winningConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

function resetGame() { 
// Reinicia o jogo.
    currentPlayer = 'X'; 
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', '']; 
    cells.forEach(cell => cell.textContent = ''); 
    // Limpa as células.
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick)); 
// Adiciona o evento de clique às células.

resetButton.addEventListener('click', resetGame); 
// Adiciona o evento de clique ao botão de reset.
