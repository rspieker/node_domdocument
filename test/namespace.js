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

			//  if namespaceURI is null, there may be no prefix present in the qualifiedName
			Lab.expect(function(){
				document.createElementNS(null, 'foo:bar');
			}).to.throw('NAMESPACE_ERR');
			//  if a namespaceURI is given we must have a qualifiedName consisting of both a prefix and localName
			Lab.expect(function(){
				document.createElementNS('/new', 'foo');
			}).to.throw('NAMESPACE_ERR');
			//  if the prefix is 'xml', the namespaceURL must be http://www.w3.org/XML/1998/namespace
			Lab.expect(function(){
				document.createElementNS('/new', 'xml:foo');
			}).to.throw('NAMESPACE_ERR');
			//  if the qualified name is 'xmlns', the namespace must be http://www.w3.org/2000/xmlns/
			Lab.expect(function(){
				document.createElementNS('/new', 'xmlns');
			}).to.throw('NAMESPACE_ERR');

			element = document.createElementNS(null, 'node');
			Lab.expect(element.nodeType).to.equal(1);
			Lab.expect(element.prefix).to.equal(null);
			Lab.expect(element.localName).to.equal('node');
			Lab.expect(element.nodeName).to.equal('node');
			Lab.expect(element.attributes.length).to.equal(0);
			Lab.expect(document.documentElement.appendChild(element)).to.equal(element);

			element = document.createElementNS('/lab', 'lab:node');
			Lab.expect(element.nodeType).to.equal(1);
			Lab.expect(element.prefix).to.equal('lab');
			Lab.expect(element.localName).to.equal('node');
			Lab.expect(element.nodeName).to.equal('lab:node');
			Lab.expect(element.attributes.length).to.equal(1);
			Lab.expect(element.attributes.item(0).name).to.equal('xmlns:lab');
			Lab.expect(element.attributes.item(0).value).to.equal('/lab');
			Lab.expect(document.documentElement.appendChild(element)).to.equal(element);

			//  if namespaceURI is null, there may be no prefix present in the qualifiedName
			Lab.expect(function(){
				element.setAttributeNS(null, 'foo:bar', 'baz');
			}).to.throw('NAMESPACE_ERR');
			//  if a namespaceURI is given we must have a qualifiedName consisting of both a prefix and localName
			Lab.expect(function(){
				element.setAttributeNS('/new', 'foo', 'baz');
			}).to.throw('NAMESPACE_ERR');
			//  if the prefix is 'xml', the namespaceURL must be http://www.w3.org/XML/1998/namespace
			Lab.expect(function(){
				element.setAttributeNS('/new', 'xml:foo', 'baz');
			}).to.throw('NAMESPACE_ERR');
			//  if the qualified name is 'xmlns', the namespace must be http://www.w3.org/2000/xmlns/
			Lab.expect(function(){
				element.setAttributeNS('/new', 'xmlns', '/foo');
			}).to.throw('NAMESPACE_ERR');


			//  and now for the proper scenario's
			element.setAttributeNS(null, 'a', 'b');
			element.setAttributeNS('/c', 'd:e', 'f');
			element.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:g', 'h');
			element.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', '/mine');

			Lab.expect(element.getAttributeNS(null, 'a')).to.equal('b');
			Lab.expect(element.getAttributeNS('/c', 'e')).to.equal('f');

			element = new XMLSerializer().serializeToString(document);
			Lab.expect(element).to.equal('<root><node/><lab:node xmlns:lab="/lab" a="b" xmlns:d="/c" d:e="f" xmlns:xml="http://www.w3.org/XML/1998/namespace" xml:g="h" xmlns="/mine"/></root>');

			done();
		});
	});
});
