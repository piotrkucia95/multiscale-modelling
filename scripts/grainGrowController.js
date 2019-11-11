function checkMoore (stateForIteration, xIndex, yIndex) {
    if (stateForIteration[xIndex][yIndex] == 0) {
        var neighborColors = getMooreNeighbors(stateForIteration, xIndex, yIndex);
        if (neighborColors.length) {
            var colorIndex = getMostFrequentColor(neighborColors);
            stateArray[xIndex][yIndex] = colorIndex;         
            drawPixel(xIndex, yIndex, colorArray[colorIndex][0], colorArray[colorIndex][1], colorArray[colorIndex][2], 255);
        }
    }
}

function checkVonNeumann (stateForIteration, xIndex, yIndex) {
    if (stateForIteration[xIndex][yIndex] == 0) {
        var neighborColors = getVonNeumannNeighbors(stateForIteration, xIndex, yIndex);
        if (neighborColors.length) {
            var colorIndex = getMostFrequentColor(neighborColors);
            stateArray[xIndex][yIndex] = colorIndex;         
            drawPixel(xIndex, yIndex, colorArray[colorIndex][0], colorArray[colorIndex][1], colorArray[colorIndex][2], 255);
        }
    }
}

function checkShapeControl (stateForIteration, xIndex, yIndex, probability) {
    if (stateForIteration[xIndex][yIndex] == 0) {
        var firstRuleNeighbors = getMooreNeighbors(stateForIteration, xIndex, yIndex);
        var secondRuleNeighbors = getVonNeumannNeighbors(stateForIteration, xIndex, yIndex);
        var thirdRuleNeighbors = getFurtherMooreNeighbors(stateForIteration, xIndex, yIndex);

        if (!checkRule(firstRuleNeighbors, xIndex, yIndex, 5)) {
            if (!checkRule(secondRuleNeighbors, xIndex, yIndex, 3)) {
                if(!checkRule(thirdRuleNeighbors, xIndex, yIndex, 3)) {
                    if (firstRuleNeighbors.length > 0) {
                        var randomNumber = Math.floor(Math.random() * 100);
                        if (randomNumber < probability) {
                            var colorIndex = getMostFrequentColor(firstRuleNeighbors);
                            stateArray[xIndex][yIndex] = colorIndex;         
                            drawPixel(xIndex, yIndex, colorArray[colorIndex][0], colorArray[colorIndex][1], colorArray[colorIndex][2], 255);
                        }
                    }
                }
            }
        }
    }
}

function checkRule(neighborColors, xIndex, yIndex, amount) {
    if (neighborColors.length > 0) {
        var colorIndex = getMostFrequentColor(neighborColors);
        var colorCounter = 0;
        for (var i = 0; i < neighborColors.length; i++) {
            if (neighborColors[i] == colorIndex) colorCounter++;
        }
        if (colorCounter >= amount) {
            stateArray[xIndex][yIndex] = colorIndex;         
            drawPixel(xIndex, yIndex, colorArray[colorIndex][0], colorArray[colorIndex][1], colorArray[colorIndex][2], 255);
            return true;
        } 
        return false;
    }
}

function getMooreNeighbors(stateForIteration, xIndex, yIndex) {
    var neighborColors = [];
    for (var x=-1; x<=1; x++) {
        for (var y=-1; y<=1; y++) {
            if (xIndex+x < 0 || xIndex+x > canvasWidth-1 || yIndex+y < 0 || yIndex+y > canvasHeight-1) continue;
            if (stateForIteration[xIndex+x][yIndex+y] != 0 && stateForIteration[xIndex+x][yIndex+y] != 1) {
                neighborColors.push(stateForIteration[xIndex+x][yIndex+y]);
            }
        }
    }
    return neighborColors;
}

function getVonNeumannNeighbors(stateForIteration, xIndex, yIndex) {
    var neighborColors = [];
    for (var x=-1; x<=1; x++) {
        if (xIndex+x < 0 || xIndex+x > canvasWidth-1) continue;
        if (stateForIteration[xIndex+x][yIndex] != 0 && stateForIteration[xIndex+x][yIndex] != 1) {
            neighborColors.push(stateForIteration[xIndex+x][yIndex]);
        }
        if (yIndex+x < 0 || yIndex+x > canvasHeight-1) continue;
        if (stateForIteration[xIndex][yIndex+x] != 0 && stateForIteration[xIndex][yIndex+x] != 1) {
            neighborColors.push(stateForIteration[xIndex][yIndex+x]);
        }
    }
    return neighborColors;
}

function getFurtherMooreNeighbors(stateForIteration, xIndex, yIndex) {
    var neighborColors = [];
    for (var x=-1; x<=1; x++) {
        for (var y=-1; y<=1; y++) {
            if (x == 0 || y == 0) continue;
            if (xIndex+x < 0 || xIndex+x > canvasWidth-1 || yIndex+y < 0 || yIndex+y > canvasHeight-1) continue;
            if (stateForIteration[xIndex+x][yIndex+y] != 0 && stateForIteration[xIndex+x][yIndex+y] != 1) {
                neighborColors.push(stateForIteration[xIndex+x][yIndex+y]);
            }
        }
    }
    return neighborColors;
}