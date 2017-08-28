var eventDate = new Date(2017, 8, 29, 18);
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
    console.log("Test");
    showCountdown();
    console.log("Test2");
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

$('body').on('mousedown', function(evt) {
    var clickInsideMap = $(evt.target).parents('#map').length > 0;

    if (!clickInsideMap) {
        setScrollingWithMouseWheel(false);
    }
});

$(document).on('keydown', function(evt) {
    // hide extra
    if (evt.keyCode === 27 && currentExtraRow) {
        hideExtraRow();
        currentExtraRow = null;
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
            adjustGallery();
        }
    };

    xmlhttp.open("GET", "resources/program/participant-gallery.html", true);
    xmlhttp.send();
}

function adjustGallery() {
    if (isGalleryLoaded) {
        var $participantGallery = $("#participant-gallery");
        var oldNumberOfColumns = $participantGallery.children().filter(".gallery-column").length;
        var newNumberOfColumns = 1;

        var width = $participantGallery.width();
        if (width > 1200) {
            newNumberOfColumns = 4;
        } else if (width > 900) {
            newNumberOfColumns = 3;
        } else if (width > 500) {
            newNumberOfColumns = 2;
        }

        if (oldNumberOfColumns != newNumberOfColumns) {
            var $allGalleryItems = $participantGallery.find(".gallery-item");
            // sort items, as they may have been reshuffled by the previous reordering/balancing procedure.
            // items are more or less sorted by event name through the following stuff.
            $allGalleryItems.sort(function(a, b) {
                var stringA = $(a).text().replace(/[^a-zA-Z]/g, "");
                var stringB = $(b).text().replace(/[^a-zA-Z]/g, "");
                if (stringA > stringB) {
                    return 1;
                } else if (stringA < stringB) {
                    return -1;
                }
                return 0;
            });

            $participantGallery.empty();
            for (var i = 0; i < newNumberOfColumns; i++) {
                $participantGallery.append($("<div>", { class: "gallery-column" }));
            }

            var $galleryColumns = $participantGallery.children(".gallery-column");

            for (var i = 0; i < $allGalleryItems.length; i++) {
                var $currentColumn = $galleryColumns[i % $galleryColumns.length];
                $currentColumn.append($allGalleryItems[i]);
            }

            for (var i = 0; i < 2; i++) {
                // two rounds seems to reach the best fit for all cases (1, 2, 3, 4 columns)
                // move item from largest to smallest to get a little bit better balance of column heights

                // find highest endpoint
                var maxIndex = 0;
                for (var j = 0; j < $galleryColumns.length; j++) {
                    var $currentLast = $galleryColumns.eq(j).children().last();
                    var currentBottom = $currentLast.position().top + $currentLast.height();
                    var $maxLast = $galleryColumns.eq(maxIndex).children().last();
                    var maxBottom = $maxLast.position().top + $maxLast.height();
                    if (currentBottom > maxBottom) {
                        maxIndex = j;
                    }
                }

                // remove highest element
                var maxGalleryItem = $galleryColumns.eq(maxIndex).children().last();
                maxGalleryItem.detach();

                // find lowest endpoint
                var minIndex = 0;
                for (var j = 0; j < $galleryColumns.length; j++) {
                    var $currentLast = $galleryColumns.eq(j).children().last();
                    var currentBottom = $currentLast.position().top + $currentLast.height();
                    var $minLast = $galleryColumns.eq(minIndex).children().last();
                    var minBottom = $minLast.position().top + $minLast.height();
                    if (currentBottom < minBottom) {
                        minIndex = j;
                    }
                }

                // move maxGalleryItem to lowest column
                $galleryColumns.eq(minIndex).append(maxGalleryItem);
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
    var days = Math.floor((eventDate.getTime() - Date.now()) / (1000 * 3600 * 24));    

    var $countdown = $("#countdown");
    $countdown.html("Noch " + days + " Tage bis zur");
    /*$countdown.css("display", "unset");  -> IE CANNOT HANDLE THAT */
}

function updateNavigation() {
    // reset state
    $('nav li').removeClass('current');

    var windowOffset = $(document).scrollTop();
    var windowHeight = $(window).height();
    var navHeight = $('nav').height();

    currentPosition = null;
    var $anchors = $('a.anchor');
    for (var i = 0; i < $anchors.length; i++) {
        var anchorTop = $anchors.eq(i).offset().top;
        if (anchorTop - windowOffset < (windowHeight - navHeight) / 2) {
            currentPosition = { $anchor: $anchors.eq(i), index: i };
            if (anchorTop > windowOffset) {
                // I am completely contained in the top half. Take me!
                break;
            }
        } else {
            break;
        }
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
    var target = evt.target;

    // cleanup
    if (currentExtraRow) {
        hideExtraRow();
    }

    if (!currentExtraRow || target !== currentExtraRow.target) {
        var $locationCell = $("#" + locationId + " > .locationCell");
        var rowSpan = $locationCell.prop("rowspan");
        $locationCell.prop("rowspan", rowSpan + 1);
        switchClassesExtraRow($(target));

        currentExtraRow = { target: target, $cell: $locationCell, rowSpan: rowSpan };

        $(".extra-row[data-participant=" + participantId + "]").show();
    } else {
        currentExtraRow = null;
    }
}

function hideExtraRow() {
    $(".extra-row").hide();
    currentExtraRow.$cell.prop("rowspan", currentExtraRow.rowSpan);
    switchClassesExtraRow($(currentExtraRow.target));
}

function switchClassesExtraRow($target) {
    $target.siblings().not(".locationCell").toggleClass("bottom-border");
    $target.toggleClass("selected");
    $target.prev().not(".locationCell").toggleClass("before-selected");
}