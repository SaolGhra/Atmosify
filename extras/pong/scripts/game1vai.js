export function start1vAI() {
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

  const keys = {
    w: false,
    s: false,
  };

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

  update();
}
