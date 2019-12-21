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
        if (colorArray.length <= 2) getRandomStateColors(numberOfStates);
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

$('#simulate-button').on('click', () => {
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
    if (!selectedGrains.length) updateInputsOnCanvasClear();
    for (var i = 0; i < stateArray.length; i++) {
        for (var j = 0; j < stateArray[0].length; j++) {

            if (!selectedGrains.includes(stateArray[i][j]) && stateArray[i][j] != 1) {
                stateArray[i][j] = 0;
                drawPixel(i, j, COLOR_WHITE[0], COLOR_WHITE[1], COLOR_WHITE[2], 255);
            }

        }
    }
    updateCanvas();
    updateInputsOnGrainsSelect();
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
                if (colorArray.length <= 2) getRandomStateColors(numberOfStates);
                addNucleon(event.offsetX, event.offsetY, 1, SHAPE_SQUARE, false);
                updateCanvas();
                $('#states-number').attr('disabled', true);
                $('#states-error').text('');
            }
        } else if (isMicrostructureGenerated) {
            var phase = stateArray[event.offsetX][event.offsetY];
            if (phase == 1) return;
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
        }
    });
}

function updateInputsOnCanvasCreate() {
    $('.canvas-column').removeClass('d-none');
    $('#x-size-input').attr('disabled', true);
    $('#y-size-input').attr('disabled', true);
    $('#x-size-input').val(canvasWidth);
    $('#y-size-input').val(canvasHeight);
    $('#size-button').addClass('d-none');
    $('input[name="optradio"]').prop('disabled', false);
    $('#states-number').prop('disabled', false);
    $('#simulate-button').prop('disabled', false);
    $('#neighborhood-type').prop('disabled', false);
    $('#inclusions-number').prop('disabled', false);
    $('#inclusions-size').prop('disabled', false);
    $('#inclusions-shape').prop('disabled', false);
    $('#inclusions-button').prop('disabled', false);
    $('#nav-tab').removeClass('d-none');
}

function updateInputsOnSimulationEnd() {
    $('.radio-container').addClass('d-none');
    $('#simulate-button').addClass('d-none');
    $('.neighborhood-type-container').addClass('d-none');
    $('.probability-container').addClass('d-none');
    $('.states-number-container').addClass('d-none');
    $('.grains-number-container').addClass('d-none');
    $('#grains-button').addClass('d-none');
    $('#selected-grains-container').removeClass('d-none');
    $('.structure-container').removeClass('d-none');
    $('#select-grains-button').removeClass('d-none').prop('disabled', false);
    $('#selected-grains').empty();
    $('#color-all-button').removeClass('d-none');
    $('#color-selected-button').removeClass('d-none');
    $('#clear-button').removeClass('d-none');
    $('.inclusions-number-container').removeClass('d-none');
    $('.inclusions-size-container').removeClass('d-none');
    $('.inclusions-shape-container').removeClass('d-none');
    $('#inclusions-button').removeClass('d-none');
    $('#nav-mc-tab').removeClass('disabled');
}

function updateInputsOnGrainsSelect() {
    $('#selected-grains-container').addClass('d-none');
    $('.radio-container').removeClass('d-none');
    $('.neighborhood-type-container').removeClass('d-none');
    if ($('#neighborhood-type').val() == TYPE_SHAPE_CONTROL) $('.probability-container').removeClass('d-none');
    $('.states-number-container').removeClass('d-none');
    $('.grains-number-container').removeClass('d-none');
    $('#grains-button').removeClass('d-none');
    $('#select-grains-button').attr('disabled', true);
    $('#simulate-button').removeClass('d-none');
    $('.inclusions-number-container').addClass('d-none');
    $('.inclusions-size-container').addClass('d-none');
    $('.inclusions-shape-container').addClass('d-none');
    $('#inclusions-button').addClass('d-none');
}

function updateInputsOnCanvasClear() {
    $('.radio-container').removeClass('d-none');
    $('#simulate-button').removeClass('d-none');
    $('.neighborhood-type-container').removeClass('d-none');
    if ($('#neighborhood-type').val() == TYPE_SHAPE_CONTROL) $('.probability-container').removeClass('d-none');
    $('.states-number-container').removeClass('d-none');
    $('#states-number').prop('disabled', false);
    $('.grains-number-container').removeClass('d-none');
    $('#grains-button').removeClass('d-none');
    $('.structure-container').addClass('d-none');
    $('#selected-grains-container').addClass('d-none');
    $('#select-grains-button').addClass('d-none').prop('disabled', false);;
    $('#selected-grains').empty();
    $('#color-all-button').addClass('d-none').prop('disabled', false);
    $('#color-selected-button').addClass('d-none').prop('disabled', false);
    $('#clear-button').addClass('d-none');
    $('.inclusions-number-container').removeClass('d-none');
    $('.inclusions-size-container').removeClass('d-none');
    $('.inclusions-shape-container').removeClass('d-none');
    $('#inclusions-button').removeClass('d-none');
}