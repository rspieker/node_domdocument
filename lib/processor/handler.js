function Handler(scope, options)
{
	"use strict";

	var handler = this,
		factory = require('../simple/factory');


	function init()
	{
		if (!('validTagNames' in options))
			options.validTagNames = /^[a-z][a-z0-9:_-]+$/i;
	}

	/**
	 *  Parse the doctype with a regular expression (Bad Idea™), extracting the name, publicId and systemId (if any)
	 *  @name    parseDoctype
	 *  @access  internal
	 *  @param   string doctype (htmlparser2 removes the < and >)
	 *  @return  void
	 */
	function parseDoctype(data)
	{
		var parts = data.match(/!doctype\s*([a-z][^\s]*)(?:\s*(public|system|local)\s*(?:(['"])([^\3]*?)\3(?:\s*(['"])([^\5]*?)\5)?)?)?/i),
			name = parts[1],
			publicId = null,
			systemId = null;


		switch ((parts[2] || '').toLowerCase())
		{
			case 'public':
				publicId = parts[4];
				systemId = parts[6];
				break;

			case 'system':
				systemId = parts[4];
				break;
		}

		handler.ondocumenttype(name, publicId, systemId);
	}

	handler.onopentag = function(name, attribute){
		if (options.validTagNames && !options.validTagNames.test(name))
			throw new Error('Invalid token ' + name);

		scope = scope.append(factory.create(1, name, attribute));
	};

	handler.onclosetag = function(name){
		scope = scope.parent;
	};

	handler.ontext = function(data){
		scope.append(factory.create(3, '#text', data));
	};

	handler.oncdata = function(data){
		scope.append(factory.create(4, '#cdata-section', data));
	};

	handler.oncomment = function(data){
		//  work around an issue where CDATA is seen as comment node in htmlparser2
		var match = data.match(/^\[CDATA\[(.*?)\]\]$/);

		if (match)
			return handler.oncdata(match[1]);

		scope.append(factory.create(8, '#comment', data));
	};

	handler.ondocumenttype = function(name, publicId, systemId){
		scope.append(factory.create(10, name, {publicId: publicId, systemId: systemId}));
	};

	handler.onprocessinginstruction = function(name, data){
		if (name.toLowerCase() === '!doctype')
			return parseDoctype(data);

		//  TODO:  implement processing instructions
	};

	init();
}

//  Expose the Handler module
module.exports = Handler;
