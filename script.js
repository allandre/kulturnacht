var eventDate = new Date(2017, 9, 29, 18, 0, 0, 0);
var map;

var hamburgerMenuWidth = 1045;

var $positionIndication;

var positionIndicationData;
var showPositionVisible = {
    visible: false,
    hasSwitched: true
}

var programStates = {
    undef: -1,
    table: 0,
    list: 1
}
var programSectionState = programStates.undef;


$(document).ready(function() {
    showCountdown();
    loadMap();

    $positionIndication = $('#position-indication');

    updateProgramSection(true);
    initPositionIndication();
});

$(window).on('resize', function(event) {
    var containerWidth = $("#container").width();
    if (containerWidth > hamburgerMenuWidth) {
        hideMenu();
    }

    updateProgramSection(false);

    initPositionIndication();
    updatePositionIndication();
});

$(window).on('scroll', function() {
    setScrollingWithMouseWheel(false);

    updatePositionIndication();
});

$('body').on('mousedown', function(evt) {
    var clickInsideMap = $(evt.target).parents('#map').length > 0;

    if (!clickInsideMap) {
        setScrollingWithMouseWheel(false);
    }
});


function setScrollingWithMouseWheel(isEnable) {
    if (map) {
        map.setOptions({ scrollwheel: isEnable });
    }
}

function loadMap() {
    var kuesnacht = { lat: 47.316667, lng: 8.583333 };
    var center = { lat: 47.35, lng: 8.54 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: center,
        scrollwheel: false
    });

    google.maps.event.addListener(map, 'mousedown', function() {
        setScrollingWithMouseWheel(true);
    });


    var marker = new google.maps.Marker({
        position: kuesnacht,
        map: map
    });
}


function updateProgramSection(force) {
    var containerWidth = $("#container").width();
    if (containerWidth > 747 && (force || programSectionState === programStates.undef || programSectionState === programStates.list)) {
        loadProgram("resources/program/program-table.html");
        programSectionState = programStates.table;
    } else if (containerWidth <= 747 && (force || programSectionState === programStates.undef || programSectionState === programStates.table)) {
        loadProgram("resources/program/program-list.html");
        programSectionState = programStates.list;
    }
}

function loadProgram(file) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var $programDiv = $("#program");
            $programDiv.html(this.responseText);

            // readjust positionIndication for new html length!!
            createPositionIndicationData();
        }
    };

    xmlhttp.open("GET", file, true);
    xmlhttp.send();
}

function hideMenu() {
    $("#nav-trigger").prop("checked", false);
}


// calculate days until eventDate, and display on title image
function showCountdown() {
    // get remaining days until event
    var days = Math.floor(new Date(eventDate - new Date()).getTime() / (1000 * 3600 * 24));

    var $countdown = $("#countdown");
    $countdown.html("Noch " + days + " Tage bis zur");
    $countdown.css("display", "unset");
}

function initPositionIndication() {
    function updateShowPositionVisible(newValue) {
        showPositionVisible.hasSwitched = (showPositionVisible.visible !== newValue);
        showPositionVisible.visible = newValue;
    }

    if ($('#container').width() > hamburgerMenuWidth) {
        updateShowPositionVisible(true);
        createPositionIndicationData();
    } else {
        updateShowPositionVisible(false);        
        setPositionIndicationDisplay(false);
    }
}

function createPositionIndicationData() {
    var windowHeight = $(window).height();
    var totalHeight = $(document).height();
    var navWidth = $('nav').width();
    var width = windowHeight / totalHeight * navWidth;

    $positionIndication.css('width', width);

    positionIndicationData = {
        distanceFactor: navWidth / totalHeight
    }
}

function updatePositionIndication() {
    if (!showPositionVisible.visible) {
        return;
    }

    if (showPositionVisible.hasSwitched) {
        setPositionIndicationDisplay(true);
        showPositionVisible.hasSwitched = false;
    }

    if (!positionIndicationData) {
        initPositionIndication();
    }

    var offset = $(document).scrollTop();
    var distance = positionIndicationData.distanceFactor * offset;
    console.log(distance);

    $positionIndication.css('left', distance);
}

function setPositionIndicationDisplay(isShow) {
    if (isShow) {
        $positionIndication.css('display', 'unset');
    } else {
        $positionIndication.css('display', 'none');
    }
}
