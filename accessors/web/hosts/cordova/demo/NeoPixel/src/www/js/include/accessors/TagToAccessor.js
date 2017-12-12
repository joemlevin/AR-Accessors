exports.setup = function () {
    this.input('tagId', {'type': 'string',});

    this.output('accessor');


};

function triggerInputHandler() {
    tag = this.get('tagId');
    if (accessorStore[tag]) {
        name = accessorStore[tag];
        accessor = instantiateAccessor(name, name, getAccessorCode);
        this.send('accessor', accessor);
    }
};

exports.initialize = function () {
    this.addInputHandler('tagId', triggerInputHandler);
};

var accessorStore = {1: 'NeoPixel'};
