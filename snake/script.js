const boardSize = 10;
const gameBoard = document.getElementById('game-board');
const cells = [];
const scoreDisplay = document.getElementById('score');

let snake = [{ x: 0, y: 0 }];
let food = { x: 5, y: 5 };
let direction = 'right';
let nextDirection = 'right';
let speed = 300;
let gameRunning = true;
let gameInterval;

function initializeGameBoard() {
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
    cells.forEach((cell) => cell.classList.remove('snake', 'food'));

    snake.forEach((segment) => {
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

    // Wall collision
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        gameOver();
        return;
    }

    // Self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Food collision
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
    updateScore(snake.length);
    gameRunning = true;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function updateScore(score) {
    scoreDisplay.textContent = `Score: ${score}`;
}

function gameLoop() {
    if (!gameRunning) return;
    update();
    render();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning && e.key === 'r') {
        resetGame();
        return;
    }

    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown': case 's': case 'S':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft': case 'a': case 'A':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight': case 'd': case 'D':
            if (direction !== 'left') nextDirection = 'right';
            break;
        case '+': case '=':
            speed = Math.max(100, speed - 50);
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
            break;
        case '-': case '_':
            speed = Math.min(1000, speed + 50);
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
            break;
        case 'r': case '