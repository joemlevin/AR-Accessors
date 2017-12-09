exports.setup = function() {
    this.input('html');
    this.output('update');
};

function packageHtml() {
    html = this.get('html');
    var update = html;
    this.send('update', update);
}

exports.initialize = function() {
    this.addInputHandler('html', packageHtml);
}
