var eventDate = new Date(2017, 9, 29, 18, 0, 0, 0);

var times = [1800, 1900, 2000, 2100, 2200, 2300];
var program = [];

var programStates = {
	undef: -1,
	table: 0,
	list: 1
}
var programSectionState = programStates.undef;


window.onload = function() {
	showCountdown();
	loadMap();
	loadProgram();	
};

window.onresize = function(event) {
	var containerWidth = $("#container").width();
	console.log(containerWidth);
	if (containerWidth > 1045) {
		hideMenu();
	}

	drawProgramSection(false);
};

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

function loadProgram() {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			program = JSON.parse(this.responseText);
			drawProgramSection(true);

		/*	times = [];

			for (var i in program) {
				var location = program[i];
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

			times.sort();*/
		}
	};

	xmlhttp.open("GET", "resources/timetable.json", true);
	xmlhttp.send();
}

function drawTimetable() {
	var $programDiv = $("#program");
	$programDiv.html("");

	var $table = $("<table></table>");
	$programDiv.append($table);

	var $row = $("<tr></tr>");
	$table.append($row);

	var $locationElement = $("<th>Ort</th>");
	$row.append($locationElement);

	for (var i in times) {
		var $headerElement = $("<th></th>");		
		$headerElement.html(timeToString(times[i]));
		$row.append($headerElement);
	}

	var $element;
	for (var i in program) {
		var location = program[i];

		$row = $("<tr></tr>");
		$table.append($row);

		$element = $("<td></td>");
		$element.html(location.location);
		$row.append($element);

		for (var j in times) {
			var time = times[j];
			$element = $("<td></td>");
			$row.append($element);

			for (var k in location.events) {
				var event = location.events[k];
				if (event.times.indexOf(time) !== -1) {
					$element.html(event.event);
					break;
				}
			}
		}
	}
}

function drawTimelist() {
	var $programDiv = $("#program");
	$programDiv.html("");

	var $table = $("<table></table>");
	$programDiv.append($table);

	for (var i in times) {
		var time = times[i];

		var $timeRow = $("<tr></tr>");
		$table.append($timeRow);
		
		var $timeCell = $("<th></th>");
		$timeRow.append($timeCell);
		$timeCell.html(timeToString(time));
		$timeCell.prop("colspan", "2");
		

		for (var j in program) {
			var location = program[j];

			for (var k in location.events) {
				var event = location.events[k];

				if (event.times.indexOf(time) !== -1) {
					var $eventRow = $("<tr></tr>");
					$table.append($eventRow);

					var $locationCell = $("<td></td>");
					$eventRow.append($locationCell);
					$locationCell.html(location.location);
					
					var $eventCell = $("<td></td>");
					$eventRow.append($eventCell);
					$eventCell.html(event.event);
					
					break;
				}
			}
		}
	}

}


function drawProgramSection(force) {
	var containerWidth = $("#container").width();
	console.log(programSectionState);
	if (containerWidth > 747 && (force || programSectionState === programStates.undef || programSectionState === programStates.list)) {
		drawTimetable();
		timeSectionState = programStates.table;
	} else if (containerWidth <= 747 && (force || programSectionState === programStates.undef || programSectionState === programStates.table)) {
		drawTimelist();
		timeSectionState = programStates.list;
	}
}

function hideMenu() {
	$("#nav-trigger").prop("checked", false);
}

// calculate days until eventDate, and display on title image
function showCountdown() {
	// get remaining days until event
	var days = Math.floor(new Date(eventDate - new Date()).getTime() / (1000 * 3600 * 24));

	var $countdown = $("#countdown");
	$countdown.html("Noch " + days + " Tage bis zur");
	$countdown.css("display", "unset");
}
