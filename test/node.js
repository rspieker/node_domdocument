var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DOMException = require('./../lib/dom/exception.js'),
	Node = require('./../lib/dom/node.js');


lab.experiment('Node', function(){

	lab.test('Direct creation', function(done){
		var node = new Node({type:1, name:'node'});

		Lab.expect(node.nodeType).to.equal(1);
		Lab.expect(node.nodeName).to.equal('node');

		Lab.expect(node.parentNode).to.equal(null);
		Lab.expect(node.ownerDocument).to.equal(null);

		done();
	});

	var dom = [],
		xml = '<root><item><nested /></item><item><nested /></item></root>',
		i;


	function tests()
	{
		var a = dom[0],
			b = dom[1];

		lab.test('Wrong document', function(done){
			Lab.expect(function(){
				a.documentElement.insertBefore(b.documentElement.firstChild, a.documentElement.firstChild);
			}).to.throw('WRONG_DOCUMENT_ERR');

			Lab.expect(function(){
				b.documentElement.insertBefore(a.documentElement.firstChild, b.documentElement.firstChild);
			}).to.throw('WRONG_DOCUMENT_ERR');

			done();
		});

		lab.test('Not found', function(done){
			Lab.expect(function(){
				a.documentElement.firstChild.insertBefore(
					a.documentElement.firstChild.firstChild,
					a.documentElement.lastChild
				);
			}).to.throw('NOT_FOUND_ERR');

			done();
		});

		lab.test('Hierarchy', function(done){
			Lab.expect(function(){
				a.documentElement.firstChild.insertBefore(
					a.documentElement,
					a.documentElement.firstChild.firstChild
				);
			}).to.throw('HIERARCHY_REQUEST_ERR');

			done();
		});

		lab.test('replaceChild', function(done){
			var node = a.createElement('replace');

			a.documentElement.replaceChild(
				node,
				a.documentElement.firstChild
			);

			done();
		});

		lab.test('removeChild', function(done){
			var node = b.createElement('remove');

			Lab.expect(function(){
				b.documentElement.removeChild(
					node
				);
			}).to.throw('NOT_FOUND_ERR');

			done();
		});

		lab.test('appendChild', function(done){
			var node = b.createElement('one'),
				nest = b.createElement('two');

			Lab.expect(function(){
				a.documentElement.appendChild(node);
			}).to.throw('WRONG_DOCUMENT_ERR');

			Lab.expect(b.documentElement.appendChild(node)).to.equal(node);
			Lab.expect(b.documentElement.appendChild(nest)).to.equal(nest);
			Lab.expect(b.documentElement.lastChild.appendChild(node)).to.equal(node);

			done();
		});

		lab.test('hasChildNodes', function(done){
			Lab.expect(a.documentElement.hasChildNodes()).to.be.a('boolean');

			done();
		});

		lab.test('cloneNode - shallow', function(done){
			var clone = a.documentElement.cloneNode();

			Lab.expect(clone.nodeType).to.eql(a.documentElement.nodeType);
			Lab.expect(clone.nodeName).to.eql(a.documentElement.nodeName);
			Lab.expect(clone.childNodes.length).to.equal(0);

			done();
		});

		lab.test('cloneNode - deep', function(done){
			var clone = a.documentElement.cloneNode(true);

			Lab.expect(clone.nodeType).to.equal(a.documentElement.nodeType);
			Lab.expect(clone.nodeName).to.equal(a.documentElement.nodeName);
			Lab.expect(clone.childNodes.length).to.equal(2);
			Lab.expect(clone.firstChild.nodeName).to.equal(a.documentElement.firstChild.nodeName);
			Lab.expect(clone.lastChild.nodeName).to.equal(a.documentElement.lastChild.nodeName);

			done();
		});

		lab.test('normalize', function(done){
			var node = a.createElement('normalize'),
				text1 = node.appendChild(a.createTextNode('and ')),
				text2 = node.appendChild(a.createTextNode('so ')),
				text3 = node.appendChild(a.createTextNode('it ')),
				text4 = node.appendChild(a.createTextNode('begins'));

			Lab.expect(node.childNodes.length).to.equal(4);
			Lab.expect(node.firstChild.nodeValue).to.equal('and ');
			Lab.expect(node.textContent).to.equal('and so it begins');

			Lab.expect(node.normalize()).to.equal(undefined);  //  no return value

			Lab.expect(node.textContent).to.equal('and so it begins');
			Lab.expect(node.firstChild.nodeValue).to.equal('and so it begins');
			Lab.expect(node.childNodes.length).to.equal(1);

			done();
		});

		lab.test('isSupported', function(done){
			//  as this is a todo, we only check for false

			Lab.expect(a.documentElement.isSupported('core', 1)).to.equal(false);
			Lab.expect(a.documentElement.isSupported('core', 2)).to.equal(false);
			Lab.expect(a.documentElement.isSupported('core', 3)).to.equal(false);

			done();
		});

		lab.test('compareDocumentPosition', function(done){
			var offset = b.documentElement.firstChild,
				disco = b.createElement('disco');

			//  test constants
			Lab.expect(Node.DOCUMENT_POSITION_DISCONNECTED).to.equal(1);
			Lab.expect(Node.DOCUMENT_POSITION_PRECEDING).to.equal(2);
			Lab.expect(Node.DOCUMENT_POSITION_FOLLOWING).to.equal(4);
			Lab.expect(Node.DOCUMENT_POSITION_CONTAINS).to.equal(8);
			Lab.expect(Node.DOCUMENT_POSITION_CONTAINED_BY).to.equal(16);
			Lab.expect(Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC).to.equal(32);


			//  same node
			Lab.expect(
				offset.compareDocumentPosition(offset)
			).to.equal(0);

			//  disconnected
			Lab.expect(
				offset.compareDocumentPosition(disco) & Node.DOCUMENT_POSITION_DISCONNECTED
			).to.equal(Node.DOCUMENT_POSITION_DISCONNECTED);

			//  nested preceding (also contains)
			Lab.expect(
				offset.parentNode.compareDocumentPosition(offset) & Node.DOCUMENT_POSITION_PRECEDING
			).to.equal(Node.DOCUMENT_POSITION_PRECEDING);
			Lab.expect(
				offset.parentNode.compareDocumentPosition(offset) & Node.DOCUMENT_POSITION_CONTAINS
			).to.equal(Node.DOCUMENT_POSITION_CONTAINS);

			//  nested following (also contained by)
			Lab.expect(
				offset.compareDocumentPosition(offset.parentNode) & Node.DOCUMENT_POSITION_FOLLOWING
			).to.equal(Node.DOCUMENT_POSITION_FOLLOWING);
			Lab.expect(
				offset.compareDocumentPosition(offset.parentNode) & Node.DOCUMENT_POSITION_CONTAINED_BY
			).to.equal(Node.DOCUMENT_POSITION_CONTAINED_BY);

			//  direct sibling preceding
			Lab.expect(
				offset.compareDocumentPosition(offset.nextSibling) & Node.DOCUMENT_POSITION_FOLLOWING
			).to.equal(Node.DOCUMENT_POSITION_FOLLOWING);

			//  direct sibling following
			Lab.expect(
				offset.nextSibling.compareDocumentPosition(offset) & Node.DOCUMENT_POSITION_PRECEDING
			).to.equal(Node.DOCUMENT_POSITION_PRECEDING);

			//  descended sibling preceding
			Lab.expect(
				offset.compareDocumentPosition(offset.nextSibling.firstChild) & Node.DOCUMENT_POSITION_FOLLOWING
			).to.equal(Node.DOCUMENT_POSITION_FOLLOWING);

			//  descended sibling following
			Lab.expect(
				offset.nextSibling.firstChild.compareDocumentPosition(offset) & Node.DOCUMENT_POSITION_PRECEDING
			).to.equal(Node.DOCUMENT_POSITION_PRECEDING);

			done();
		});

		lab.test('isEqualNode', function(done){
			var nodeA = a.createElement('equal'),
				nodeB = a.createElement('equal'),
				nodeC = a.createElement('notequal');

			Lab.expect(nodeA.isEqualNode(nodeB)).to.equal(true);
			Lab.expect(nodeB.isEqualNode(nodeA)).to.equal(true);

			Lab.expect(nodeA.isEqualNode(nodeC)).to.equal(false);
			Lab.expect(nodeB.isEqualNode(nodeC)).to.equal(false);

			nodeA.setAttribute('differ', 'yes');
			Lab.expect(nodeA.isEqualNode(nodeB)).to.equal(false);
			nodeB.setAttribute('differ', 'yes');
			Lab.expect(nodeA.isEqualNode(nodeB)).to.equal(true);

			nodeA.appendChild(a.createElement('child'));
			Lab.expect(nodeA.isEqualNode(nodeB)).to.equal(false);
			nodeB.appendChild(a.createElement('child'));
			Lab.expect(nodeA.isEqualNode(nodeB)).to.equal(true);

			nodeA.removeAttribute('differ', 'yes');
			Lab.expect(nodeA.isEqualNode(nodeB)).to.equal(false);
			nodeB.removeAttribute('differ', 'yes');
			Lab.expect(nodeA.isEqualNode(nodeB)).to.equal(true);

			done();
		});
	}

	function callback(error, document)
	{
		if (error)
			throw error;

		dom.push(document);

		if (dom.length > 1)
			tests();
	}

	new DOMDocument().loadXML(xml, callback);
	new DOMDocument().loadXML(xml, callback);

});
