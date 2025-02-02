const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake = [{ x: 100, y: 100 }];
let food = randomPosition();
let dx = gridSize, dy = 0;
let score = 0;

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) {
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -gridSize; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = gridSize; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -gridSize; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = gridSize; dy = 0; }
}

function randomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

function gameLoop() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").textContent = score;
        food = randomPosition();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert("Game Over! 🐍 Score: " + score);
        resetGame();
        return;
    }

    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    setTimeout(gameLoop, 100);
}

function resetGame() {
    snake = [{ x: 100, y: 100 }];
    dx = gridSize; dy = 0;
    score = 0;
    document.getElementById("score").textContent = score;
    food = randomPosition();
    gameLoop();
}

resetGame();
