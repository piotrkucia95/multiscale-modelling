function getRandomColor() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    if ((red == COLOR_WHITE[0] && green == COLOR_WHITE[1] && blue == COLOR_WHITE[2]) || 
        (red == COLOR_BLACK[0] && green == COLOR_BLACK[1] && blue == COLOR_BLACK[2]) ||
        (red == COLOR_SELECTED[0] && green == COLOR_SELECTED[1] && blue == COLOR_SELECTED[2])) 
            return getRandomColor();

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