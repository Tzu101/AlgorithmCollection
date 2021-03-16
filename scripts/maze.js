// Basic class to hold cell data
class MazeCell {

    constructor() {

        this.prevCell = null;
        
        this.wallLeft = true;
        this.wallRight = true;
        this.wallUp = true;
        this.wallDown = true;

        this.visited = false;

        this.x = 0;
        this.y = 0;

        this.group = 0;
    }
}

// Converts the flaz maze shape to a cell one
function toCellMaze(flatMap, cellMap) {

    // Turns cell into a wall cell and modifies data
    function toWall(cell) {
        cell.classList.remove("mazeempty");
        cell.classList.add("mazewall");
        cell.type = 0;
    }

    // Converts thin wall to wall cells
    for(let y = 0; y < flatMap.length; y++) {
        for(let x = 0; x < flatMap[0].length; x++) {

            toWall(cellMap[2*y][2*x]);
            
            if(flatMap[y][x].wallRight) toWall(cellMap[2*y+1][2*x+2]);
            if(flatMap[y][x].wallDown) toWall(cellMap[2*y+2][2*x+1]);
        }
    }

    // Fills in maze corners
    for(let y = 0; y < cellMap.length; y++) toWall(cellMap[y][0]);
    for(let x = 0; x < cellMap[0].length; x++) toWall(cellMap[0][x]);

    for(let y = 0; y < cellMap.length; y++) toWall(cellMap[y][cellMap[0].length-1]);
    for(let x = 0; x < cellMap[0].length; x++) toWall(cellMap[cellMap.length-1][x]);

    // Extra fill in case of even map size
    if(cellMap.length % 2 == 0)
        for(let x = 0; x < cellMap[0].length; x++) toWall(cellMap[cellMap.length-2][x]);

    if(cellMap[0].length % 2 == 0)
        for(let y = 0; y < cellMap.length; y++) toWall(cellMap[y][cellMap[0].length-2]);
}

// Recursive backtracking maze algorithm
function recursiveBacktrackingMaze(width, height) {

    // Converts the cell map units into a flat map and initilizes it
    let flatWidth = Math.floor((width - 1) / 2);
    let flatHeight = Math.floor((height - 1) / 2);

    let flatMap = array2D(flatWidth, flatHeight);

    for(let y = 0; y < flatHeight; y++) {
        for(let x = 0; x < flatWidth; x++) {

            flatMap[y][x] = new MazeCell();
        }
    }

    // Picks a random starting point and starts the algorithm
    let startX = RandomGenerator.getInt(0, flatWidth-1);
    let startY = RandomGenerator.getInt(0, flatHeight-1);
    recursiveB(startX, startY);


    // Recursive function with random depth first search
    function recursiveB(posX, posY) {
        
        // Generates a list of possible paths
        let paths = [];
        if(posX > 0) paths.push([-1, 0]);
        if(posX < flatWidth-1) paths.push([1, 0]);
        if(posY > 0) paths.push([0, -1]);
        if(posY < flatHeight-1) paths.push([0, 1]);

        // Starts a recursive search in each path
        while(paths.length > 0) {

            flatMap[posY][posX].visited = true;

            let randomPath = RandomGenerator.getInt(0, paths.length-1);
            let dirX = paths[randomPath][0];
            let dirY = paths[randomPath][1]

            let newX = posX + dirX;
            let newY = posY + dirY;

            paths.splice(randomPath, 1);

            if(!flatMap[newY][newX].visited) {

                if(dirX == 1) {
                    flatMap[posY][posX].wallRight = false;
                    flatMap[newY][newX].wallLeft = false;
                }
                else if(dirX == -1) {
                    flatMap[posY][posX].wallLeft = false;
                    flatMap[newY][newX].wallRight = false;
                }

                if(dirY == 1) {
                    flatMap[posY][posX].wallDown = false;
                    flatMap[newY][newX].wallUp = false;
                }
                else if(dirY == -1) {
                    flatMap[posY][posX].wallUp = false;
                    flatMap[newY][newX].wallDown = false;
                }

                recursiveB(newX, newY);
            }
        }
    }
    return flatMap;
}

// Sindwinder maze algorithm
function sidewinderMaze(width, height) {

    // Odds that determine the random direction - player chosen
    let odds = document.getElementById("sidewinderOdds").value;
    
    // Converts the cell map units into a flat map and initilizes it
    let flatWidth = Math.floor((width - 1) / 2);
    let flatHeight = Math.floor((height - 1) / 2);

    let flatMap = array2D(flatWidth, flatHeight);

    for(let y = 0; y < flatHeight; y++) {
        for(let x = 0; x < flatWidth; x++) {

            flatMap[y][x] = new MazeCell();
        }
    }

    skippedCells = [];
    
    // For every cell it either creates a passage right or a passage north from one of the skipped cells
    for(let y = 0; y < flatHeight; y++) {

        for(let x = 0; x < flatWidth; x++) {

            skippedCells.push(x);

            let right = RandomGenerator.getInt(1, 100) <= odds;

            if(y == 0) right = true;
            if(x == flatWidth-1) right = false;

            if(right) {
                
                flatMap[y][x].wallRight = false;
                flatMap[y][x+1].wallLeft = false;
            }
            else {

                if(y != 0) {

                    let randSkipped = randomFromArray(skippedCells);
                    flatMap[y-1][randSkipped].wallDown = false;
                    flatMap[y][randSkipped].wallUp = false;
                }

                skippedCells = [];
            }
        }
    }

    return flatMap;
}

// Kruskal's maze algorithm
function kruskalMaze(width, height) {

    // Converts the cell map units into a flat map and initilizes it
    let flatWidth = Math.floor((width - 1) / 2);
    let flatHeight = Math.floor((height - 1) / 2);

    let flatMap = array2D(flatWidth, flatHeight);

    for(let y = 0; y < flatHeight; y++) {
        for(let x = 0; x < flatWidth; x++) {

            flatMap[y][x] = new MazeCell();
            flatMap[y][x].group = y*flatWidth + x;
        }
    }

    // Creates a list of all edges or possible connections on the map
    let edges = [];

    for(let y = 0; y < flatHeight; y++) {
        for(let x = 0; x < flatWidth; x++) {

            if(x != flatWidth-1) edges.push([y, x, y, x+1, 0]);
            if(y != flatHeight-1) edges.push([y, x, y+1, x, 1]);
        }
    }

    // Picks a random edge and if it doesnt create a loop it creates a passage
    while(edges.length != 0) {

        let edge = randomFromArray(edges, true);

        let cell1 = flatMap[edge[0]][edge[1]];
        let cell2 = flatMap[edge[2]][edge[3]];
        let edgeType = edge[4];

        if(cell1.group != cell2.group) {

            if(edgeType == 0) {
                cell1.wallRight = false;
                cell2.wallLeft = false;
            }
            else {
                cell1.wallDown = false;
                cell2.wallUp = false;
            }

            replaceGroup(cell1.group, cell2.group);
        }
    }

    // Function for replacing one group with another to keep track of connected areas
    function replaceGroup(target, replacement) {

        for(let y = 0; y < flatHeight; y++) {
            for(let x = 0; x < flatWidth; x++) {
    
                if(flatMap[y][x].group == target) flatMap[y][x].group = replacement;
            }
        }
    }

    return flatMap;
}

// Prim's maze algorithm
function primMaze(width, height) {

    // Converts the cell map units into a flat map and initilizes it
    let flatWidth = Math.floor((width - 1) / 2);
    let flatHeight = Math.floor((height - 1) / 2);

    let flatMap = array2D(flatWidth, flatHeight);

    for(let y = 0; y < flatHeight; y++) {
        for(let x = 0; x < flatWidth; x++) {

            flatMap[y][x] = new MazeCell();
            flatMap[y][x].x = x;
            flatMap[y][x].y = y;
        }
    }

    // Random starting point
    let startX = RandomGenerator.getInt(0, flatWidth-1);
    let startY = RandomGenerator.getInt(0, flatHeight-1);

    // A list of cells next to already visited cells
    let cellQueue = [];
    cellQueue.push(flatMap[startY][startX]);

    while(cellQueue.length > 0) {

        let cell = randomFromArray(cellQueue, true);

        cell.visited = true;

        let directions = [];

        if(cell.x > 0) directions.push([0, -1]);
        if(cell.x < flatWidth-1) directions.push([0, 1]);
        if(cell.y > 0) directions.push([-1, 0]);
        if(cell.y < flatHeight-1) directions.push([1, 0]);

        for(let d = 0; d < directions.length; d++) {

            let dirX = directions[d][1], dirY = directions[d][0];

            newCell = flatMap[ cell.y + dirY ][ cell.x + dirX ];

            if(newCell.visited) {

                if(newCell == cell.prevCell) {

                    if(dirX == -1) {
                        cell.wallLeft = false;
                        newCell.wallRight = false;
                    }
                    else if(dirX == 1) {
                        cell.wallRight = false;
                        newCell.wallLeft = false;
                    }
                    if(dirY == -1) {
                        cell.wallUp = false;
                        newCell.wallDown = false;
                    }
                    else if(dirY == 1) {
                        cell.wallDown = false;
                        newCell.wallUp = false;
                    }
                }
            }
            else if(!cellQueue.includes(newCell)) {
                newCell.prevCell = cell;
                cellQueue.push(newCell);
            }
        }
    }
    
    return flatMap;
}

// Binary tree maze algorithm
function binaryTreeMaze(width, height) {

    // User defined parameters
    let ratio = document.getElementById("binaryTreeRatio").value;
    let bias = document.getElementById("binaryTreeBias").value;

    // Parameters to determine the vertical and horizontal direction of the algorithm
    let up=true, left=true;
    if(bias == "northwest") up = true, left = true;
    else if(bias == "northeast") up = true, left = false;
    else if(bias == "southwest") up = false, left = true;
    else if(bias == "southeast") up = false, left = false;

    // Converts the cell map units into a flat map and initilizes it
    let flatWidth = Math.floor((width - 1) / 2);
    let flatHeight = Math.floor((height - 1) / 2);

    let flatMap = array2D(flatWidth, flatHeight);

    for(let y = 0; y < flatHeight; y++) {
        for(let x = 0; x < flatWidth; x++) {

            flatMap[y][x] = new MazeCell();
        }
    }

    // For every cell it moves either horizontally or vertically in the specified direction
    for(let y = 0; y < flatHeight; y++) {
        for(let x = 0; x < flatWidth; x++) {

            let horizontal = RandomGenerator.getInt(1, 100) <= ratio;
            let vertical = !horizontal;

            if((left && x == 0) || (!left && x == flatWidth-1)) horizontal = false, vertical = true;
            if((up && y == 0) || (!up && y == flatHeight-1)) vertical = false, horizontal = true;

            if((left && x == 0) || (!left && x == flatWidth-1)) horizontal = false;
            if((up && y == 0) || (!up && y == flatHeight-1)) vertical = false;

            if(horizontal) {
                if(left) {
                    flatMap[y][x].wallLeft = false;
                    flatMap[y][x-1].wallRight = false;
                }
                else {
                    flatMap[y][x].wallRight = false;
                    flatMap[y][x+1].wallLeft = false;
                }
            }
            if(vertical) {
                if(up) {
                    flatMap[y][x].wallUp = false;
                    flatMap[y-1][x].wallDown = false;
                }
                else {
                    flatMap[y][x].wallDown = false;
                    flatMap[y+1][x].wallUp = true;
                }
            }
        }
    }

    return flatMap;
}

// Generates a random maze map
function mazeMap(width, height) {

    function onModdify(cell) {

        if(cell.type == 0) {
            cell.classList.remove("mazewall");
            cell.classList.add("mazeempty");
        }
        else {
            cell.classList.remove("mazeempty");
            cell.classList.add("mazewall");
        }
        cell.type = Math.abs(cell.type - 1);
    }

    // Generates an empty maze map
    let cellMap = makeMap(width, height, "mazeempty", onModdify);

    // Maze generating algorithm
    let mazeType = document.getElementById("mazetype").value;

    if(mazeType != "none") {
        
        if(mazeType == "recursiveB") {
            toCellMaze(recursiveBacktrackingMaze(width, height), cellMap);
        }
        else if(mazeType == "sidewinder") {
            toCellMaze(sidewinderMaze(width, height), cellMap);
        }
        else if(mazeType == "kruskal") {
            toCellMaze(kruskalMaze(width, height), cellMap);
        }
        else if(mazeType == "prim") {
            toCellMaze(primMaze(width, height), cellMap);
        }
        else if(mazeType == "binarytree") {
            toCellMaze(binaryTreeMaze(width, height), cellMap);
        }
    }

    return cellMap;
}