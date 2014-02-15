function DOM()
{
	'use strict';

	var dom =this,
		SAXParser = require('./sax.js');


	dom.load = function(file, done)
	{
		var sax = new SAXParser();

		sax.stream(file, done);
	}
}


module.exports = function(){
	return new DOM();
};
