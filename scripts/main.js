var stateArray                  = [];
var colorArray                  = [];
var selectedGrains              = [];
var isMicrostructureGenerated   = false;

function initializeStateArray (width, height) {
    colorArray = [COLOR_WHITE, COLOR_BLACK];
    stateArray = [];
    selectedGrains = [];

    for (var i=0; i < width; i++) {
        stateArray[i] = [];
        for (var j=0; j < height; j++) {
            stateArray[i][j] = 0;
        }
    }
}

function addNucleon (xIndex, yIndex, size, shape, isNucleon) {
    if (isNucleon) {
        var pixelColor = COLOR_BLACK;
    } else {
        var pixelColor = getRandomColor();
    }
    
    colorArray.push(pixelColor);
    var leftIncrease = Math.floor(size / 2);
    var righIncrease = size % 2 == 0 ? leftIncrease-1 : leftIncrease;
    if (shape == SHAPE_RANDOM) shape = Math.round((Math.random() * 1) + 1);

    if (shape == SHAPE_ROUND && size > 1) {
        var r = leftIncrease;
        for (var i = -r; i <= r; i++) {
            for (var j = -r; j <= r; j++) {
                if (xIndex + i < canvasWidth && xIndex + i >= 0 && yIndex + j < canvasHeight && yIndex + j >= 0) {
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
                if (xIndex + i < canvasWidth && xIndex + i >= 0 && yIndex + j < canvasHeight && yIndex + j >= 0) {
                    stateArray[xIndex + i][yIndex + j] = colorArray.indexOf(pixelColor);
                    drawPixel(xIndex + i, yIndex + j, pixelColor[0], pixelColor[1], pixelColor[2], 255);
                }
            }
        }
    }
}

function spreadNucleonsRandomly (amount, size, shape, isNucleon) {
    if (!isNucleon) var isNucleon = false;

    for (var i=0; i < amount; i++) {
        var randomXIndex = Math.floor(Math.random() * canvasWidth);
        var randomYIndex = Math.floor(Math.random() * canvasHeight);
        addNucleon(randomXIndex, randomYIndex, size, shape, isNucleon);
    }
    updateCanvas();
}

function spreadNucleonsOnGrainBoundaries (amount, size, shape, isNucleon) {
    var grainBoundaries = getGrainBoundaries();

    for (var i = 0; i < parseInt(amount); i++) {
        var index = Math.floor(Math.random() * grainBoundaries.length);
        addNucleon(grainBoundaries[index][0], grainBoundaries[index][1], size, shape, isNucleon);
    }
    updateCanvas();
}

function getGrainBoundaries () {
    var boundaries = [];
    for (var i = 0; i < stateArray.length; i++) {
        for (var j = 0; j < stateArray[i].length; j++) {
            if (stateArray[i][j] != 0 && stateArray[i][j] != 1) {
                var pointColor = stateArray[i][j];
                var isBoundary = false;
                for (var x=-1; x<=1; x++) {
                    for (var y=-1; y<=1; y++) {
                        if (i+x < 0 || i+x > canvasWidth-1 || j+y < 0 || j+y > canvasHeight-1) continue;
                        if (stateArray[i+x][j+y] != pointColor && stateArray[i+x][j+y] != 1) {
                            isBoundary = true
                        }
                    }
                }
                if (isBoundary) boundaries.push([i, j]);
            }
        }   
    }
    return boundaries;
}

function simulateGrainGrowth (neighborhoodType, probability) {
    var currentState = JSON.parse(JSON.stringify(stateArray));

    switch (neighborhoodType) {
        case TYPE_MOORE:
            var checkNeighbors = checkMoore;
            break;
        case TYPE_VON_NEUMANN:
            var checkNeighbors = checkVonNeumann;
            break;
        case TYPE_SHAPE_CONTROL:
            var checkNeighbors = checkShapeControl;
            break;
        default:
            break;
    }

    for (var i = 0; i < canvasWidth; i++) {
        for (var j = 0; j < canvasHeight; j++) {
            checkNeighbors(currentState, i, j, probability);
        }
    }

    updateCanvas();
    return currentState;
}
 
function startSimulation (neighborhoodType, probability) {
    var currentState = simulateGrainGrowth(neighborhoodType, probability);
    if (!checkIfFinished()) {
        window.requestAnimationFrame(() => startSimulation(neighborhoodType, probability));
    } else {
        enableCanvasExport();
    }
}

function checkIfFinished () {
    for (var i = 0; i < stateArray.length; i++) {
        for (var j = 0; j < stateArray[0].length; j++) {
            if (stateArray[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}
