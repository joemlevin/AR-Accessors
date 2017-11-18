var serial = require('serialport')
exports.setup = function() {
    this.input('switch', {
        'type': 'string',
    });
    this.output('output', {
        'type': 'string'
    });
    var a = this.instantiate('test', '/net/SerialPort');
    a.setParameter('port', '/dev/tty.usbmodem1411');
    a.initialize();
    this.connect('switch', a, 'toSend');
    this.connect(a, 'received', 'output');
};
