const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Obtener puntuación alta del almacenamiento local

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Récord: ${highScore}`;

// Pasa aleatoriamente entre 1 y 30 como posición de comida

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("¡Juego terminado! Presione Aceptar para jugar...");
    location.reload();
}

// Cambia el valor de velocidad según la pulsación de tecla

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Cambia de dirección con cada clic de tecla

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Cuando la serpiente come comida
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); //Agregar comida al cuerpo de serpiente
        score++;
        highScore = score >= highScore ? score : highScore; // if score > high score => high score = score

        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Puntaje: ${score}`;
        highScoreElement.innerText = `Puntaje: ${highScore}`;
    }

    // Actualizar cabeza de serpiente
    snakeX += velocityX;
    snakeY += velocityY;

    // Avanzando los valores de los elementos en el cuerpo de la serpiente en uno

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // Verifica que el cuerpo de la serpiente esté fuera de la pared o no

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    // Agrega div para cada parte del cuerpo de la serpiente

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Verifique si la cabeza de serpiente golpeó el cuerpo o no
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);