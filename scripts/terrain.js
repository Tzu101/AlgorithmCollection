let biomes= [[40, [0, 51, 204], "Deep ocean"], 
            [80, [0, 102, 255], "Shallow ocean"], 
            [95, [255, 255, 153], "Beach"], 
            [150, [102, 255, 51], "Plains"], 
            [170, [0, 153, 0], "Oak forrest"], 
            [190, [0, 153, 51], "Pine forrest"], 
            [210, [153, 102, 51], "Mountain"], 
            [240, [102, 51, 0], "Cliff"], 
            [255, [255, 255, 255], "Snow"]];
let selectedBiome;
let biomeNum = 1;

function updateBiomeSelector(keepSelected=false) {

    function onClick() {
        
        saveBiome();

        document.getElementById(selectedBiome[2]).classList.remove("selectedbiome");
        selectedBiome = biomes[this.index];

        updateCustomBiome();
    }

    function compareBiome(b1, b2) {

        return b1[0] - b2[0];
    }

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

function updateCustomBiome() {

    if(selectedBiome === undefined) return;

    document.getElementById(selectedBiome[2]).classList.add("selectedbiome");

    document.getElementById("biomeheight").value = selectedBiome[0];
    document.getElementById("biomered").value = selectedBiome[1][0];
    document.getElementById("biomegreen").value = selectedBiome[1][1];
    document.getElementById("biomeblue").value = selectedBiome[1][2];
    document.getElementById("biomename").value = selectedBiome[2];
}

function saveBiome() {

    if(selectedBiome === undefined) return;

    selectedBiome[0] = document.getElementById("biomeheight").value;
    selectedBiome[1][0] = document.getElementById("biomered").value;
    selectedBiome[1][1] = document.getElementById("biomegreen").value;
    selectedBiome[1][2] = document.getElementById("biomeblue").value;

    let newName = document.getElementById("biomename").value

    if(document.getElementById(newName) == null) {
        document.getElementById(selectedBiome[2]).setAttribute("id", newName);
        selectedBiome[2] = newName;
    }

    updateBiomeSelector(true);
}

function deleteBiome() {

    biomes.splice(biomes.indexOf(selectedBiome), 1);
    updateBiomeSelector();
}

function addBiome() {

    let newBiome = [256, [200, 200, 200], "new biome " + biomeNum];
    biomeNum++;

    selectedBiome = newBiome;
    biomes.push(newBiome);

    updateBiomeSelector(true);
}

function terrainMap(width, height) {

    updateBiomeSelector();
    updateCustomBiome();

    // function that runs when clicking on a cell to modify it
    function onModdify(cell, leftClick) {

        if(leftClick) {
            if(cell.type < biomes.length-1) cell.type++;
            else cell.type = 0;
        }
        else {
            if(cell.type > 0) cell.type--;
            else cell.type = biomes.length-1;
        }

        cell.style.backgroundColor
        = "rgb("+biomes[cell.type][1][0]+","+biomes[cell.type][1][1]+","+biomes[cell.type][1][2]+")";
    }

    let scale = document.getElementById("scale").value;
    let octaves = document.getElementById("octaves").value;
    let lacunarity = document.getElementById("lacunarity").value;
    let persistance = document.getElementById("persistance").value;
    let perlinMap = document.getElementById("perlinmap").checked;

    let cellMap = makeMap(width, height, "", onModdify);

    let terraformMap = array2D(width, height);

    PerlinNoise.getOctave(width, height, scale, octaves, lacunarity, persistance, RandomGenerator.seed, terraformMap);

    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
    
            let height = terraformMap[y][x] * 255;
            
            if(perlinMap) {
                height = 255 - height;
                cellMap[y][x].style.backgroundColor = "rgb("+height+","+height+","+height+")";
            }
            
            else {

                for(let b = 0; b < biomes.length; b++) {

                    if(height <= biomes[b][0]) {
                        cellMap[y][x].style.backgroundColor
                        = "rgb("+biomes[b][1][0]+","+biomes[b][1][1]+","+biomes[b][1][2]+")";
                        cellMap[y][x].type = b;
                        break;
                    }
                }
            }
        }
    }
}