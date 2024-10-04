const board = document.getElementById('game-board'); 
// Seleciona o elemento HTML com o ID 'game-board', que representa o tabuleiro do jogo.

const cells = document.querySelectorAll('.cell'); 
// Seleciona todos os elementos com a classe 'cell', representando cada célula do tabuleiro.

const resetButton = document.getElementById('reset-button'); 
// Seleciona o botão com o ID 'reset-button', que será usado para reiniciar o jogo.

let currentPlayer = 'X'; 
// Define o jogador atual como 'X', que será alternado durante o jogo.

let gameActive = true; 
// Variável para controlar se o jogo está ativo ou não. Se falso, impede jogadas.

let boardState = ['', '', '', '', '', '', '', '', '']; 
// Array que mantém o estado atual do tabuleiro, começando vazio (9 células).

const winningConditions = [ 
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
]; 
// Definição das combinações vencedoras no jogo (linhas, colunas e diagonais).

function handleCellClick(event) { 
// Função que lida com o clique em uma célula do tabuleiro.
    const clickedCell = event.target; 
    // Obtém a célula clicada.

    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index')); 
    // Pega o índice da célula clicada a partir do atributo 'data-index'.

    if (boardState[clickedCellIndex] !== '' || !gameActive) { 
        return; 
    } 
    // Verifica se a célula já foi preenchida ou se o jogo não está ativo. Se for o caso, a função é encerrada.

    updateCell(clickedCell, clickedCellIndex); 
    // Atualiza a célula com o jogador atual.

    checkResult(); 
    // Verifica se o jogo terminou com vitória ou empate.

    if (gameActive) { 
        switchPlayer(); 
    } 
    // Se o jogo ainda estiver ativo, alterna para o próximo jogador.
}

function updateCell(cell, index) { 
// Atualiza o estado do tabuleiro e o conteúdo visual da célula.
    boardState[index] = currentPlayer; 
    // Atualiza o estado interno do tabuleiro com o jogador atual.

    cell.textContent = currentPlayer; 
    // Define o texto dentro da célula com o símbolo do jogador atual ('X' ou 'O').
}

function switchPlayer() { 
// Alterna o jogador atual entre 'X' e 'O'.
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; 
    // Se o jogador atual for 'X', passa para 'O', caso contrário, volta para 'X'.
}

function checkResult() { 
// Verifica se há uma condição de vitória ou empate.
    let roundWon = false; 
    // Inicialmente, define que ninguém venceu ainda.

    for (let i = 0; i < winningConditions.length; i++) { 
        const winCondition = winningConditions[i]; 
        // Verifica cada uma das condições de vitória.

        let a = boardState[winCondition[0]]; 
        let b = boardState[winCondition[1]]; 
        let c = boardState[winCondition[2]]; 
        // Obtém os valores das células correspondentes a uma condição de vitória.

        if (a === '' || b === '' || c === '') { 
            continue; 
        } 
        // Se qualquer célula na combinação estiver vazia, ignora essa condição.

        if (a === b && b === c) { 
            roundWon = true; 
            break; 
        } 
        // Se todas as células em uma condição de vitória forem iguais, define que houve vitória.
    }

    if (roundWon) { 
        gameActive = false; 
        // Se alguém venceu, desativa o jogo.

        setTimeout(() => alert(`Jogador ${currentPlayer} venceu!`), 10); 
        // Exibe um alerta com o vencedor após um pequeno atraso.
        return;
    }

    let roundDraw = !boardState.includes(''); 
    // Verifica se houve empate, ou seja, todas as células estão preenchidas.

    if (roundDraw) { 
        gameActive = false; 
        // Se houve empate, desativa o jogo.

        setTimeout(() => alert('Empate!'), 10); 
        // Exibe um alerta informando o empate.
        return;
    }
}

function resetGame() { 
// Função para reiniciar o jogo.
    currentPlayer = 'X'; 
    // Redefine o jogador atual para 'X'.

    gameActive = true; 
    // Ativa o jogo novamente.

    boardState = ['', '', '', '', '', '', '', '', '']; 
    // Redefine o estado do tabuleiro para vazio.

    cells.forEach(cell => cell.textContent = ''); 
    // Limpa o conteúdo visual de todas as células.
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick)); 
// Adiciona um evento de clique para cada célula, chamando a função handleCellClick.

resetButton.addEventListener('click', resetGame); 
// Adiciona um evento de clique ao botão de reset para reiniciar o jogo.