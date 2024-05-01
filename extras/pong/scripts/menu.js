import { start1v1 } from "./game1v1.js";
import { start1vAI } from "./game1vai.js";

let isGamePaused = false;
let currentGameMode = null;

document.getElementById("start1v1Button").addEventListener("click", () => {
  startGame(start1v1);
});

document.getElementById("startAIButton").addEventListener("click", () => {
  startGame(start1vAI);
});

function startGame(gameMode) {
  hideMenu();
  gameMode();
}

document.getElementById("pauseButton").addEventListener("click", () => {
  location.reload();
});

const cover = document.querySelector("#cover");
const menu = document.querySelector(".start-menu");

function hideMenu() {
  cover.style.display = "none";
  menu.style.display = "none";
}

// Pause Game
// function pauseGame() {
//   isGamePaused = true;
//   if (currentGameMode) {
//     currentGameMode.pause();
//   }
// }

// // Resume Game
// function resumeGame() {
//   isGamePaused = false;
//   if (currentGameMode) {
//     currentGameMode.resume();
//   }
// }

const backToMenu = document.querySelector("#backtomenu");

backToMenu.addEventListener("click", () => {
  window.history.go(-1);
});

const pauseButton = document.querySelector("#pauseButton");

pauseButton.addEventListener("click", () => {
  location.reload();
  showMenu();
});

function showMenu() {
  cover.style.display = "block";
  menu.style.display = "flex";
}
