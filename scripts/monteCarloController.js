var boundaryEnergy = 1;

function calculateMonteCarlo (stateForIteration, xIndex, yIndex) {
    if (stateForIteration[xIndex][yIndex] == 1 || selectedGrains.includes(stateForIteration[xIndex][yIndex])) return;
    var neighbours = getMooreNeighbors(stateForIteration, xIndex, yIndex);
    var randomCellValue = Math.floor(Math.random() * (colorArray.length-3)) + 3;
    
    var energyBefore = countEnergy(neighbours, stateForIteration[xIndex][yIndex]);
    var energyAfter = countEnergy(neighbours, randomCellValue);
    var delta = energyAfter - energyBefore;
    
    if (delta <= 0) {
        stateArray[xIndex][yIndex] = randomCellValue;         
        drawPixel(xIndex, yIndex, colorArray[randomCellValue][0], colorArray[randomCellValue][1], colorArray[randomCellValue][2], 255);
    }
}

function countEnergy (neighbours, cellValue) {
    var differentNeighbours = [];
    for (var n of neighbours) {
        if (n != cellValue) {
            differentNeighbours.push(n);
        }
    }
    console.log(differentNeighbours.length);
    return differentNeighbours.length;
}

function drawEnergy (grainEnergy, boundaryEnergy) {
    var boundaries = getGrainBoundaries();
    var grainColor = getRandomColor();
    var boundaryColor = (grainEnergy == boundaryEnergy ? grainColor : getRandomColor());

    for (var i=0; i<canvasWidth; i++) {
        for (var j=0; j<canvasHeight; j++) {
            drawPixel(i, j, grainColor[0], grainColor[1], grainColor[2], 255);
        }
    }
    for (b of boundaries) {
        drawPixel(b[0], b[1], boundaryColor[0], boundaryColor[1], boundaryColor[2], 255);
    }
    updateCanvas();
}

function drawStates() {
    for (var i=0; i<canvasWidth; i++) {
        for (var j=0; j<canvasHeight; j++) {
            drawPixel(i, j, colorArray[stateArray[i][j]][0], colorArray[stateArray[i][j]][1], colorArray[stateArray[i][j]][2], 255);
        }
    }
    updateCanvas();
}