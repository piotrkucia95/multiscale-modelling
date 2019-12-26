var isCanvasDrawable = false;

$('#size-button').on('click', (event) => {

    var width = $('#x-size-input').val();
    var height = $('#y-size-input').val();

    if (!width || !height) {
        $('#size-error').text('Enter X Size and Y Size of the space.');
    } else if (width < 100 || height < 100) {
        $('#size-error').text('Entered sizes are too small. Minimum size is 100px.');
    } else {
        $('#size-error').text('');
        createCanvas(width, height);
        initializeStateArray(width, height);
    }
});

$('#neighborhood-type').on('change', (event) => {
    if (event.target.value == TYPE_SHAPE_CONTROL) {
        $('.probability-container').removeClass('d-none');
    } else {
        $('.probability-container').addClass('d-none');
    }
});

$('input[name="optradio"]').on('click', (event) => {
    if(event.target.value === 'manual') {
        $('#grains-number').attr('disabled', true);
        $('#grains-button').attr('disabled', true);
        isCanvasDrawable = true;
    } else {
        $('#grains-number').prop('disabled', false);
        $('#grains-button').prop('disabled', false);
        isCanvasDrawable = false;
    }
});

$('#grains-button').on('click', () => {
    var numberOfGrains = $('#grains-number').val();
    var numberOfStates = $('#states-number').val();
    if (!numberOfStates || numberOfStates < 1) {
        $('#states-error').text('Provide a valid number of states.');
    } else {
        if (colorArray.length <= 3) getRandomStateColors(numberOfStates);
        $('#states-error').text('');
    }

    if (!numberOfGrains) {
        $('#grains-error').text('Provide a number of grains.');
    } else if (numberOfGrains < 1 || numberOfGrains > canvasWidth*canvasHeight) {
        $('#grains-error').text('Number of grains must be higher than 0 and lower than space size.');
    } else {
        $('#grains-error').text('');
        $('#states-number').attr('disabled', true);
        spreadNucleonsRandomly(numberOfGrains, 1, SHAPE_SQUARE, false);
    }
});

$('#inclusions-button').on('click', ()=> {
    var numberOfNucleons = $('#inclusions-number').val();
    var sizeOfNucleons = $('#inclusions-size').val();
    var shapeOfNucleons = $('#inclusions-shape').val();

    if (!numberOfNucleons) {
        $('#inclusions-error').text('Provide a number of inclusions.');
        return;
    } else if (numberOfNucleons < 1 || numberOfNucleons > canvasWidth*canvasHeight) {
        $('#inclusions-error').text('Number of inclusions must be higher than 0 and lower than space size.');
        return;
    }

    if (!sizeOfNucleons) {
        $('#inclusions-error').text('Provide the size of inclusions.');
        return;
    } else if (sizeOfNucleons < 1) {
        $('#inclusions-error').text('The size of inclusions must be higher than 0.');
        return;
    }

    if (isMicrostructureGenerated) {
        spreadNucleonsOnGrainBoundaries(numberOfNucleons, sizeOfNucleons, shapeOfNucleons, true);
    } else {
        spreadNucleonsRandomly(numberOfNucleons, sizeOfNucleons, shapeOfNucleons, true);
    }
});

$('#ca-simulate-button').on('click', () => {
    var neighborhoodType = $('#neighborhood-type').val();
    var probability = $('#probability').val();
    if (!probability && neighborhoodType == TYPE_SHAPE_CONTROL) {
        $('#probability-error').text('Enter probability.');
    } else if (neighborhoodType == TYPE_SHAPE_CONTROL && (probability < 1 || probability > 100)) {
        $('#probability-error').text('Probabilty must be a value between 1% and 100%.');
    } else {
        $('#probability-error').text('');
        startSimulation( parseInt(neighborhoodType), parseInt(probability) );
        isCanvasDrawable = false;
    }
});

$('#select-grains-button').on('click', (event) => {
    var isSelectionOfAll = $('input[name="selection-opt"]:checked').val() == 'all-grains';

    if (!selectedGrains.length) updateInputsOnCanvasClear();
    var isDualPhase = $('#structure').val() == 0;
    for (var i = 0; i < stateArray.length; i++) {
        for (var j = 0; j < stateArray[0].length; j++) {
            if (isSelectionOfAll && !selectedGrains.includes(stateArray[i][j]) && stateArray[i][j] != 1) {
                stateArray[i][j] = 0;
                drawPixel(i, j, COLOR_WHITE[0], COLOR_WHITE[1], COLOR_WHITE[2], 255);
            } else if (isSelectionOfAll && isDualPhase){
                stateArray[i][j] = 2;
                drawPixel(i, j, COLOR_SELECTED[0], COLOR_SELECTED[1], COLOR_SELECTED[2], 255);
            } else if (!isSelectionOfAll && stateArray[i][j] != 2) {
                stateArray[i][j] = 0;
                drawPixel(i, j, COLOR_WHITE[0], COLOR_WHITE[1], COLOR_WHITE[2], 255);
            }

        }
    }
    updateCanvas();
    updateInputsOnGrainsSelect();
    selectedGrains.length = 0;
});

$('#color-all-button').on('click', (event) => {
    var grainBoundaries = getGrainBoundaries();
    for (var i = 0; i < grainBoundaries.length; i++) {
        addNucleon(grainBoundaries[i][0], grainBoundaries[i][1], 1, 1, true);
    }
    updateCanvas();
    $('#color-all-button').attr('disabled', true);
    $('#color-selected-button').attr('disabled', true);
});

$('#color-selected-button').on('click', (event) => {
    var grainBoundaries = getGrainBoundaries();
    for (var i = 0; i < grainBoundaries.length; i++) {
        if (selectedGrains.includes(stateArray[grainBoundaries[i][0]][grainBoundaries[i][1]])) {
            addNucleon(grainBoundaries[i][0], grainBoundaries[i][1], 1, 1, true);
            for (var x = -1; x <= 1; x++) {
                for (var y = -1; y <= 1; y++) {
                    var xIndex = grainBoundaries[i][0];
                    var yIndex = grainBoundaries[i][1];
                    if (xIndex+x < 0 || xIndex+x > canvasWidth-1 || yIndex+y < 0 || yIndex+y > canvasHeight-1) continue;
                    var arr = [(xIndex + x), (yIndex + y)];

                    for (var gb of grainBoundaries) {
                        if (gb[0] == arr[0] && gb[1] == arr[1]) {
                            addNucleon(arr[0], arr[1], 1, 1, true);
                        }
                    }
                }
            }
        }

    }
    updateCanvas();
});

$('#clear-button').on('click', (event) => {
    for (var i = 0; i < stateArray.length; i++) {
        for (var j = 0; j < stateArray[i].length; j++) {
            stateArray[i][j] = 0;
            drawPixel(i, j, 0, 0, 0, 0);
        }   
    }
    updateCanvas();
    isMicrostructureGenerated = false;
    ipcRenderer.send('export:disable');
    updateInputsOnCanvasClear();
});

function addCanvasOnclickHandler() {
    $('#main-canvas').on('click', (event) => {
        if (isCanvasDrawable) {
            var numberOfStates = $('#states-number').val();
            if (!numberOfStates || numberOfStates < 1) {
                $('#states-error').text('Provide a valid number of states before adding nucleons.');
                return;
            } else {
                if (colorArray.length <= 3) getRandomStateColors(numberOfStates);
                addNucleon(event.offsetX, event.offsetY, 1, SHAPE_SQUARE, false);
                updateCanvas();
                $('#states-number').attr('disabled', true);
                $('#states-error').text('');
            }
        } else if (isMicrostructureGenerated) {
            var isSelectionOfAll = $('input[name="selection-opt"]:checked').val() == 'all-grains';
            var phase = stateArray[event.offsetX][event.offsetY];
            if (phase == 1) return;

            if (isSelectionOfAll) {
                var hasPhase = false;
                for (var p of selectedGrains) {
                    if (p == phase) {
                        hasPhase = true;
                    }
                }
    
                if (!hasPhase) {
                    var element = $('#selected-grains');
                    selectedGrains.push(phase);
                    var phaseSqureElement = '<div class="phase-square float-left m-1" style="background-color: rgb(' + colorArray[phase][0] + ', ' + colorArray[phase][1] + ', '+ colorArray[phase][2] + ')"></div>'
                    $('#selected-grains').append('<li class="list-group-item"> ' + phaseSqureElement + 'phase id:'  + phase + '</li>');
                    $("#selected-grains").scrollTop($('#selected-grains-container')[0].scrollHeight);
                }

            } else {

                checkIfSameGrainNeighbours(stateArray[event.offsetX][event.offsetY], event.offsetX, event.offsetY);
                selectedGrains.push(2);
                updateCanvas();

            }
        }
    });
}

$('#mc-simulate-button').on('click', () => {
    var numberOfIterations = $('#iterations-number').val();
    if (!numberOfIterations || numberOfIterations < 0 || numberOfIterations != parseInt(numberOfIterations)) {
        $('#iterations-error').text('Enter a valid number of iterations.');
    } else {
        $('#iterations-error').text('');
        startMonteCarlo( parseInt(numberOfIterations) );
    }
});

function addSelectionOptionOnlickHandler() {
    $('input[name="selection-opt"]').on('click', (event) => {
        if(event.target.value === 'all-grains') {
            $('#selected-grains-container').removeClass('d-none');
            $('#structure option[value="1"]').prop('disabled', false);
        } else {
            $('#selected-grains-container').addClass('d-none');
            $('#structure').val('0').change();
            $('#structure option[value="1"]').attr('disabled', true);
        }
    });
}
addSelectionOptionOnlickHandler();

$('#nav-mc-tab').on('click', () => {
    $("#grains-selection-menu-2").append($("#grains-selection-menu").remove());
    addSelectionOptionOnlickHandler();
});

$('#nav-ca-tab').on('click', () => {
    $("#grains-selection-menu-1").append($("#grains-selection-menu").remove());
    addSelectionOptionOnlickHandler();
});

$('#energy-button').on('click', (event) => {
    var grainEnergy = $('#grain-energy-input').val();
    var boundaryEnergy = $('#boundary-energy-input').val();

    if (!grainEnergy && !boundaryEnergy) {
        $('#energy-error').text('Enter grain and boundary energy values.');
    } else if (grainEnergy < 0 || boundaryEnergy < 0) {
        $('#energy-error').text('Enter valid grain and boundary energy values.');
    } else if (!grainEnergy) {
        $('#energy-error').text('Enter grain energy value.');
    } else if (!boundaryEnergy) {
        $('#energy-error').text('Enter boundary energy value.');
    } else {
        drawEnergy(grainEnergy, boundaryEnergy);
        $('#energy-error').text('');
        $('#energy-button').addClass('d-none');
        $('#open-main-view').removeClass('d-none');
    }
});

$('#open-main-view').on('click', () => {
    drawStates();
    $('#open-main-view').addClass('d-none');
    $('#energy-button').removeClass('d-none');
});