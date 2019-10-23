var canvas          = document.getElementById("main-canvas"); 
var context         = canvas.getContext("2d");
var canvasWidth     = canvas.width;
var canvasHeight    = canvas.height;
var canvasData      = context.createImageData(canvasWidth, canvasHeight);

function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;

    canvasData.data[index]     = r;  // Red
    canvasData.data[index + 1] = g;  // Green
    canvasData.data[index + 2] = b;  // Blue
    canvasData.data[index + 3] = a;  // Alpha
}

function updateCanvas() {
    context.putImageData(canvasData, 0, 0);
}
