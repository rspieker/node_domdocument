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


	lab.test('parse single default namespace', function(done){
		new DOMDocument().loadXML('<root xmlns="/spul" />', function(error, document){
			//  Node.isDefaultNamespace(...);
			Lab.expect(document.documentElement.isDefaultNamespace('/nope')).to.equal(false);
			Lab.expect(document.documentElement.isDefaultNamespace('/spul')).to.equal(true);

			done();
		});

	});

	lab.test('parse multiple default and prefixed namespaces', function(done){
		new DOMDocument().loadXML(xml, function(error, document){
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

			done();
		});
	});

	lab.test('creating new elements and attributes', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){
			var element;

			element = document.createElementNS('/lab', 'lab:node');
			Lab.expect(element.nodeType).to.equal(1);
			Lab.expect(element.prefix).to.equal('lab');
			Lab.expect(element.localName).to.equal('node');
			Lab.expect(element.nodeName).to.equal('lab:node');
			Lab.expect(element.attributes.length).to.equal(1);
			Lab.expect(element.attributes.item(0).name).to.equal('xmlns:lab');
			Lab.expect(element.attributes.item(0).value).to.equal('/lab');

			done();
		});
	});
});
