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
}];


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
