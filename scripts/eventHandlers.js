$('#main-canvas').on('click', (event) => {
    var nucleonSize = $('#nucleons-size').val();
    addNucleon(event.offsetX, event.offsetY, nucleonSize);
    updateCanvas();
});

$('#simulate-button').on('click', () => {
    startSimulation();
});

$('#nucleons-button').on('click', ()=> {
    var numberOfNucleons = $('#nucleons-amount').val();
    var sizeOfNucleons = $('#nucleons-size').val();
    spreadNucleonsRandomly(numberOfNucleons, sizeOfNucleons);
});

$('input[name="optradio"]').on('click', (event) => {
    if(event.target.value === 'manual') {
        $('.nucleons-amount-container').addClass('d-none');
        $('.nucleons-size-container label').text('Rozmiar zarodka:');
        $('.nucleons-size-container').removeClass('d-none');
        $('#nucleons-button').addClass('d-none');
    } else {
        $('.nucleons-size-container').removeClass('d-none');
        $('.nucleons-size-container label').text('Rozmiar zarodków:');
        $('.nucleons-amount-container').removeClass('d-none');
        $('#nucleons-button').removeClass('d-none');
    }
});
