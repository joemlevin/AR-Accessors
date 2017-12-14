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
  this.send('schema', schema);
}

var schema = {
    "type": "object",
    "properties": {
        "menu": {
            "type": "string",
            "title": "Dummy Menu",
            "description": "The name of the show to play",
            "choices": ["Burp", "Sponge", "Cat", "Car", "Turtle", "Square"]
        }
    }
};
