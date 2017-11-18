exports.setup = function() {
    this.input('switch', {
        'type': 'string',
    });
    this.output('output', {
        'type': 'string'
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

exports.initialize = function () {
    this.addInputHandler('switch', handleInput);
    console.log("Ready to start.")
}
