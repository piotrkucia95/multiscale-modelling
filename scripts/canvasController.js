const electron      = require('electron');
const fileSaver     = require('file-saver');
const fs            = require('fs');

const {ipcRenderer} = electron;

var canvas;
var context;
var canvasWidth;
var canvasHeight;
var canvasData;

function createCanvas (width, height) {
    $('.canvas-container').append('<canvas id="main-canvas" width="' + width + '" height="' + height + '"></canvas>');
    
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    canvasData = context.createImageData(width, height);
    canvasWidth = width;
    canvasHeight = height;

    ipcRenderer.send('canvas:create', width, height);
}

function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;

    canvasData.data[index]     = r;  // Red
    canvasData.data[index + 1] = g;  // Green
    canvasData.data[index + 2] = b;  // Blue
    canvasData.data[index + 3] = a;  // Alpha
}

function updateCanvas () {
    context.putImageData(canvasData, 0, 0);
}

function enableCanvasExport () {
    ipcRenderer.send('export:enable');
}

ipcRenderer.on('canvas:import', function(e, filePath) {
    console.log(filePath);
});

ipcRenderer.on('canvas:export:txt', function(e) {
    var txtArray = [stateArray.length + ' ' + stateArray[0].length];
    for (var i = 0; i < stateArray.length; i++) {
        for (var j = 0; j < stateArray[i].length; j++) {
            txtArray.push( '\n' + i + ' ' + j + ' ' + stateArray[i][j] + ' ' + JSON.stringify(colorArray[stateArray[i][j]]));
        }
    }

    var file = new File(txtArray, "microstructure.txt", {type: "text/plain;charset=utf-8"});
    fileSaver.saveAs(file);
});

ipcRenderer.on('canvas:export:bmp', function(e) {
    canvas.toBlob(function(blob) {
        saveAs(blob, 'microstructure.bmp');
    });
});

