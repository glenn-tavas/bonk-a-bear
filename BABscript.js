const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetSpeedButton = document.getElementById('resetSpeed');
const resetScoreButton = document.getElementById('resetScore');
const scoreElement = document.getElementById('scoreValue');
const explosionDuration = 100; // Duration in milliseconds for the explosion emoji to stay


function drawExplosion(x, y) {
    ctx.fillStyle = 'red';
    ctx.font = '160px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💥', x, y);
}

function clearExplosion() {
    explosionTimer = null;
    clearCanvas();
    drawGrid();
    moveBearRandomly(); // Move the bear to a new position

    // Clear the explosion emoji after a brief duration
    setTimeout(() => {
        clearCanvas();
        drawGrid();
    }, explosionDuration);
}

function whackBear(x, y) {
    if (!bearClicked) {
        const col = Math.floor(x / holeSize);
        const row = Math.floor(y / holeSize);

        if (bearPosition.row === row && bearPosition.col === col) {
            // Draw explosion in the middle of the hole
            const centerX = col * holeSize + holeSize / 2;
            const centerY = row * holeSize + holeSize / 2;
            drawExplosion(centerX, centerY);

            score += 10;
            updateScore();
            bearClicked = true; // Set bearClicked flag
            
            bearInterval -= 50; // Decrease the interval when the bear is clicked
            if (bearInterval < 500) {
                bearInterval = 500; // Set a minimum interval
            }

            setTimeout(() => {
                bearClicked = false;
                clearCanvas();
                drawGrid();
            }, 800); // Reset bearClicked flag and clear explosion after 1 second
        }
    }
}


const numCols = 3;
const numRows = 3;
const holeSize = canvas.width / numCols;

let score = 0;
let bearPosition = { row: 0, col: 0 }; // Initial bear position
let bearInterval = 1500; // Initial interval for moving the bear (in milliseconds)
let bearClicked = false; // Flag to track if the bear has been clicked

function drawHole(x, y) {
    ctx.fillStyle = '#FFFDD4';
    ctx.beginPath();
    ctx.arc(x, y, holeSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawBear(x, y) {
    ctx.fillStyle = 'white';
    ctx.font = '165px Arial'; // Increase the font size to make the bear bigger
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐻', x, y);
}


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = col * holeSize + holeSize / 2;
            const y = row * holeSize + holeSize / 2;

            // Draw hole
            drawHole(x, y);

            // Draw bear if its position matches the current hole
            if (bearPosition.row === row && bearPosition.col === col) {
                drawBear(x, y);
            }
        }
    }
}

let previousBearPosition = { row: -1, col: -1 }; // Initialize with an invalid position

function moveBearRandomly() {
    let newRow, newCol;

    do {
        newRow = Math.floor(Math.random() * numRows);
        newCol = Math.floor(Math.random() * numCols);
    } while (newRow === previousBearPosition.row && newCol === previousBearPosition.col);

    bearPosition = { row: newRow, col: newCol };
    previousBearPosition = { ...bearPosition }; // Store the current bear position
    bearClicked = false; // Reset bearClicked flag
    
    clearCanvas();
    drawGrid();
    
    setTimeout(moveBearRandomly, bearInterval);
}

function resetScore() {
    score = 0;
    bearInterval = 1500; // Reset the interval to the initial value
    updateScore();
}

function resetSpeed() {
    bearInterval = 1500; // Reset the interval to the initial value
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    whackBear(x, y);
});

resetScoreButton.addEventListener('click', resetScore);
resetSpeedButton.addEventListener('click', resetSpeed);

function updateScore() {
    scoreElement.textContent = score;
}

drawGrid();
moveBearRandomly(); // Start the bear movement loop
