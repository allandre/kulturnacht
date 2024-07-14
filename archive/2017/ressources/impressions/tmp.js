var fs = require('fs');

var path = ".";

var initList = fs.list(path);
var list = [];

for (var i in initList) {
	var item = initList[i];
	
	if (/.+(?:(?:\.jpg)|(?:\.JPG))/.test(item)) {		
		list.push(item);
	}
}

console.log(JSON.stringify(list));

phantom.exit();