var Handlebars = require('handlebars')

Handlebars.registerHelper({
	'===': (v1, v2) => v1 === v2,
	'==': (v1, v2) => v1 == v2,
	'!==': (v1, v2) => v1 !== v2,
	'!=': (v1, v2) => v1 != v2,
	'<': (v1, v2) => v1 < v2,
	'>': (v1, v2) => v1 > v2,
	'<=': (v1, v2) => v1 <= v2,
	'>=': (v1, v2) => v1 >= v2,
	// keep as non-arrow functions to maintain scoped for arguments
	'&&': function() {
		return Array.prototype.slice.call(arguments).every(Boolean)
	},
	'||': function() {
		return Array.prototype.slice.call(arguments, 0, -1).some(Boolean)
	}
})
