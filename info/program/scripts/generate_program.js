var page = require('webpage').create();
var fs = require('fs');

var pathPrefix = '../../../resources/program/';


/* worker api */
function Creator(injectFile, out) {
    this.injectFile = injectFile;
    this.out = out;
}

var creators = [
    new Creator('create_gallery.js', 'participant-gallery.html')
];


/* init page */
page.onConsoleMessage = function(msg) {
    console.log('page >' + msg);
}
page.onError = function(msg) {
    console.log('error>' + msg);
}

/* load program data */
var programData = JSON.stringify({
    locationData: fs.read('../data/locationData.json'),
    eventData: fs.read('../data/eventData.json'),
    participantData: fs.read('../data/participantData.json')
});

// initial call
callNextCreator();


function callNextCreator() {
    if (creators.length === 0) {
        console.log('### END ###');
        phantom.exit();
    } else {
        processCreator(creators.shift());
    }
}


function processCreator(creator) {
    page.open('../skeleton.html', function(status) {
        if (status !== 'success') {
            console.log('FAIL to open page');
            phantom.exit();
        }

        if (!page.injectJs('./jquery.js')) {
            console.log('FAIL to inject jquery');
            phantom.exit();
        }

        if (!page.injectJs('./util.js')) {
            console.log('FAIL to inject util');
            phantom.exit();
        }

        if (!page.injectJs(creator.injectFile)) {
            console.log('FAIL to inject ' + creator.injectFile);
            phantom.exit();
        }

        console.log('Started ' + creator.injectFile);
        var result = page.evaluate(function(_programData) {
            parseProgramData(_programData);
            return createItem();
        }, programData);
        console.log('Finished ' + creator.injectFile);

        writeToFile(pathPrefix + creator.out, result);

        callNextCreator();
    });
}


function writeToFile(fileName, content) {
    if (fs.exists(fileName)) {
        fs.remove(fileName);
    }

    fs.write(fileName, content, 'w');
}
