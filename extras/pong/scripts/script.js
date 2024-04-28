const container = document.querySelector(".container");
const leftPaddle = document.getElementById("leftPaddle");
const rightPaddle = document.getElementById("rightPaddle");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const joystick = document.getElementById("joystick");

let ballX = container.offsetWidth / 2;
let ballY = container.offsetHeight / 2;
let ballSpeedX = 2;
let ballSpeedY = 2;
const paddleSpeed = 5;
const aiSpeed = 1.65;
let playerScore = 0;
let aiScore = 0;
let joystickPressed = false;
let isGamePaused = false;

// Flag to track key states
const keys = {
  w: false,
  s: false,
};

// Event listeners to track keydown and keyup events
document.addEventListener("keydown", (event) => {
  if (event.key === "w") {
    keys.w = true;
  } else if (event.key === "s") {
    keys.s = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "w") {
    keys.w = false;
  } else if (event.key === "s") {
    keys.s = false;
  }
});

// Add event listeners for joystick touch events
joystick.addEventListener("touchstart", (event) => {
  event.preventDefault();
  joystickPressed = true;
});

joystick.addEventListener("touchmove", (event) => {
  event.preventDefault();
  if (joystickPressed) {
    moveJoystick(event);
  }
});

joystick.addEventListener("touchend", (event) => {
  event.preventDefault();
  joystickPressed = false;
  keys.w = false;
  keys.s = false;
});

// Function to move the joystick and control the paddle
function moveJoystick(event) {
  const touch = event.touches[0];
  const joystickRect = joystick.getBoundingClientRect();
  const centerJoystickY = joystickRect.top + joystickRect.height / 2;
  const distanceY = touch.clientY - centerJoystickY;

  if (distanceY > 0) {
    keys.w = false;
    keys.s = true;
  } else {
    keys.w = true;
    keys.s = false;
  }
}

function update() {
  if (!isGamePaused) {
    movePaddle();
    moveAI();
    moveBall();
    checkScore();
  }

  requestAnimationFrame(update);
}

function movePaddle() {
  if (keys.w && leftPaddle.offsetTop > 0) {
    leftPaddle.style.top = leftPaddle.offsetTop - paddleSpeed + "px";
  }
  if (
    keys.s &&
    leftPaddle.offsetTop < container.offsetHeight - leftPaddle.offsetHeight
  ) {
    leftPaddle.style.top = leftPaddle.offsetTop + paddleSpeed + "px";
  }
}

function moveAI() {
  const reactionDelay = 500;
  setTimeout(() => {
    if (ballX > container.offsetWidth / 2) {
      const targetY = ballY - rightPaddle.offsetHeight / 2;

      const minY = 0;
      const maxY = container.offsetHeight - rightPaddle.offsetHeight;
      const limitedTargetY = Math.max(minY, Math.min(maxY, targetY));

      const distance = limitedTargetY - rightPaddle.offsetTop;

      const direction = Math.sign(distance);
      const moveSpeed = Math.min(Math.abs(distance), aiSpeed);

      rightPaddle.style.top =
        rightPaddle.offsetTop + direction * moveSpeed + "px";
    }
  }, reactionDelay);
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= container.offsetHeight - ball.offsetHeight) {
    ballSpeedY = -ballSpeedY;
  }

  if (
    ballX <= leftPaddle.offsetWidth &&
    ballY + ball.offsetHeight >= leftPaddle.offsetTop &&
    ballY <= leftPaddle.offsetTop + leftPaddle.offsetHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (
    ballX + ball.offsetWidth >=
      container.offsetWidth - rightPaddle.offsetWidth &&
    ballY + ball.offsetHeight >= rightPaddle.offsetTop &&
    ballY <= rightPaddle.offsetTop + rightPaddle.offsetHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballX <= 0) {
    resetBall();
    aiScore++;
  }

  if (ballX >= container.offsetWidth - ball.offsetWidth) {
    resetBall();
    playerScore++;
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

function checkScore() {
  scoreDisplay.textContent = `Player: ${playerScore} - AI: ${aiScore}`;
}

function resetBall() {
  ballX = container.offsetWidth / 2;
  ballY = container.offsetHeight / 2;
  ballSpeedX *= -1;
  ballSpeedY = Math.random() > 0.5 ? -2 : 2;
}

const backToMenu = document.querySelector("#backtomenu");

backToMenu.addEventListener("click", () => {
  window.history.go(-1);
});

const SinglePlayerButton = document.querySelector("#startAIButton");
const VSButton = document.querySelector("#start1v1Button");
const cover = document.querySelector("#cover");
const menu = document.querySelector(".start-menu");
const pauseButton = document.querySelector("#pauseButton");

pauseButton.style.display = "none";
cover.style.transition = "all 100ms ease-in-out";
menu.style.transition = "all 100ms ease-in-out";
cover.style.opacity = 1;
menu.style.opacity = 1;

SinglePlayerButton.addEventListener("click", () => {
  cover.style.opacity = 0;
  menu.style.opacity = 0;
  pauseButton.style.display = "block";

  setTimeout(() => {
    cover.style.display = "none";
    menu.style.display = "none";
  }, 1000);
});

VSButton.addEventListener("click", () => {
  cover.style.opacity = 0;
  menu.style.opacity = 0;
  pauseButton.style.display = "block";

  setTimeout(() => {
    cover.style.display = "none";
    menu.style.display = "none";
  }, 1000);
});

pauseButton.addEventListener("click", () => {
  pauseButton.style.display = "none";
  cover.style.display = "block";
  menu.style.display = "flex";

  setTimeout(() => {
    pauseGame();
    cover.style.opacity = 1;
    menu.style.opacity = 1;
  }, 100);
});

// Pause Game
function pauseGame() {
  isGamePaused = true;
}

// Resume Game
function resumeGame() {
  isGamePaused = false;
}

update();
