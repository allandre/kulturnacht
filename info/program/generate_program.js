var page = require('webpage').create();
var fs = require('fs');

var pathPrefix = '../../resources/program/';

page.onConsoleMessage = function(msg) {
    console.log('page >' + msg);
}

page.onError = function(msg) {
    console.log('error>' + msg);
}

var program = fs.read('./program.json');

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

    var programTable = page.evaluate(function(_program) {
        return createProgramTable(_program);
    }, program);
    writeToFile(pathPrefix + 'program-table.html', programTable);

    var programList = page.evaluate(function(_program) {
        return createProgramList(_program);
    }, program);
    writeToFile(pathPrefix + 'program-list.html', programList);
    

    phantom.exit();
});


function writeToFile(fileName, content) {
    if (fs.exists(fileName)) {
        fs.remove(fileName);
    }

    fs.write(fileName, content, 'w');
}
