var eventDate = new Date(2017, 9, 29, 18, 0, 0, 0);
var map;

var hamburgerMenuWidth = 1045;

var currentPosition = null;


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
    // updateMitwirkende();
});

$(window).on('resize', function(event) {
    var containerWidth = $("#container").width();
    if (containerWidth > hamburgerMenuWidth) {
        hideMenu();
    }

    updateProgramSection(false);
});

$(window).on('scroll', function() {
    setScrollingWithMouseWheel(false);

    updateNavigation();
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

    if (typeof google == 'undefined') {
        // to continue executing the rest of this file
        return
    }

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
        }
    };

    xmlhttp.open("GET", file, true);
    xmlhttp.send();
}

// function updateMitwirkende() {
//     loadParticipants("resources/program/participant-list.html");
// }

// function loadParticipants(file) {
//     var xmlhttp = new XMLHttpRequest();

//     xmlhttp.onreadystatechange = function   () {
//         if (this.readyState === 4 && this.status === 200) {
//             $("#mitwirkende").html(this.responseText);
//         }
//     };

//     xmlhttp.open("GET", file, true);
//     xmlhttp.send();
// }

function toggleParticipantInfo(id) {
    console.log(id);
    $("#" + id).toggleClass("modal-hidden");
}


function hideMenu() {
    $("#nav-trigger").prop("checked", false);
    $('nav li').removeClass('current');
}


// calculate days until eventDate, and display on title image
function showCountdown() {
    // get remaining days until event
    var days = Math.floor(new Date(eventDate - new Date()).getTime() / (1000 * 3600 * 24));

    var $countdown = $("#countdown");
    $countdown.html("Noch " + days + " Tage bis zur");
    $countdown.css("display", "unset");
}

function updateNavigation() {
    // reset state
    $('nav li').removeClass('current');

    var windowOffset = $(document).scrollTop();
    var windowHeight = $(window).height();

    if (windowOffset < 0.8 * windowHeight) {
        currentPosition = null;
    } else {
        var prio = false;
        $('a.anchor').each(function(index) {
            var $section = $(this).next();
            var relPositionTop = $section.offset().top - windowOffset;
            var relPositionBottom = relPositionTop + $section.height();
            if ((relPositionTop >= 0 && relPositionTop <= 0.5 * windowHeight)
             || (!prio && relPositionBottom >= 0 && relPositionBottom < 0.5 * windowHeight)) {
                prio = true;
                currentPosition = { $anchor: $(this), index: index };
            }
        });
    }

    if (currentPosition !== null) {
        $('nav li').eq(currentPosition.index).addClass('current');
        history.replaceState(undefined, undefined, '#' + currentPosition.$anchor.prop('id'));
    } else {
        history.replaceState(undefined, undefined, '#');
    }
}
