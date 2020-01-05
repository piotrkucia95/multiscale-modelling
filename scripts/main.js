const COLOR_WHITE           = [255, 255, 255];
const COLOR_BLACK           = [0, 0, 0];
const COLOR_SELECTED        = [252, 15, 192];

// indices of colors in colorArray
const WHITE                 = 0;
const BLACK                 = 1;
const SELECTED              = 2;

const COLOR_ENERGY_LOW      = [4, 93, 197];
const COLOR_ENERGY_MEDIUM   = [17, 136, 255];
const COLOR_ENERGY_HIGH     = [155, 205, 36];

const TYPE_MOORE            = 0;
const TYPE_VON_NEUMANN      = 1;
const TYPE_SHAPE_CONTROL    = 2;

const SHAPE_RANDOM          = 0;
const SHAPE_ROUND           = 1;
const SHAPE_SQUARE          = 2;

var stateArray              = [];
var colorArray              = [];
var selectedGrains          = [];
var nucleonsNumber          = 0;
var isMicrostructureGenerated = false;

function initializeStateArray (width, height) {
    // order important
    colorArray = [COLOR_WHITE, COLOR_BLACK, COLOR_SELECTED];
    stateArray = [];
    selectedGrains = [];
    nucleonsNumber = 0;

    for (var i=0; i < width; i++) {
        stateArray[i] = [];
        for (var j=0; j < height; j++) {
            stateArray[i][j] = WHITE;
        }
    }
}

function getRandomStateColors (numberOfStates) {
    for (var i = 0; i < numberOfStates; i++) {
        colorArray.push(getRandomColor());
    }
}

function getNextStateColor () {
    var currentNucleon = SELECTED;
    for (var i = 0; i < nucleonsNumber; i++) {
        if (currentNucleon >= colorArray.length - 1) currentNucleon = SELECTED;
        currentNucleon++;
    }
    return colorArray[currentNucleon];
}

function addNucleon (xIndex, yIndex, size, shape, isNucleon) {
    if (isNucleon) {
        var pixelColor = COLOR_BLACK;
    } else {
        nucleonsNumber++;
        var pixelColor = getNextStateColor();
    }

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
                    if (!isNucleon && stateArray[xIndex + i][yIndex + j] != WHITE) continue; 
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
        if (!isNucleon && stateArray[randomXIndex][randomYIndex] != 0) {
            i--;
            continue;
        }
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
            if (stateArray[i][j] != WHITE && stateArray[i][j] != BLACK) {
                var pointColor = stateArray[i][j];
                var isBoundary = false;
                for (var x = -1; x <= 1; x++) {
                    for (var y = -1; y <= 1; y++) {
                        if (i+x < 0 || i+x > canvasWidth-1 || j+y < 0 || j+y > canvasHeight-1) continue;
                        if (stateArray[i+x][j+y] != pointColor && stateArray[i+x][j+y] != BLACK) {
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
            if (currentState[i][j] == WHITE) checkNeighbors(currentState, i, j, probability);
        }
    }

    updateCanvas();
}
 
function startSimulation (neighborhoodType, probability) {
    simulateGrainGrowth(neighborhoodType, probability);
    if (!checkIfFinished()) {
        window.requestAnimationFrame(() => startSimulation(neighborhoodType, probability));
    } else {
        enableCanvasExport();
    }
}

function checkIfFinished () {
    for (var i = 0; i < stateArray.length; i++) {
        for (var j = 0; j < stateArray[0].length; j++) {
            if (stateArray[i][j] == WHITE) {
                return false;
            }
        }
    }
    return true;
}

function simulateMonteCarlo () {
    var currentState = JSON.parse(JSON.stringify(stateArray));
    for (var i = 0; i < canvasWidth; i++) {
        for (var j = 0; j < canvasHeight; j++) {
            calculateMonteCarlo(currentState, i, j);
        }
    }
    updateCanvas();
}

var monteCarloCalls = 0;
function startMonteCarlo (iterations) {
    simulateMonteCarlo();
    monteCarloCalls++;
    if (monteCarloCalls <= iterations) {
        window.requestAnimationFrame(() => startMonteCarlo(iterations));
    } else {
        monteCarloCalls = 0;
    }
}

function checkIfSameGrainNeighbours(colorIndex, xIndex, yIndex) {
    if (stateArray[xIndex][yIndex] == BLACK || stateArray[xIndex][yIndex] == SELECTED) return;

    stateArray[xIndex][yIndex] = SELECTED;
    drawPixel(xIndex, yIndex, COLOR_SELECTED[0], COLOR_SELECTED[1], COLOR_SELECTED[2], 255);

    if ((xIndex - 1 >= 0) && (stateArray[xIndex-1][yIndex] == colorIndex)) 
        checkIfSameGrainNeighbours(colorIndex, xIndex-1, yIndex);
    if (xIndex+1 < stateArray.length && stateArray[xIndex+1][yIndex] == colorIndex) 
        checkIfSameGrainNeighbours(colorIndex, xIndex+1, yIndex);
    if (yIndex-1 >= 0 && stateArray[xIndex][yIndex-1] == colorIndex) 
        checkIfSameGrainNeighbours(colorIndex, xIndex, yIndex-1);
    if (yIndex-1 < stateArray[0].length && stateArray[xIndex][yIndex+1] == colorIndex) 
        checkIfSameGrainNeighbours(colorIndex, xIndex, yIndex+1);
}
