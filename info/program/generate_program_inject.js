var programData;

var timeColumns = [{
    times: [1800, 1830]
}, {
    times: [1900, 1930]
}, {
    times: [2000, 2030]
}, {
    times: [2100, 2130]
}, {
    times: [2200, 2230]
}, {
    times: [2300, 2330]
}]

var modalDivs = {};

function createProgramTable(_programData) {
    parseProgramData(_programData);
    drawProgramTable();

    return $("#program-table")[0].innerHTML;
}

function createProgramList(_programData) {
    parseProgramData(_programData);
    drawProgramList();

    return $("#program-list")[0].innerHTML;
}

function createParticipantList(_programData) {
    parseProgramData(_programData);
    drawParticipanList();

    return $("#participant-list")[0].innerHTML;
}

function drawProgramTable() {
    var $table = prepareDiv($("#program-table"));

    var $row = $("<tr>");
    $table.append($row);

    // create header row
    var $locationElement = $("<th>Ort</th>");
    $row.append($locationElement);
    $locationElement.prop("colspan", "3");

    timeColumns.map(function(t) {
        var $headerElement = $("<th>");
        $row.append($headerElement);
        $headerElement.html(timeToString(t.times[0]));
        $headerElement.prop("colspan", "2");
    });

    //     create actual rows
    for (var i in programData.eventData) {
        var eventDatum = programData.eventData[i];
        var rowNumber = calculateRowNumber_Table(eventDatum);

        var rows = [];
        for (var i = 0; i < rowNumber; i++) {
            $row = $("<tr>");
            $table.append($row);
            rows.push($row);

            if (i < rowNumber - 1) {
                $row.addClass("intermediateRow");
            }
        }

        createLocationColumn(eventDatum, rows, true);
        createContentRows_Table(eventDatum, rows);
    }
}

function calculateRowNumber_Table(eventDatum) {

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

    var privateRowCount = 0;

    for (var i in eventDatum.events) {
        var event = eventDatum.events[i];
        if (event.private_row) {
            privateRowCount++;
        } else {
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
    }

    var max = 0;
    for (var i = 0; i < slots.length; i++) {
        for (var j = 0; j < 2; j++) {
            max = max > slots[i][j] ? max : slots[i][j];
        }
    }

    return max + privateRowCount;
}

function createContentRows_Table(eventDatum, rows) {
    // every row needs a 2column cell for every timeColumn
    var currentRow = 0;
    var otherEvents = [];

    // iterate over 'private-row' events first
    for (var i in eventDatum.events) {
        var event = eventDatum.events[i];
        if (event.private_row) {
            var row = rows[currentRow++];
            for (var j = 0; j < timeColumns.length; j++) {
                var timeColumn = timeColumns[j];
                var event00 = findEventForTime([event], timeColumn.times[0]);
                var event30 = findEventForTime([event], timeColumn.times[1]);

                createEventCell_Table(row, event00, event30, timeColumn.times);
            }
        } else {
            otherEvents.push(event);
        }
    }

    // handle rest of events
    for (; currentRow < rows.length; currentRow++) {
        var row = rows[currentRow];
        for (var j = 0; j < timeColumns.length; j++) {
            var timeColumn = timeColumns[j];

            var event00 = findEventForTime(otherEvents, timeColumn.times[0]);
            var event30 = findEventForTime(otherEvents, timeColumn.times[1]);

            createEventCell_Table(row, event00, event30, timeColumn.times);
        }
    }
}

function createEventCell_Table(row, event00, event30, times) {
    var text00 = event00 ? createTextForEvent(event00) : "";
    var text30 = event30 ? createTextForEvent(event30) : "";

    var $cell = $('<td>');
    row.append($cell);
    var $cell2;

    if (text00.length === 0) {
        if (text30.length === 0) {
            // empty 2 cell                 
            $cell.prop('colspan', '2');
        } else {
            // empty 00 cell followed by 30 cell
            $cell.html('&nbsp;');
            $cell2 = $('<td>');
            row.append($cell2);
            $cell2.html(timeToString(times[1]) + ": " + text30);
            createEventModal_Table(event30, $cell2);
        }
    } else {
        $cell.html(text00);
        createEventModal_Table(event00, $cell);
        if (text30.length === 0) {
            // 'regular case': full event
            $cell.prop('colspan', '2');
        } else {
            $cell2 = $('<td>');
            row.append($cell2);
            $cell2.html(timeToString(times[1]) + ": " + text30);
            createEventModal_Table(event30, $cell2);
        }
    }
}

function createEventModal_Table(event, $cell) {

    // persist call directly in html
    addToggleParticipantInfo($cell, event.eventId);
    $cell.addClass("content");

    if (!modalDivs[event.eventId]) {
        modalDivs[event.eventId] = true;
        var participant = getParticipantById(event.eventId);

        if (/^@/.test(participant.description)) {
            participant = getParticipantById(/^@(.*)$/.exec(participant.description)[1]);
        }

        var $modalDiv = $("<div>", { class: "modal-hidden modal", id: event.eventId });
        $("#program-table").append($modalDiv);
        addToggleParticipantInfo($modalDiv, event.eventId);

        var $dialogDiv = $("<div>", { class: "modal-dialog" });
        $modalDiv.append($dialogDiv);

        var $contentDiv = $("<div>", { class: "modal-content" });
        $dialogDiv.append($contentDiv);

        var $title = $("<h4>");
        $contentDiv.append($title);
        $title.html(participant.title);

        var $closebtn = $("<span>×</span>");
        $contentDiv.append($closebtn);
        $closebtn.addClass("closebtn");
        addToggleParticipantInfo($closebtn, event.eventId);

        if (participant.images && participant.images.length > 0) {
            var $imgDiv = $("<div>", { class: "img-div" });
            $contentDiv.append($imgDiv);

            for (var i in participant.images) {
                var $img = $("<img>", { src: "resources/participants/" + participant.images[i] });
                $imgDiv.append($img);
            }
        }

        if (participant.description && participant.description.length > 0) {
            var $description = $("<p>");
            $contentDiv.append($description);
            $description.html(participant.description);
        }

        if (participant.team && participant.team.length > 0) {
            var $team = $("<p>");
            $contentDiv.append($team);
            $team.html(participant.team);
        }
    }
}

function addToggleParticipantInfo($element, eventId) {
    $element[0].setAttribute("onclick", "toggleParticipantInfo(event, \"" + eventId + "\");");
}

function drawProgramList()  {
    var $table = prepareDiv($("#program-list"));

    var _timeColumns = [{ times: [1745] }].concat(timeColumns);


    for (var i in _timeColumns) {
        var timeColumn = _timeColumns[i];

        var $timeRow = $("<tr>");
        $table.append($timeRow);

        var $timeCell = $("<th>", { class: "time-cell" });
        $timeRow.append($timeCell);
        $timeCell.html(timeToString(timeColumn.times[0]));
        $timeCell.prop("colspan", "5");


        for (var j in programData.eventData) {
            var eventDatum = programData.eventData[j];

            var rowNumber = calculateRowNumber_List(eventDatum, timeColumn);

            if (rowNumber === 0) {
                continue;
            }

            var rows = [];
            for (var k = 0; k < rowNumber; k++) {
                var $row = $('<tr>');
                $table.append($row);
                rows.push($row);

                if (k < rowNumber - 1) {
                    $row.addClass('intermediateRow');
                }
            }


            createLocationColumn(eventDatum, rows, false);
            createContentRow_List(eventDatum.events, rows, timeColumn);
        }
    }
}

function calculateRowNumber_List(eventDatum, timeColumn) {

    function _calculateIndex(time) {
        return time % 100 === 0 ? 0 : 1;
    }

    var slots = [0, 0];

    for (var i in timeColumn.times) {
        var time = timeColumn.times[i];
        for (var e in eventDatum.events) {
            var event = eventDatum.events[e];
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

        var $cell = $('<td>');
        row.append($cell);
        var $cell2;

        if (text00.length === 0) {
            if (text30.length === 0) {
                $cell.prop('colspan', '2');
            } else {
                $cell.html('&nbsp;');
                $cell2 = $('<td>');
                row.append($cell2);
                $cell2.html(timeToString(timeColumn.times[1]) + ": " + text30);
            }
        } else {
            $cell.html(text00);
            if (text30.length === 0) {
                $cell.prop('colspan', '2');
            } else {
                $cell2 = $('<td>');
                row.append($cell2);
                $cell2.html(timeToString(timeColumn.times[1]) + ": " + text30);
            }
        }

    }
}

function drawParticipanList() {
    var $superDiv = $("#participant-list");
    $superDiv.html("");

    var divMap = {};

    for (var i in programData.participantData) {
        var participant = programData.participantData[i];

        if (/^@/.test(participant.description)) {
            //     // append title to other entry
            var div = divMap[/^@(.*)/.exec(participant.description)[1]];
            var team = div.find(".team");
            var text = team.html() + ", " + participant.team;
            team.html(text);
        } else {
            // mitwirkender on its own
            var $div = $("<div>");
            $superDiv.append($div);
            divMap[participant.id] = $div;

            var $title = $("<h4>");
            $div.append($title);
            $title.html(participant.title);

            if (participant.images && participant.images.length > 0) {
                // only one image for now
                var $img = $("<img>", { src: "resources/participants/" + participant.images[0] });
                $div.append($img);
            }

            $description = $("<p>");
            $div.append($description);
            $description.html(participant.description);

            $team = $("<p>", { class: "team" });
            $div.append($team);
            $team.html(participant.team);
        }
    }
}

function createLocationColumn(eventDatum, rows, include1745) {
    var location = getLocationById(eventDatum.locationId);

    var $locationCell = $("<td>", { class: "locationCell" });
    rows[0].append($locationCell);
    $locationCell.prop("rowspan", "" + rows.length);
    var text = location.name + (location.address ? "\<br\>" + location.address : "");
    $locationCell.html(text);

    var event1745;
    if (include1745 && (event1745 = get1745EventForEventDatum(eventDatum))) {
        $locationCell.prop("colspan", "2");
        var $eventCell = $("<td>");
        rows[0].append($eventCell);
        $eventCell.html("17.45: " + createTextForEvent(event1745));
    } else {
        $locationCell.prop("colspan", "3");
    }
}

function get1745EventForEventDatum(eventDatum) {
    for (var i in eventDatum.events) {
        for (var j in eventDatum.events[i].times) {
            if (eventDatum.events[i].times[j] === 1745) {
                return eventDatum.events[i];
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
    var particpant = getParticipantById(event.eventId);

    var text = "";
    for (var l in particpant.categories) {
        text += getIconForCategory(particpant.categories[l]);
    }
    text += " " + particpant.name;

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

function getLocationById(locationId) {
    for (var i in programData.locationData) {
        var location = programData.locationData[i];
        if (location.id === locationId) {
            return location;
        }
    }

    console.log('no location found for id: ' + locationId);
    return null;
}

function getParticipantById(participantId) {
    for (var i in programData.participantData) {
        var participant = programData.participantData[i];
        if (participant.id === participantId) {
            return participant;
        }
    }

    console.log('no participant found for id: ' + participantId);
    return null;
}

function parseProgramData(_programData) {
    programData = JSON.parse(_programData);
    programData.eventData = JSON.parse(programData.eventData);
    programData.locationData = JSON.parse(programData.locationData);
    programData.participantData = JSON.parse(programData.participantData);
}

function timeToString(time) {
    var minutes = "0" + time % 100;
    var timeString = Math.floor(time / 100) + "." + minutes.substr(-2);
    return timeString;
}

function prepareDiv($div) {
    $div.html("");
    var $table = $("<table>");
    $div.append($table);

    return $table;
}
