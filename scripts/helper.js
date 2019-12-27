const COLOR_WHITE = [255, 255, 255];
const COLOR_BLACK = [0, 0, 0];
const COLOR_SELECTED = [252, 15, 192];

const COLOR_ENERGY_LOW = [4, 93, 197];
const COLOR_ENERGY_MEDIUM = [17, 136, 255];
const COLOR_ENERGY_HIGH = [155, 205, 36];

const TYPE_MOORE = 0;
const TYPE_VON_NEUMANN = 1;
const TYPE_SHAPE_CONTROL = 2;

const SHAPE_RANDOM = 0;
const SHAPE_ROUND = 1;
const SHAPE_SQUARE = 2;

function getRandomColor() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    if ((red == 0 && green == 0 && blue == 0) || (red == 1 && green == 1 && blue == 1)) return getRandomColor();

    return [red, green, blue];
}

function getMostFrequentColor(colorArray) {
    if (colorArray.length == 0) return null;

    var m = 0;
    var maxCount = 1;
    var item = colorArray[0];
    for (var i=0; i<colorArray.length; i++) {
        for (var j=i; j<colorArray.length; j++) {
            if (colorArray[i] == colorArray[j]) m++;
            if (maxCount < m) {
                maxCount = m; 
                item = colorArray[i];
            }
        }
        m = 0;
    }
    return item;
}

function getEnergyColor (energy) {
    if (energy <= 2) return COLOR_ENERGY_LOW;
    else if (energy > 2 && energy < 5) {
        return [(COLOR_ENERGY_LOW[0] + (COLOR_ENERGY_MEDIUM[0]-COLOR_ENERGY_LOW[0])*(energy/5)), 
                (COLOR_ENERGY_LOW[1] + (COLOR_ENERGY_MEDIUM[1]-COLOR_ENERGY_LOW[1])*(energy/5)), 
                (COLOR_ENERGY_LOW[2] + (COLOR_ENERGY_MEDIUM[2]-COLOR_ENERGY_LOW[2])*(energy/5))
            ];
    } else if (energy == 5) return COLOR_ENERGY_MEDIUM;
    else if (energy > 5 && energy < 7) {
        return [(COLOR_ENERGY_MEDIUM[0] + (COLOR_ENERGY_HIGH[0]-COLOR_ENERGY_MEDIUM[0])*(energy/7)), 
                (COLOR_ENERGY_MEDIUM[1] + (COLOR_ENERGY_HIGH[1]-COLOR_ENERGY_MEDIUM[1])*(energy/7)), 
                (COLOR_ENERGY_MEDIUM[2] + (COLOR_ENERGY_HIGH[2]-COLOR_ENERGY_MEDIUM[2])*(energy/7))
            ];
    } else return COLOR_ENERGY_HIGH;
}

function compareColors(color1, color2) {    
    if (color1[0] == color2[0] && color1[1] == color2[1] && color1[2] == color2[2]) return true;
    else return false;
}