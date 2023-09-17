class MazeGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.maze = this.initMaze();
        this.stack = [];
        this.start = { x: 0, y: 0 };
        this.current = this.start;
        this.current.visited = true;
        this.stack.push(this.current);
    }

    initMaze() {
        let maze = new Array(this.height);
        for (let y = 0; y < this.height; y++) {
            maze[y] = new Array(this.width).fill({
                visited: false,
                walls: {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true
                }
            });
        }
        return maze;
    }

getNeighbors(cell) {
    let x = cell.x;
    let y = cell.y;
    let neighbors = [];

    let directions = [
        { x: 0, y: -2, wall: 'top' },
        { x: 2, y: 0, wall: 'right' },
        { x: 0, y: 2, wall: 'bottom' },
        { x: -2, y: 0, wall: 'left' }
    ];

    for (let dir of directions) {
        let newX = x + dir.x;
        let newY = y + dir.y;

        // Add boundary checks for newX and newY
        if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height && !this.maze[newY][newX].visited) {
            neighbors.push({
                x: newX,
                y: newY,
                wall: dir.wall
            });
        }
    }

    if (neighbors.length) {
        let randomIndex = Math.floor(Math.random() * neighbors.length);
        return neighbors[randomIndex];
    } else {
        return undefined;
    }
}

generate() {
    while (this.stack.length) {
        let cell = this.stack[this.stack.length - 1];
        let next = this.getNeighbors(cell);

        if (next) {
            this.maze[next.y][next.x].visited = true;

            switch (next.wall) {
                case 'top':
                    this.maze[cell.y - 1][cell.x].visited = true;
                    cell.walls.top = false;
                    this.maze[next.y][next.x].walls.bottom = false;
                    break;
                case 'right':
                    this.maze[cell.y][cell.x + 1].visited = true;
                    cell.walls.right = false;
                    this.maze[next.y][next.x].walls.left = false;
                    break;
                case 'bottom':
                    this.maze[cell.y + 1][cell.x].visited = true;
                    cell.walls.bottom = false;
                    this.maze[next.y][next.x].walls.top = false;
                    break;
                case 'left':
                    this.maze[cell.y][cell.x - 1].visited = true;
                    cell.walls.left = false;
                    this.maze[next.y][next.x].walls.right = false;
                    break;
            }

            this.stack.push(this.maze[next.y][next.x]);
        } else {
            this.stack.pop();
        }
    }
}



    getMazeArray() {
        let simpleMaze = new Array(this.height);
        for (let y = 0; y < this.height; y++) {
            simpleMaze[y] = new Array(this.width).fill(1); // 1 is wall, 0 is path
            for (let x = 0; x < this.width; x++) {
                if (!this.maze[y][x].walls.top && !this.maze[y][x].walls.right && !this.maze[y][x].walls.bottom && !this.maze[y][x].walls.left) {
                    simpleMaze[y][x] = 0; // set path
                }
            }
        }
        return simpleMaze;
    }
}


