function createItem() {
    drawProgramList();

    return $("#program-list")[0].innerHTML;
}

function drawProgramList() {
    var $containerDiv = $("#program-list");
    $containerDiv.html("");

    var $table = $("<table>", { class: "mobile" });
    $containerDiv.append($table);

    timeMatrix = [
        [1745]
    ].concat(timeMatrix);

    for (var i in timeMatrix) {
        var times = timeMatrix[i];

        var $timeRow = $("<tr>");
        $table.append($timeRow);

        var $timeCell = $("<th>", { class: "time-cell" });
        $timeRow.append($timeCell);

        var $expDiv = $("<div>", { class: "expand", text: "❯" });
        $timeCell.append($expDiv);
        $expDiv.attr("data-time", "" + times[0]);

        $timeCell.append(timeToString(times[0]));
        $timeCell.prop("colspan", "5");
        $timeCell.attr("onclick", "toggleListRow(" + times[0] + ")");

        for (var j in programData.eventData) {
            var eventEntry = programData.eventData[j];

            var rowNumber = calculateRowNumber(eventEntry, times);

            if (rowNumber === 0) {
                continue;
            }

            var rows = [];
            for (var k = 0; k < rowNumber; k++) {
                var $row = $("<tr>");
                $table.append($row);
                rows.push($row);

                $row.attr("data-time", "" + times[0]);
                $row.css("display", "none");

                if (k < rowNumber - 1) {
                    $row.addClass("intermediateRow");
                }
            }

            createLocationCell(eventEntry, rows, false);
            createContentRows(eventEntry.events, rows, times);
        }
    }
}

function calculateRowNumber(eventEntry, times) {

    function _calculateIndex(time) {
        return time % 100 === 0 ? 0 : 1;
    }

    var slots = [0, 0];

    for (var i in times) {
        var time = times[i];
        for (var j in eventEntry.events) {
            var event = eventEntry.events[j];
            for (var k in event.times) {
                if (event.times[k] === time) {
                    slots[_calculateIndex(time)] += 1;
                }
            }
        }
    }

    return Math.max.apply(null, slots);
}

function createContentRows(events, rows, times) {

    for (var i in rows) {
        var $row = rows[i];

        var text00 = createTextForEvent(findEventForTime(events, times[0]));
        var text30 = createTextForEvent(findEventForTime(events, times[1]));

        var $cell = $("<td>");
        $row.append($cell);
        var $cell2;

        if (text00.length === 0) {
            if (text30.length === 0) {
                // empty 2 cell
                $cell.prop("colspan", 2);
            } else {
                // empty cell followed by 30 event
                $cell.html("&nbsp;");
                $cell2 = $("<td>");
                $row.append($cell2);
                $cell2.html(timeToString(times[1]) + ": " + text30);
            }
        } else {
            $cell.html(text00);
            if (text30.length === 0) {
                $cell.prop("colspan", 2);
            } else {
                $cell2 = $("<td>");
                $row.append($cell2);
                $cell2.html(timeToString(times[1]) + ": " + text30);
            }
        }
    }
}
