const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "right";
let food = generateFood();

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

document.addEventListener("keydown", (e) => {
    handleDirectionChange(e.key);
});

document.getElementById("up").addEventListener("click", () => handleDirectionChange("z"));
document.getElementById("down").addEventListener("click", () => handleDirectionChange("s"));
document.getElementById("left").addEventListener("click", () => handleDirectionChange("q"));
document.getElementById("right").addEventListener("click", () => handleDirectionChange("d"));

function handleDirectionChange(key) {
    if ((key === "ArrowUp" || key === "z") && direction !== "down") direction = "up";
    if ((key === "ArrowDown" || key === "s") && direction !== "up") direction = "down";
    if ((key === "ArrowLeft" || key === "q") && direction !== "right") direction = "left";
    if ((key === "ArrowRight" || key === "d") && direction !== "left") direction = "right";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((part) => {
        ctx.fillStyle = "green";
        ctx.fillRect(part.x, part.y, box, box);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let head = { ...snake[0] };
    if (direction === "up") head.y -= box;
    if (direction === "down") head.y += box;
    if (direction === "left") head.x -= box;
    if (direction === "right") head.x += box;

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snake.some(part => part.x === head.x && part.y === head.y)) {
        alert("Game Over!");
        snake = [{ x: 200, y: 200 }];
        direction = "right";
        food = generateFood();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
    } else {
        snake.pop();
    }
}

setInterval(draw, 150); // Vitesse réduite du snake

// Style des boutons de contrôle
const controlButtons = document.querySelectorAll('.control-button');
controlButtons.forEach(button => {
    button.style.width = '70px';
    button.style.height = '70px';
    button.style.margin = '15px';
    button.style.fontSize = '24px';
    button.style.borderRadius = '15px';
});
