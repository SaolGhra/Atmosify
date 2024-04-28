import { startAIVsAI } from "./gameAIVAI.js";
import { start1v1 } from "./game1v1.js";
import { start1vAI } from "./game1vai.js";

let isGamePaused = false;

// Function to start the selected game mode
function startGame(startFunction) {
  // Hide menu and show game
  hideMenu();

  // Start the selected game mode
  startFunction();
}

// Event listeners for game mode buttons
document.getElementById("start1v1Button").addEventListener("click", () => {
  startGame(start1v1);
});

document.getElementById("startAIButton").addEventListener("click", () => {
  startGame(start1vAI);
});

document.getElementById("backtomenu").addEventListener("click", () => {
  showMenu();
});

const pauseButton = document.querySelector("#pauseButton");

pauseButton.addEventListener("click", () => {
  if (isGamePaused) {
    resumeGame();
  } else {
    pauseGame();
  }
});

const cover = document.querySelector("#cover");
const menu = document.querySelector(".start-menu");

function hideMenu() {
  cover.style.display = "none";
  menu.style.display = "none";
  pauseButton.style.display = "block";
}

function showMenu() {
  cover.style.backgroundImage = "url('" + startAIVsAI() + "')"; // Set background image URL correctly

  cover.style.display = "block";
  menu.style.display = "flex";
  pauseButton.style.display = "none";
}

// Pause Game
function pauseGame() {
  isGamePaused = true;
  showMenu();
}

// Resume Game
function resumeGame() {
  isGamePaused = false;
  hideMenu(); // Hide menu when resuming the game
}
