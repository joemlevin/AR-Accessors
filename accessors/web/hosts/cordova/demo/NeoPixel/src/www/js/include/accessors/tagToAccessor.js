exports.setup = function () {
    this.input('tagId',{'type': 'int',});

    this.output('accessor');


};

function triggerInputHandler() {
    tag = this.get('tagId');
    console.log(tag);
    var out; //= "";
    if (tag == '1') {
        out = '1';
    } else {
        out = '0';
    }
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
