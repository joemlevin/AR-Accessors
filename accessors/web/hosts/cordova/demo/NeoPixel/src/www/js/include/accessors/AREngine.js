// This is the AR Engine Accessor
var AR = require('@accessors-modules/wikitude');  // Acquire the Wikitube module as the AR interface.

exports.setup = function(){
	// Detection
	this.output('tag_id');
	// ConstructingUI
	this.input('html');
	this.output('post');
	var spont = this.instantiate('sp', 'test/TestSpontaneousOnce');
	spont.setParameter('delay', 1000.0);
	spont.setParameter('value', 1);
	this.connect(spont, 'output', 'tag_id');
}
exports.initialize = function() {
	// Detection
	var settings = {
		"callback_func": function (AR_image_id){
			// Translate AR_image_id to tag_id
			var tag_id = AR_image_id; //Potentially change this such that it doesn't depend on AR values
			this.send('tag_id', tag_id);
		}
	};
	// AR.startDetection(settings);
	// ConstructUI
	this.addInputHandler('html', function (){
		var accessor_html = this.get('html');
		var options = {
			'UI_input_handler': function(command){
				this.send('command', command); // If this works wow
			}
		};
		// BEGIN TEMPORARY CODE TO TEST INTEGRATION
		ui = document.getElementById('ui');
    ui.innerHTML = accessor_html;
    var thiz = this;
    document.getElementById('form').addEventListener("submit", function() {
        x = document.getElementById('form').elements["show"].value;
        var message = {'message': {'show': x}};
        thiz.send('post', message);
    });
		// END TEMPORARY CODE TO TEST INTEGRATION
		// AR.renderUI(accessor_html, options);
	});
	var customArchitectWorld = {
			"path": "www/world.html",
			"requiredFeatures": [
					"image_tracking",
					"geo"
			],
			"startupConfiguration": {
					"camera_position": "back"
			}
	};
	AR.StartAR(customArchitectWorld);
}
