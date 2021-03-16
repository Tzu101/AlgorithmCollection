// Default biomes
let biomes= [[40, [0, 51, 204], "Deep ocean", 0], 
            [80, [0, 102, 255], "Shallow ocean", 0], 
            [95, [255, 255, 153], "Beach", 1], 
            [150, [102, 255, 51], "Plains", 2], 
            [170, [0, 153, 0], "Oak forrest", 3], 
            [190, [0, 153, 51], "Pine forrest", 4], 
            [210, [153, 102, 51], "Mountain", 5], 
            [240, [102, 51, 0], "Cliff", 6], 
            [255, [255, 255, 255], "Snow", 7]];
let selectedBiome;
let biomeNum = 1;

// Creates the biome selector from biomes
function updateBiomeSelector(keepSelected=false) {

    // click function for selection biome
    function onClick() {
        
        saveBiome();

        document.getElementById(selectedBiome[2]).classList.remove("selectedbiome");
        selectedBiome = biomes[this.index];

        updateCustomBiome();
    }

    function compareBiome(b1, b2) {

        return b1[0] - b2[0];
    }

    // Biomes sorted by height
    biomes.sort(compareBiome);
    if(!keepSelected) selectedBiome = biomes[0];

    let biomeSelector = document.getElementById("biomeselector");
    biomeSelector.innerHTML = "Biomes: ";

    for(let b = 0; b < biomes.length; b++) {

        let biome = document.createElement("div");

        biome.style.backgroundColor
         = "rgb("+biomes[b][1][0]+","+biomes[b][1][1]+","+biomes[b][1][2]+")";
        
        biome.index = b;
        biome.setAttribute("class", "biome");
        biome.setAttribute("id", biomes[b][2]);
        biome.addEventListener("click", onClick);

        biomeSelector.appendChild(biome);
    }

    updateCustomBiome();
}

// Updates selected biome data
function updateCustomBiome() {

    if(selectedBiome === undefined) return;

    document.getElementById(selectedBiome[2]).classList.add("selectedbiome");

    document.getElementById("biomeheight").value = selectedBiome[0];
    document.getElementById("biomered").value = selectedBiome[1][0];
    document.getElementById("biomegreen").value = selectedBiome[1][1];
    document.getElementById("biomeblue").value = selectedBiome[1][2];
    document.getElementById("biomename").value = selectedBiome[2];
    document.getElementById("traverse").value = selectedBiome[3];
}

// Saves changed to biome
function saveBiome() {

    if(selectedBiome === undefined) return;

    selectedBiome[0] = document.getElementById("biomeheight").value;
    selectedBiome[1][0] = document.getElementById("biomered").value;
    selectedBiome[1][1] = document.getElementById("biomegreen").value;
    selectedBiome[1][2] = document.getElementById("biomeblue").value;
    selectedBiome[3] = document.getElementById("traverse").value;

    let newName = document.getElementById("biomename").value

    if(document.getElementById(newName) == null) {
        document.getElementById(selectedBiome[2]).setAttribute("id", newName);
        selectedBiome[2] = newName;
    }

    updateBiomeSelector(true);
}

// Deletes selected biome
function deleteBiome() {

    biomes.splice(biomes.indexOf(selectedBiome), 1);
    updateBiomeSelector();
}

// Adds a new biome
function addBiome() {

    let newBiome = [256, [200, 200, 200], "new biome " + biomeNum];
    biomeNum++;

    selectedBiome = newBiome;
    biomes.push(newBiome);

    updateBiomeSelector(true);
}

// Genererates a random terrain map based on seed
function terrainMap(width, height) {

    updateBiomeSelector();
    updateCustomBiome();

    // function that runs when clicking on a cell to modify it
    function onModdify(cell, leftClick) {

        let perlinMap = document.getElementById("perlinmap").checked

        if(!perlinMap) {
            if(leftClick) {
                if(cell.biome < biomes.length-1) cell.biome++;
                else cell.biome = 0;
            }
            else {
                if(cell.biome > 0) cell.biome--;
                else cell.biome = biomes.length-1;
            }
            let rgb = biomes[cell.biome][1];
            cell.style.backgroundColor
            = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
        }
        else {
            if(leftClick) {
                if(cell.type <= 245) cell.type += 10;
            }
            else {
                if(cell.type >= 10) cell.type -= 10;
            }
            let grayscale = 255 - cell.type;
            cell.style.backgroundColor
            = "rgb("+grayscale+","+grayscale+","+grayscale+")";
        }
    }

    // Perlin noise parameters
    let scale = document.getElementById("scale").value;
    let octaves = document.getElementById("octaves").value;
    let lacunarity = document.getElementById("lacunarity").value;
    let persistance = document.getElementById("persistance").value;
    let perlinMap = document.getElementById("perlinmap").checked;

    let cellMap = makeMap(width, height, "", onModdify);

    let terraformMap = array2D(width, height);

    // Calculates the perlin noise map
    PerlinNoise.getOctave(width, height, scale, octaves, lacunarity, persistance, RandomGenerator.seed, terraformMap);

    // Displays either the biome map or the perlin map
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
    
            let height = terraformMap[y][x] * 255;
            
            if(perlinMap) {
                let grayscale = 255 - height;
                cellMap[y][x].style.backgroundColor = "rgb("+grayscale+","+grayscale+","+grayscale+")";
                cellMap[y][x].type = height;
            }
            
            else {

                for(let b = 0; b < biomes.length; b++) {

                    if(height <= biomes[b][0]) {
                        cellMap[y][x].style.backgroundColor
                        = "rgb("+biomes[b][1][0]+","+biomes[b][1][1]+","+biomes[b][1][2]+")";
                        cellMap[y][x].type = biomes[b][3];
                        cellMap[y][x].biome = b;
                        break;
                    }
                }
            }
        }
    }

    return cellMap;
}