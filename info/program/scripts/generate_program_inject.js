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

function drawProgramTable() {
  var $table = prepareDiv($("#program-table"));

  var $row = $("<tr>");
  $table.append($row);

  // create header row
  var $locationElement = $("<th>Ort</th>");
  $row.append($locationElement);
  $locationElement.prop("colspan", "3");

  timeColumns.map(function (t) {
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

  var $cell = $("<td>");
  row.append($cell);
  var $cell2;

  if (text00.length === 0) {
    if (text30.length === 0) {
      // empty 2 cell
      $cell.prop("colspan", "2");
    } else {
      // empty 00 cell followed by 30 cell
      $cell.html("&nbsp;");
      $cell.addClass("halbstund");
      $cell2 = $("<td>");
      row.append($cell2);
      $cell2.html(timeToString(times[1]) + ": " + text30);
      createEventModal_Table(event30, $cell2);
    }
  } else {
    $cell.html(text00);
    createEventModal_Table(event00, $cell);
    if (text30.length === 0) {
      // 'regular case': full event
      $cell.prop("colspan", "2");
    } else {
      $cell2 = $("<td>");
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
      participant = getParticipantById(
        /^@(.*)$/.exec(participant.description)[1],
      );
    }

    var $modalDiv = $("<div>", {
      class: "modal-hidden modal",
      id: event.eventId,
    });
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
        var $img = $("<img>", {
          src: "resources/participants/" + participant.images[i],
        });
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
  $element[0].setAttribute(
    "onclick",
    'toggleParticipantInfo(event, "' + eventId + '");',
  );
}
