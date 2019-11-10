var isCanvasDrawable = false;

$('#size-button').on('click', (event) => {
    var width = $('#x-size-input').val();
    var height = $('#y-size-input').val();
    createCanvas(width, height);
    initializeStateArray(width, height);
    addCanvasOnclickHandler();
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

$('#nucleons-button').on('click', ()=> {
    var numberOfNucleons = $('#nucleons-number').val();
    var sizeOfNucleons = $('#nucleons-size').val();
    var shapeOfNucleons = $('#nucleons-shape').val();

    if (isMicrostructureGenerated) {
        spreadNucleonsOnGrainBoundaries(numberOfNucleons, sizeOfNucleons, shapeOfNucleons, true);
    } else {
        spreadNucleonsRandomly(numberOfNucleons, sizeOfNucleons, shapeOfNucleons, true);
    }
});

$('#simulate-button').on('click', () => {
    var neighborhoodType = $('#neighborhood-type').val();
    startSimulation( parseInt(neighborhoodType) );
    isCanvasDrawable = false;
});

function addCanvasOnclickHandler() {
    $('#main-canvas').on('click', (event) => {
        if (isCanvasDrawable) {
            addNucleon(event.offsetX, event.offsetY, 1, SHAPE_SQUARE, false);
            updateCanvas();
        }
    });
}