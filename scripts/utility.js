// Custom seeded random number generator
/*
m > 0
0 < a < m
0 <= b < m
0 <= seed < m

min: 0
max: m-1
*/
class RandomGenerator {

    static seed = seed;

    static a = 1203456;
    static b = 6504;
    static m = 93715489205;

    static reSeed() {

        RandomGenerator.seed = ( this.a * this.seed + this.b ) % this.m;
    }

    static getInt(min, max) {

        RandomGenerator.reSeed();

        let int = RandomGenerator.seed % (max - min + 1) + min;

        return int;
    }
}

// Custom perlin noise generator
class PerlinNoise {

    // Makes the transition from one value to another smoother
    static smooth(s, p1, p2) {

        s = ((6*s -15)*s + 10)*s*s*s;

        return p1 + s*(p2 - p1);
    }

    // Calculates the distance vecotr between two points
    static distanceVector(x1, y1, x2, y2) {

        return {x: x2-x1, y: y2-y1};
    }

    // Calculates a random gradient vector based on x, y location
    static gradientVector(x, y) {

        let rand = 2920 * Math.sin(x * 21942 + y * 171324 + 8912) * Math.cos(x * 23157 * y * 217832 + 9758);

        return {x: Math.cos(rand), y: Math.sin(rand)};
    }

    // Calculates the dot product between two vectors
    static dotProduct(v1, v2) {

        return v1.x * v2.x + v1.y * v2.y;
    }

    // Calculates the perlin noise value based on the given position
    static getNoise(x, y) {

        let x0 = Math.floor(x);
        let y0 = Math.floor(y);

        let p1 = this.dotProduct(this.distanceVector(x0, y0, x, y), this.gradientVector(x0, y0));
        let p2 = this.dotProduct(this.distanceVector(x0+1, y0, x, y), this.gradientVector(x0+1, y0));
        let p3 = this.dotProduct(this.distanceVector(x0, y0+1, x, y), this.gradientVector(x0, y0+1));
        let p4 = this.dotProduct(this.distanceVector(x0+1, y0+1, x, y), this.gradientVector(x0+1, y0+1));

        let s1 = this.smooth(x-x0, p1, p2);
        let s2 = this.smooth(x-x0, p3, p4);

        let value = (this.smooth(y-y0, s1, s2) + 1) / 2;

        return value;
    }

    // Calculates a map of perlin noise with given parameters
    /*
    scale - controls the scope of the map
    octaves - number of layers added together
    lacunarity - rate of increse of frequency
    persistance - rate of decrese of amplitude

    frequency - scope of a layer
    amplitude - influence of layer

    offset - moves away from origin for different seeds
    */
    static getOctave(width, height, scale, octaves, lacunarity, persistance, offset, map) {

        if(scale <= 0) scale = 1.33;

        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;

        for(let y = 0; y < height; y++) {
            for(let x = 0;  x < width; x++) {

                let amplitude = 1;
                let frequency = 1;
                let noiseHeight = 0;

                for(let o = 0; o < octaves; o++) {

                    let noiseX = (x + offset) / scale * frequency;
                    let noiseY = (y + offset) / scale * frequency;

                    let perlin = this.getNoise(noiseX, noiseY);
                    noiseHeight += perlin * amplitude;

                    amplitude *= persistance;
                    frequency *= lacunarity;
                }

                map[y][x] = noiseHeight;

                if(noiseHeight < min) min = noiseHeight;
                if(noiseHeight > max) max = noiseHeight;
            }
        }
        let domain = max - min;

        for(let y = 0; y < height; y++) {
            for(let x = 0;  x < width; x++) {

                map[y][x] = map[y][x] / domain - (min / domain);
            }
        }
    }
}

// Returns a random element from an array with the option of deleting it
function randomFromArray(array, remove=false) {

    let randomIndex = RandomGenerator.getInt(0, array.length-1);

    let randomElement = array[randomIndex];

    if(remove) array.splice(randomIndex, 1);

    return randomElement;
}

// returns a random integer between (inclusive) min and max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Manages the custom size style
function manageSizeStyle(width, height, grid) {

    if(!grid) {
        width = parseInt(width) + 2;
        height = parseInt(height) + 2;
    }

    sizeStyle = document.createElement('style');
    sizeStyle.type = 'text/css';
    sizeStyle.innerHTML = '.size { width: ' + width + 'px; height: ' + height + 'px; }';
    document.getElementsByTagName('head')[0].appendChild(sizeStyle);
}

// Created a 2D array
function array2D(width, height) {

    let array = new Array(height);

    for(let h = 0; h < height; h++) {
        array[h] = new Array(width);
    }

    return array;
}

// clones a 2D array
function cloneArray2D(array) {

    let height = array.length;
    let width = array[0].length;

    let clone = array2D(width, height);

    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {

            clone[y][x] = array[y][x];
        }
    }

    return clone;
}

// Creates a html table and maps it, adding onclick functions to elements
function makeMap(width, height, defaultCell, onModdify) {

    // function that runs when clicking on a cell to modify it
    function onClick(e) {

        // Prevents context menu on right click
        e.preventDefault();

        // Determines type of click
        let leftClick = true;
        if(e.button != 0) leftClick = false;

        let isStart = (this == startCell);
        let isGoal = goalCells.includes(this);

        // Switched between dirrerent cell types
        if(clickAction == "moddify") {

            onModdify(this, leftClick);
        }

        // Controls the start point
        else if(clickAction == "start" && !isGoal) {

            if(isStart) {
                startCell.innerHTML = "";
                startCell = null;
            }
            else {
                if(startCell != null) startCell.innerHTML = "";
                this.innerHTML = "<div class='size cell start'></div>";
                startCell = this;
            }
        }

        // Controls the goal points
        else if(clickAction == "goal" && !isStart) {

            if(isGoal) {
                this.innerHTML = "";
                goalCells.splice(goalCells.indexOf(this), 1);
            }
            else {
                this.innerHTML = "<div class='size cell goal'></div>";
                goalCells.push(this);
            }
        }
    }

    // Deletes the old map from html
    let oldTable = document.getElementById("map");
    if(oldTable != null) oldTable.remove();

    // Creates a table to hold the new map
    let table = document.createElement("table");
    table.setAttribute("id", "map");

    // 2D array for storing cell data
    let cellMap = array2D(width, height);

    // Generates an empty map
    for(let y = 0; y < height; y++) {

        let row = table.insertRow(y);

        for(let x = 0; x < width; x++) {

            // Creates a cell element and sets basic parameters
            let cell = row.insertCell(x);
            cell.type = 0;
            cell.setAttribute("class", "size " + cellClass + " " + defaultCell);

            // Adds the on click function to the cell for user left click
            cell.addEventListener("click", onClick);

            // Adds it for right click too
            cell.addEventListener("contextmenu", onClick);

            cellMap[y][x] = cell;  // Adds cell to map
        }
    }

    // Adds cell table to html and returns the map
    document.getElementById("mapcontainer").appendChild(table);

    return cellMap;
}