var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DocumentFragment = require('./../lib/dom/documentfragment.js');


lab.experiment('DocumentFragment', function(){

	lab.test('Direct creation', function(done){
		var fragment = new DocumentFragment({type:11, name:'#document-fragment'});

		Code.expect(fragment.nodeType).to.equal(11);
		Code.expect(fragment.nodeName).to.equal('#document-fragment');

		done();
	});

	new DOMDocument().loadXML('<root />', function(error, document){
		var fragment;

		lab.test('Creation from document', function(done){
			fragment = document.createDocumentFragment();

			Code.expect(fragment.nodeType).to.equal(11);
			Code.expect(fragment.nodeName).to.equal('#document-fragment');

			done();
		});

		lab.test('Not a document', function(done){

			fragment = document.createDocumentFragment();

			//  despite the name implying to be some kind of document element, it should not have document specific
			//  methods, such as the create<Type> methods
			Code.expect(typeof fragment.createElement).not.to.be.function();
			Code.expect(typeof fragment.createAttribute).not.to.be.function();
			Code.expect(typeof fragment.createTextNode).not.to.be.function();
			Code.expect(typeof fragment.createCDATASection).not.to.be.function();
			Code.expect(typeof fragment.createComment).not.to.be.function();
			Code.expect(typeof fragment.createDocumentFragment).not.to.be.function();

			done();
		});

		lab.test('Append behaviour', function(done){
			var first = document.createElement('first'),
				root = document.documentElement,
				last, clone;

			fragment = document.createDocumentFragment();

			Code.expect(fragment.appendChild(first)).to.equal(first);
			Code.expect(fragment.childNodes.length).to.equal(1);
			Code.expect(fragment.firstChild).to.equal(first);
			Code.expect(fragment.lastChild).to.equal(first);

			Code.expect(fragment.appendChild(document.createElement('last')).nodeName).to.equal('last');
			Code.expect(fragment.childNodes.length).to.equal(2);

			Code.expect(fragment.insertBefore(
				document.createTextNode('hello world'),
				fragment.lastChild
			).textContent).to.equal('hello world');
			Code.expect(fragment.childNodes.length).to.equal(3);

			//  when a document fragment itself is appended in whatever way, its children will be appended, not the
			//  fragment itself, therefor the number of childNodes of the target should equal the number of childNodes
			//  of the fragment and the fragment itself don't have any childNodes left.
			clone = fragment.cloneNode(true);
			first = clone.firstChild;

			root.appendChild(document.createElement('fragmentholder'));
			Code.expect(root.lastChild.appendChild(clone)).to.equal(clone);

			Code.expect(root.lastChild.childNodes.length).to.equal(3);
			Code.expect(clone.childNodes.length).to.equal(0);
			Code.expect(root.lastChild.firstChild).to.equal(first);
			Code.expect(root.lastChild.firstChild.parentNode).to.equal(root.lastChild);

			//  insertBefore
			clone = fragment.cloneNode(true);
			first = clone.firstChild;

			Code.expect(root.lastChild.insertBefore(
				clone,
				root.lastChild.firstChild.nextSibling
			)).to.equal(clone);

			Code.expect(root.lastChild.childNodes.length).to.equal(6);
			Code.expect(clone.childNodes.length).to.equal(0);
			Code.expect(root.lastChild.firstChild.nextSibling).to.equal(first);

			//  replaceChild
			clone = fragment.cloneNode(true);
			first = clone.firstChild;
			last  = root.lastChild;

			Code.expect(root.replaceChild(
				clone,
				root.lastChild
			)).to.equal(last);

			Code.expect(clone.childNodes.length).to.equal(0);
			Code.expect(root.lastChild.previousSibling.previousSibling).to.equal(first);

			done();
		});
	});

});
