const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  color: "#fff",
  speed: 5,
};

// Background variables
let bgSpeed = 1;
let bgX = 0;

// Obstacle variables
let obstacles = [];
const obstacleSize = 20;
const obstacleSpeed = 5;
let spawnRate = 90;
let score = 0;

// Keyboard event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Functions for handling keyboard events
function keyDown(e) {
  if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
    player.y -= player.speed;
  } else if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
    player.y += player.speed;
  } else if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
    player.x -= player.speed;
  } else if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
    player.x += player.speed;
  }
}

function keyUp(e) {
  // Add any necessary key release actions
}

// Function to draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

// Function to draw obstacles
function drawObstacles() {
  ctx.fillStyle = "#ff0000";
  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacleSize, obstacleSize);
  }
}

// Function to move obstacles
function moveObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= obstacleSpeed;
  }

  // Remove obstacles that have passed
  obstacles = obstacles.filter((obstacle) => obstacle.x > 0);

  // Increase score when passing obstacles
  score += obstacleSpeed / 10;
}

// Function to spawn obstacles
function spawnObstacles() {
  if (Math.random() < 1 / spawnRate) {
    obstacles.push({
      x: canvas.width,
      y: Math.random() * (canvas.height - obstacleSize),
    });
  }
}

// Function to draw background
function drawBackground() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#666";
  ctx.fillRect(bgX, 0, canvas.width, canvas.height);
  ctx.fillRect(bgX - canvas.width, 0, canvas.width, canvas.height);
}

// Function to move background
function moveBackground() {
  bgX -= bgSpeed;
  if (bgX <= -canvas.width) bgX = 0;
}

// Function to update score
function updateScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + Math.floor(score), 10, 30);
}

// Function to detect collisions
function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    if (
      player.x < obstacles[i].x + obstacleSize &&
      player.x + player.size > obstacles[i].x &&
      player.y < obstacles[i].y + obstacleSize &&
      player.y + player.size > obstacles[i].y
    ) {
      // Collision detected
      alert("Game Over! Your score: " + Math.floor(score));
      document.location.reload();
    }
  }
}

// Main game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  drawBackground();

  // Draw player
  drawPlayer();

  // Move obstacles
  moveObstacles();

  // Draw obstacles
  drawObstacles();

  // Spawn obstacles
  spawnObstacles();

  // Move background
  moveBackground();

  // Update score
  updateScore();

  // Check for collisions
  checkCollisions();

  // Request animation frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
