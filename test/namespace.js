var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DOMException = require('./../lib/dom/exception.js'),
	XMLSerializer = require('./../lib/xmlserializer.js');

lab.experiment('Namespace', function(){
	var xml = '<?xml version="1.0" encoding="utf-8"?>\n' +
			'<lab:root xmlns="/spul" xmlns:lab="/lab">' +
			'<lab:test xmlns="/default" spul="spulleke" />' +
			'</lab:root>';


	new DOMDocument().loadXML('<root xmlns="/spul" />', function(error, document){

		lab.test('parsing default namespace', function(done){

			console.log(new XMLSerializer().serializeToString(document));

			console.log(document.documentElement.___simple(function(){
				return this.ns();
			}));

			done();
		});

	});

	new DOMDocument().loadXML(xml, function(error, document){

		lab.test('properties', function(done){
			var root = document.documentElement;

			console.log(new XMLSerializer().serializeToString(document));

			console.log(document.documentElement.firstChild.___simple(function(){
				return this.ns();
			}));

			Lab.expect(root.nodeType).to.equal(1);
			Lab.expect(root.nodeName).to.equal('root');

			done();
		});
	});

});
