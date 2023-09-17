document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("yourbadscore").innerHTML = `Your score: ${localStorage.getItem("score") || 0}`;
    const startButton = document.getElementById("start-button");
    const timerDisplay = document.getElementById("timer");
    // const scoreDisplay = document.getElementById("yourbadscore")
    const mazeWidth = 10;
    const mazeHeight = 11;
    const maze = Array.from({ length: mazeHeight }, () => Array(mazeWidth).fill(true));
    var score = 0;

    // Define starting and ending points
    const start = { x: 1, y: 0 };
    const end = { x: mazeWidth - 2, y: mazeHeight - 1 };

    // Initialize avatar at the starting point
    const avatar = { x: start.x, y: start.y };
    
    let countdown; // To store the countdown interval

    startButton.addEventListener("click", function() {
        mazeMap.innerHTML = ""; 
        generateMaze(Math.floor(Math.random() * mazeWidth), Math.floor(Math.random() * mazeHeight));
        displayMaze();
        let timeLeft = 5;
        timerDisplay.textContent = timeLeft;
  
        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                hideMazeWalls();  // Hide all the maze walls when the timer reaches 0
                clearInterval(countdown);
            }
        }, 1000);        
    });

    function hideMazeWalls() {
        // Get all wall elements and add the 'invisible-wall' class to each
        const walls = document.querySelectorAll(".wall");
        walls.forEach(wall => {
            if (!wall.classList.contains("avatar") && !wall.classList.contains("end"))
                wall.classList.add("invisible-wall");
        });
    }



    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function generateMaze(x, y) {
        const DIRECTION_OFFSET = 2; // Determines the size of each cell
    
        // Define directions based on offset
        const directions = [
            [0, DIRECTION_OFFSET],
            [DIRECTION_OFFSET, 0],
            [0, -DIRECTION_OFFSET],
            [-DIRECTION_OFFSET, 0]
        ];
        
        // Shuffle directions to make maze generation random
        shuffleArray(directions);
    
        maze[y][x] = false;
    
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
    
            // Check within boundaries of maze
            if (
                newX >= 0 && newX < mazeWidth &&
                newY >= 0 && newY < mazeHeight &&
                maze[newY][newX]
            ) {
                // Determine the wall cell coordinates
                const wallX = x + dx / 2;
                const wallY = y + dy / 2;
    
                // Mark the wall as visited
                maze[wallY][wallX] = false;
    
                // Recursively generate the maze from this point
                generateMaze(newX, newY);
            }
        }
    }
    
    
    
    function displayMaze() {
        const mazeMap = document.getElementById("mazeMap");
        mazeMap.innerHTML = ""; 
        for (let row = 0; row < mazeHeight; row++) {
            for (let col = 0; col < mazeWidth; col++) {
                const cell = document.createElement("div");
                cell.className = maze[row][col] ? "wall" : "path";
      
                // Set the start and end points
                if (row === start.y && col === start.x) {
                    cell.classList.add("start");
                } else if (row === end.y && col === end.x) {
                    cell.classList.add("end");
                }
      
                // Place the avatar at the starting point
                if (row === avatar.y && col === avatar.x) {
                    cell.classList.add("avatar");
                }
                mazeMap.appendChild(cell);
            }
        }
    }
    
// Function to move the avatar
function moveAvatar(newX, newY) {
    if (newX === end.x && newY === end.y) {
        clearInterval(countdown);
        if (localStorage.getItem('score')) {
         let s = parseInt(localStorage.getItem('score'));
         s = s+1;
         score = s;
        }
        localStorage.setItem('score', score.toString());
        alert("Congratulations! You've won!");
        generateMaze(Math.floor(Math.random() * mazeWidth), Math.floor(Math.random() * mazeHeight));
        displayMaze();
        console.log(localStorage.getItem('score'));
        // scoreDisplay.innerHTML = localStorage.getItem("score") || 0;
        return;
    }
    // Check if the new position is a valid path cell
    if (newX >= 0 && newX < mazeWidth && newY >= 0 && newY < mazeHeight && !maze[newY][newX]) {
        // Clear the previous avatar position
        maze[avatar.y][avatar.x] = false;
        // Update the avatar's position
        avatar.x = newX;
        avatar.y = newY;
        // Set the new avatar position in the maze
        maze[avatar.y][avatar.x] = true;

        // Redraw the maze with the updated avatar position
        displayMaze();

        if (timerDisplay.textContent == "0")
            hideMazeWalls();
    } else {
        
         
        clearInterval(countdown);
        alert("Game Over! You hit a wall.");
        
    }
}

// Adding Event Listeners for Movement Buttons
document.getElementById('move-up').addEventListener('click', function() {
    moveAvatar(avatar.x, avatar.y - 1);
});

document.getElementById('move-down').addEventListener('click', function() {
    moveAvatar(avatar.x, avatar.y + 1);
});

document.getElementById('move-left').addEventListener('click', function() {
    moveAvatar(avatar.x - 1, avatar.y);
});

document.getElementById('move-right').addEventListener('click', function() {
    moveAvatar(avatar.x + 1, avatar.y);
});
});