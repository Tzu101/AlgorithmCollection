/* Global variables */
let pathfinder = null;  // Pathfinder instance
let intervalPath;  // Interval function cancel instance

// Pathfinder class
class Pathfinder {

    constructor() {

        // Only selects available goal points
        this.goals = [];
        for(let g = 0; g < goalCells.length; g++) {
            if(goalCells[g].type != 0) this.goals.push(goalCells[g]);
        }

        // Sorts goal points based on starting cell
        this.goals.sort(this.compareCellDist(startCell));
        this.goalNum = 0;

        ž// sets cell groups
        this.visitedCells = [];
        this.cellQueue = [];
        this.cellQueue.push(startCell);

        // Determines if pathfinding is finished
        this.pathfound = false;
    }

    // a step of Astar pathfinding algorithm
    pathfindAstar() {

        if(this.cellQueue.length != 0 && this.goalNum < this.goals.length) {

            let cell = this.cellQueue[0];
            this.cellQueue.shift();

            if(cell != startCell) 
                cell.innerHTML = "<div class='size cell visited'></div>";

            if(cell == this.goals[this.goalNum]) {
                cell.innerHTML = "<div class='size cell goal'></div>";
                if(this.goalNum < this.goals.length-1) this.goalNum++;
                else return false;
            }

            this.visitedCells.push(cell);
            let x=cell.x, y=cell.y;

            if(x > 0) {
                let newCell = map[y][x-1];
                this.checkAddCell(newCell, cell);
            }
            if(x < mapWidth-1 && map[y][x+1].type != 0) {
                let newCell = map[y][x+1];
                this.checkAddCell(newCell, cell);
            }

            if(y > 0 && map[y-1][x].type != 0) {
                let newCell = map[y-1][x];
                this.checkAddCell(newCell, cell);
            }
            if(y < mapHeight-1 && map[y+1][x].type != 0) {
                let newCell = map[y+1][x];
                this.checkAddCell(newCell, cell);
            }

            // sorts unvisited cells based on goal cell proximity
            this.cellQueue.sort(this.compareCellDist(this.goals[this.goalNum]))

            return true;
        }
        else return false;
    }

    // Displays pathfinding step by step
    pathfindStep() {
        if(!pathfinder.pathfound) {
            if(!pathfinder.pathfindAstar()) 
                pathfinder.drawPath();
        }
        else {
            clearInterval(intervalPath);
        }
    }

    // Instantly finds path
    pathfindRun() {
        while(!this.pathfound && this.pathfindAstar());
        this.drawPath();
    }

    // Display found path
    drawPath() {

        this.pathfound = true;
        document.getElementById("pathresoult").style.color = "green";
        document.getElementById("pathresoult").innerHTML = "Path found";

        this.resetLists();

        for(let g = 0; g < this.goals.length; g++) {

            let path = this.goals[g];

            while(path.parentCell != startCell) {
                path = path.parentCell;

                if(typeof path === 'undefined') {
                    document.getElementById("pathresoult").style.color = "darkred";
                    document.getElementById("pathresoult").innerHTML = "No path exists";
                    return;
                }

                path.innerHTML = "<div class='size cell path'></div>";
            }
        }

        this.redrawPoints();
    }

    // Clears all useless points
    cleanPath() {
        this.resetLists();
        this.redrawPoints();
    }

    // resets cells used to showcase
    resetLists() {
        if(this.cellQueue != null) 
            for(let c = 0; c < this.cellQueue.length; c++) 
                if(this.cellQueue[c] != null) this.cellQueue[c].innerHTML = "";
        if(this.visitedCells != null) 
            for(let c = 0; c < this.visitedCells.length; c++) 
                if(this.visitedCells[c] != null) this.visitedCells[c].innerHTML = "";
    }

    // Fixes start and goal points
    redrawPoints() {
        for(let g = 0; g < this.goals.length; g++) 
            this.goals[g].innerHTML = "<div class='size cell goal'></div>";

        startCell.innerHTML = "<div class='size cell start'></div>";
    }

    // comparison function that retuens a comparator that sorts based on proximity to cell
    compareCellDist(d) {
        return function(c1, c2) {
            let d1 = Math.sqrt(Math.pow(d.x - c1.x, 2) + Math.pow(d.y - c1.y, 2)) * c1.type;
            let d2 = Math.sqrt(Math.pow(d.x - c2.x, 2) + Math.pow(d.y - c2.y, 2)) * c2.type;

            return d1 - d2;
        }
    }

    // Checks if a unvisited cell fits adn adds it to queue
    checkAddCell(newCell, parentCell) {
        if(newCell.type != 0 && !this.visitedCells.includes(newCell) 
        && !this.cellQueue.includes(newCell)) {
            this.cellQueue.push(newCell);
            newCell.innerHTML = "<div class='size cell inqueue'></div>";
            newCell.parentCell = parentCell;
        }
    }
}

// Resets the pathfinding
function clearpath() {
    if(pathfinder != null) pathfinder.cleanPath();
    if(intervalPath != null) clearInterval(intervalPath);
    document.getElementById("pathresoult").innerHTML ="";
    pathfinder = new Pathfinder();
}

// Checks if all parameters are set
function chackpath() {
    let pathResoult = document.getElementById("pathresoult");
    pathResoult.style.color = "red";

    // Error message
    if(startCell == null) {
        pathResoult.innerHTML = "No start cell selected";
        return false;
    }
    else if(startCell.type == 0) {
        pathResoult.innerHTML = "Invalid start cell selected";
        return false;
    }
    else if(goalCells.length == 0) {
        pathResoult.innerHTML = "No goal cells selected";
        return false;
    }
    else if(pathfinder.goals.length == 0) {
        pathResoult.innerHTML = "Invalid goal cells selected";
        return false;
    }
    // All good
    else {
        pathResoult.style.color = "LimeGreen";
        pathResoult.innerHTML = "Pathdinding";
        return true;
    }
}

// Starts step by step showcase
function pathstep() {
    clearpath();
    if(chackpath()) {
        let speed = 1000 /  document.getElementById("pathspeed").value;
        intervalPath = setInterval(pathfinder.pathfindStep, speed);
    }
}

// Starts instant pathfinding
function pathfind() {
    clearpath();
    if(chackpath()) pathfinder.pathfindRun();
}