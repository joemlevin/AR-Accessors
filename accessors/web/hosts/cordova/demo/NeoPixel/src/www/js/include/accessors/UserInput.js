exports.setup = function() {
    this.input('input');
    x = document.getElementById('input');
    x.innerHTML += "<br/>" + "Enter command:" + "<br/>";
    x.innerHTML += "<input type=\"radio\" id=\"command\"><br>";
    this.output('output');
};

function triggerInputHandler() {
    console.log(this.get('input'));
}

exports.initialize = function() {
    this.addInputHandler('input', triggerInputHandler);
}
