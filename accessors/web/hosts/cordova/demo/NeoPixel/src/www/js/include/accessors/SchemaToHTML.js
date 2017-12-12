// This script accepts a JSON schema (see http://json-schema.org/)
// and produces HTML for entering data that conforms with the specified
// schema. At this point, it is very limited, supporting only a small
// subset of the schema. But it is also extended to allow for hints
// to provide more natural interfaces such as pushbuttons instead of
// entry boxes. The most basic functionality takes a schema like this:
//    { "type": "object",
//      "properties": {
//         "a": {
//            "type": "string",
//            "title": "A",
//            "description": "A description here",
//			  "choices": ["first", "second"]
//          }
//         "b": {
//             ...
//          }
//       }
// and generates an HTML table with entry boxes labeled with the specified
// title and a "submit" button.
//
// If a property has a "choices" property whose value is an array of
// strings, then a radio button will be used instead of an entry box
// with the specified choices offered as options.
//
// If a property has no "choices" property but instead has an "options"
// property whose value is an array of strings, then a drop-down list
// will br provided instead of an entry box.
exports.setup = function() {
	this.input('schema', {'type':'JSON'});
	this.output('html', {'type':'string'});
}
exports.initialize = function() {
	var self = this;
	this.addInputHandler('schema', function() {
		var schema = self.get('schema');
		var content = '<h2>Inputs:</h2><form action="javascript:void(0);" id="form"/><table>';

        // FIXME: Handle types other than object, e.g. string, number.
        if (schema.type === 'object') {
			for (prop in schema.properties) {
				var name = prop;
				var entry = schema.properties[prop];
				if (entry['title']) {
					name = entry['title'];
				}
				// Default type of entry will be a string.
				// Note that this is not the same as the type in the schema,
				// which specifies a JSON type, not an HTML5 type.
				var choices = entry['choices'];
				var options = entry['options'];
				var input = '';
				if (choices && choices.length) {
					for (var i = 0; i < choices.length; i++) {
						input += '<input type="radio" style="width: 25px;height: 25px;" name="'
							+ prop
							+ '" value="'
							+ choices[i]
							+ '" form="form"/>'
							+ choices[i]
							+ '<br>';
					}
				} else if (options && options.length) {
					input += '<select form="form" name="'
							+ prop
							+ '">';
					for (var i = 0; i < options.length; i++) {
						input += '<option value="'
							+ options[i]
							+ '">'
							+ options[i]
							+ '</option>';
					}
					input += '</select>';
				} else {
					input = '<input type="text" name="'
							+ prop
							+ '" form="form"/>';
				}

				content += '<tr><td>'
						+ name
						+ '</td><td>'
						+ input
						+ '</td></tr>';
			}
		}
		content += '</table><input type="submit" value="Submit" form="form">';
		self.send('html', content);
	});
}
