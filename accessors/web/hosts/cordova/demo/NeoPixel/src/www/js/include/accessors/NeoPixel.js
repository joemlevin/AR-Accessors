exports.setup = function() {
    this.input('control');
    this.output('schema', {
        'type': 'JSON',
    });
    // bluetoothSerial.connect("00:06:66:01:9B:9E",
    // function (successMessage) {
    //     console.log("Connected to NeoPixel: " + successMessage);
    // }, function error(message) {
    //     console.log("chup: " + message);
    // });
};

exports.initialize = function() {
	var thiz = this;
	this.addInputHandler('control', function() {
		var control = thiz.get('control');
    console.log("Command handler called");
		if (control.message) {
			var spec = control.message;
			if (spec.show) {
				console.log("Show selected: " + spec.show);
        bluetoothSerial.connect("00:06:66:01:9B:9E",
        function (successMessage) {
            console.log("Connected to NeoPixel: " + successMessage);
            bluetoothSerial.write(spec.show, function() {
                console.log("Command sent to NeoPixel.");
                bluetoothSerial.disconnect();
            }, function() {
                console.log("Error: Communication failed.");
                bluetoothSerial.disconnect();
            });
        }, function error(message) {
            console.log(message);
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
            "choices": ["Reset", "Wipe", "Rainbow", "Chase", "Scan", "Fade"]
        }
    }
};
