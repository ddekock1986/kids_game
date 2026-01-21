const character = document.getElementById('character');
const game = document.getElementById('game');

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let targetX = x;
let targetY = y;
let isMoving = false;

function updatePosition() {
    if (!isMoving) return;

    const speed = 5;
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < speed) {
        // We zijn er bijna, spring naar exacte positie
        x = targetX;
        y = targetY;
        isMoving = false;
    } else {
        // Beweeg richting doel
        const dirX = dx / distance;
        const dirY = dy / distance;

        x += dirX * speed;
        y += dirY * speed;
    }

    character.style.left = x + 'px';
    character.style.top = y + 'px';
}

function setTarget(touchX, touchY) {
    targetX = touchX;
    targetY = touchY;
    isMoving = true;
}

// Touch events voor iPad
game.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    setTarget(touch.clientX, touch.clientY);
}, { passive: false });

// Mouse events voor desktop test
game.addEventListener('click', function(e) {
    setTarget(e.clientX, e.clientY);
});

// Game loop - draait ~60 keer per seconde
setInterval(updatePosition, 16);

console.log('Game loaded - smooth movement!');
