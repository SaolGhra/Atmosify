const container = document.querySelector(".container");
const leftPaddle = document.getElementById("leftPaddle");
const rightPaddle = document.getElementById("rightPaddle");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");

let ballX = container.offsetWidth / 2;
let ballY = container.offsetHeight / 2;
let ballSpeedX = 2;
let ballSpeedY = 2;
const paddleSpeed = 5;
const aiSpeed = 2;
let playerScore = 0;
let aiScore = 0;

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

function update() {
  movePaddle();
  moveAI();
  moveBall();
  checkScore();

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
  if (ballY > rightPaddle.offsetTop + rightPaddle.offsetHeight / 2) {
    if (
      rightPaddle.offsetTop <
      container.offsetHeight - rightPaddle.offsetHeight
    ) {
      rightPaddle.style.top = rightPaddle.offsetTop + aiSpeed + "px";
    }
  } else if (ballY < rightPaddle.offsetTop + rightPaddle.offsetHeight / 2) {
    if (rightPaddle.offsetTop > 0) {
      rightPaddle.style.top = rightPaddle.offsetTop - aiSpeed + "px";
    }
  }
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= container.offsetHeight - ball.offsetHeight) {
    ballSpeedY = -ballSpeedY;
  }

  if (
    ballX <= leftPaddle.offsetWidth &&
    ballY >= leftPaddle.offsetTop &&
    ballY <= leftPaddle.offsetTop + leftPaddle.offsetHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (
    ballX >=
      container.offsetWidth - rightPaddle.offsetWidth - ball.offsetWidth &&
    ballY >= rightPaddle.offsetTop &&
    ballY <= rightPaddle.offsetTop + rightPaddle.offsetHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballX <= 0) {
    aiScore++;
    resetBall();
  } else if (ballX >= container.offsetWidth - ball.offsetWidth) {
    playerScore++;
    resetBall();
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

update();
