const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const startButton = document.getElementById("startButton");
const toggleFSButton = document.getElementById("toggleFS");
const exitButton = document.getElementById("exitButton");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "right";
let food = generateFood();
let score = 0;
let gameInterval = null;
let gameRunning = false;
const maxFoods = 10; // Le jeu s'arrête après que le snake a mangé 10 nourritures

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// Gestion des touches (clavier et boutons)
// Ici, on utilise z,s,q,d pour le clavier azerty ainsi que les flèches standards.
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

    // Calcul de la nouvelle tête avec effet wrap-around
    let head = { ...snake[0] };
    if (direction === "up") head.y -= box;
    if (direction === "down") head.y += box;
    if (direction === "left") head.x -= box;
    if (direction === "right") head.x += box;

    // Wrap-around
    if (head.x < 0) head.x = canvas.width - box;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - box;
    if (head.y >= canvas.height) head.y = 0;

    // Vérifier auto-collision (sans collision murale grâce au wrap-around)
    if (snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y)) {
        endGame("Game Over! Score: " + score);
        return;
    }

    snake.unshift(head);

    // Si le snake mange la nourriture
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = "Score: " + score;
        food = generateFood();
        // Si le snake a mangé 10 nourritures, arrêter le jeu
        if (score >= maxFoods) {
            endGame("Snake is full, come tomorrow!");
            return;
        }
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
    gameInterval = setInterval(draw, 150);
}

function exitGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    alert("Game exited!");
    startButton.style.display = "block";
    // Retourner au bot Telegram
    redirectToTelegram();
}

function endGame(message) {
    clearInterval(gameInterval);
    gameRunning = false;
    alert(message);
    // Retourner au bot Telegram après 2 secondes
    setTimeout(() => {
        redirectToTelegram();
    }, 2000);
}

function redirectToTelegram() {
    // Rediriger vers le bot Telegram via un lien profond.
    // Remplacez 'YourBotUsername' par le nom de votre bot sans '@'
    window.location.href = "tg://resolve?domain=thebig001lkBot";
}

startButton.addEventListener("click", startGame);
exitButton.addEventListener("click", exitGame);

// Bouton pour toggle le mode plein écran
toggleFSButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
});
