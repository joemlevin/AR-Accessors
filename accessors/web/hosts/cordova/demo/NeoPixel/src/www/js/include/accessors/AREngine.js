// This is the AR Engine Accessor
var AR = require('@accessors-modules/wikitude');  // Acquire the Wikitube module as the AR interface.
var key ="ucUHghOxI+30wb8LoegIszD0BZm51S4jSwxHgAUvOsHyTPfDQhCyM76X469mOk2UVbPuS5zO5wrotYGfWXkCWLSc2LFq55c5QZg7gmBzzpRrrlxVgkfOhkidsdVo3X0kU+HVdb9BQBtwcyp1nwshUZ2tNcUBEIMAZKRiYT2bRklTYWx0ZWRfX+9DHzpS2/6pxX0Cv0KS7dcCCRoAIdJLYY6NeWHceGMN1RoTqjVsX/CIIVe/L820/tNxabJ6jsOuk566+AVgUw8SFs+AZfOn+obqSfx5MGkdjWEUNnu0nTdVLshw30hkUj7Zsff954JSkhMnILUktSVR5bAdGY1YdZDhR3udEHrJeBtJc8xRHuTRaGFjqTLJEYsF/TpjG33RsXZ9oZPBIkQ7jdZ+HJ3osXy1WYnkehO1sOHaBS1Dh8FtdRcIzID+DB/UFJblSbH8AAx+CNRp/mQXF0SNvVwQz8WtKVWaNGGGIxtbj+tCShRJSaDZWzy2hX/KsGKO8AQkZcZogxy9mO/0vr+53jg0KQdVIfMyiIOLd5TqczUlDI63hEg9jDivRWU0izqaFAfEt1YfA9kZCwKTxJhpgLGCPI+6XadUrabfnmXV2F7m7JAhdbROOskfvaiiMnlZAGAmJaDabEKiCkSN7mXyheg1ng669yhwthwKa+6bJt6F/0c=";
// this is a hack to keep the tag around to pass back into the wikitudePlugin
// there is probably a much more robust way of doing this, but it should work
// for now
var saved_tag = null;
exports.setup = function(){
	// Detection
	this.output('tag_id');
	// ConstructingUI
	this.input('html');
	this.output('command');
	// var spont = this.instantiate('sp', 'test/TestSpontaneousOnce');
	// spont.setParameter('delay', 1000.0);
	// spont.setParameter('value', 1);
	// this.connect(spont, 'output', 'tag_id');
}

exports.initialize = function() {
	// Detection
	// AR.startDetection(settings);
	// ConstructUI
	var thiz = this;
	this.addInputHandler('html', function (){
		var accessor_html = this.get('html');
		var options = {
			'input_handler': function(command){
				console.log("Command recevied: " + command.toString());
				var message = {'message': {'show': command}};
				thiz.send('command', message);
			},
			'html': accessor_html,
			'target_id': saved_tag
		};
		AR.RenderUI(options);
		// BEGIN TEMPORARY CODE TO TEST INTEGRATION
		// ui = document.getElementById('ui');
    // ui.innerHTML = accessor_html;
    // var thiz = this;
    // document.getElementById('form').addEventListener("submit", function() {
    //     x = document.getElementById('form').elements["show"].value;
    //     var message = {'message': {'show': x}};
    //     thiz.send('post', message);
    // });
		// END TEMPORARY CODE TO TEST INTEGRATION
	});
	AR.setLicenseKey(key);
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
	var settings = {
		"world": customArchitectWorld,
		"callback_func": function (AR_image_id){
			// Translate AR_image_id to tag_id
			var tag_id = AR_image_id; //Potentially change this such that it doesn't depend on AR values
			saved_tag = tag_id;
			console.log('tag id callback invoked: ' + tag_id.toString());
			thiz.send('tag_id', tag_id);
		},
		"handle_command": function(command) {
			console.log("Command received: " + command.toString());
			var message = {'message': {'show': command}};
			thiz.send('command', message);
		}
	};
	AR.StartAR(settings);
}
