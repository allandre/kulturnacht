var eventDate = new Date(2017, 9, 29, 18, 0, 0, 0);

var timeColumns = [{
    id: 0,
    times: [1800, 1830]
}, {
    id: 1,
    times: [1900, 1930]
}, {
    id: 2,
    times: [2000, 2030]
}, {
    id: 3,
    times: [2100, 2130]
}, {
    id: 4,
    times: [2200]
}, {
    id: 5,
    times: [2300]
}]

var program = [];

var programStates = {
    undef: -1,
    table: 0,
    list: 1
}
var programSectionState = programStates.undef;


window.onload = function() {
    showCountdown();
    loadMap();
    loadProgram();
};

window.onresize = function(event) {
    var containerWidth = $("#container").width();
    if (containerWidth > 1045) {
        hideMenu();
    }

    drawProgramSection(false);
};

function loadMap() {
    var kuesnacht = { lat: 47.316667, lng: 8.583333 };
    var center = { lat: 47.35, lng: 8.54 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: center
    });

    var marker = new google.maps.Marker({
        position: kuesnacht,
        map: map
    });
}

function timeToString(time) {
    var minutes = "0" + time % 100;
    var timeString = Math.floor(time / 100) + "." + minutes.substr(-2);
    return timeString;
}

function loadProgram() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            program = JSON.parse(this.responseText);
            drawProgramSection(true);
        }
    };

    xmlhttp.open("GET", "resources/timetable.json", true);
    xmlhttp.send();
}

function drawTimetable() {
    var $programDiv = $("#program");
    $programDiv.html("");

    var $table = $("<table></table>", { class: "table" });
    $programDiv.append($table);

    var $row = $("<tr></tr>");
    $table.append($row);

    // create header row
    var $locationElement = $("<th>Ort</th>");
    $row.append($locationElement);
    $locationElement.prop("colspan", "3");
    // not using array.prototype.map, b/c browser support and stuff :/
    for (var i in timeColumns) {
        var timeColumn = timeColumns[i];
        var $headerElement = $("<th></th>");
        $row.append($headerElement);
        $headerElement.html(timeToString(timeColumn.times[0]));
        $headerElement.prop("colspan", "2");
    }

    // create location rows
    for (var i in program) {
        var location = program[i];
        var rowNumber = calculateRowNumber(location);

        var rows = [];
        for (var i = 0; i < rowNumber; i++) {
            $row = $("<tr></tr>");
            $table.append($row);
            rows.push($row);

            if (i < rowNumber - 1) {
                $row.addClass("intermediateRow");
            }
        }

        createLocationColumn(location, rows);
        createContentRows(location.events, rows);
    }
}

function calculateRowNumber(location) {
	// calculate number of slots needed
	// -> logical map behind table: 2 slots per row per time (1 slot can accomodate 1 event)(1 slot for .00, 1 slot for .30)
    var slots = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    for (var i in location.events) {
        var event = location.events[i];
        for (var j in event.times) {
            var time = event.times[j];
            // ignore special case of 1745...
            if (time === 1745) {
                continue;
            }
            var index = calculateSlot(time);
            slots[index.x][index.y] += 1;
        }
    }

    var max = 0;
    for (var i = 0; i < slots.length; i++) {
        for (var j = 0; j < 2; j++) {
        	max = max > slots[i][j] ? max : slots[i][j];
        }
    }

    return max;
}

function calculateSlot(time) {
	// .00 -> y = 0
	// .30 -> y = 1
	var y = time % 100 !== 0 ? 1 : 0;
    if (y) {
    	time -= 30;
    }
    // 18 -> 0
    // 19 -> 1
    // ..
    // 23 -> 5
    var x = time / 100 - 18;
    return {x : x, y : y};    
}

function createLocationColumn(location, rows) {
    var $locationCell = $('<td></td>', { class: "locationCell" });
    rows[0].append($locationCell);
    $locationCell.prop("rowspan", "" + rows.length);
    var text = location.location + "\<br \/\>" + location.address;
    $locationCell.html(text);

    var event1745 = get1745EventForLocation(location);
    if (!event1745) {
    	$locationCell.prop("colspan", "3");	
    } else {
    	$locationCell.prop("colspan", "2");
    	var $eventCell = $('<td></td>');
    	rows[0].append($eventCell);
    	$eventCell.html("17.45: " + createTextForEvent(event1745));
    }
    

    
}

function get1745EventForLocation(location) {
	for (var i in location.events) {
		for (var j in location.events[i].times) {
			if (location.events[i].times[j] === 1745) {
				return location.events[i];
			}
		}
	}
	return null;
}

function createContentRows(events, rows) {
    // every row needs a 2column cell for every timeColumn
    for (var i in rows) {
        var row = rows[i];
        for (var j = 0; j < timeColumns.length; j++) {
        	var timeColumn = timeColumns[j];

        	var text00 = findEventText(events, timeColumn.times[0]);
        	var text30 = findEventText(events, timeColumn.times[1]);

        	var $cell = $('<td></td>');
        	row.append($cell);
        	var $cell2;

        	if (text00.length === 0) {
        		if (text30.length === 0) {
        			// empty 2 cell        			
        			$cell.prop('colspan', '2');
        		} else {
        			// empty 00 cell followed by 30 cell
        			$cell.html('&nbsp;');
        			$cell2 = $('<td></td>');
        			row.append($cell2);
        			$cell2.html(timeToString(timeColumn.times[1]) + ": " + text30);
        		}
        	} else {        		
        		$cell.html(text00);
        		if (text30.length === 0) {
        			// 'regular case': full event
        			$cell.prop('colspan', '2');
        		} else {
        			$cell2 = $('<td></td>');
        			row.append($cell2);
        			$cell2.html(timeToString(timeColumn.times[1]) + ": " + text30);
        		}
        	}
        }
    }
}

function findEventText(events, time) {
	var text = "";
    for (var i in events) {
        var event = events[i];
        var index = event.times.indexOf(time);
        if (index !== -1) {
            text = createTextForEvent(event);
            // only account once for each time per event
            event.times[index] = -1;
            break;
        }
    }

    return text;
}


function drawTimelist()  {
    var $programDiv = $("#program");
    $programDiv.html("");

    var $table = $("<table></table>");
    $programDiv.append($table);

    for (var i in times) {
        var time = times[i];

        var $timeRow = $("<tr></tr>");
        $table.append($timeRow);

        var $timeCell = $("<th></th>");
        $timeRow.append($timeCell);
        $timeCell.html(timeToString(time));
        $timeCell.prop("colspan", "2");


        for (var j in program) {
            var location = program[j];

            for (var k in location.events) {
                var event = location.events[k];

                if (event.times.indexOf(time) !== -1) {
                    var $eventRow = $("<tr></tr>");
                    $table.append($eventRow);

                    var $locationCell = $("<td></td>");
                    $eventRow.append($locationCell);
                    $locationCell.html(location.location);

                    var $eventCell = $("<td></td>");
                    $eventRow.append($eventCell);
                    $eventCell.html(event.event);

                    break;
                }
            }
        }
    }
}


function drawProgramSection(force) {
    var containerWidth = $("#container").width();
    if (containerWidth > 747 && (force || programSectionState === programStates.undef || programSectionState === programStates.list)) {
        drawTimetable();
        timeSectionState = programStates.table;
    } else if (containerWidth <= 747 && (force || programSectionState === programStates.undef || programSectionState === programStates.table)) {
        drawTimelist();
        timeSectionState = programStates.list;
    }
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

function createTextForEvent(event) {
    var text = "";
    for (var l in event.categories) {
        text += getIconForCategory(event.categories[l]);
    }
    text += event.event;

    return text;
}

function getIconForCategory(category) {
    switch (category) {
        case "guide":
            return "👮";
        case "music":
            return "🎜";
        case "language":
            return "💬";
        case "exposition":
            return "🖽";
        case "movie":
            return "🎥";
        case "theater":
            return "🎭";
        case "food":
            return "🍴";
        default:
            return "";
    }
}
