var stateArray = [];
var colorArray = [];

function initializeStateArray(width, height) {
    stateArray = [];
    colorArray = [];
    colorArray.push(COLOR_WHITE);
    for (var i=0; i <= width; i++) {
        stateArray[i] = [];
        for (var j=0; j <= height; j++) {
            stateArray[i][j] = 0;
        }
    }
}

function addNucleon(xIndex, yIndex, size, shape) {
    var pixelColor = getRandomColor();
    colorArray.push(pixelColor);
    var leftIncrease = Math.floor(size / 2);
    var righIncrease = size % 2 == 0 ? leftIncrease-1 : leftIncrease;
    if (shape == SHAPE_RANDOM) shape = Math.round((Math.random() * 1) + 1);

    if (shape == SHAPE_ROUND && size > 1) {
        var r = leftIncrease;
        for (var i = -r; i <= r; i++) {
            for (var j = -r; j <= r; j++) {
                if (xIndex + i < canvasWidth-1 && xIndex + i > 0 && yIndex + j < canvasHeight-1 && yIndex + j > 0) {
                    var d = (i / r) * (i / r) + (j / r) * (j / r); 
                    if (d < 1.08) {
                        stateArray[xIndex + i][yIndex + j] = colorArray.indexOf(pixelColor);
                        drawPixel(xIndex + i, yIndex + j, pixelColor[0], pixelColor[1], pixelColor[2], 255);
                    }
                }
            }
        }

    } else if (shape == SHAPE_SQUARE || size == 1) {
        for (var i = -leftIncrease; i <= righIncrease; i++) {
            for (var j = -leftIncrease; j <= righIncrease; j++) {
                if (xIndex + i < canvasWidth-1 && xIndex + i > 0 && yIndex + j < canvasHeight-1 && yIndex + j > 0) {
                    stateArray[xIndex + i][yIndex + j] = colorArray.indexOf(pixelColor);
                    drawPixel(xIndex + i, yIndex + j, pixelColor[0], pixelColor[1], pixelColor[2], 255);
                }
            }
        }
    }
}

function spreadNucleonsRandomly(amount, size, shape) {
    for (var i=0; i < amount; i++) {
        var randomXIndex = Math.floor(Math.random() * canvasWidth);
        var randomYIndex = Math.floor(Math.random() * canvasHeight);
        addNucleon(randomXIndex, randomYIndex, size, shape);
    }
    updateCanvas();
}

function checkMoore(stateForIteration, xIndex, yIndex) {
    var neighborColors = [];
    if (stateForIteration[xIndex][yIndex] == 0) {
        for (var x=-1; x<=1; x++) {
            for (var y=-1; y<=1; y++) {
                if (xIndex+x < 0 || yIndex+y < 0) continue;
                if (stateForIteration[xIndex+x][yIndex+y] != 0) {
                    neighborColors.push(stateForIteration[xIndex+x][yIndex+y]);
                }
            }
        }
        if (neighborColors.length) {
            var colorIndex = getMostFrequentColor(neighborColors);
            stateArray[xIndex][yIndex] = colorIndex;            
            drawPixel(xIndex, yIndex, colorArray[colorIndex][0], colorArray[colorIndex][1], colorArray[colorIndex][2], 255);
        }
    }
}

function simulateGrainGrowth() {
    var currentState = JSON.parse(JSON.stringify(stateArray));

    for (var i = 1; i < canvasWidth - 1; i++) {
        for (var j = 1; j < canvasHeight - 1; j++) {
            checkMoore(currentState, i, j);
        }
    }

    updateCanvas();
    return currentState;
}
 
function startSimulation() {
    var currentState = simulateGrainGrowth();
    if (JSON.stringify(currentState) != JSON.stringify(stateArray)) {
        window.requestAnimationFrame(startSimulation);
    } else {
        enableCanvasExport();
    }
}
