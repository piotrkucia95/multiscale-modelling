var stateArray = [];
for (var i=0; i<300; i++) {
    stateArray[i] = [];
    for (var j=0; j<300; j++) {
        stateArray[i][j] = 0;
    }
}

function addNucleon(xIndex, yIndex) {
    stateArray[xIndex][yIndex] = 1;
    drawPixel(xIndex, yIndex, 255, 0, 0, 255);
}

function spreadNucleonsRandomly(amount) {
    for (var i=0; i < amount; i++) {
        var randomXIndex = Math.floor(Math.random() * 300);
        var randomYIndex = Math.floor(Math.random() * 300);
        addNucleon(randomXIndex, randomYIndex);
    }
    updateCanvas();
}
 
function startSimulation(tframe) {
    // Request animation frames
    window.requestAnimationFrame(startSimulation);

    // Draw the image data to the canvas
    // context.putImageData(canvasData, 0, 0);
}
