// This is the AR Engine Accessor
// var AR = require('wikitude');  // Acquire the Wikitube module as the AR interface.

exports.setup = function(){
	// Detection
	this.output('tag_id');
	// ConstructingUI
	this.input('html');
	this.output('command');
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
	AR.startDetection(settings);
	// ConstructUI
	this.addInputHandler('html', function (){
		var accessor_html = this.get('html');
		var options = {
			'UI_input_handler': function(command){
				this.send('command', command);
			}
		};
		AR.renderUI(accessor_html, options);
	});
}

