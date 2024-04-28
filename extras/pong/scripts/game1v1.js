export function start1v1() {
  // Define container and paddle elements
  const container = document.querySelector(".container");
  const leftPaddle = document.getElementById("leftPaddle");
  const rightPaddle = document.getElementById("rightPaddle");
  const ball = document.getElementById("ball");
  const scoreDisplay = document.getElementById("score");

  // Define game variables
  let ballX = container.offsetWidth / 2;
  let ballY = container.offsetHeight / 2;
  let ballSpeedX = 2;
  let ballSpeedY = 2;
  const paddleSpeed = 5;
  let player1Score = 0;
  let player2Score = 0;
  let isGamePaused = false;

  // Define event listeners for player 1 keys
  const keys = {
    w: false,
    s: false,
  };

  // Add event listeners to track keydown and keyup events for player 1
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

  // Define event listeners for player 2 keys (arrow keys)
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      keys.up = true;
    } else if (event.key === "ArrowDown") {
      keys.down = true;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") {
      keys.up = false;
    } else if (event.key === "ArrowDown") {
      keys.down = false;
    }
  });

  // Function to move player 2 paddle
  function moveRightPaddle() {
    if (keys.up && rightPaddle.offsetTop > 0) {
      rightPaddle.style.top = rightPaddle.offsetTop - paddleSpeed + "px";
    }
    if (
      keys.down &&
      rightPaddle.offsetTop < container.offsetHeight - rightPaddle.offsetHeight
    ) {
      rightPaddle.style.top = rightPaddle.offsetTop + paddleSpeed + "px";
    }
  }

  // Function to move player 1 paddle
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

  // Function to move the ball
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
      player2Score++;
    }

    if (ballX >= container.offsetWidth - ball.offsetWidth) {
      resetBall();
      player1Score++;
    }

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
  }

  // Function to check score
  function checkScore() {
    scoreDisplay.textContent = `Player 1: ${player1Score} - Player 2: ${player2Score}`;
  }

  // Function to reset the ball position
  function resetBall() {
    ballX = container.offsetWidth / 2;
    ballY = container.offsetHeight / 2;
    ballSpeedX *= -1;
    ballSpeedY = Math.random() > 0.5 ? -2 : 2;
  }

  // Main update loop
  function update() {
    if (!isGamePaused) {
      movePaddle();
      moveRightPaddle();
      moveBall();
      checkScore();
    }

    requestAnimationFrame(update);
  }

  // Start the game loop
  update();
}
