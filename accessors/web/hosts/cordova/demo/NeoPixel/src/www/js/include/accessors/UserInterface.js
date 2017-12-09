// Accessor that provides a user interface based on HTML5 on the local host

/** Accessor that provides a user interface based on HTML5 on the local host.
*  The initial content on the page may be specified using the *content*
*  parameter and HTML header content may be specified using *header*.
*/

exports.setup = function() {
    this.parameter('header', {
        'type': 'string',
        'value': ''
    });
    this.parameter('content', {
        'type': 'string',
        'value': ''
    });
    this.input('html', {
        'type': 'string',
        'value': ''
    });
    this.input('update', {
        'type': 'string'
    });

};

function update() {
    updateContent = this.get('update');
    if (!updateContent) {
        updateContent = '';
    }
    document.getElementById('ui').innerHTML = updateContent;
};

exports.initialize = function() {
    this.addInputHandler('update', update.bind(this));
}
