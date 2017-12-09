exports.setup = function() {
    this.input('received');
    this.output('schema', {
        'type': 'JSON',
    });
    bluetoothSerial.connect("00:06:66:01:9B:9E",
    function (successMessage) {
        console.log("Connected to NeoPixel")
    }, function error(message) {
        console.log("chup: " + message)
    });
};

function handleInput() {
    x = this.get('switch');
    console.log('Starting show ' + x);
    bluetoothSerial.write(x, function () {
        console.log('Show started.')
    }, function () {
        console.log("Error: communication failed.")
    });
}

// exports.initialize = function () {
//     this.addInputHandler('switch', handleInput);
//     this.send('schema', schema);
//     console.log("NeoPixel ready to start.")
// }

exports.initialize = function() {
	var thiz = this;
	this.addInputHandler('received', function() {
		var received = thiz.get('received');
		if (received.message) {
			var spec = JSON.parse(received.message);
			if (spec.show) {
				console.log("Show selected: " + string(spec.show))
			}
		}
	});
}

var schema = {
    "type": "object",
    "properties": {
        "show": {
            "type": "string",
            "title": "Show Select",
            "description": "The name of the show to play",
            "choices": ["A", "B", "C", "D", "E"]
        }
    }
};
