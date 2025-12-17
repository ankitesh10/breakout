const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("runButton");

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

document.addEventListener("mousemove", handleMouseMove);

let score = 0;

// bricks
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];

// fill bricks array
for (let y = 0; y < brickRowCount; y++) {
  bricks[y] = [];
  for (let x = 0; x < brickColumnCount; x++) {
    bricks[y][x] = { x: 0, y: 0, status: 1 };
  }
}

// ball and paddle
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const borderRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let leftPressed = false;
let rightPressed = false;

let paddleX = (canvas.width - paddleWidth) / 2;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawball();
  drawPaddle();
  detectCollisionWithBricks();
  drawBricks();
  drawScore();

  if (x + dx < borderRadius || x + dx > canvas.width - borderRadius) {
    dx = -dx;
  }

  if (y + dy < borderRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - borderRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      if (x < paddleX + paddleWidth / 2) {
        dx = -2;
      } else {
        dx = 2;
      }

      dy = -dy;
    } else {
      alert("Game over");
      document.location.reload();
    }
  }

  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  }

  if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

function drawball() {
  ctx.beginPath();
  ctx.arc(x, y, borderRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(e) {
  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  }
}

button.addEventListener("click", function () {
  draw();
});
function drawBricks() {
  for (let y = 0; y < brickRowCount; y++) {
    for (let x = 0; x < brickColumnCount; x++) {
      const brick = bricks[y][x];

      if (brick.status) {
        const brickX = x * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = y * (brickHeight + brickPadding) + brickOffsetTop;

        brick.x = brickX;
        brick.y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  ctx.beginPath();
  ctx.rect(brickOffsetLeft, brickOffsetTop, brickWidth, brickHeight);
}

function detectCollisionWithBricks() {
  for (let brickY = 0; brickY < brickRowCount; brickY++) {
    for (let brickX = 0; brickX < brickColumnCount; brickX++) {
      const brick = bricks[brickY][brickX];

      if (brick.status) {
        if (
          x > brick.x &&
          x < brick.x + brickWidth &&
          y > brick.y &&
          y < brick.y + brickHeight
        ) {
          dy = -dy;
          brick.status = 0;
          score++;

          if (score === brickRowCount * brickColumnCount) {
            alert("Congratulation, you have won!!!!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function handleMouseMove(e) {
  const relativeX = e.clientX - canvas.offsetLeft;

  console.log(relativeX, canvas.width);

  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
