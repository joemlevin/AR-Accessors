exports.setup = function() {
    this.input('control');
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

// exports.initialize = function () {
//     this.addInputHandler('switch', handleInput);
//     this.send('schema', schema);
//     console.log("NeoPixel ready to start.")
// }

exports.initialize = function() {
	var thiz = this;
	this.addInputHandler('control', function() {
		var control = thiz.get('control');
		if (control.message) {
			var spec = control.message;
			if (spec.show) {
				console.log("Show selected: " + spec.show);
                bluetoothSerial.write(x, function() {
                    console.log("Command sent to NeoPixel.");
                }, function() {
                    console.log("Error: Communication failed.");
                });
			}
		}
	});
    this.send('schema', schema);
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
