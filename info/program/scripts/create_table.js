function createItem() {
    drawProgramTable();

    return $("#program-table")[0].innerHTML;
}

function drawProgramTable() {
    var $containerDiv = $("#program-table");
    $containerDiv.html("");

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

                var text00 = createTextForEvent(findEventForTime([event], times[0]));
                var text30 = createTextForEvent(findEventForTime([event], times[1]));

                createEventCell($row, text00, text30, times);
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

    		var text00 = createTextForEvent(findEventForTime(otherEvents, times[0]));
    		var text30 = createTextForEvent(findEventForTime(otherEvents, times[1]));

    		createEventCell($row, text00, text30, times);
    	}
    }
}

function createEventCell($row, text00, text30, times) {
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
			$cell2.html(timeToString(times[1] + ": " + text30));
		}
	} else {
		$cell.html(text00);
		if (text30.length === 0) {
			// 'regular case' : full event
			$cell.prop("colspan", "2");
		} else {
			$cell2 = $("<td>");
			$row.append($cell2);
			$cell2.html(timeToString(times[1]) + ": " + text30);
		}
	}
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
