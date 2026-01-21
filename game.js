// Simpele test: tik op het scherm en het balletje springt naar die plek
const character = document.getElementById('character');
const game = document.getElementById('game');

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;

function moveCharacter(touchX, touchY) {
    x = touchX;
    y = touchY;

    character.style.left = x + 'px';
    character.style.top = y + 'px';
}

// Touch events voor iPad
game.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    moveCharacter(touch.clientX, touch.clientY);
}, { passive: false });

// Mouse events voor desktop test
game.addEventListener('click', function(e) {
    moveCharacter(e.clientX, e.clientY);
});

console.log('Game loaded!');
