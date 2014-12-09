var Code = require('code'),
	Lab = require('lab'),
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

			Code.expect(document.documentElement.isDefaultNamespace('/nope')).to.equal(false);
			Code.expect(document.documentElement.isDefaultNamespace('/spul')).to.equal(true);

			done();
		});
	});

	lab.test('parse single non-default namespace', function(done){
		new DOMDocument().loadXML('<root xmlns:spul="/spul" spul:attr="value" />', function(error, document){

			Code.expect(document.documentElement.isDefaultNamespace('/nope')).to.equal(false);
			Code.expect(document.documentElement.isDefaultNamespace('/spul')).to.equal(false);

			done();
		});
	});

	lab.test('attributes (namespaced and non-namespaced)', function(done){
		new DOMDocument().loadXML('<root xmlns="/spul" xmlns:foo="/foo"><child foo="bar" foo:bar="baz" /></root>', function(error, document){
			var child = document.getElementsByTagName('child')[0];

			Code.expect(child.hasAttributeNS('/does/not/exist', 'bar')).to.equal(false);
			Code.expect(child.getAttributeNS('/does/not/exist', 'bar') || '').to.equal('');

			Code.expect(child.hasAttributeNS('/foo', 'bar')).to.equal(true);
			Code.expect(child.getAttributeNS('/foo', 'bar')).to.equal('baz');

			Code.expect(child.hasAttributeNS('/foo', 'foo')).to.equal(false);
			Code.expect(child.getAttributeNS('/foo', 'foo') || '').to.equal('');

			Code.expect(child.hasAttributeNS('', 'foo')).to.equal(true);
			Code.expect(child.getAttributeNS('', 'foo')).to.equal('bar');

			Code.expect(child.hasAttribute('foo')).to.equal(true);
			Code.expect(child.getAttribute('foo')).to.equal('bar');

			done();
		});
	});

	lab.test('parse multiple default and prefixed namespaces', function(done){
		new DOMDocument().loadXML(xml, function(error, document){
			var root = document.documentElement;

			//  Node.prefix, Node.localName, Node.nodeName
			Code.expect(root.nodeType).to.equal(1);
			Code.expect(root.prefix).to.equal('lab');
			Code.expect(root.localName).to.equal('root');
			Code.expect(root.nodeName).to.equal('lab:root');

			//  Node.isDefaultNamespace(...);
			Code.expect(root.isDefaultNamespace('/lab')).to.equal(false);
			Code.expect(root.isDefaultNamespace('/spul')).to.equal(true);
			Code.expect(root.isDefaultNamespace('/default')).to.equal(false);

			Code.expect(root.firstChild.isDefaultNamespace('/lab')).to.equal(false);
			Code.expect(root.firstChild.isDefaultNamespace('/spul')).to.equal(false);
			Code.expect(root.firstChild.isDefaultNamespace('/default')).to.equal(true);

			//  Node.lookupPrefix
			Code.expect(root.lookupPrefix('/lab')).to.equal('lab');
			Code.expect(root.lookupPrefix('/spul')).to.equal(null);
			Code.expect(root.lookupPrefix('/default')).to.equal(null);

			done();
		});
	});

	lab.test('redundant declaration', function(done){
		new DOMDocument().loadXML('<root xmlns:lab="/lab" lab:attr="attrib"><lab:node xmlns:lab="/lab" lab:attr="attrib" /></root>', function(error, document){
			var root = document.documentElement;

			//  naming and attributes
			Code.expect(root.localName).to.equal('root');
			Code.expect(root.firstChild.localName).to.equal('node');
			Code.expect(root.firstChild.prefix).to.equal('lab');
			Code.expect(root.firstChild.nodeName).to.equal('lab:node');

			Code.expect(root.hasAttributeNS('/lab', 'attr')).to.equal(true);
			Code.expect(root.getAttributeNS('/lab', 'attr')).to.equal('attrib');

			Code.expect(root.firstChild.hasAttributeNS('/lab', 'attr')).to.equal(true);
			Code.expect(root.firstChild.getAttributeNS('/lab', 'attr')).to.equal('attrib');

			Code.expect(
				new XMLSerializer().serializeToString(document, {format:'xml'})
			).to.equal(
				'<root xmlns:lab="/lab" lab:attr="attrib"><lab:node lab:attr="attrib"/></root>'
			);

			done();
		});
	});

	lab.test('redundant declaration removal', function(done){
		new DOMDocument().loadXML('<root xmlns:lab="/lab" lab:attr="attrib"><lab:node lab:attr="attrib" /></root>', function(error, document){
			var root = document.documentElement,
				i;

			//  naming and attributes
			Code.expect(root.localName).to.equal('root');
			Code.expect(root.firstChild.localName).to.equal('node');
			Code.expect(root.firstChild.prefix).to.equal('lab');
			Code.expect(root.firstChild.nodeName).to.equal('lab:node');

			Code.expect(root.hasAttributeNS('/lab', 'attr')).to.equal(true);
			Code.expect(root.getAttributeNS('/lab', 'attr')).to.equal('attrib');

			Code.expect(root.firstChild.hasAttributeNS('/lab', 'attr')).to.equal(true);
			Code.expect(root.firstChild.getAttributeNS('/lab', 'attr')).to.equal('attrib');

			for (i = 0; i < root.firstChild.attributes.length; ++i)
				if (root.firstChild.attributes.item(i).name === 'lab:attr')
					root.firstChild.removeAttributeNode(
						root.firstChild.attributes.item(i)
					);

			Code.expect(root.firstChild.hasAttributeNS('/lab', 'attr')).to.equal(false);
			Code.expect(root.firstChild.getAttributeNS('/lab', 'attr')).to.equal(null);

			Code.expect(
				new XMLSerializer().serializeToString(document, {format:'xml'})
			).to.equal(
				'<root xmlns:lab="/lab" lab:attr="attrib"><lab:node/></root>'
			);

			done();
		});
	});

	lab.test('same prefix, different namespace', function(done){
		new DOMDocument().loadXML('<root xmlns:lab="/lab" lab:attr="attrib"><lab:node  xmlns:lab="/labs" lab:attr="attrib" /></root>', function(error, document){
			var root = document.documentElement;

			//  naming and attributes
			Code.expect(root.localName).to.equal('root');
			Code.expect(root.firstChild.localName).to.equal('node');
			Code.expect(root.firstChild.prefix).to.equal('lab');
			Code.expect(root.firstChild.nodeName).to.equal('lab:node');

			Code.expect(root.hasAttributeNS('/lab', 'attr')).to.equal(true);
			Code.expect(root.getAttributeNS('/lab', 'attr')).to.equal('attrib');

			Code.expect(root.hasAttributeNS('/labs', 'attr')).to.equal(false);
			Code.expect(root.getAttributeNS('/labs', 'attr')).to.equal(null);

			Code.expect(root.firstChild.hasAttributeNS('/lab', 'attr')).to.equal(false);
			Code.expect(root.firstChild.getAttributeNS('/lab', 'attr')).to.equal(null);

			Code.expect(root.firstChild.hasAttributeNS('/labs', 'attr')).to.equal(true);
			Code.expect(root.firstChild.getAttributeNS('/labs', 'attr')).to.equal('attrib');

			Code.expect(
				new XMLSerializer().serializeToString(document, {format:'xml'})
			).to.equal(
				'<root xmlns:lab="/lab" lab:attr="attrib"><lab:node xmlns:lab="/labs" lab:attr="attrib"/></root>'
			);

			done();
		});
	});

	lab.test('creating new elements and attributes', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){
			var element;

			//  if namespaceURI is null, there may be no prefix present in the qualifiedName
			Code.expect(function(){
				document.createElementNS(null, 'foo:bar');
			}).to.throw('NAMESPACE_ERR');
			//  if a namespaceURI is given we must have a qualifiedName consisting of both a prefix and localName
			Code.expect(function(){
				document.createElementNS('/new', 'foo');
			}).to.throw('NAMESPACE_ERR');
			//  if the prefix is 'xml', the namespaceURL must be http://www.w3.org/XML/1998/namespace
			Code.expect(function(){
				document.createElementNS('/new', 'xml:foo');
			}).to.throw('NAMESPACE_ERR');
			//  if the qualified name is 'xmlns', the namespace must be http://www.w3.org/2000/xmlns/
			Code.expect(function(){
				document.createElementNS('/new', 'xmlns');
			}).to.throw('NAMESPACE_ERR');

			element = document.createElementNS(null, 'node');
			Code.expect(element.nodeType).to.equal(1);
			Code.expect(element.prefix).to.equal(null);
			Code.expect(element.localName).to.equal('node');
			Code.expect(element.nodeName).to.equal('node');
			Code.expect(element.attributes.length).to.equal(0);
			Code.expect(document.documentElement.appendChild(element)).to.equal(element);

			element = document.createElementNS('/lab', 'lab:node');
			Code.expect(element.nodeType).to.equal(1);
			Code.expect(element.prefix).to.equal('lab');
			Code.expect(element.localName).to.equal('node');
			Code.expect(element.nodeName).to.equal('lab:node');
			Code.expect(element.attributes.length).to.equal(1);
			Code.expect(element.attributes.item(0).name).to.equal('xmlns:lab');
			Code.expect(element.attributes.item(0).value).to.equal('/lab');
			Code.expect(document.documentElement.appendChild(element)).to.equal(element);

			//  if namespaceURI is null, there may be no prefix present in the qualifiedName
			Code.expect(function(){
				element.setAttributeNS(null, 'foo:bar', 'baz');
			}).to.throw('NAMESPACE_ERR');
			//  if a namespaceURI is given we must have a qualifiedName consisting of both a prefix and localName
			Code.expect(function(){
				element.setAttributeNS('/new', 'foo', 'baz');
			}).to.throw('NAMESPACE_ERR');
			//  if the prefix is 'xml', the namespaceURL must be http://www.w3.org/XML/1998/namespace
			Code.expect(function(){
				element.setAttributeNS('/new', 'xml:foo', 'baz');
			}).to.throw('NAMESPACE_ERR');
			//  if the qualified name is 'xmlns', the namespace must be http://www.w3.org/2000/xmlns/
			Code.expect(function(){
				element.setAttributeNS('/new', 'xmlns', '/foo');
			}).to.throw('NAMESPACE_ERR');


			//  and now for the proper scenario's
			element.setAttributeNS(null, 'a', 'b');
			element.setAttributeNS('/c', 'd:e', 'f');
			element.setAttributeNS('/c', 'd:g', 'h');
			element.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:g', 'h');
			element.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', '/mine');

			Code.expect(element.getAttributeNS(null, 'a')).to.equal('b');
			Code.expect(element.getAttributeNS('/c', 'e')).to.equal('f');
			Code.expect(element.getAttributeNS('/c', 'g')).to.equal('h');

			element = new XMLSerializer().serializeToString(document, {format:'xml'});

			Code.expect(element).to.equal('<root><node/><lab:node xmlns:d="/c" xmlns:lab="/lab" xmlns:xml="http://www.w3.org/XML/1998/namespace" a="b" d:e="f" d:g="h" xml:g="h"/></root>');

			done();
		});
	});

});
