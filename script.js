var eventDate = new Date(2017, 9, 29, 18, 0, 0, 0);
var map;

var hamburgerMenuWidth = 1045;

var currentPosition = null;

var isGalleryLoaded = false;
var galleryColumnCount = 1;

var currentExtraRow;

var didScroll = false;

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

    initGallery();
});

$(window).on('resize', function(event) {
    var containerWidth = $("#container").width();
    if (containerWidth > hamburgerMenuWidth) {
        hideMenu();
    }

    updateProgramSection(false);
    adjustGallery();
});

$(window).on('scroll', function() {
    setScrollingWithMouseWheel(false);
    updateNavigation();
});

$(document).on('keydown', function(evt) {
    // close all modal pop-ups on esc
    if (evt.keyCode === 27) {
        $(".modal").addClass("modal-hidden");
    }
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
            $(".extra-row").hide();
        }
    };

    xmlhttp.open("GET", file, true);
    xmlhttp.send();
}

function initGallery() {
    $(".gallery-toggler").on("click", toggleGallery);
    $("#gallery-container").toggle();
}

function toggleGallery(evt) {
    evt.preventDefault();

    // load gallery only once
    if (!isGalleryLoaded) {
        loadGallery();
    }

    // toggle visibilty
    $("#gallery-container").toggle();
    adjustGallery();

    $(".gallery-toggler").text(
        ($("#gallery-container").is(":visible") ?
            "Galerie ausblenden" :
            "Galerie aller Mitwirkenden anzeigen"));

}

function loadGallery() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            $("#participant-gallery").html(this.responseText);
            isGalleryLoaded = true;

            // TODO: hanlde load of images (-> results in height being too small!)
            setTimeout(adjustGallery, 1000);
        }
    };

    xmlhttp.open("GET", "resources/program/participant-gallery.html", true);
    xmlhttp.send();
}

function adjustGallery() {
    if (isGalleryLoaded) {
        var $participantGallery = $("#participant-gallery");

        var galleryWidth = $participantGallery.width();
        var galleryHeight = $participantGallery.height();
        var newColumns = 1 + Math.round((galleryWidth - 750) / 250);

        // console.log(galleryWidth);
        // console.log(galleryHeight);
        // console.log(newColumns);

        if ($participantGallery.is(":visible") && galleryColumnCount !== newColumns) {
            console.log('A');
            galleryHeight *= galleryColumnCount;
            galleryColumnCount = newColumns;

            var newHeight = (galleryHeight / newColumns);
            $participantGallery.height(newHeight);
            var itemWidth = (galleryWidth / newColumns) * 0.9;
            $(".gallery-item").width(itemWidth);

            var $galleryItemFirst = $(".gallery-item:first");
            var counter = 0;
            while ($galleryItemFirst.offset().left < $participantGallery.offset().left && counter < 20) {
                // console.log('Loop');
                // console.log($galleryItemFirst.offset().left);
                // console.log($participantGallery.offset().left);
                // console.log($participantGallery.height());
                counter++;
                $participantGallery.height($participantGallery.height() * 1.1);
            }
        }
    }
}

function toggleParticipantInfo(evt, id) {
    // console.log(evt);
    if (evt.target.nodeName === "TD" || evt.target.classList.contains("modal") || evt.target.classList.contains("closebtn")) {
        $("#" + id).toggleClass("modal-hidden");
    }
    evt.stopPropagation();
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
            if ((relPositionTop >= 0 && relPositionTop <= 0.5 * windowHeight) || (!prio && relPositionBottom >= 0 && relPositionBottom < 0.5 * windowHeight)) {
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


function toggleListRow(time) {
    $("tr[data-time]").not("[data-time=" + time + "]").hide();
    $("div[data-time]").not("[data-time=" + time + "]").removeClass("collapse");

    $("tr[data-time=" + time + "]").toggle();
    var $div = $("div[data-time=" + time + "]");
    $div.toggleClass("collapse");
    scrollToElement($div);
}

function scrollToElement($element) {
    var offset = $element.offset().top - $(window).scrollTop();

    if (offset < 0) {
        // Not in view so scroll to it
        $('html,body').animate({ scrollTop: $(window).scrollTop() + offset - 1.2 * $("nav").height() }, 1000);
    }
}

function toggleExtraRow(evt, participantId, locationId) {

    function _switchClasses($target) {
        $target.siblings().not(".locationCell").toggleClass("bottom-border");
        $target.toggleClass("selected");
    }

    var target = evt.target;


    // cleanup
    if (currentExtraRow) {
        $(".extra-row").hide();
        currentExtraRow.$cell.prop("rowspan", currentExtraRow.rowSpan);
        _switchClasses($(currentExtraRow.target));
    }

    if (!currentExtraRow || target !== currentExtraRow.target) {
        var $locationCell = $("#" + locationId + " > .locationCell");
        var rowSpan = $locationCell.prop("rowspan");
        $locationCell.prop("rowspan", rowSpan + 1);
        _switchClasses($(target));

        currentExtraRow = { target: target, $cell: $locationCell, rowSpan: rowSpan };

        $(".extra-row[data-participant=" + participantId + "]").show();
    } else {
        currentExtraRow = null;
    }
}
