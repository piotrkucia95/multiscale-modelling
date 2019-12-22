var boundaryEnergy = 1;

function calculateMonteCarlo(stateForIteration, xIndex, yIndex) {
    var neighbours = getMooreNeighbors(stateForIteration, xIndex, yIndex);
    var randomCellValue = Math.floor(Math.random() * (colorArray.length-2)) + 2;
    
    var energyBefore = countEnergy(neighbours, stateForIteration[xIndex][yIndex]);
    var energyAfter = countEnergy(neighbours, randomCellValue);
    var delta = energyAfter - energyBefore;
    
    if (delta <= 0) {
        stateArray[xIndex][yIndex] = randomCellValue;         
        drawPixel(xIndex, yIndex, colorArray[randomCellValue][0], colorArray[randomCellValue][1], colorArray[randomCellValue][2], 255);
    }
}

function countEnergy(neighbours, cellValue) {
    var differentNeighbours = [];
    for (var n of neighbours) {
        if (n != cellValue) {
            differentNeighbours.push(n);
        }
    }
    return differentNeighbours.length;
}