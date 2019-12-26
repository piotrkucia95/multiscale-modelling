function updateInputsOnCanvasCreate() {
    $('.canvas-column').removeClass('d-none');
    $('#x-size-input').attr('disabled', true);
    $('#y-size-input').attr('disabled', true);
    $('#x-size-input').val(canvasWidth);
    $('#y-size-input').val(canvasHeight);
    $('#size-button').addClass('d-none');
    $('input[name="optradio"]').prop('disabled', false);
    $('#states-number').prop('disabled', false);
    $('#ca-simulate-button').prop('disabled', false);
    $('#neighborhood-type').prop('disabled', false);
    $('#inclusions-number').prop('disabled', false);
    $('#inclusions-size').prop('disabled', false);
    $('#inclusions-shape').prop('disabled', false);
    $('#inclusions-button').prop('disabled', false);
    $('#nav-tab').removeClass('d-none');
}

function updateInputsOnSimulationEnd() {
    $('.radio-container').addClass('d-none');
    $('#ca-simulate-button').addClass('d-none');
    $('.neighborhood-type-container').addClass('d-none');
    $('.probability-container').addClass('d-none');
    $('.states-number-container').addClass('d-none');
    $('.grains-number-container').addClass('d-none');
    $('#grains-button').addClass('d-none');
    $('#selection-radio-container').removeClass('d-none');
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
    $('#selection-radio-container').addClass('d-none');
    $('#selected-grains-container').addClass('d-none');
    $('.radio-container').removeClass('d-none');
    $('.neighborhood-type-container').removeClass('d-none');
    if ($('#neighborhood-type').val() == TYPE_SHAPE_CONTROL) $('.probability-container').removeClass('d-none');
    $('.states-number-container').removeClass('d-none');
    $('.grains-number-container').removeClass('d-none');
    $('#grains-button').removeClass('d-none');
    $('#select-grains-button').attr('disabled', true);
    $('#ca-simulate-button').removeClass('d-none');
    $('.inclusions-number-container').addClass('d-none');
    $('.inclusions-size-container').addClass('d-none');
    $('.inclusions-shape-container').addClass('d-none');
    $('#inclusions-button').addClass('d-none');
}

function updateInputsOnCanvasClear() {
    $('.radio-container').removeClass('d-none');
    $('#ca-simulate-button').removeClass('d-none');
    $('.neighborhood-type-container').removeClass('d-none');
    if ($('#neighborhood-type').val() == TYPE_SHAPE_CONTROL) $('.probability-container').removeClass('d-none');
    $('.states-number-container').removeClass('d-none');
    $('#states-number').prop('disabled', false);
    $('.grains-number-container').removeClass('d-none');
    $('#grains-button').removeClass('d-none');
    $('.structure-container').addClass('d-none');
    $('#selection-radio-container').addClass('d-none');
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