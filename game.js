const character = document.getElementById('character');
const game = document.getElementById('game');
const joystickArea = document.getElementById('joystick-area');
const joystickBase = document.getElementById('joystick-base');
const joystickStick = document.getElementById('joystick-stick');

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let velocityX = 0;
let velocityY = 0;
let direction = 'down';
let isJoystickActive = false;

const speed = 4;

function updateCharacterPosition() {
    // Move character
    x += velocityX;
    y += velocityY;

    // Keep character on screen
    const margin = 20;
    x = Math.max(margin, Math.min(x, window.innerWidth - margin));
    y = Math.max(margin, Math.min(y, window.innerHeight - margin));

    character.style.left = x + 'px';
    character.style.top = y + 'px';

    // Update direction based on movement
    if (velocityX !== 0 || velocityY !== 0) {
        updateDirection(velocityX, velocityY);
    }
}

function updateDirection(vx, vy) {
    // Determine direction based on velocity
    const angle = Math.atan2(vy, vx) * (180 / Math.PI);

    // 8 directions
    if (angle >= -22.5 && angle < 22.5) {
        direction = 'right';
    } else if (angle >= 22.5 && angle < 67.5) {
        direction = 'down-right';
    } else if (angle >= 67.5 && angle < 112.5) {
        direction = 'down';
    } else if (angle >= 112.5 && angle < 157.5) {
        direction = 'down-left';
    } else if (angle >= 157.5 || angle < -157.5) {
        direction = 'left';
    } else if (angle >= -157.5 && angle < -112.5) {
        direction = 'up-left';
    } else if (angle >= -112.5 && angle < -67.5) {
        direction = 'up';
    } else if (angle >= -67.5 && angle < -22.5) {
        direction = 'up-right';
    }

    character.setAttribute('data-direction', direction);
}

function handleJoystickStart(e) {
    isJoystickActive = true;
    handleJoystickMove(e);
}

function handleJoystickMove(e) {
    if (!isJoystickActive) return;

    e.preventDefault();

    let clientX, clientY;

    if (e.type === 'touchmove' || e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    // Get joystick base position
    const baseRect = joystickBase.getBoundingClientRect();
    const baseCenterX = baseRect.left + baseRect.width / 2;
    const baseCenterY = baseRect.top + baseRect.height / 2;

    // Calculate offset from center
    let offsetX = clientX - baseCenterX;
    let offsetY = clientY - baseCenterY;

    // Limit to circle radius
    const maxDistance = baseRect.width / 2 - 30;
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

    if (distance > maxDistance) {
        const angle = Math.atan2(offsetY, offsetX);
        offsetX = Math.cos(angle) * maxDistance;
        offsetY = Math.sin(angle) * maxDistance;
    }

    // Update stick position
    joystickStick.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

    // Calculate velocity
    const normalizedX = offsetX / maxDistance;
    const normalizedY = offsetY / maxDistance;

    velocityX = normalizedX * speed;
    velocityY = normalizedY * speed;
}

function handleJoystickEnd() {
    isJoystickActive = false;
    velocityX = 0;
    velocityY = 0;

    // Reset stick position
    joystickStick.style.transform = 'translate(-50%, -50%)';
}

// Joystick event listeners
joystickArea.addEventListener('touchstart', handleJoystickStart, { passive: false });
joystickArea.addEventListener('touchmove', handleJoystickMove, { passive: false });
joystickArea.addEventListener('touchend', handleJoystickEnd, { passive: false });

// Mouse events for desktop testing
joystickArea.addEventListener('mousedown', handleJoystickStart);
document.addEventListener('mousemove', handleJoystickMove);
document.addEventListener('mouseup', handleJoystickEnd);

// Game loop
setInterval(updateCharacterPosition, 16);

console.log('RPG Game loaded with joystick controls!');
