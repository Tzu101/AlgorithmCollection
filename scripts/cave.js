// Random fills a map with 1s and 0s
function caveFillRandom(width, height, chance, outline, map) {

    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {

            let wall = RandomGenerator.getInt(1, 100) <= chance;
            if(outline && (x == 0 || x == width-1 || y == 0 || y == height-1)) wall = true;

            if(wall) map[y][x] = 1;
            else map[y][x] = 0;
        }
    }
}

// Calculates the cell state based on the number of adjacent walls
function caveIterate(width, height, create, outline, map) {
    
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {

            let adjacentWalls = getAdjacentWalls(x, y, width, height, outline, map);

            if(adjacentWalls > create) map[y][x] = 1;
            else if(adjacentWalls < create) map[y][x] = 0;
        }
    }
}

// Clears regions of size below the limit
function caveClearRegions(width, height, limit, region, map) {

    let groupMap = cloneArray2D(map);

    let groupNum = 2;

    let groups = [];

    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {

            if(groupMap[y][x] < 2 && map[y][x] == region) {
                
                let groupSize = floodRegion(x, y);
                
                if(groupSize < limit) groups.push([groupNum, Math.abs(region-1)]);

                groupNum++;
            }
        }
    }

    for(let g = 0; g < groups.length; g++) 
        replaceGroup(groups[g][0], groups[g][1]);
    
    // Determines the size of a region
    function floodRegion(x, y) {

        groupMap[y][x] = groupNum;

        let groupSize = 0;

        if(x > 0 && map[y][x] == map[y][x-1] && groupMap[y][x] != groupMap[y][x-1]) 
            groupSize += floodRegion(x-1, y) + 1;

        if(x < width-1 && map[y][x] == map[y][x+1] && groupMap[y][x] != groupMap[y][x+1]) 
            groupSize += floodRegion(x+1, y) + 1;

        if(y > 0 && map[y][x] == map[y-1][x] && groupMap[y][x] != groupMap[y-1][x]) 
            groupSize += floodRegion(x, y-1) + 1;

        if(y < height-1 && map[y][x] == map[y+1][x] && groupMap[y][x] != groupMap[y+1][x]) 
            groupSize += floodRegion(x, y+1) + 1;

        return groupSize;
    }

    // Fills in a region
    function replaceGroup(target, replacement) {

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {

                if(groupMap[y][x] == target) map[y][x] = replacement;
            }
        }
    }
}

// Calculates the number of adjacent wall cells
function getAdjacentWalls(posX, posY, width, height, outline, map) {

    let adjacent = 0;
    
    for(let y = posY-1; y <= posY+1; y++) {
        for(let x = posX-1; x <= posX+1; x++) {

            if(x != posX || y != posY) {

                if(x >= 0 && x < width && y >= 0 && y < height) {

                    adjacent += map[y][x];
                }
                else if(outline) adjacent++;
            }
        }
    }

    return adjacent;
}

// Generates a cave map
function caveMap(width, height) {

    function onModdify(cell) {

        if(cell.type == 0) {
            cell.classList.remove("cavewall");
            cell.classList.add("caveempty");
        }
        else {
            cell.classList.remove("caveempty");
            cell.classList.add("cavewall");
        }
        cell.type = Math.abs(cell.type - 1);
    }

    // Gets cave parameters from player input
    let wallChance = document.getElementById("caveChance").value;
    let iterations = document.getElementById("caveIterations").value;
    let createLimit = document.getElementById("caveCreate").value;
    let fillLimit = document.getElementById("caveFill").value;
    let obstacleLimit = document.getElementById("caveObstacle").value;

    let outline = document.getElementById("caveOutline").checked;

    // Makes an empty cave map
    let cellMap = makeMap(width, height, "caveempty", onModdify);

    // Placeholder map to terraform
    let terraformMap = array2D(width, height);

    // Randomly fills the map
    caveFillRandom(width, height, wallChance, outline, terraformMap);

    // Runs the cellular automata alogrithm
    for(let i = 0; i < iterations; i++)
        caveIterate(width, height, createLimit, outline, terraformMap);

    // Fills in smaller caverns and removes small obstacles
    if(fillLimit > 0) 
        caveClearRegions(width, height, fillLimit, 0, terraformMap);
    if(obstacleLimit > 0) 
        caveClearRegions(width, height, obstacleLimit, 1, terraformMap);
        
    // Modifies the cell map to match the transformed map
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {

            if(terraformMap[y][x] == 1) {
                cellMap[y][x].classList.remove("caveempty");
                cellMap[y][x].classList.add("cavewall");
                cellMap[y][x].type = 0;
            }
        }
    }

    return cellMap;
}