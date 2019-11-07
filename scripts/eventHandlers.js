var isCanvasDrawable = false;

$('#size-button').on('click', (event) => {
    var width = $('#x-size-input').val();
    var height = $('#y-size-input').val();
    createCanvas(width, height);
    initializeStateArray(width, height);
    addCanvasOnclickHandler();

    $('.canvas-column').removeClass('d-none');

    $('#x-size-input').attr('disabled', true);
    $('#y-size-input').attr('disabled', true);
    $('#size-button').attr('disabled', true);
    $('input[name="optradio"]').prop('disabled', false);
    $('#simulate-button').prop('disabled', false);
});

$('#simulate-button').on('click', () => {
    startSimulation();
    isCanvasDrawable = false;
});

$('#nucleons-button').on('click', ()=> {
    var numberOfNucleons = $('#nucleons-amount').val();
    var sizeOfNucleons = $('#nucleons-size').val();
    var shapeOfNucleons = $('#nucleons-shape').val();
    spreadNucleonsRandomly(numberOfNucleons, sizeOfNucleons, shapeOfNucleons);
});

$('input[name="optradio"]').on('click', (event) => {
    if(event.target.value === 'manual') {
        $('.nucleons-size-container label').text('Rozmiar zarodka:');
        $('#nucleons-amount').attr('disabled', true);
        $('#nucleons-size').prop('disabled', false);
        $('#nucleons-shape').prop('disabled', false);
        $('#nucleons-button').attr('disabled', true);
        isCanvasDrawable = true;
    } else {
        $('.nucleons-size-container label').text('Rozmiar zarodków:');
        $('#nucleons-size').prop('disabled', false);
        $('#nucleons-amount').prop('disabled', false);
        $('#nucleons-shape').prop('disabled', false);
        $('#nucleons-button').prop('disabled', false);
        isCanvasDrawable = false;
    }
});

function addCanvasOnclickHandler() {
    $('#main-canvas').on('click', (event) => {
        if (isCanvasDrawable) {
            var nucleonSize = $('#nucleons-size').val();
            var nucleonsShape = $('#nucleons-shape').val();
            addNucleon(event.offsetX, event.offsetY, nucleonSize, nucleonsShape);
            updateCanvas();
        }
    });
}