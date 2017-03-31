

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

function loadTimetable() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			var table = document.createElement("table");
			var timetable = JSON.parse(this.responseText);

			var div = document.getElementById("timetable");
			var times = [];


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
			console.log(JSON.stringify(times));

			var row = document.createElement("tr");

			var element = document.createElement("th");
			element.innerHTML = "Ort";
			row.appendChild(element);

			for (var i in times) {
				element = document.createElement("th");
				var time = times[i];
				var minutes = "0" + time % 100;
				var timeString = Math.floor(time / 100) + "." + minutes.substr(-2);
				element.innerHTML = timeString;
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
	};
	xmlhttp.open("GET", "resources/timetable.json", true);
	xmlhttp.send();
}

window.onload = function() {
	loadMap();
	loadTimetable();
};

window.onresize = function(event) {
	
};
