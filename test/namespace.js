var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DOMException = require('./../lib/dom/exception.js'),
	XMLSerializer = require('./../lib/xmlserializer.js');

lab.experiment('Namespace', function(){
	var xml = '<?xml version="1.0" encoding="utf-8"?>\n' +
			'<lab:root xmlns="/spul" xmlns:lab="/lab">' +
			'<lab:test xmlns="/default" spul="spulleke"><spul /></lab:test>' +
			'<spul />' +
			'</lab:root>';


	new DOMDocument().loadXML('<root xmlns="/spul" />', function(error, document){

		lab.test('parsing default namespaces', function(done){

			//  Node.isDefaultNamespace(...);
			Lab.expect(document.documentElement.isDefaultNamespace('/nope')).to.equal(false);
			Lab.expect(document.documentElement.isDefaultNamespace('/spul')).to.equal(true);

			done();
		});

	});

	new DOMDocument().loadXML(xml, function(error, document){

		lab.test('properties', function(done){
			var root = document.documentElement;

			//  Node.prefix, Node.localName, Node.nodeName
			Lab.expect(root.nodeType).to.equal(1);
			Lab.expect(root.prefix).to.equal('lab');
			Lab.expect(root.localName).to.equal('root');
			Lab.expect(root.nodeName).to.equal('lab:root');

			//  Node.isDefaultNamespace(...);
			Lab.expect(root.isDefaultNamespace('/lab')).to.equal(false);
			Lab.expect(root.isDefaultNamespace('/spul')).to.equal(true);
			Lab.expect(root.isDefaultNamespace('/default')).to.equal(false);

			Lab.expect(root.firstChild.isDefaultNamespace('/lab')).to.equal(false);
			Lab.expect(root.firstChild.isDefaultNamespace('/spul')).to.equal(false);
			Lab.expect(root.firstChild.isDefaultNamespace('/default')).to.equal(true);

			//  Node.lookupPrefix
			Lab.expect(root.lookupPrefix('/lab')).to.equal('lab');
			Lab.expect(root.lookupPrefix('/spul')).to.equal(null);
			Lab.expect(root.lookupPrefix('/default')).to.equal(null);

/*
			console.log(new XMLSerializer().serializeToString(document));

			console.log(document.documentElement.firstChild.___simple(function(){
				return this.ns();
			}));
			console.log(document.documentElement.firstChild.firstChild.___simple(function(){
				return this.ns();
			}));
			console.log(document.documentElement.firstChild.nextSibling.___simple(function(){
				return this.ns();
			}));
*/

			done();
		});
	});

});
