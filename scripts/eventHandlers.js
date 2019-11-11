var isCanvasDrawable = false;

$('#size-button').on('click', (event) => {
    var width = $('#x-size-input').val();
    var height = $('#y-size-input').val();
    createCanvas(width, height);
    initializeStateArray(width, height);
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

$('#grains-button').on('click', ()=> {
    var numberOfGrains = $('#grains-number').val();
    spreadNucleonsRandomly(numberOfGrains, 1, SHAPE_SQUARE, false);
});

$('#inclusions-button').on('click', ()=> {
    var numberOfNucleons = $('#inclusions-number').val();
    var sizeOfNucleons = $('#inclusions-size').val();
    var shapeOfNucleons = $('#inclusions-shape').val();

    if (isMicrostructureGenerated) {
        spreadNucleonsOnGrainBoundaries(numberOfNucleons, sizeOfNucleons, shapeOfNucleons, true);
    } else {
        spreadNucleonsRandomly(numberOfNucleons, sizeOfNucleons, shapeOfNucleons, true);
    }
});

$('#simulate-button').on('click', () => {
    var neighborhoodType = $('#neighborhood-type').val();
    var probability = $('#probability').val();
    startSimulation( parseInt(neighborhoodType), parseInt(probability) );
    isCanvasDrawable = false;
});

$('#select-grains-button').on('click', (event) => {
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

function addCanvasOnclickHandler() {
    $('#main-canvas').on('click', (event) => {
        if (isCanvasDrawable) {
            addNucleon(event.offsetX, event.offsetY, 1, SHAPE_SQUARE, false);
            updateCanvas();
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
                $('#select-grains-button').prop('disabled', false);
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
    $('#simulate-button').prop('disabled', false);
    $('#neighborhood-type').prop('disabled', false);
    $('#inclusions-number').prop('disabled', false);
    $('#inclusions-size').prop('disabled', false);
    $('#inclusions-shape').prop('disabled', false);
    $('#inclusions-button').prop('disabled', false);
}

function updateInputsOnSimulationEnd() {
    $('.radio-container').addClass('d-none');
    $('#simulate-button').addClass('d-none');
    $('.neighborhood-type-container').addClass('d-none');
    $('.probability-container').addClass('d-none');
    $('.grains-number-container').addClass('d-none');
    $('#grains-button').addClass('d-none');
    $('#selected-grains-container').removeClass('d-none');
    $('.structure-container').removeClass('d-none');
    $('#select-grains-button').removeClass('d-none');
    $('#selected-grains').empty();
}

function updateInputsOnGrainsSelect() {
    $('#selected-grains-container').addClass('d-none');
    $('.radio-container').removeClass('d-none');
    $('.neighborhood-type-container').removeClass('d-none');
    if ($('#neighborhood-type').val() == TYPE_SHAPE_CONTROL) $('.probability-container').removeClass('d-none');
    $('.grains-number-container').removeClass('d-none');
    $('#grains-button').removeClass('d-none');
    $('#select-grains-button').addClass('d-none').attr('disabled', true);
    $('#simulate-button').removeClass('d-none');
}