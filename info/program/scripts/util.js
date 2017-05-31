var programData;


var timeMatrix = [
    [1800, 1830],
    [1900, 1930],
    [2000, 2030],
    [2100, 2130],
    [2200, 2230],
    [2300, 2330]
];

/* ### create aux functions ### */
function createLocationCell(eventEntry, rows, include1745) {
    var location = getLocationById(eventEntry.locationId);

    var $locationCell = $("<td>", { class: "locationCell" });
    rows[0].append($locationCell);
    $locationCell.prop("rowspan", "" + rows.length);
    var text = location.name + (location.address ? "\<br\>" + location.address : "");
    $locationCell.html(text);

    var event1745;
    if (include1745 && (event1745 = get1745Event(eventEntry))) {
        $locationCell.prop("colspan", "2");
        var $eventCell = $("<td>");
        rows[0].append($eventCell);
        $eventCell.html("17.45: " + createTextForEvent(event1745));
    } else {
        $locationCell.prop("colspan", "3");
    }
}

function get1745Event(eventEntry) {
    for (var i in eventEntry.events) {
        for (var j in eventEntry.events[i].times) {
            if (eventEntry.events[i].times[j] === 1745) {
                return eventEntry.events[i];
            }
        }
    }

    return null;
}


/* ### data aux functions ### */
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

function getEventPlusForParticipantId(participantId) {
    for (var i in programData.eventData) {
        var eventEntry = programData.eventData[i];
        for (var j in eventEntry.events) {
            if (eventEntry.events[j].participantId === participantId) {
                return { eventEntry: eventEntry, event: eventEntry.events[j] };
            }
        }
    }

    console.log('no event found for participantId ' + participantId);
    return null;
}

function getLocationForParticipantId(participantId) {
    var eventPlus = getEventPlusForParticipantId(participantId);
    if (eventPlus) {
        return getLocationById(eventPlus.eventEntry.locationId);
    }

    console.log('no event found for participantId ' + participantId);
    return null;
}

/* ### event aux functions ### */
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
    if (!event) {
        return "";
    }
    
    var participant = getParticipantById(event.participantId);
    return createTextForParticipant(participant);
}

function createTextForParticipant(participant) {
    var text = "";
    for (var l in participant.categories) {
        text += getIconForCategory(participant.categories[l]) + " ";
    }
    text += " " + participant.name;

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
