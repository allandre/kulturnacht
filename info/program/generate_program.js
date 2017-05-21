var page = require('webpage').create();
var fs = require('fs');

var pathPrefix = '../../resources/program/';

page.onConsoleMessage = function(msg) {
    console.log('page >' + msg);
}

page.onError = function(msg) {
    console.log('error>' + msg);
}

var programData = JSON.stringify({
    locationData: fs.read('./locationData.json'),
    eventData: fs.read('./eventData.json'),
    participantData: fs.read('./participantData.json')
});

page.open('skeleton.html', function(status) {
    if (status !== 'success') {
        console.log('FAIL to open page');
        phantom.exit();
    }

    if (!page.injectJs('./jquery.js')) {
        console.log('FAIL to inject jquery');
        phantom.exit();
    }

    if (!page.injectJs('./generate_program_inject.js')) {
        console.log('FAIL to inject generate_program_inject');
        phantom.exit();
    }

    var programTable = page.evaluate(function(_programData) {
        console.log('Started creating program table...')
        return createProgramTable(_programData);
    }, programData);
    writeToFile(pathPrefix + 'program-table.html', programTable);
    console.log('Finished creating program table')

    var programList = page.evaluate(function(_programData) {
        console.log('Started creating program list...')
        return createProgramList(_programData);
    }, programData);
    writeToFile(pathPrefix + 'program-list.html', programList);
    console.log('Finished creating program list')

    phantom.exit();
});


function writeToFile(fileName, content) {
    if (fs.exists(fileName)) {
        fs.remove(fileName);
    }

    fs.write(fileName, content, 'w');
}