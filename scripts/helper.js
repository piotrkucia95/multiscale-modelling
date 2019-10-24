const COLOR_WHITE = [255, 255, 255];

function getRandomColor() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    return [red, green, blue];
}

function getMostFrequentValue(array) {
    if (array.length == 0) return null;
    var modeMap = {};
    var maxEl = JSON.stringify(array[0]), maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = JSON.stringify(array[i]);
        if(modeMap[el] == null) {
            modeMap[el] = 1;
        } else {
            modeMap[el]++;
        }  
        if(modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}