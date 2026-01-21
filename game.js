const character = document.getElementById('character');
const room = document.getElementById('room');
const itemsDisplay = document.getElementById('items-collected');
const winScreen = document.getElementById('win-screen');
const restartBtn = document.getElementById('restart-btn');

// Grid settings
const TILE_SIZE = 32;
const GRID_WIDTH = Math.floor(window.innerWidth / TILE_SIZE);
const GRID_HEIGHT = Math.floor(window.innerHeight / TILE_SIZE);

// Character position (in grid coordinates)
let charX = Math.floor(GRID_WIDTH / 2);
let charY = Math.floor(GRID_HEIGHT / 2);
let direction = 'down';
let isMoving = false;
let itemsCollected = 0;
const totalItems = 5;

// Collision map
const collisionMap = [];

// Room layout
const roomLayout = {
    furniture: [
        { type: 'bed', x: 2, y: 2 },
        { type: 'toy-chest', x: 10, y: 2 },
        { type: 'bookshelf', x: 15, y: 2 },
        { type: 'desk', x: 2, y: 8 },
        { type: 'closet', x: 15, y: 8 },
        { type: 'rug', x: 7, y: 6 }
    ],
    items: [
        { type: 'item-ball', x: 5, y: 3 },
        { type: 'item-book', x: 16, y: 4 },
        { type: 'item-puzzle', x: 8, y: 8 },
        { type: 'item-toy-car', x: 12, y: 3 },
        { type: 'item-teddy', x: 4, y: 10 }
    ]
};

function initGame() {
    itemsCollected = 0;
    updateItemsDisplay();
    winScreen.classList.add('hidden');

    // Clear room
    room.innerHTML = '';

    // Initialize collision map
    for (let y = 0; y < GRID_HEIGHT; y++) {
        collisionMap[y] = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            collisionMap[y][x] = false;
        }
    }

    // Add borders as collision
    for (let x = 0; x < GRID_WIDTH; x++) {
        collisionMap[0][x] = true;
        collisionMap[GRID_HEIGHT - 1][x] = true;
    }
    for (let y = 0; y < GRID_HEIGHT; y++) {
        collisionMap[y][0] = true;
        collisionMap[y][GRID_WIDTH - 1] = true;
    }

    // Create furniture
    roomLayout.furniture.forEach(furn => {
        const element = document.createElement('div');
        element.className = 'furniture ' + furn.type;
        element.style.left = (furn.x * TILE_SIZE) + 'px';
        element.style.top = (furn.y * TILE_SIZE) + 'px';
        room.appendChild(element);

        // Add to collision map
        const width = Math.ceil(element.offsetWidth / TILE_SIZE) || 2;
        const height = Math.ceil(element.offsetHeight / TILE_SIZE) || 2;

        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                const gridX = furn.x + dx;
                const gridY = furn.y + dy;
                if (gridY < GRID_HEIGHT && gridX < GRID_WIDTH) {
                    collisionMap[gridY][gridX] = true;
                }
            }
        }
    });

    // Create collectible items
    roomLayout.items.forEach(item => {
        const element = document.createElement('div');
        element.className = 'collectible ' + item.type;
        element.style.left = (item.x * TILE_SIZE + 4) + 'px';
        element.style.top = (item.y * TILE_SIZE + 4) + 'px';
        element.dataset.gridX = item.x;
        element.dataset.gridY = item.y;
        room.appendChild(element);
    });

    // Reset character position
    charX = Math.floor(GRID_WIDTH / 2);
    charY = Math.floor(GRID_HEIGHT / 2);
    direction = 'down';
    updateCharacterPosition();
}

function updateCharacterPosition() {
    character.style.left = (charX * TILE_SIZE) + 'px';
    character.style.top = (charY * TILE_SIZE) + 'px';
    character.setAttribute('data-direction', direction);

    // Check for item collection
    checkItemCollection();
}

function updateItemsDisplay() {
    itemsDisplay.textContent = `Items: ${itemsCollected}/${totalItems}`;
}

function checkItemCollection() {
    const items = document.querySelectorAll('.collectible:not(.collected)');
    items.forEach(item => {
        const itemX = parseInt(item.dataset.gridX);
        const itemY = parseInt(item.dataset.gridY);

        if (itemX === charX && itemY === charY) {
            item.classList.add('collected');
            itemsCollected++;
            updateItemsDisplay();

            if (itemsCollected >= totalItems) {
                setTimeout(() => {
                    winScreen.classList.remove('hidden');
                }, 500);
            }
        }
    });
}

function canMoveTo(x, y) {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
        return false;
    }
    return !collisionMap[y][x];
}

function moveCharacter(targetX, targetY) {
    if (isMoving) return;

    // Calculate direction
    const dx = targetX - charX;
    const dy = targetY - charY;

    // Determine which direction to move
    let newX = charX;
    let newY = charY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Move horizontally
        if (dx > 0) {
            direction = 'right';
            newX = charX + 1;
        } else if (dx < 0) {
            direction = 'left';
            newX = charX - 1;
        }
    } else {
        // Move vertically
        if (dy > 0) {
            direction = 'down';
            newY = charY + 1;
        } else if (dy < 0) {
            direction = 'up';
            newY = charY - 1;
        }
    }

    // Check collision and move
    if (canMoveTo(newX, newY)) {
        isMoving = true;
        charX = newX;
        charY = newY;

        updateCharacterPosition();

        setTimeout(() => {
            isMoving = false;
        }, 200);
    } else {
        // Just update direction
        character.setAttribute('data-direction', direction);
    }
}

function handleTap(e) {
    e.preventDefault();

    let clientX, clientY;

    if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    // Convert to grid coordinates
    const gridX = Math.floor(clientX / TILE_SIZE);
    const gridY = Math.floor(clientY / TILE_SIZE);

    moveCharacter(gridX, gridY);
}

// Event listeners
room.addEventListener('touchstart', handleTap, { passive: false });
room.addEventListener('click', handleTap);
restartBtn.addEventListener('click', initGame);

// Initialize
initGame();

console.log('RPG Game loaded! Grid: ' + GRID_WIDTH + 'x' + GRID_HEIGHT);
