function XMLSerializer()
{
	var serializer = this,
		SimpleSerializer = require('./simple/serializer.js');

	serializer.serializeToString = function(document, options)
	{
		return document.___simple(function(){
			return new SimpleSerializer().serializeToString(this, options);
		});
	};
}

module.exports = XMLSerializer;
