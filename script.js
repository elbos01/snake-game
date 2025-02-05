const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const startButton = document.getElementById("startButton");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "right";
let food = generateFood();
let score = 0;
let gameInterval = null;
let gameRunning = false;

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// Gestion des touches clavier et des boutons (on utilise ici les touches Z,S,Q,D pour émuler un clavier AZERTY)
function handleDirectionChange(key) {
    if ((key === "ArrowUp" || key === "z") && direction !== "down") direction = "up";
    if ((key === "ArrowDown" || key === "s") && direction !== "up") direction = "down";
    if ((key === "ArrowLeft" || key === "q") && direction !== "right") direction = "left";
    if ((key === "ArrowRight" || key === "d") && direction !== "left") direction = "right";
}

document.addEventListener("keydown", (e) => {
    handleDirectionChange(e.key);
});
document.getElementById("up").addEventListener("click", () => handleDirectionChange("ArrowUp"));
document.getElementById("down").addEventListener("click", () => handleDirectionChange("ArrowDown"));
document.getElementById("left").addEventListener("click", () => handleDirectionChange("ArrowLeft"));
document.getElementById("right").addEventListener("click", () => handleDirectionChange("ArrowRight"));

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le snake
    snake.forEach((part) => {
        ctx.fillStyle = "green";
        ctx.fillRect(part.x, part.y, box, box);
    });

    // Dessiner la nourriture
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Calculer la nouvelle tête
    let head = { ...snake[0] };
    if (direction === "up") head.y -= box;
    if (direction === "down") head.y += box;
    if (direction === "left") head.x -= box;
    if (direction === "right") head.x += box;

    // Vérifier les collisions (murs ou auto-collision)
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
            snake.some(part => part.x === head.x && part.y === head.y)) {
        clearInterval(gameInterval);
        gameRunning = false;
        alert("Game Over! Score: " + score);
        startButton.style.display = "block"; // Afficher le bouton de démarrage pour rejouer
        return;
    }

    snake.unshift(head);

    // Vérifier si la nourriture est mangée
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = "Score: " + score;
        food = generateFood();
    } else {
        snake.pop();
    }
}

function startGame() {
    // Réinitialiser l'état du jeu
    snake = [{ x: 200, y: 200 }];
    direction = "right";
    food = generateFood();
    score = 0;
    scoreDisplay.textContent = "Score: " + score;
    gameRunning = true;
    startButton.style.display = "none";
    gameInterval = setInterval(draw, 150); // Vitesse réduite (150ms par frame)
}

startButton.addEventListener("click", startGame);
