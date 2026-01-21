const ball = document.getElementById('ball');
const timerDisplay = document.getElementById('timer');
const gameArea = document.getElementById('game-area');
const gameOver = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

let timeRemaining = 20;
let timerInterval = null;
let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX = 0;
let initialY = 0;
let xOffset = 0;
let yOffset = 0;

function initGame() {
    timeRemaining = 20;
    timerDisplay.textContent = timeRemaining;
    gameOver.classList.add('hidden');

    const gameRect = gameArea.getBoundingClientRect();
    xOffset = gameRect.width / 2 - 40;
    yOffset = gameRect.height / 2 - 40;

    ball.style.left = xOffset + 'px';
    ball.style.top = yOffset + 'px';

    startTimer();
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    gameOver.classList.remove('hidden');
}

function dragStart(e) {
    if (timeRemaining <= 0) return;

    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (e.target === ball) {
        isDragging = true;
    }
}

function drag(e) {
    if (isDragging && timeRemaining > 0) {
        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        const gameRect = gameArea.getBoundingClientRect();
        const ballRadius = 40;

        xOffset = Math.max(0, Math.min(xOffset, gameRect.width - ballRadius * 2));
        yOffset = Math.max(0, Math.min(yOffset, gameRect.height - ballRadius * 2));

        setTranslate(xOffset, yOffset, ball);
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function setTranslate(xPos, yPos, el) {
    el.style.left = xPos + 'px';
    el.style.top = yPos + 'px';
}

ball.addEventListener('touchstart', dragStart, { passive: false });
ball.addEventListener('touchmove', drag, { passive: false });
ball.addEventListener('touchend', dragEnd, { passive: false });

ball.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

restartBtn.addEventListener('click', initGame);

initGame();
