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

		lab.test('cloneNode - deep', function(done){
			var clone = a.documentElement.cloneNode();

			Lab.expect(clone.nodeType).to.eql(a.documentElement.nodeType);
			Lab.expect(clone.nodeName).to.eql(a.documentElement.nodeName);
			Lab.expect(clone.childNodes.length).to.equal(0);

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
