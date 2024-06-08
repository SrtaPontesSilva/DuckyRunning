const dino = document.querySelector('.dino');
const cactus = document.querySelector('.cactus');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const gameOverElement = document.querySelector('.game-over');
let isJumping = false;
let gravity = 0.9;
let score = 0;
let highScore = 0;
let speed = 2;
let cactusSpeed = speed;
let isGameOver = false;

// Carregar o maior score armazenado (se houver)
if (localStorage.getItem('highScore')) {
    highScore = parseInt(localStorage.getItem('highScore'));
    highScoreElement.textContent = `High Score: ${highScore}`;
}

// Eventos para dispositivos móveis e desktops
document.addEventListener('keydown', handleJumpOrRestart);
document.addEventListener('touchstart', handleJumpOrRestart);

function handleJumpOrRestart(event) {
    if (event.code === 'Space' || event.type === 'touchstart') {
        if (isGameOver) {
            restartGame();
        } else if (!isJumping) {
            jump();
        }
    }
}

function jump() {
    let position = 0;
    isJumping = true;

    let upInterval = setInterval(() => {
        if (position >= 150) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 20;
                    position = position * gravity;
                    dino.style.bottom = position + 'px';
                }
            }, 20);
        } else {
            position += 20;
            position = position * gravity;
            dino.style.bottom = position + 'px';
        }
    }, 20);
}

function checkCollision() {
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    const cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));

    if (cactusLeft > 0 && cactusLeft < 60 && dinoBottom <= 40) {
        gameOver();
    }
}

function updateScore() {
    score++;
    scoreElement.textContent = `Score: ${score}`;

    // Atualizar o maior score
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = `High Score: ${highScore}`;
        localStorage.setItem('highScore', highScore);
    }

    // Aumentar a dificuldade a cada 100 pontos
    if (score % 100 === 0) {
        speed += 0.5;
        cactus.style.animation = `moveCactus ${2 / speed}s linear infinite`;
    }
}

function gameOver() {
    isGameOver = true;
    gameOverElement.classList.remove('hidden');
    gameOverElement.style.display = 'block';
    cactus.style.animation = 'none';
    cactus.style.display = 'none';
    clearInterval(collisionInterval);
    clearInterval(scoreInterval);
}

function restartGame() {
    isGameOver = false;
    score = 0;
    speed = 2;
    scoreElement.textContent = `Score: ${score}`;
    cactus.style.animation = `moveCactus ${2 / speed}s linear infinite`;
    cactus.style.display = 'block';
    gameOverElement.classList.add('hidden');
    gameOverElement.style.display = 'none';
    collisionInterval = setInterval(checkCollision, 10);
    scoreInterval = setInterval(updateScore, 1000);
}

let collisionInterval = setInterval(checkCollision, 10);
let scoreInterval = setInterval(updateScore, 1000);
