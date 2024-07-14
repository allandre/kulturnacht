function createItem() {
  drawParticipantGallery();
  return $("#participant-gallery")[0].innerHTML;
}

var participantDivs = {};

function drawParticipantGallery() {
  var $participantGallery = $("#participant-gallery");
  var $containerDiv = $("<div>", { class: "gallery-column" });
  $participantGallery.empty().append($containerDiv);
  $containerDiv.html("");

  for (var i in programData.participantData) {
    var participant = programData.participantData[i];

    // participants in aggregated events start their description with @mainParticipant
    if (/^@/.test(participant.description)) {
      processAggregatedEvent(participant);
    } else {
      // participant for stand-alone event
      var $div = createParticipantDiv(participant);
      $containerDiv.append($div);
    }
  }
}

function processAggregatedEvent(participant) {
  var div = participantDivs[/^@(.*)/.exec(participant.description)[1]];
  var $team = div.find(".team");
  var newText = $team.html() + ", " + participant.team;
  $team.html(newText);
}

function createParticipantDiv(participant) {
  var $div = $("<div>", { class: "gallery-item" });
  participantDivs[participant.id] = $div;

  // TITLE
  var $title = $("<h4>");
  $div.append($title);
  $title.html(createTextForParticipant(participant));

  // IMAGES
  if (participant.images && participant.images.length > 0) {
    for (var i in participant.images) {
      $div.append(
        $("<img>", { src: "resources/participants/" + participant.images[i] }),
      );
    }
  }

  // DESCRIPTION
  var $description = $("<p>");
  $div.append($description);
  $description.html(participant.description);

  // LOCATION
  var location = getLocationForParticipantId(participant.id);

  var $location = $("<p>");
  $div.append($location);
  $location.html("Ort: " + location.name);

  // TIME
  var event = getEventPlusForParticipantId(participant.id).event;
  if (event.times && event.times.length > 0) {
    var timeText = "Zeit: ";
    for (var i in event.times) {
      timeText += timeToString(event.times[i]) + ", ";
    }
    timeText = timeText.slice(0, timeText.length - 2);

    var $time = $("<p>");
    $div.append($time);
    $time.html(timeText);
  }

  return $div;
}
