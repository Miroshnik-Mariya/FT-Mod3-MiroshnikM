const boardSize = 10;
const gameBoard = document.getElementById('game-board');
const cells = [];
const scoreDisplay = document.getElementById('score');
const speedInput = document.getElementById('speed-input');

let snake = [{ x: 0, y: 0 }];
let food = { x: 5, y: 5 };
let direction = 'right';
let nextDirection = 'right';
let speed = parseInt(speedInput.value) || 800;
let gameRunning = true;
let gameInterval;

function initializeGameBoard() {
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    gameBoard.innerHTML = '';
    cells.length = 0;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cells.push(cell);
            gameBoard.appendChild(cell);
        }
    }
}

function render() {
    cells.forEach(cell => cell.classList.remove('snake', 'food'));

    snake.forEach(segment => {
        const index = segment.x + segment.y * boardSize;
        if (cells[index]) cells[index].classList.add('snake');
    });

    const foodIndex = food.x + food.y * boardSize;
    if (cells[foodIndex]) cells[foodIndex].classList.add('food');
}

function update() {
    direction = nextDirection;
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
    }

    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        generateFood();
        updateScore(snake.length);
    } else {
        snake.pop();
    }
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${snake.length}`);
    resetGame();
}

function resetGame() {
    snake = [{ x: 0, y: 0 }];
    direction = 'right';
    nextDirection = 'right';
    generateFood();
    updateScore(0);
    gameRunning = true;

    speed = parseInt(speedInput.value) || 800;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function updateScore(score) {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Управление с клавиатуры
document.addEventListener('keydown', (e) => {
    if (!gameRunning && (e.key === 'r' || e.key === 'R')) {
        resetGame();
        return;
    }

    switch (e.key) {
        case 'ArrowUp': 
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown': 
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft': 
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight': 
            if (direction !== 'left') nextDirection = 'right';
            break;
        case 'r': case 'R': case 'к': case 'К':
            resetGame();
            break;
    }
});

// Управление кнопками
document.getElementById('btn-up').addEventListener('click', () => {
    if (direction !== 'down') nextDirection = 'up';
});
document.getElementById('btn-down').addEventListener('click', () => {
    if (direction !== 'up') nextDirection = 'down';
});
document.getElementById('btn-left').addEventListener('click', () => {
    if (direction !== 'right') nextDirection = 'left';
});
document.getElementById('btn-right').addEventListener('click', () => {
    if (direction !== 'left') nextDirection = 'right';
});
document.getElementById('btn-reset').addEventListener('click', resetGame);

// Управление скоростью
speedInput.addEventListener('input', function () {
    speed = Math.max(100, Math.min(2000, parseInt(this.value) || 800));
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }
});

function gameLoop() {
    if (!gameRunning) return;
    update();
    render();
}

// Запуск игры
initializeGameBoard();
speedInput.value = speed;
updateScore(1);
gameInterval = setInterval(gameLoop, speed);