function pathfindAstar() {

    let goals = [];

    for(let g = 0; g < goalCells.length; g++) {
        if(goalCells[g].type != 0) goals.push(goalCells[g]);
    }

    goals.sort(compareCellDist(startCell));
    let goalNum = 0;

    let visitedCells = [];
    let cellQueue = [];
    cellQueue.push(startCell);

    while(cellQueue.length != 0) {

        let cell = cellQueue[0];
        cellQueue.shift();

        if(cell != startCell) 
            cell.innerHTML = "<div class='size cell visited'></div>";

        if(cell == goals[goalNum]) {
            cell.innerHTML = "<div class='size cell goal'></div>";
            if(goalNum < goals.length-1) goalNum++;
            else break;
        }

        visitedCells.push(cell);
        let x=cell.x, y=cell.y;

        if(x > 0) {
            let newCell = map[y][x-1];
            checkAddCell(newCell);
        }
        if(x < mapWidth-1 && map[y][x+1].type != 0) {
            let newCell = map[y][x+1];
            checkAddCell(newCell);
        }

        if(y > 0 && map[y-1][x].type != 0) {
            let newCell = map[y-1][x];
            checkAddCell(newCell);
        }
        if(y < mapHeight-1 && map[y+1][x].type != 0) {
            let newCell = map[y+1][x];
            checkAddCell(newCell);
        }

        cellQueue.sort(compareCellDist(goals[goalNum]));
    }

    function compareCellDist(d) {
        return function(c1, c2) {
            let d1 = Math.sqrt(Math.pow(d.x - c1.x, 2) + Math.pow(d.y - c1.y, 2)) * c1.type;
            let d2 = Math.sqrt(Math.pow(d.x - c2.x, 2) + Math.pow(d.y - c2.y, 2)) * c2.type;

            return d1 - d2;
        }
    }

    function checkAddCell(cell) {
        if(cell.type != 0 && !visitedCells.includes(cell) 
        && !cellQueue.includes(cell)) {
            cellQueue.push(cell);
            cell.innerHTML = "<div class='size cell inqueue'></div>";
        }
    }
}

function pathfind() {

    let pathType = document.getElementById("pathfindtype").value;

    if(pathType == "astar") {
        pathfindAstar();
    }
}