$('#main-canvas').on('click', (event) => {
    addNucleon(event.offsetX, event.offsetY);
    updateCanvas();
});

$('#simulate-button').on('click', () => {
    main();
});

$('#nucleons-button').on('click', ()=> {
    var numberOfNucleons = $('#nucleons-input').val();
    spreadNucleonsRandomly(numberOfNucleons);
});