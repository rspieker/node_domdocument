function DOM()
{
	'use strict';

	var dom = this,
		Processor = require('./processor.js');


	dom.load = function(file, done)
	{
		new Processor().stream(file, done);
	};

	dom.loadXML = function(source, done)
	{
		new Processor().parse(source, done);
	};
}


module.exports = function(){
	return new DOM();
};
