// Global variables
let map;
let mapType;
let mapGenerator;
let mapWidth, mapHeight, cellSize;

let clickAction;
let startCell, goalCells;

let sizeStyle;
let cellClass;

// Controls the effect of user clicks on a cell
function setClickAction(action) {
    clickAction = action;
}

// Changes the options depending on the maze algorithm
function setMazeOptions() {

    let mapOptions = document.getElementById("options");  // Container for specefic options
    let mazeType;

    // Default selected element
    if(document.getElementById("mazetype") == null) mazeType = "recursiveB";
    else mazeType = document.getElementById("mazetype").value;

    let select = "selected='selected'";
    let selected = ["", "", "", "", ""];

    let extraOptions = "";  // Extra options depeding on the algorithm

    if(mazeType == "none") {
        selected[0] = select;
    }
    else if(mazeType == "recursiveB") {
        selected[1] = select;
    }
    else if(mazeType == "sidewinder") {
        selected[2] = select;

        // Odds for algorithm
        let sidewinderOdds;
        if(document.getElementById("sidewinderOdds") == null) sidewinderOdds = 50;
        else sidewinderOdds = document.getElementById("sidewinderOdds").value;

        extraOptions = 
        `<label for="sidewinderOdds"> Odds </label>
        <input type="number" id="sidewinderOdds" value="`+ sidewinderOdds +`"></input>`;
    }
    else if(mazeType == "kruskal") {
        selected[3] = select;
    }
    else if(mazeType == "prim") {
        selected[4] = select;
    }
    else if(mazeType == "binarytree") {
        selected[5] = select;

        // Ratio for algorithm
        let binaryTreeRatio;
        if(document.getElementById("binaryTreeRatio") == null) binaryTreeRatio = 50;
        else binaryTreeRatio = document.getElementById("binaryTreeRatio").value;

        // Default selected element
        let selectedBias = ["", "", "", ""];
        let bias;
        if(document.getElementById("binaryTreeBias") == null) bias = "northwest";
        else bias = document.getElementById("binaryTreeBias").value;

        if(bias == "northwest") selectedBias[0] = select;
        else if(bias == "northeast") selectedBias[1] = select;
        else if(bias == "southwest") selectedBias[2] = select;
        else if(bias == "southeast") selectedBias[3] = select;

        extraOptions = 
        `<label for="binaryTreeBias"> Bias </label>
        <select id="binaryTreeBias">
            <option value="northwest" `+ selectedBias[0] +`> NorthWest </option>
            <option value="northeast" `+ selectedBias[1] +`> NorthEast </option>
            <option value="southwest" `+ selectedBias[2] +`> SouthWest </option>
            <option value="southeast" `+ selectedBias[3] +`> SouthEast </option>
        </select>
        <label for="binaryTreeRatio"> Ratio </label>
        <input type="number" id="binaryTreeRatio" value="`+ binaryTreeRatio +`"></input>`;
    }

    let options = 
    `Maze options:
    <label for="mazetype"> Maze type </label>
    <select id='mazetype' onchange='setMazeOptions()'>
    <option value='none' `+ selected[0] +`> None </option>
    <option value='recursiveB' `+ selected[1] +`> Recursive Backtracking </option>
    <option value='sidewinder' `+ selected[2] +`> Sidewinder </option>
    <option value='kruskal' `+ selected[3] +`> Kruskal </option>
    <option value='prim' `+ selected[4] +`> Prim </option>
    <option value='binarytree' `+ selected[5] +`> Binary Tree </option>
    </select>`;

    mapOptions.innerHTML = options + extraOptions;
}

function setCaveOptions() {

    let mapOptions = document.getElementById("options");  // Container for specefic options

    let caveChance;
    if(document.getElementById("caveChance") == null) caveChance = 45;
    else caveChance = document.getElementById("caveChance").value;

    let caveIterations;
    if(document.getElementById("caveIterations") == null) caveIterations = 3;
    else caveIterations = document.getElementById("caveIterations").value;

    let caveCreate;
    if(document.getElementById("caveCreate") == null) caveCreate = 4;
    else caveCreate = document.getElementById("caveCreate").value;

    let caveFill;
    if(document.getElementById("caveFill") == null) caveFill = 25;
    else caveFill = document.getElementById("caveFill").value;

    let caveObstacle;
    if(document.getElementById("caveObstacle") == null) caveObstacle = 25;
    else caveObstacle = document.getElementById("caveObstacle").value;

    let caveOutline = "";
    if(document.getElementById("caveOutline") == null) caveOutline = "checked";
    else if(document.getElementById("caveOutline").checked) caveOutline = "checked";

    mapOptions.innerHTML = 
    `Cave options:
    <label for="caveChance"> Fill chance </label>
    <input type="number" id="caveChance" value="` + caveChance + `"></input>
    <label for="caveIterations"> Iterations </label>
    <input type="number" id="caveIterations" value="` + caveIterations + `"></input>
    <label for="caveCreate"> Create / Destroy </label>
    <input type="number" id="caveCreate" value="` + caveCreate + `"></input>
    <label for="caveFill"> Fill limit </label>
    <input type="number" id="caveFill" value="` + caveFill + `"></input>
    <label for="caveObstacle"> Obstacle limit </label>
    <input type="number" id="caveObstacle" value="` + caveObstacle + `"></input>
    <label for="caveOutline"> Enclosed </label>
    <input type="checkbox" id="caveOutline" ` + caveOutline + `></input>`;
}

function setTerrainOptions() {

    let mapOptions = document.getElementById("options");  // Container for specefic options

    let scale;
    if(document.getElementById("scale") == null) scale = 19.33;
    else scale = document.getElementById("scale").value;

    let octaves;
    if(document.getElementById("octaves") == null) octaves = 3;
    else octaves = document.getElementById("octaves").value;

    let lacunarity;
    if(document.getElementById("lacunarity") == null) lacunarity = 2;
    else lacunarity = document.getElementById("lacunarity").value;

    let persistance;
    if(document.getElementById("persistance") == null) persistance = 0.5;
    else persistance = document.getElementById("persistance").value;

    let perlinMap = "";
    if(document.getElementById("perlinmap") != null 
    && document.getElementById("perlinmap").checked) perlinMap = "checked";

    mapOptions.innerHTML = 
    `Terrain options:
    <label for="scale"> Scale </label>
    <input type="number" id="scale" value="` + scale + `"></input>
    <label for="octaves"> Octaves </label>
    <input type="number" id="octaves" value="` + octaves + `"></input>
    <label for="lacunarity"> Lacunarity </label>
    <input type="number" id="lacunarity" value="` + lacunarity + `"></input>
    <label for="persistance"> Persistance </label>
    <input type="number" id="persistance" value="` + persistance + `"></input>
    <label for="perlinmap"> Perlin map </label>
    <input type="checkbox" id="perlinmap" ` + perlinMap + `></input>
    
    <div id="biomeselector"></div>
    
    <label for="biomename"> Biome name </label>
    <input type="text" id="biomename"></input>
    <label for="biomeheight"> Biome height </label>
    <input type="number" id="biomeheight"></input>
    <label for="biomered"> Biome color </label>
    <input type="number" id="biomered"></input>
    <input type="number" id="biomegreen"></input>
    <input type="number" id="biomeblue"></input>
    
    <button onclick="saveBiome()"> Save </button>
    <button onclick="deleteBiome()"> Delete </button>
    <button onclick="addBiome()"> Add biome </button>`;

    updateBiomeSelector();
}

function setMapOptions() {

    // Gets map type
    mapType = document.getElementById("maptype").value;

    // Map type specific settings
    if(mapType == "maze") {
        mapGenerator = mazeMap;
        setMazeOptions();
    }
    else if(mapType == "cave") {
        mapGenerator = caveMap;
        setCaveOptions();
    }
    else if(mapType == "terrain") {
        mapGenerator = terrainMap;
        setTerrainOptions();
    }
}

// Loads a new map
function reloadMap() {

    // Resets pathfinding variables
    startCell = null;
    goalCells = [];

    // Updates the settings if necesearry
    setMapOptions();

    // Adding / removing the grid
    let grid = document.getElementById("grid").checked;
    cellClass = "cell border";
    if(!grid) cellClass = "cell";

    // User defined width and height of the map
    mapWidth = document.getElementById("width").value;
    mapHeight = document.getElementById("height").value;

    // Modifys the cell size
    cellSize = document.getElementById("cellsize").value;
    manageSizeStyle(cellSize, cellSize, grid);

    // Resets the number generator for a new seed
    let setSeed = document.getElementById("setseed").checked;
    let seedContainer = document.getElementById("seed");
    newSeed = randomInt(0, 93715489204);

    if(setSeed) newSeed = parseInt(seedContainer.value);
    else seedContainer.value = newSeed;
    
    RandomGenerator.seed = newSeed;

    // Generates the specified map
    map = mapGenerator(mapWidth, mapHeight);
}

// This function is called when the window is loaded
window.onload = function() {

    // Setting alues to global variables
    mapType = "";
    mapGenerator = mazeMap;
    RandomGenerator.seed = randomInt(0, 93715489204);
    clickAction = "moddify";
    goalCells = [];

    cellClass = "cell";

    // Custom style for changing cell size
    manageSizeStyle(10, 10);

    // Loading the map at the start
    reloadMap();
}