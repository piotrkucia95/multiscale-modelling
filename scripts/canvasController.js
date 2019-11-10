const electron      = require('electron');
const fileSaver     = require('file-saver');
const fs            = require('fs');
const readline      = require('readline');

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

    $('.canvas-column').removeClass('d-none');
    $('#x-size-input').attr('disabled', true);
    $('#y-size-input').attr('disabled', true);
    $('#size-button').attr('disabled', true);
    $('input[name="optradio"]').prop('disabled', false);
    $('#simulate-button').prop('disabled', false);
    $('#neighborhood-type').prop('disabled', false);
    $('#nucleons-number').prop('disabled', false);
    $('#nucleons-size').prop('disabled', false);
    $('#nucleons-shape').prop('disabled', false);
    $('#nucleons-button').prop('disabled', false);

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
    isMicrostructureGenerated = true;
    ipcRenderer.send('export:enable');
}

ipcRenderer.on('canvas:import:txt', function (e, filePath) {
    var lineReader = readline.createInterface({
        input: fs.createReadStream(filePath)
    });

    lineReader.on('line', function (line) {
        var lineParams = line.split(' ');
        if (lineParams.length == 2) {
            if ($('canvas').length != 0) $('canvas').remove();
            createCanvas(lineParams[0], lineParams[1]);
            initializeStateArray(lineParams[0], lineParams[1]);
        } else if (lineParams.length == 6) {
            stateArray[lineParams[0]][lineParams[1]] = lineParams[2];
            drawPixel(parseInt(lineParams[0]), parseInt(lineParams[1]), parseInt(lineParams[3]), parseInt(lineParams[4]), parseInt(lineParams[5]), 255);
            var isColorInArray = false;
            for (var c = 0; c < colorArray.length; c++) {
                if (colorArray[c][0] == lineParams[3] && colorArray[c][1] == lineParams[4] && colorArray[c][2] == lineParams[5]) {
                    isColorInArray = true;
                    break;
                }
            }
            if (!isColorInArray) colorArray.push([parseInt(lineParams[3]), parseInt(lineParams[4]), parseInt(lineParams[5])]);
        }
    });

    lineReader.on('close', function () {
        updateCanvas();
        enableCanvasExport();
    });
});

ipcRenderer.on('canvas:import:img', function (e, filePath) {
    var img1 = new Image();

    img1.onload = function () {
        if ($('canvas').length != 0) $('canvas').remove();
        createCanvas(img1.width, img1.height);
        initializeStateArray(canvasWidth, canvasHeight);
        context.drawImage(img1, 0, 0);
        canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight);
        var x = 0;
        for (var i = 0; i < canvasData.data.length; i += 4 * canvasWidth) {
            var y = 0;
            for (var j = 0; j < 4 * canvasWidth; j += 4) {
                var index = (x + y * canvasWidth) * 4; 
                var color = [canvasData.data[index], canvasData.data[index+1], canvasData.data[index+2]];
                var isColorInArray = false;
                var colorIndex = 0;
                for (var c = 0; c < colorArray.length; c++) {
                    if (colorArray[c][0] == color[0] && colorArray[c][1] == color[1] && colorArray[c][2] == color[2]) {
                        isColorInArray = true;
                        colorIndex = c;
                    }
                }
                if (!isColorInArray) {
                    colorIndex = colorArray.length;
                    colorArray.push(color);
                }
                stateArray[x][y] = colorIndex;
                y++;
            }
            x++;
        }
    };
    img1.src = filePath;
    enableCanvasExport();
});

ipcRenderer.on('canvas:export:txt', function (e) {
    var txtArray = [stateArray.length + ' ' + stateArray[0].length];
    for (var i = 0; i < stateArray.length; i++) {
        for (var j = 0; j < stateArray[i].length; j++) {
            txtArray.push( '\n' + i + ' ' + j + ' ' + stateArray[i][j] + ' ' + colorArray[stateArray[i][j]][0] + ' ' + colorArray[stateArray[i][j]][1] + ' ' + colorArray[stateArray[i][j]][2]);
        }
    }

    var file = new File(txtArray, "microstructure.txt", {type: "text/plain;charset=utf-8"});
    fileSaver.saveAs(file);
});

ipcRenderer.on('canvas:export:img', function (e) {
    canvas.toBlob(function(blob) {
        saveAs(blob, 'microstructure.bmp');
    });
});

