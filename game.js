const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let ghostCount = 4;
let ghostImageLocations = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 },
];

let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let ghosts = [];
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "#1A1B4B";
let wallColor = "#4169E1";
let foodColor = "#FFA500";
let backgroundColor = "#000000";
let scoreColor = "#00FF00";
let livesColor = "#FF4500";

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1],
  [1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1],
  [0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0],
  [1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let randomTargetsForGhosts = [
  { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  { x: (map[0].length - 2) * oneBlockSize, y: 1 * oneBlockSize },
  { x: 10 * oneBlockSize, y: 8 * oneBlockSize },
  { x: 10 * oneBlockSize, y: 12 * oneBlockSize },
  { x: 0, y: 10 * oneBlockSize },
  { x: (map[0].length - 1) * oneBlockSize, y: 10 * oneBlockSize },
];

let createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5
  );
};

let gameLoop = () => {
  update();
  if (isGameOver()) return; // Stop the game if it's over
  draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
  createNewPacman();
  createGhosts();
};

let onGhostCollision = () => {
  lives--;
  restartPacmanAndGhosts();
  if (lives == 0) {
  }
};

let update = () => {
  pacman.moveProcess();
  pacman.eat();
  updateGhosts();
  if (pacman.checkGhostCollision(ghosts)) {
    onGhostCollision();
  }
};

let drawFoods = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        canvasContext.save();
        canvasContext.shadowColor = foodColor;
        canvasContext.shadowBlur = 5;
        createRect(
          j * oneBlockSize + oneBlockSize / 3,
          i * oneBlockSize + oneBlockSize / 3,
          oneBlockSize / 4,
          oneBlockSize / 4,
          foodColor
        );
        canvasContext.restore();
      }
    }
  }
};

let drawRemainingLives = () => {
  canvasContext.font = "bold 24px Arial";
  canvasContext.fillStyle = livesColor;
  canvasContext.strokeStyle = "#000";
  canvasContext.lineWidth = 2;
  canvasContext.strokeText("LIVES:", 220, oneBlockSize * (map.length + 1));
  canvasContext.fillText("LIVES:", 220, oneBlockSize * (map.length + 1));

  for (let i = 0; i < lives; i++) {
    canvasContext.save();
    canvasContext.shadowColor = livesColor;
    canvasContext.shadowBlur = 10;
    canvasContext.drawImage(
      pacmanFrames,
      2 * oneBlockSize,
      0,
      oneBlockSize,
      oneBlockSize,
      350 + i * (oneBlockSize + 5),
      oneBlockSize * map.length + 2,
      oneBlockSize,
      oneBlockSize
    );
    canvasContext.restore();
  }
};

let isGameOver = () => {
  if (lives === 0) {
    clearInterval(gameInterval); // Stop the game loop
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "bold 24px Arial";
    canvasContext.fillStyle = "#FF0000";
    canvasContext.strokeStyle = "#000";
    canvasContext.lineWidth = 2;
    canvasContext.strokeText(
      "GAME OVER",
      canvas.width / 2 - 100,
      canvas.height / 2
    );
    canvasContext.fillText(
      "GAME OVER",
      canvas.width / 2 - 100,
      canvas.height / 2
    );
    return true; // Return true to indicate the game is over
  }
  return false;
};

let drawScore = () => {
  canvasContext.font = "bold 24px Arial";
  canvasContext.fillStyle = scoreColor;
  canvasContext.strokeStyle = "#000";
  canvasContext.lineWidth = 2;
  let scoreText = "SCORE: " + score;
  canvasContext.strokeText(scoreText, 10, oneBlockSize * (map.length + 1));
  canvasContext.fillText(scoreText, 10, oneBlockSize * (map.length + 1));
};

let draw = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  let time = Date.now() / 2000;
  let gradient = canvasContext.createRadialGradient(
    canvas.width / 2 + Math.cos(time) * 50,
    canvas.height / 2 + Math.sin(time) * 50,
    50,
    canvas.width / 2,
    canvas.height / 2,
    500
  );
  gradient.addColorStop(0, "#000069");
  gradient.addColorStop(0.5, "#000033");
  gradient.addColorStop(1, backgroundColor);
  canvasContext.fillStyle = gradient;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  drawWalls();
  drawFoods();
  drawGhosts();
  pacman.draw();
  drawScore();
  drawRemainingLives();
};

let drawWalls = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 1) {
        createRect(
          j * oneBlockSize,
          i * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          wallColor
        );
        if (j > 0 && map[i][j - 1] == 1) {
          createRect(
            j * oneBlockSize,
            i * oneBlockSize + wallOffset,
            wallSpaceWidth + wallOffset,
            wallSpaceWidth,
            wallInnerColor
          );
        }

        if (j < map[0].length - 1 && map[i][j + 1] == 1) {
          createRect(
            j * oneBlockSize + wallOffset,
            i * oneBlockSize + wallOffset,
            wallSpaceWidth + wallOffset,
            wallSpaceWidth,
            wallInnerColor
          );
        }

        if (i < map.length - 1 && map[i + 1][j] == 1) {
          createRect(
            j * oneBlockSize + wallOffset,
            i * oneBlockSize + wallOffset,
            wallSpaceWidth,
            wallSpaceWidth + wallOffset,
            wallInnerColor
          );
        }

        if (i > 0 && map[i - 1][j] == 1) {
          createRect(
            j * oneBlockSize + wallOffset,
            i * oneBlockSize,
            wallSpaceWidth,
            wallSpaceWidth + wallOffset,
            wallInnerColor
          );
        }
      }
    }
  }
};

let createGhosts = () => {
  ghosts = [];
  for (let i = 0; i < ghostCount * 2; i++) {
    let newGhost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostImageLocations[i % 4].x,
      ghostImageLocations[i % 4].y,
      124,
      116,
      6 + i
    );
    ghosts.push(newGhost);
  }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;
  setTimeout(() => {
    if (k == 37 || k == 65) {
      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 38 || k == 87) {
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 39 || k == 68) {
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 40 || k == 83) {
      pacman.nextDirection = DIRECTION_BOTTOM;
    }
  }, 1);
});
