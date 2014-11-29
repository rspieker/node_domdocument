function Processor()
{
	"use strict";

	var processor = this,
		htmlparser2 = require('htmlparser2'),
		Handler = require('./processor/handler'),
		fs = require('fs'),
		factory = require('./simple/factory');


	function prepare(document, options)
	{
		options = options || {};

		if (!('xmlMode' in options || 'recognizeSelfClosing' in options))
			options.recognizeSelfClosing = true;

		return new htmlparser2.Parser(new Handler(document, options), options);
	}

	/**
	 *  Create a file stream and populate a Simple object, result in a DOM document
	 *  @name    stream
	 *  @type    method
	 *  @access  public
	 *  @param   string   file
	 *  @param   function done
	 *  @param   object   options
	 *  @return  void
	 */
	processor.stream = function(file, done, options){
		var document = factory.create(9, '#document', {ns:[], uri:file}),
			parser = prepare(document, options),
			stream = fs.createReadStream(file, {encoding: 'utf-8'}),
			stat = {size: 0, mem: 0, time: process.hrtime()},
			error = null;

		stream.on('data', function(data){
			try {
				stat.size += data.length;
				parser.write(data);
			}
			catch(e) {
				error = e;
			}
		});

		stream.once('end', function(){
			var time  = process.hrtime(stat.time);
			stat.mem  = Math.round((process.memoryUsage().heapUsed * 9.53674e-7) * 100) / 100;
			stat.time = Math.round(((time[0] * 1e3) + (time[1] / 1e6)) * 100) / 100;

			done(error, factory.instance(document), stat);
		});
	};

	/**
	 *  Create an populate a Simple object from a string, result in a DOM document
	 *  @name    parse
	 *  @type    method
	 *  @access  public
	 *  @param   string   source
	 *  @param   function done
	 *  @param   object   options
	 *  @return  void
	 */
	processor.parse = function(source, done, options)
	{
		var document = factory.create(9, '#document', {ns:[], uri:process.cwd()}),
			parser = prepare(document, options),
			time = process.hrtime(),
			error = null;

		try {
			parser.write(source);
		}
		catch (e){
			error = e;
		}

		time = process.hrtime(time);
		done(error, factory.instance(document), {
			size: source.length,
			mem: Math.round((process.memoryUsage().heapUsed * 9.53674e-7) * 100) / 100,
			time: Math.round(((time[0] * 1e3) + (time[1] / 1e6)) * 100) / 100
		});
	};
}

//  Expose a factory function (we may decide to make it a singleton)
module.exports = function(){
	return new Processor();
};
