function DOM()
{
	'use strict';

	var dom = this,
		SAXParser = require('./sax.js');


	dom.load = function(file, done)
	{
		new SAXParser().stream(file, done);
	};

	dom.loadXML = function(source, done)
	{
		new SAXParser().parse(source, done);
	};
}


module.exports = function(){
	return new DOM();
};
