export function startAIVsAI() {
  const container = document.querySelector(".container");
  const leftPaddle = document.getElementById("leftPaddle");
  const rightPaddle = document.getElementById("rightPaddle");
  const ball = document.getElementById("ball");
  const scoreDisplay = document.getElementById("score");

  let ballX = container.offsetWidth / 2;
  let ballY = container.offsetHeight / 2;
  let ballSpeedX = 2;
  let ballSpeedY = 2;
  const aiSpeed = 1.65;
  let playerScore = 0;
  let aiScore = 0;
  let isGamePaused = false;

  function update() {
    if (!isGamePaused) {
      moveAI();
      moveBall();
      checkScore();
    }

    requestAnimationFrame(update);
  }

  function moveAI() {
    const reactionDelay = 500;
    setTimeout(() => {
      // Left Paddle AI
      const targetYLeft = ballY - leftPaddle.offsetHeight / 2;
      const minYLeft = 0;
      const maxYLeft = container.offsetHeight - leftPaddle.offsetHeight;
      const limitedTargetYLeft = Math.max(
        minYLeft,
        Math.min(maxYLeft, targetYLeft)
      );
      const distanceLeft = limitedTargetYLeft - leftPaddle.offsetTop;
      const directionLeft = Math.sign(distanceLeft);
      const moveSpeedLeft = Math.min(Math.abs(distanceLeft), aiSpeed);
      leftPaddle.style.top =
        leftPaddle.offsetTop + directionLeft * moveSpeedLeft + "px";

      // Right Paddle AI
      const targetYRight = ballY - rightPaddle.offsetHeight / 2;
      const minYRight = 0;
      const maxYRight = container.offsetHeight - rightPaddle.offsetHeight;
      const limitedTargetYRight = Math.max(
        minYRight,
        Math.min(maxYRight, targetYRight)
      );
      const distanceRight = limitedTargetYRight - rightPaddle.offsetTop;
      const directionRight = Math.sign(distanceRight);
      const moveSpeedRight = Math.min(Math.abs(distanceRight), aiSpeed);
      rightPaddle.style.top =
        rightPaddle.offsetTop + directionRight * moveSpeedRight + "px";
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
