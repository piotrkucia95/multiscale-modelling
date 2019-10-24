var stateArray = [];
for (var i=0; i<300; i++) {
    stateArray[i] = [];
    for (var j=0; j<300; j++) {
        stateArray[i][j] = [255, 255, 255];
    }
}

function addNucleon(xIndex, yIndex, size) {
    var pixelColor = getRandomColor();
    sideSize = Math.floor(size / 2);
    for (var i=-sideSize; i<sideSize; i++) {
        for (var j=-sideSize; j<=sideSize; j++) {
            if (xIndex + i < canvasWidth && xIndex + i >= 0 && yIndex + j < canvasHeight && yIndex + j >= 0) {
                stateArray[xIndex + i][yIndex + j] = pixelColor;
                drawPixel(xIndex + i, yIndex + j, pixelColor[0], pixelColor[1], pixelColor[2], 255);
            }
        }
    }
}

function spreadNucleonsRandomly(amount, size) {
    for (var i=0; i < amount; i++) {
        var randomXIndex = Math.floor(Math.random() * 300);
        var randomYIndex = Math.floor(Math.random() * 300);
        addNucleon(randomXIndex, randomYIndex, size);
    }
    updateCanvas();
}

function simulateGrainGrowth() {
    var neighborColors = [];
    var stateForIteration = stateArray;

    for (var i=0; i < canvasWidth; i++) {
        for (var j=0; j < canvasHeight; j++) {

            if (compareColors(stateForIteration[i][j], COLOR_WHITE)) {
                if (i != 0 && j != 0 && !compareColors(stateForIteration[i-1][j-1], COLOR_WHITE)) {
                    // neighborColors.push(stateForIteration[i-1][j-1]);
                    stateArray[i][j] = stateForIteration[i-1][j-1];
                    drawPixel(i, j, stateArray[i][j][0], stateArray[i][j][1], stateArray[i][j][2], 255);
                
                } else if (j != 0 && !compareColors(stateForIteration[i][j-1], COLOR_WHITE)) {
                    // neighborColors.push(stateForIteration[i][j-1]);
                    stateArray[i][j] = stateForIteration[i][j-1];
                    drawPixel(i, j, stateArray[i][j][0], stateArray[i][j][1], stateArray[i][j][2], 255);
                
                } else if (i != canvasWidth - 1 && j != 0 && !compareColors(stateForIteration[i+1][j-1], COLOR_WHITE)) {
                    // neighborColors.push(stateForIteration[i+1][j-1]);
                    stateArray[i][j] = stateForIteration[i+1][j-1];
                    drawPixel(i, j, stateArray[i][j][0], stateArray[i][j][1], stateArray[i][j][2], 255);
                
                } else if (i != canvasWidth - 1 && !compareColors(stateForIteration[i+1][j], COLOR_WHITE)) {
                    // neighborColors.push(stateForIteration[i+1][j]);
                    stateArray[i][j] = stateForIteration[i+1][j];
                    drawPixel(i, j, stateArray[i][j][0], stateArray[i][j][1], stateArray[i][j][2], 255);
                
                } else if (i != canvasWidth - 1 && j != canvasHeight - 1 && !compareColors(stateForIteration[i+1][j+1], COLOR_WHITE)) {
                    // neighborColors.push(stateForIteration[i+1][j+1]);
                    stateArray[i][j] = stateForIteration[i+1][j+1];
                    drawPixel(i, j, stateArray[i][j][0], stateArray[i][j][1], stateArray[i][j][2], 255);
                
                } else if (j != canvasHeight - 1 && !compareColors(stateForIteration[i][j+1], COLOR_WHITE)) {
                    // neighborColors.push(stateForIteration[i][j+1]);
                    stateArray[i][j] = stateForIteration[i][j+1];
                    drawPixel(i, j, stateArray[i][j][0], stateArray[i][j][1], stateArray[i][j][2], 255);
                
                } else if (i != 0 && j != canvasHeight - 1 && !compareColors(stateForIteration[i-1][j+1], COLOR_WHITE)) {
                    // neighborColors.push(stateForIteration[i-1][j+1]);
                    stateArray[i][j] = stateForIteration[i-1][j+1];
                    drawPixel(i, j, stateArray[i][j][0], stateArray[i][j][1], stateArray[i][j][2], 255);
                
                } else if (i != 0 && !compareColors(stateForIteration[i-1][j], COLOR_WHITE)) {
                    // neighborColors.push(stateForIteration[i-1][j]);
                    stateArray[i][j] = stateForIteration[i-1][j];
                    drawPixel(i, j, stateArray[i][j][0], stateArray[i][j][1], stateArray[i][j][2], 255);
                }
            }
        }
    }
    updateCanvas();
}
 
function startSimulation() {
    window.requestAnimationFrame(startSimulation);
    simulateGrainGrowth();
}
