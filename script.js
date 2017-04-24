var eventDate = new Date(2017, 9, 29, 18, 0, 0, 0);

function loadMap() {
	var kuesnacht = {lat: 47.316667, lng: 8.583333};
	var center = {lat: 47.35, lng: 8.54};
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

function drawTimetable() {
	var div = document.getElementById("timetable");
	div.innerHTML = "";

	var table = document.createElement("table");
	var row = document.createElement("tr");

	var element = document.createElement("th");
	element.innerHTML = "Ort";
	row.appendChild(element);

	for (var i in times) {
		element = document.createElement("th");
		var time = times[i];
		
		element.innerHTML = timeToString(time);
		row.appendChild(element);
	}

	table.appendChild(row);

	for (var i in timetable) {
		var location = timetable[i];
		row = document.createElement("tr");
		element = document.createElement("th");
		element.innerHTML = location.location;
		row.appendChild(element);

		for (var j in times) {
			var time = times[j];
			element = document.createElement("th");
			for (var k in location.events) {
				var event = location.events[k];
				if (event.times.indexOf(time) !== -1) {
					element.innerHTML = event.event;
					break;
				}
			}

			row.appendChild(element);
		}
		table.appendChild(row);
	}

	div.appendChild(table);
}

function drawTimelist() {
	var div = document.getElementById("timetable");
	div.innerHTML = "";

	var table = document.createElement("table");
	div.appendChild(table);

	for (var i in times) {
		var time = times[i];
		var timeRow = document.createElement("tr");
		var timeCell = document.createElement("th");
		timeCell.innerHTML = timeToString(time);
		timeCell.colSpan = "2";
		timeRow.appendChild(timeCell);
		table.appendChild(timeRow);

		for (var j in timetable) {
			var location = timetable[j];

			for (var k in location.events) {
				var event = location.events[k];
				if (event.times.indexOf(time) !== -1) {
					var eventRow = document.createElement("tr");
					table.appendChild(eventRow);
					var locationCell = document.createElement("th");
					locationCell.innerHTML = location.location;
					eventRow.appendChild(locationCell);
					var eventCell = document.createElement("th");
					eventCell.innerHTML = event.event;
					eventRow.appendChild(eventCell);
					break;
				}
			}
		}
	}

}

var times = [];
var timetable = [];

function loadTimetable() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			timetable = JSON.parse(this.responseText);

			times = [];

			for (var i in timetable) {
				var location = timetable[i];
				for (var j in location.events) {

					var event = location.events[j];
					for (var k in event.times) {
						var time = event.times[k];
						if (times.indexOf(time) === -1) {
							times.push(time);
						}
					}

				}
			}

			times.sort();
			
			drawTimeSection(true);
		}
	};
	xmlhttp.open("GET", "resources/timetable.json", true);
	xmlhttp.send();
}

var timeSectionState = -1;

function drawTimeSection(force) {
	var containerWidth = document.getElementById("container").offsetWidth;
	if (containerWidth > 743 && (timeSectionState === -1 || timeSectionState === 0 || force)) {
		drawTimetable();
		timeSectionState = 1;
	} else if (containerWidth <= 743 && (timeSectionState === -1 || timeSectionState === 1 || force)) {
		drawTimelist();
		timeSectionState = 0;
	}
}

function hideMenu() {
	document.getElementById("nav-trigger").checked = false;
}

function calculateDays() {
	// get remaining days until event
	var days = Math.floor(new Date(eventDate - new Date()).getTime() / (1000 * 3600 * 24));

	var countdown = document.getElementById("countdown");
	countdown.innerHTML = "Noch " + days + " Tage";
	countdown.style.display = "unset";
}

window.onload = function() {
	calculateDays();
	loadMap();
	loadTimetable();	
};

window.onresize = function(event) {
	var containerWidth = document.getElementById("container").offsetWidth;
	if (containerWidth > 467) {
		hideMenu();
	}

	drawTimeSection(false);
};
