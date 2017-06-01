var extraRows = {};

function createItem() {
    drawProgramTable();

    return $("#program-table")[0].innerHTML;
}

function drawProgramTable() {
    var $containerDiv = $("#program-table");
    $containerDiv.html("");

    var $p = $("<p>", { class: "prgoram-table-hint" });
    $containerDiv.append($p);
    $p.text("Um mehr Informationen zu einem Anlass zu erhalten, auf den Eintrag klicken.");
    $p.css("max-width", "unset");

    $containerDiv.append('<div id="legend-program" class="legend">  \
                    <h6>Legende: </h6> \
                    <div>&#x1F46E; Führung</div> \
                    <div>&#x1F3B5; Konzert, Gesang</div> \
                    <div>&#x1F3A5; Film</div> \
                    <div>&#x1F5BC; Ausstellung</div> \
                    <div>&#x1F374; Verpflegung</div> \
                    <div>&#x1F3AD; Theater</div> \
                    <div>&#x1F4AC; Lesung, Literatur, Poetry Slam, Gedichte, Sprache</div> \
                </div>');

    var $table = $("<table>", { class: "desktop" });
    $containerDiv.append($table);

    var $headerRow = $("<tr>");
    $table.append($headerRow);

    var $locationHeader = $("<th>Ort</th>");
    $headerRow.append($locationHeader);
    $locationHeader.prop("colspan", "3");

    timeMatrix.map(function(m) {
        var $headerElement = $("<th>");
        $headerRow.append($headerElement);
        $headerElement.html(timeToString(m[0]));
        $headerElement.prop("colspan", "2");
    });

    for (var i in programData.eventData) {
        var eventEntry = programData.eventData[i];
        var rowNumber = calculateRowNumber(eventEntry.events);

        var rows = [];
        for (var i = 0; i < rowNumber; i++) {
            $row = $("<tr>");
            $table.append($row);
            rows.push($row);

            if (i < rowNumber - 1) {
                $row.addClass("intermediateRow");
            }
        }

        createLocationCell(eventEntry, rows, true);
        createContentRows(eventEntry, rows);
    }
}

function createContentRows(eventEntry, rows) {
    var currentRow = 0;
    var otherEvents = [];

    // iterate over "private_row" events first
    for (var i in eventEntry.events) {
        var event = eventEntry.events[i];
        if (event.private_row) {
            var $row = rows[currentRow++];
            for (var j = 0; j < timeMatrix.length; j++) {
                var times = timeMatrix[j];

                var event00 = findEventForTime([event], times[0]);
                var event30 = findEventForTime([event], times[1]);

                createEventCell($row, event00, event30, times, eventEntry.locationId);
            }
        } else {
            otherEvents.push(event);
        }
    }

    // handle over rest of events
    for (; currentRow < rows.length; currentRow++) {
        var $row = rows[currentRow];
        for (var j = 0; j < timeMatrix.length; j++) {
            var times = timeMatrix[j];

            var event00 = findEventForTime(otherEvents, times[0]);
            var event30 = findEventForTime(otherEvents, times[1]);

            createEventCell($row, event00, event30, times, eventEntry.locationId);
        }
    }
}

function createEventCell($row, event00, event30, times, locationId) {
    var text00 = createTextForEvent(event00);
    var text30 = createTextForEvent(event30);

    var $cell = $("<td>");
    $row.append($cell);
    var $cell2;

    if (text00.length === 0) {
        if (text30.length === 0) {
            // empty 2 cell
            $cell.prop("colspan", "2");
        } else {
            // empty 00 cell, 30 text
            $cell.html("&nbsp;");
            $cell.addClass("halbstund");
            $cell2 = $("<td>");
            $row.append($cell2);
            $cell2.html(timeToString(times[1]) + ": " + text30);
            processAdditionalRow($row, $cell2, event30, locationId);
        }
    } else {
        $cell.html(text00);
        processAdditionalRow($row, $cell, event00, locationId);
        if (text30.length === 0) {
            // 'regular case' : full event
            $cell.prop("colspan", "2");
        } else {
            $cell2 = $("<td>");
            $row.append($cell2);
            $cell2.html(timeToString(times[1]) + ": " + text30);
            processAdditionalRow($row, $cell, event30, locationId);
        }
    }
}

function processAdditionalRow($row, $cell, event, locationId) {
    $cell.addClass("content");

    var participant = getParticipantById(event.participantId);

    if (!extraRows[event.participantId]) {
        var $extraRow;
        if (/^@/.test(participant.description)) {
            var id = /^@(.*)$/.exec(participant.description)[1];
            $extraRow = extraRows[id];
            if (!$extraRow) {
                console.log('Das war genau der Fall, den du kanntest, aber zu faul warst, dich darum zu kümmern..');
                return;
            } else {
                var text = $extraRow.find("p:last-of-type").text();
                text += ", " + participant.team;
                $extraRow.find("p:last-of-type").text(text);

                addClickEvent($cell, $extraRow.attr("data-participant"), locationId);
            }
        } else {
            addClickEvent($cell, event.participantId, locationId);

            $extraRow = $("<tr>", { class: "extra-row" });
            $row.after($extraRow);
            $extraRow.attr("data-participant", event.participantId);

            var $extraCell = $("<td>", { class: "extra-cell" });
            $extraRow.append($extraCell);
            $extraCell.prop("colspan", "12");

            var $containerDiv = $("<div>", { class: "table-entry" });
            $extraCell.append($containerDiv);

            if (participant.images && participant.images.length > 0) {
                var $imgDiv = $("<div>", { class: "img" });
                $containerDiv.append($imgDiv);

                var $img = $("<img>", { src: "resources/participants/" + participant.images[0] });
                $imgDiv.append($img);
            }

            var $contentDiv = $("<div>", { class: "content" });
            $containerDiv.append($contentDiv);

            var $h4 = $("<h4>");
            $contentDiv.append($h4);
            $h4.html(participant.title);

            var $description = $("<p>");
            $contentDiv.append($description);
            $description.html(participant.description);

            var $team = $("<p>");
            $contentDiv.append($team);
            $team.html(participant.team);
        }


        extraRows[event.participantId] = $extraRow;
    } else {
        addClickEvent($cell, event.participantId, locationId);
    }
}

function addClickEvent($cell, participantId, locationId) {
    $cell[0].setAttribute("onclick", "toggleExtraRow(event, \"" + participantId + "\", \"" + locationId + "\");");
}

function calculateRowNumber(events) {

    function _calculateIndex(time) {
        // 00 -> 0
        // 30 -> 1
        var y = time % 100 === 0 ? 0 : 1;
        if (y) {
            time -= 30;
        }

        // 18 -> 0
        // 19 -> 1
        // ...
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

    for (var i in events) {
        var event = events[i];
        if (event.private_row) {
            privateRowCount++;
        } else {
            for (var j in event.times) {
                var time = event.times[j];
                // ignore 17.45
                if (time === 1745) {
                    continue;
                }
                var index = _calculateIndex(time);
                slots[index.x][index.y] += 1;
            }
        }
    }

    // calculate max of all numbers in slots
    // apply math.max on all rows, then math.max on that result
    var max = Math.max.apply(null, slots.map(function(x) {
        return Math.max.apply(null, x);
    }));

    return max + privateRowCount;
}
