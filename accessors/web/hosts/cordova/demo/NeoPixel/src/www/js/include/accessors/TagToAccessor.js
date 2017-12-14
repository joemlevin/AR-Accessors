exports.setup = function () {
    this.input('tagId', {'type': 'int',});

    this.output('accessor');


};

function triggerInputHandler() {
    tag = this.get('tagId');
    if (accessorStore[tag]) {
        name = accessorStore[tag];
        accessor = instantiateAccessor(name, name, getAccessorCode);
        console.log("Accessor instantiated: " + name);
        this.send('accessor', accessor);
    }
};

exports.initialize = function () {
    this.addInputHandler('tagId', triggerInputHandler);
};

var accessorStore = {1: 'NeoPixel', 2: 'Dummy'};
