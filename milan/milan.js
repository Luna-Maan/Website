url = "https://tutorial-worker.pvanoostveenneo2.workers.dev/leaderboard/voetbal"

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
const maxCanvasWidth = 600;
canvas.width = Math.min(window.innerWidth, maxCanvasWidth);
canvas.height = window.innerHeight;

const goalWidth = 200;
const ballRadius = 15;
let score = 0;
let gameOver = false;

// Ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  dx: 0,
  dy: 0,
  speed: 3
};

// Goal object
const goal = {
  x: (canvas.width - goalWidth) / 2,
  y: 10,
  width: goalWidth,
  height: 20
};

// Goalkeeper object
const goalkeeper = {
  x: canvas.width / 2 - 50,
  y: goal.y + 50,
  width: 100,
  height: 20,
  speed: 3,
  direction: 1 // 1 for right, -1 for left
};

// Player objects
const players = [];

// Add new players at random positions
function addPlayer() {
  const player = {
    x: Math.random() * (canvas.width - 50) + 25, // Ensure players are not at the edge
    y: Math.random() * (canvas.height - 200) + 100, // Keep players away from the goal and edges
    width: 30,
    height: 30,
    dx: (Math.random() - 0.5) * 4, // Random horizontal speed
    dy: (Math.random() - 0.5) * 1  // Random vertical speed
  };
  players.push(player);
}

// Touch and mouse event handling
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

// Touch events
canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  dragStartX = touch.clientX;
  dragStartY = touch.clientY;
  isDragging = true;
});

canvas.addEventListener("touchmove", (e) => {
  if (!isDragging || gameOver) return;
  const touch = e.touches[0];
  moveBall(touch.clientX, touch.clientY);
});

canvas.addEventListener("touchend", () => {
  isDragging = false;
});

//mouse events
canvas.addEventListener("mousedown", (e) => {
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  isDragging = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging || gameOver) return;
  moveBall(e.clientX, e.clientY);
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});


// Helper functions for moving and stopping the ball
function moveBall(clientX, clientY) {
  const dx = clientX - dragStartX;
  const dy = clientY - dragStartY;
  ball.dx = dx * 0.5;
  ball.dy = dy * 0.5;
  dragStartX = clientX;
  dragStartY = clientY;
}

function stopBall() {
  ball.dx = 0;
  ball.dy = 0;
}

// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

// Draw the goal
function drawGoal() {
  ctx.fillStyle = "green";
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
}

// Draw the goalkeeper
function drawGoalkeeper() {
  ctx.fillStyle = "red";
  ctx.fillRect(goalkeeper.x, goalkeeper.y, goalkeeper.width, goalkeeper.height);
}

// Draw the players
function drawPlayers() {
  ctx.fillStyle = "purple";
  players.forEach((player) => {
    ctx.fillRect(player.x, player.y, player.width, player.height);
  });
}

// Move players
function updatePlayers() {
  players.forEach((player) => {
    player.x += player.dx;
    player.y += player.dy;

    // Bounce off canvas boundaries
    if (player.x < 0 || player.x + player.width > canvas.width) {
      player.dx *= -1;
    }
    if (player.y < 0 || player.y + player.height + 100 > canvas.height) {
      player.dy *= -1;
    }
  });
}

// Draw the score
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Update ball position
function updateBall() {
  if (gameOver) return;

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Boundary collision
  if (ball.x - ballRadius < 0) ball.x = ballRadius;
  if (ball.x + ballRadius > canvas.width) ball.x = canvas.width - ballRadius;
  if (ball.y - ballRadius < 0) ball.y = ballRadius;
  if (ball.y + ballRadius > canvas.height) ball.y = canvas.height - ballRadius;

  // Goal collision
  if (
    ball.x > goal.x &&
    ball.x < goal.x + goal.width &&
    ball.y - ballRadius < goal.y + goal.height
  ) {
    score++;
    resetBall();

    // Add a new player if score > 1
    if (score > 1) {
      addPlayer();
    }
  }

  // Goalkeeper collision
  if (
    ball.x + ballRadius > goalkeeper.x &&
    ball.x - ballRadius < goalkeeper.x + goalkeeper.width &&
    ball.y + ballRadius > goalkeeper.y &&
    ball.y - ballRadius < goalkeeper.y + goalkeeper.height &&
    score > 0
  ) {
    gameOver = true;
  }

  // Player collision
  players.forEach((player) => {
    if (
      ball.x + ballRadius > player.x &&
      ball.x - ballRadius < player.x + player.width &&
      ball.y + ballRadius > player.y &&
      ball.y - ballRadius < player.y + goalkeeper.height
    ) {
      gameOver = true;
    }
  });
}

// Update goalkeeper position
function updateGoalkeeper() {
  if (score > 0) {
    goalkeeper.x += goalkeeper.speed * goalkeeper.direction;

    // Reverse direction on boundary collision
    if (goalkeeper.x < 0 || goalkeeper.x + 50 < goal.x || goalkeeper.x + goalkeeper.width > canvas.width || goalkeeper.x + goalkeeper.width - 50 > goal.width + goal.x) {
      goalkeeper.direction *= -1;
    }
  }
}

// Reset ball to start position
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 50;
  stopBall();
}

const modal = document.getElementById("modal");
const leaderboard = document.getElementById("leaderboard");

requested = false
posted = false
submitted = false
text = ""
locatieText = false
// Populate leaderboard content
async function showLeaderboard() {

  if (requested == false) {
    requested = true
    let response = await fetch(url);
    text = await response.text();
    text = JSON.parse(text);
    console.log(text);

    let scoreText = document.getElementById("modal-content");
    scoreText.innerHTML = `Your Score is: ${score}!`

    let leaderboardRows = text
      .map((player) => `<tr><td>${player.name}</td><td>${player.score}</td></tr>`)
      .join("");

    modal.style.display = "block";
    leaderboard.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        ${leaderboardRows}
      </tbody>
  `;
  }

  if (score > 9 & locatieText == false) {
    locatieText = true
    console.log(score)
    const modalElement = document.getElementById("modal-contentm");

    // Create a new h2 element
    const newHeading = document.createElement("h2");

    // Set the text content for the new h2 element
    newHeading.textContent = "Het cadeau bevindt zich in de keuken onder de bank.";

    // Optionally, add a class or id to the new h2 element
    newHeading.id = "new-heading";
    newHeading.className = "modal-title";

    // Append the new h2 element to the modal
    modalElement.appendChild(newHeading);
  }



  const nameField = document.getElementById("name");
  nameField.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const playerName = nameField.value.trim();
      if (playerName) {
        await submitScore(playerName);
        showLeaderboard(); // Refresh leaderboard after submitting
      } else {
        alert("Please enter your name before submitting.");
      }
    }

  });


  const restartButton = document.getElementById("restartButton");
  restartButton.addEventListener("click", restartGame);
}

async function submitScore(playerName) {
  // Add the new player to the leaderboard
  if (submitted == false) {
    submitted = true
    const existingPlayerIndex = text.findIndex(player => player.name === playerName);

    if (existingPlayerIndex !== -1) {
      // If the player exists, update their score if the new score is better
      if (text[existingPlayerIndex].score < score) {
        text[existingPlayerIndex].score = score;
      }
    } else {
      // If the player doesn't exist, add them to the leaderboard
      text.push({ name: playerName, score: score });
    }
  }

  // Sort the leaderboard again
  text.sort((a, b) => b.score - a.score);

  data = {
    text: text,
    password: "test2",
    username: "test"
  }

  // Send updated leaderboard to the server
  if (posted == false) {
    console.log(JSON.stringify(text))
    posted = true
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log(response);
    requested = false;
  }
}

// Restart the game
function restartGame() {
  requested = false
  posted = false
  submitted = false
  modal.style.display = "none";
  gameOver = false;
  score = 0;
  players.length = 0;
  resetBall();
  goalkeeper.x = canvas.width / 2 - 50;
}

// Display the leaderboard when the game ends
function drawGameOver() {
  // Show leaderboard
  showLeaderboard();
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    drawGoal();
    drawBall();
    drawScore();

    if (score > 0) {
      drawGoalkeeper();
      updateGoalkeeper();
    }

    if (score > 1) {
      drawPlayers();
      updatePlayers();
    }

    updateBall();
  } else {
    drawGameOver();
  }


  requestAnimationFrame(gameLoop);

}

// Start the game
gameLoop();
