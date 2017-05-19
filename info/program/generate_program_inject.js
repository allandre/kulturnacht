var program;

var timeColumns = [{
    times: [1800, 1830]
}, {
    times: [1900, 1930]
}, {
    times: [2000, 2030]
}, {
    times: [2100, 2130]
}, {
    times: [2200]
}, {
    times: [2300]
}]


function createProgramTable(_program) {
    program = JSON.parse(_program);
    drawProgramTable();

    return $("#program-table")[0].innerHTML;
}

function createProgramList(_program) {
    program = JSON.parse(_program);
    drawProgramList();

    return $("#program-list")[0].innerHTML;
}


function drawProgramTable() {
    var $programDiv = $("#program-table");
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

    // create actual rows
    for (var i in program) {
        var location = program[i];
        var rowNumber = calculateRowNumber_Table(location);

        var rows = [];
        for (var i = 0; i < rowNumber; i++) {
            $row = $("<tr></tr>");
            $table.append($row);
            rows.push($row);

            if (i < rowNumber - 1) {
                $row.addClass("intermediateRow");
            }
        }

        createLocationColumn(location, rows, true);
        createContentRows_Table(location.events, rows);
    }
}

function calculateRowNumber_Table(location) {

    function _calculateIndex(time) {
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
        return { x: x, y: y };
    }


    // calculate number of rows needed
    // -> logical map behind table: 2 slots per row per time (1 slot can accomodate 1 event)(1 slot for .00, 1 slot for .30)
    var slots = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];

    for (var i in location.events) {
        var event = location.events[i];
        for (var j in event.times) {
            var time = event.times[j];
            // ignore special case of 1745...
            if (time === 1745) {
                continue;
            }
            var index = _calculateIndex(time);
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

function createContentRows_Table(events, rows) {
    // every row needs a 2column cell for every timeColumn
    for (var i in rows) {
        var row = rows[i];
        for (var j = 0; j < timeColumns.length; j++) {
            var timeColumn = timeColumns[j];

            var event00 = findEventForTime(events, timeColumn.times[0]);
            var event30 = findEventForTime(events, timeColumn.times[1]);

            var text00 = event00 ? createTextForEvent(event00) : "";
            var text30 = event30 ? createTextForEvent(event30) : "";

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

function drawProgramList()  {
    var $programDiv = $("#program-list");
    $programDiv.html("");

    var $table = $("<table></table>");
    $programDiv.append($table);

    for (var i in timeColumns) {
        var timeColumn = timeColumns[i];

        var $timeRow = $("<tr></tr>");
        $table.append($timeRow);

        var $timeCell = $("<th></th>", {class: "time-cell"});
        $timeRow.append($timeCell);
        $timeCell.html(timeToString(timeColumn.times[0]));
        $timeCell.prop("colspan", "5");


        for (var j in program) {
            var location = program[j];

            var rowNumber = calculateRowNumber_List(location, timeColumn);

            if (rowNumber === 0) {
                continue;
            }

            var rows = [];
            for (var k = 0; k < rowNumber; k++) {
                var $row = $('<tr></tr>');
                $table.append($row);
                rows.push($row);

                if (k < rowNumber - 1) {
                    $row.addClass('intermediateRow');
                }
            }


            createLocationColumn(location, rows, i == 0);
            createContentRow_List(location.events, rows, timeColumn);
        }
    }
}

function calculateRowNumber_List(location, timeColumn) {

    function _calculateIndex(time) {
        return time % 100 === 0 ? 0 : 1;
    }

    var slots = [0, 0];

    for (var i in timeColumn.times) {
        var time = timeColumn.times[i];
        for (var e in location.events) {
            var event = location.events[e];
            for (var t in event.times) {
                if (event.times[t] === time) {
                    slots[_calculateIndex(time)] += 1;
                }
            }
        }
    }

    return slots[0] >= slots[1] ? slots[0] : slots[1];
}

function createContentRow_List(events, rows, timeColumn) {

    for (var r in rows) {
        var row = rows[r];

        var event00 = findEventForTime(events, timeColumn.times[0]);
        var event30 = findEventForTime(events, timeColumn.times[1]);

        var text00 = event00 ? createTextForEvent(event00) : "";
        var text30 = event30 ? createTextForEvent(event30) : "";

        var $cell = $('<td></td>');
        row.append($cell);
        var $cell2;

        if (text00.length === 0) {
            if (text30.length === 0) {
                $cell.prop('colspan', '2');
            } else {
                $cell.html('&nbsp;');
                $cell2 = $('<td></td>');
                row.append($cell2);
                $cell2.html(timeToString(timeColumn.times[1]) + ": " + text30);
            }
        } else {
            $cell.html(text00);
            if (text30.length === 0) {
                $cell.prop('colspan', '2');
            } else {
                $cell2 = $('<td></td>');
                row.append($cell2);
                $cell2.html(timeToString(timeColumn.times[1]) + ": " + text30);
            }
        }

    }
}

function createLocationColumn(location, rows, include1745) {
    var $locationCell = $('<td></td>', { class: "locationCell" });
    rows[0].append($locationCell);
    $locationCell.prop("rowspan", "" + rows.length);
    var text = location.location + "\<br\>" + location.address;
    $locationCell.html(text);

    if (include1745) {
        var event1745 = get1745EventForLocation(location);
        if (!event1745) {
            $locationCell.prop("colspan", "3");
        } else {
            $locationCell.prop("colspan", "2");
            var $eventCell = $('<td></td>');
            rows[0].append($eventCell);
            $eventCell.html("17.45: " + createTextForEvent(event1745));
        }
    } else {
        $locationCell.prop("colspan", "3");
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

function findEventForTime(events, time) {
    var res = null;
    for (var i in events) {
        var event = events[i];
        var index = event.times.indexOf(time);
        if (index !== -1) {
            res = event;
            // only account once for each time per event
            event.times[index] = -1;
            break;
        }
    }

    return res;
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
            return "&#x1F46E;";
        case "music":
            return "&#x1F3B5;";
        case "language":
            return "&#x1F4AC;";
        case "exposition":
            return "&#x1F5BC;";
        case "movie":
            return "&#x1F3A5;";
        case "theater":
            return "&#x1F3AD;";
        case "food":
            return "&#x1F374;";
        default:
            return "";
    }
}

function timeToString(time) {
    var minutes = "0" + time % 100;
    var timeString = Math.floor(time / 100) + "." + minutes.substr(-2);
    return timeString;
}