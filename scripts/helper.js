const COLOR_WHITE = [255, 255, 255];
const COLOR_BLACK = [0, 0, 0];

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

    if (red == 0 && green == 0 && blue == 0) {
        return getRandomColor();
    }

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

function compareColors(color1, color2) {    
    if (color1[0] == color2[0] && color1[1] == color2[1] && color1[2] == color2[2]) return true;
    else return false;
}