const electron = require('electron');
const {ipcRenderer} = electron;

var stateArray = [];
var colorArray = [];
for (var i=0; i<=300; i++) {
    stateArray[i] = [];
    for (var j=0; j<=300; j++) {
        stateArray[i][j] = [255, 255, 255];
    }
}

function setSize(width, height) {
    ipcRenderer.send('canvas:create', width, height);
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
                if (xIndex + i < canvasWidth-1 && xIndex + i >= 0 && yIndex + j < canvasHeight && yIndex + j >= 1) {
                    var d = (i / r) * (i / r) + (j / r) * (j / r); 
                    if (d < 1.08) {
                        stateArray[xIndex + i][yIndex + j] = pixelColor;
                        drawPixel(xIndex + i, yIndex + j, pixelColor[0], pixelColor[1], pixelColor[2], 255);
                    }
                }
            }
        }

    } else if (shape == SHAPE_SQUARE || size == 1) {
        for (var i=-leftIncrease; i<=righIncrease; i++) {
            for (var j=-leftIncrease; j<=righIncrease; j++) {
                if (xIndex + i < canvasWidth-1 && xIndex + i >= 0 && yIndex + j < canvasHeight && yIndex + j >= 1) {
                    stateArray[xIndex + i][yIndex + j] = pixelColor;
                    drawPixel(xIndex + i, yIndex + j, pixelColor[0], pixelColor[1], pixelColor[2], 255);
                }
            }
        }
    }
}

function spreadNucleonsRandomly(amount, size, shape) {
    for (var i=0; i < amount; i++) {
        var randomXIndex = Math.floor(Math.random() * 300);
        var randomYIndex = Math.floor(Math.random() * 300);
        addNucleon(randomXIndex, randomYIndex, size, shape);
    }
    updateCanvas();
}

function checkMoore(stateForIteration, xIndex, yIndex) {
    var neighborColors = [];
    if(compareColors(stateForIteration[xIndex][yIndex], COLOR_WHITE)) {
        for (var x=-1; x<=1; x++) {
            for (var y=-1; y<=1; y++) {
                if (xIndex+x < 0 || yIndex+y < 0) continue;
                if (!compareColors(stateForIteration[xIndex+x][yIndex+y], COLOR_WHITE)) {
                    neighborColors.push(stateForIteration[xIndex+x][yIndex+y]);
                }
            }
        }
        if (neighborColors.length) {
            stateArray[xIndex][yIndex] = getMostFrequentColor(neighborColors);
            drawPixel(xIndex, yIndex, stateArray[xIndex][yIndex][0], stateArray[xIndex][yIndex][1], stateArray[xIndex][yIndex][2], 255);
        }
    }
}

function simulateGrainGrowth() {
    var currentState = JSON.parse(JSON.stringify(stateArray));

    // TODO: find a new way of storing colors

    for (var i=0; i < canvasWidth-1; i++) {
        for (var j=1; j < canvasHeight; j++) {
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
    }
}
