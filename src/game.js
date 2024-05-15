import { _keyboard_listen, pressedKey } from "./engine/input.js";
import { Sprite } from "./classes/Sprite.js";

const canvas = document.getElementById("canvas");

// Init player
const playerImage = new Image();
playerImage.src = "../assets/graphics/player.png";
const player = new Sprite(canvas.width / 2.3, 350, 200, playerImage);
let velocity = player.SPEED;

// Inimigos
const enemyImage = new Image();
enemyImage.src = "../assets/graphics/red.png";
const enemyA = new Sprite(50, 50, 200, enemyImage);
const enemies = [enemyA];

function draw(ctx) {
    ctx.clearRect(0, 0, 400, 400);

    // Desenhar player
    ctx.drawImage(player.image, player.x, player.y);

    // Desenhar inimigos
    if (enemies.length > 0) {
        for (let e of enemies) {
            ctx.drawImage(e.image, e.x, e.y);
        }
    }
}

// Update coordenadas dos sprites
function update(time) {
    // Update player
    if (pressedKey("ArrowUp") && player.y > 30) player.y -= velocity * time;
    else if (pressedKey("ArrowDown") && player.y <= canvas.height - 30)
        player.y += velocity * time;

    if (pressedKey("ArrowLeft") && player.x > 30) player.x -= velocity * time;
    else if (pressedKey("ArrowRight") && player.x <= canvas.width - 30)
        player.x += velocity * time;

    // Update inimigos
    if (enemies.length > 0) {
        for (let e of enemies) {
            e.y += e.velocity * time;

            if (e.y < e.image.height) e.velocity = e.SPEED;
            else if (e.y > canvas.height - e.image.height)
                e.velocity = -e.SPEED;
        }
    }
}

function animation() {
    if (!canvas.getContext) {
        alert("Canvas não disponível");
        return;
    }

    _keyboard_listen();

    const ctx = canvas.getContext("2d");
    let lastFrameTime = 0;

    function onFrame(time) {
        if (lastFrameTime !== 0) {
            const elapsed = (time - lastFrameTime) / 1000;
            update(elapsed);
            draw(ctx);
        }

        lastFrameTime = time;
        window.requestAnimationFrame(onFrame);
    }

    window.requestAnimationFrame(onFrame);
}

animation();
