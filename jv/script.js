const board = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
let currentPlayer = 'X';
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
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
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Verifica se a célula já está ocupada ou se o jogo está inativo
    if (boardState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();
    if (gameActive) {
        switchPlayer();
        // Se for a vez da IA, faça um movimento após uma pequena pausa
        if (currentPlayer === 'O') {
            setTimeout(makeAIMove, 500); // Pequena espera para parecer mais natural
        }
    }
}

function updateCell(cell, index) {
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        setTimeout(() => alert(`Jogador ${currentPlayer} venceu!`), 10);
        return;
    }

    let roundDraw = !boardState.includes('');
    if (roundDraw) {
        gameActive = false;
        setTimeout(() => alert('Empate!'), 10);
        return;
    }
}

function makeAIMove() {
    const bestMove = minimax(boardState, 'O').index;
    const cell = document.querySelector(`.cell[data-index='${bestMove}']`);
    updateCell(cell, bestMove);
    checkResult();
    if (gameActive) {
        switchPlayer();
    }
}

function minimax(newBoard, player) {
    const availSpots = emptyIndexes(newBoard);

    if (winning(newBoard, 'X')) {
        return { score: -10 };
    } else if (winning(newBoard, 'O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function emptyIndexes(board) {
    return board.reduce((acc, elem, index) => elem === '' ? acc.concat(index) : acc, []);
}

function winning(board, player) {
    return winningConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
