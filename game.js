const character = document.getElementById('character');
const gameArea = document.getElementById('game-area');
const gameOver = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const itemsFoundDisplay = document.getElementById('items-found');

let characterX = window.innerWidth / 2;
let characterY = window.innerHeight / 2;
let targetX = characterX;
let targetY = characterY;
let isMoving = false;
let itemsCollected = 0;
const totalItems = 5;

const furniture = [];
const collectibles = [];

function initGame() {
    itemsCollected = 0;
    updateItemsDisplay();
    gameOver.classList.add('hidden');

    // Reset character position
    characterX = window.innerWidth / 2;
    characterY = window.innerHeight / 2;
    targetX = characterX;
    targetY = characterY;
    updateCharacterPosition();

    // Reset collectibles
    document.querySelectorAll('.collectible').forEach(item => {
        item.setAttribute('data-collected', 'false');
        item.style.display = 'block';
    });

    // Cache furniture positions
    furniture.length = 0;
    document.querySelectorAll('.furniture').forEach(item => {
        const rect = item.getBoundingClientRect();
        furniture.push({
            element: item,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        });
    });

    // Cache collectible positions
    collectibles.length = 0;
    document.querySelectorAll('.collectible').forEach(item => {
        const rect = item.getBoundingClientRect();
        collectibles.push({
            element: item,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            radius: rect.width / 2
        });
    });
}

function updateCharacterPosition() {
    character.style.left = characterX + 'px';
    character.style.top = characterY + 'px';
}

function updateItemsDisplay() {
    itemsFoundDisplay.textContent = `Items: ${itemsCollected}/${totalItems}`;
}

function checkCollision(newX, newY) {
    const charWidth = 40;
    const charHeight = 60;

    // Check collision with each furniture item
    for (let furn of furniture) {
        const furnitureRect = furn.element.getBoundingClientRect();

        // Character bounding box
        const charLeft = newX - charWidth / 2;
        const charRight = newX + charWidth / 2;
        const charTop = newY - charHeight / 2;
        const charBottom = newY + charHeight / 2;

        // Check if rectangles overlap
        if (charRight > furnitureRect.left &&
            charLeft < furnitureRect.right &&
            charBottom > furnitureRect.top &&
            charTop < furnitureRect.bottom) {
            return true; // Collision detected
        }
    }

    return false; // No collision
}

function checkItemCollection() {
    const charWidth = 40;
    const charHeight = 60;
    const collectionRadius = 50;

    document.querySelectorAll('.collectible').forEach(item => {
        if (item.getAttribute('data-collected') === 'true') return;

        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const itemCenterY = itemRect.top + itemRect.height / 2;

        // Calculate distance between character center and item center
        const dx = characterX - itemCenterX;
        const dy = characterY - itemCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < collectionRadius) {
            collectItem(item);
        }
    });
}

function collectItem(item) {
    item.setAttribute('data-collected', 'true');
    item.style.transform = 'scale(0)';

    setTimeout(() => {
        item.style.display = 'none';
    }, 200);

    itemsCollected++;
    updateItemsDisplay();

    if (itemsCollected >= totalItems) {
        setTimeout(() => {
            endGame();
        }, 500);
    }
}

function endGame() {
    gameOver.classList.remove('hidden');
}

function moveCharacter() {
    if (!isMoving) return;

    const speed = 3;
    const dx = targetX - characterX;
    const dy = targetY - characterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < speed) {
        characterX = targetX;
        characterY = targetY;
        isMoving = false;
        updateCharacterPosition();
        checkItemCollection();
        return;
    }

    // Normalize direction and apply speed
    const dirX = dx / distance;
    const dirY = dy / distance;

    const newX = characterX + dirX * speed;
    const newY = characterY + dirY * speed;

    // Check collision before moving
    if (!checkCollision(newX, newY)) {
        characterX = newX;
        characterY = newY;
    } else {
        // Try moving only in X direction
        if (!checkCollision(newX, characterY)) {
            characterX = newX;
        }
        // Try moving only in Y direction
        else if (!checkCollision(characterX, newY)) {
            characterY = newY;
        }
        // Can't move, stop
        else {
            isMoving = false;
        }
    }

    updateCharacterPosition();
    checkItemCollection();
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

    targetX = clientX;
    targetY = clientY;
    isMoving = true;
}

// Event listeners
gameArea.addEventListener('touchstart', handleTap, { passive: false });
gameArea.addEventListener('click', handleTap);

restartBtn.addEventListener('click', initGame);

// Game loop
setInterval(moveCharacter, 16); // ~60 FPS

// Initialize game
initGame();
