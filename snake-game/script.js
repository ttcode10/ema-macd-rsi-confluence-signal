(() => {
  "use strict";

  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const highScoreEl = document.getElementById("high-score");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayMsg = document.getElementById("overlay-msg");
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const restartBtn = document.getElementById("restart-btn");
  const dpad = document.getElementById("dpad");

  const GRID_SIZE = 20; // 20x20 cells
  const CELL = canvas.width / GRID_SIZE;
  const BASE_SPEED_MS = 140; // ms per tick at start
  const MIN_SPEED_MS = 70;
  const SPEED_STEP = 3; // ms faster per food eaten
  const HIGH_SCORE_KEY = "snake_high_score";

  let snake, direction, nextDirection, food, score, highScore;
  let running = false;
  let paused = false;
  let tickMs = BASE_SPEED_MS;
  let loopHandle = null;

  function loadHighScore() {
    const v = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0", 10);
    return Number.isFinite(v) ? v : 0;
  }

  function saveHighScore(v) {
    localStorage.setItem(HIGH_SCORE_KEY, String(v));
  }

  function randomCell(exclude) {
    let cell;
    do {
      cell = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (exclude.some((c) => c.x === cell.x && c.y === cell.y));
    return cell;
  }

  function resetState() {
    const start = Math.floor(GRID_SIZE / 2);
    snake = [
      { x: start - 1, y: start },
      { x: start - 2, y: start },
      { x: start - 3, y: start },
    ];
    direction = "right";
    nextDirection = "right";
    score = 0;
    tickMs = BASE_SPEED_MS;
    food = randomCell(snake);
    scoreEl.textContent = "0";
  }

  function draw() {
    // background
    ctx.fillStyle = "#16213a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(canvas.width, i * CELL);
      ctx.stroke();
    }

    // food
    const fx = food.x * CELL + CELL / 2;
    const fy = food.y * CELL + CELL / 2;
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(fx, fy, CELL * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(fx - CELL * 0.1, fy - CELL * 0.1, CELL * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const px = seg.x * CELL;
      const py = seg.y * CELL;
      const pad = isHead ? 1 : 2;
      ctx.fillStyle = isHead ? "#4ade80" : "#22c55e";
      roundRect(px + pad, py + pad, CELL - pad * 2, CELL - pad * 2, 5);
      ctx.fill();

      if (isHead) {
        ctx.fillStyle = "#06210f";
        const eyeSize = CELL * 0.09;
        const offsets = eyeOffsetsForDirection(direction);
        offsets.forEach(([ex, ey]) => {
          ctx.beginPath();
          ctx.arc(px + CELL / 2 + ex, py + CELL / 2 + ey, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
  }

  function eyeOffsetsForDirection(dir) {
    const d = CELL * 0.18;
    switch (dir) {
      case "up": return [[-d, -d], [d, -d]];
      case "down": return [[-d, d], [d, d]];
      case "left": return [[-d, -d], [-d, d]];
      case "right": return [[d, -d], [d, d]];
      default: return [[d, -d], [d, d]];
    }
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function isOpposite(a, b) {
    return (
      (a === "up" && b === "down") ||
      (a === "down" && b === "up") ||
      (a === "left" && b === "right") ||
      (a === "right" && b === "left")
    );
  }

  function setDirection(dir) {
    if (!running || paused) return;
    if (isOpposite(dir, direction)) return;
    nextDirection = dir;
  }

  function step() {
    direction = nextDirection;
    const head = snake[0];
    let nx = head.x;
    let ny = head.y;
    if (direction === "up") ny -= 1;
    else if (direction === "down") ny += 1;
    else if (direction === "left") nx -= 1;
    else if (direction === "right") nx += 1;

    // wall collision
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) {
      return gameOver();
    }
    // self collision
    if (snake.some((seg) => seg.x === nx && seg.y === ny)) {
      return gameOver();
    }

    const newHead = { x: nx, y: ny };
    snake.unshift(newHead);

    if (nx === food.x && ny === food.y) {
      score += 10;
      scoreEl.textContent = String(score);
      food = randomCell(snake);
      tickMs = Math.max(MIN_SPEED_MS, tickMs - SPEED_STEP);
      restartLoop();
    } else {
      snake.pop();
    }

    draw();
  }

  function gameOver() {
    running = false;
    stopLoop();
    if (score > highScore) {
      highScore = score;
      saveHighScore(highScore);
      highScoreEl.textContent = String(highScore);
    }
    overlayTitle.textContent = "游戏结束 💥";
    overlayMsg.innerHTML = `本局得分 <strong style="color:#4ade80">${score}</strong><br/>再试一次吧！`;
    startBtn.textContent = "再来一局";
    overlay.classList.remove("hidden");
    pauseBtn.textContent = "暂停";
  }

  function startLoop() {
    stopLoop();
    loopHandle = setInterval(step, tickMs);
  }

  function restartLoop() {
    if (running && !paused) startLoop();
  }

  function stopLoop() {
    if (loopHandle) {
      clearInterval(loopHandle);
      loopHandle = null;
    }
  }

  function startGame() {
    resetState();
    running = true;
    paused = false;
    overlay.classList.add("hidden");
    pauseBtn.textContent = "暂停";
    draw();
    startLoop();
  }

  function togglePause() {
    if (!running) return;
    paused = !paused;
    if (paused) {
      stopLoop();
      pauseBtn.textContent = "继续";
      overlayTitle.textContent = "已暂停";
      overlayMsg.innerHTML = "点击继续或按空格键恢复游戏";
      startBtn.textContent = "继续游戏";
      overlay.classList.remove("hidden");
    } else {
      overlay.classList.add("hidden");
      pauseBtn.textContent = "暂停";
      startLoop();
    }
  }

  // Keyboard controls
  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const map = {
      arrowup: "up", w: "up",
      arrowdown: "down", s: "down",
      arrowleft: "left", a: "left",
      arrowright: "right", d: "right",
    };
    if (map[key]) {
      e.preventDefault();
      if (!running && !overlay.classList.contains("hidden")) {
        startGame();
      }
      setDirection(map[key]);
    } else if (key === " ") {
      e.preventDefault();
      if (running) togglePause();
    }
  });

  // Buttons
  startBtn.addEventListener("click", () => {
    if (paused) {
      togglePause();
    } else {
      startGame();
    }
  });
  pauseBtn.addEventListener("click", togglePause);
  restartBtn.addEventListener("click", startGame);

  // D-pad
  dpad.addEventListener("click", (e) => {
    const btn = e.target.closest(".dpad-btn");
    if (!btn) return;
    setDirection(btn.dataset.dir);
  });

  // Touch swipe on board
  const boardContainer = document.querySelector(".board-container");
  let touchStart = null;
  boardContainer.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  boardContainer.addEventListener("touchend", (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const THRESHOLD = 20;
    if (Math.max(absX, absY) < THRESHOLD) {
      touchStart = null;
      return;
    }
    if (absX > absY) {
      setDirection(dx > 0 ? "right" : "left");
    } else {
      setDirection(dy > 0 ? "down" : "up");
    }
    touchStart = null;
    if (!running && !overlay.classList.contains("hidden")) {
      startGame();
    }
  }, { passive: true });

  // Init
  highScore = loadHighScore();
  highScoreEl.textContent = String(highScore);
  resetState();
  draw();
})();
