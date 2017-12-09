/**
* Accessor for displaying Augmented Reality interfaces using Wikitude
**/

exports.setup = function() {
    this.input('html', {'type': 'string'});

};

exports.initialize = function() {
    // Instantiate the Wikitude plugin.
    // TODO: Write this as an Accessor Module
    app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
    // set a callback for android that is called once the back button was clicked.
    if ( cordova.platformId == "android" ) {
        app.wikitudePlugin.setBackButtonCallback(app.onBackButton);
    }
    app.wikitudePlugin.setJSONObjectReceivedCallback(app.onJSONObjectReceived);
};
