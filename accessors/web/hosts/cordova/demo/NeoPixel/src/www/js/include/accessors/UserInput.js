exports.setup = function() {
    this.input('input');
    this.output('output');
};

function triggerInputHandler() {
    x = document.getElementById('ui');
    x.innerHTML += this.get('input');
}

exports.initialize = function() {
    this.addInputHandler('input', triggerInputHandler);
}
