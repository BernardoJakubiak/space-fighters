import { _keyboard_listen, pressedKey } from "./engine/input.js";
import { Sprite } from "./classes/Sprite.js";

const canvas = document.getElementById("canvas");

// Init player
const playerImage = new Image();
playerImage.src = "../assets/graphics/player.png";
const player = new Sprite(canvas.width / 2.3, 350, 200, playerImage);
let playerVelocity = player.SPEED; // Use a dedicated variable

// Enemies
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

// Update coordinates and handle collisions
function update(time) {
  // Player movement with collision detection
  const playerMovement = { x: 0, y: 0 }; // Store intended movement
  if (pressedKey("ArrowLeft") && player.x > 30) {
    playerMovement.x = -playerVelocity * time;
  } else if (pressedKey("ArrowRight") && player.x <= canvas.width - 30) {
    playerMovement.x = playerVelocity * time;
  }
 // if (pressedKey("ArrowUp") && player.y > 30) {
   // playerMovement.y = -playerVelocity * time;
 // } else if (pressedKey("ArrowDown") && player.y <= canvas.height - 30) {
   // playerMovement.y = playerVelocity * time;
  //}

  // Check for collisions before applying movement
  const collisions = checkCollisions(player, enemies);
  if (collisions.top || collisions.bottom || collisions.left || collisions.right) {
    console.error("Player hit!"); // Display message on hit
  }

  // Update player position based on allowed movement
  player.x += playerMovement.x * (collisions.right ? 0 : 1);
  player.y += playerMovement.y * (collisions.bottom ? 0 : 1);

  // Update enemies
  if (enemies.length > 0) {
    for (let e of enemies) {
      e.y += e.velocity * time;

      if (e.y < e.image.height) {
        e.velocity = e.SPEED;
      } else if (e.y > canvas.height - e.image.height) {
        e.velocity = -e.SPEED;
      }
    }
  }
}

// Improved collision detection function (optional)
function checkCollisions(sprite, otherSprites) {
  const collisions = { top: false, right: false, bottom: false, left: false };
  const padding = 1; // Optional padding for better collision accuracy

  for (let other of otherSprites) {
    const dx = sprite.x + sprite.width / 2 - (other.x + other.width / 2);
    const dy = sprite.y + sprite.height / 2 - (other.y + other.height / 2);
    const combinedHalfWidths = (sprite.width + other.width) / 2 - padding;
    const combinedHalfHeights = (sprite.height + other.height) / 2 - padding;

    if (Math.abs(dx) < combinedHalfWidths && Math.abs(dy) < combinedHalfHeights) {
      // Overlap detected
      if (dy > 0) {
        collisions.top = true; // Player is above enemy
      } else {
        collisions.bottom = true; // Player is below enemy
      }
      if (dx > 0) {
        collisions.left = true; // Player is left of enemy
      } else {
        collisions.right = true; // Player is right of enemy
      }
    }
  }

  return collisions;
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
