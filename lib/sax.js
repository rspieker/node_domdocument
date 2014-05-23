function SAXParser()
{
	'use strict';

	var sax = this,
		expat = require('node-expat'),
		fs = require('fs'),
		factory = require('./simple/factory.js');


	/**
	 *  Prepare an expat.Parser instance with all events accounted for
	 *  @name    prepare
	 *  @type    function
	 *  @access  internal
	 *  @param   Simple   document
	 *  @param   string   encoding [optional, default null - 'UTF-8']
	 *  @return  expat.Parser object
	 */
	function prepare(document, encoding)
	{
		var parser = new expat.Parser((encoding || 'utf-8').toUpperCase()),
			scope = document;

		//  add listeners for the various Expat events
		parser.on('error', function(error){
			throw new Error(error);
		});


		//  append a new Simple object (representing an Element node) to the current scope and move the scope to
		//  the newly created Simple
		parser.on('startElement', function(name, attribute){
			scope = scope.append(factory.create(1, name, attribute));
		});

		//  move the scope back to the parent Simple of the current scope
		parser.on('endElement', function(name){
			scope = scope.parent;
		});

		//  append a new Simple object (representing a Text node) to the current scope
		parser.on('text', function(data){
			scope.append(factory.create(3, '#text', data));
		});

		//  append a new Simple object (representing a Comment node) to the current scope
		parser.on('comment', function(data){
			scope.append(factory.create(8, '#comment', data));
		});

		//  create a new Simple object (representing a CDATASection node) to the current scope
		parser.on('startCdata', function(){
			scope = scope.append(factory.create(4, '#cdata-section'));
		});

		parser.on('endCdata', function(){
			scope = scope.parent;
		});



		parser.on('processingInstruction', function(target, data){
			console.log('TODO: processingInstruction', target, data);
		});

		parser.on('startDoctypeDecl', function(){
			console.log('TODO: startDoctypeDecl', arguments);
		});

		parser.on('entityDecl', function(entityName, isParameterEntity, value, base, systemId, publicId, notationName){
			console.log('TODO: entityDecl', arguments);
		});

		return parser;
	}


	/**
	 *  Create a file stream and populate a Simple object representing a document node
	 *  @name    stream
	 *  @type    method
	 *  @access  public
	 *  @param   string   file
	 *  @param   function done
	 *  @param   string   encoding [optional, default null - 'utf-8']
	 *  @return  void
	 */
	sax.stream = function(file, done, encoding)
	{
		var document = factory.create(9, '#document', {ns:[], uri:file}),
			parser = prepare(document, encoding),
			stream = fs.createReadStream(file, {encoding: encoding || 'utf-8'}),
			stat = {size: 0, mem: 0, time: process.hrtime()};

		stream.on('data', function(data){
			stat.size += data.length;
			parser.parse(data);
		});

		stream.on('end', function(){
			var time = process.hrtime(stat.time);
			stat.mem  = Math.round((process.memoryUsage().heapUsed * 9.53674e-7) * 100) / 100;
			stat.time = Math.round(((time[0] * 1e3) + (time[1] / 1e6)) * 100) / 100;

			done(null, factory.instance(document), stat);
		});
	};

	sax.parse = function(source, done, encoding)
	{
		var document = factory.create(9, '#document', {ns:[], uri:process.cwd()}),
			parser = prepare(document, encoding),
			time = process.hrtime();

		parser.parse(source, true);

		time = process.hrtime(time);
		done(null, factory.instance(document), {
			size: source.length,
			mem: Math.round((process.memoryUsage().heapUsed * 9.53674e-7) * 100) / 100,
			time: Math.round(((time[0] * 1e3) + (time[1] / 1e6)) * 100) / 100
		});
	}
}


//  Expose a SAXParser factory function (we may decide to make it a singleton)
module.exports = function(){
	return new SAXParser();
};
