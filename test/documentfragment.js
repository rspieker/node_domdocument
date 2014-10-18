var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DocumentFragment = require('./../lib/dom/documentfragment.js');


lab.experiment('DocumentFragment', function(){

	lab.test('Direct creation', function(done){
		var fragment = new DocumentFragment({type:11, name:'#document-fragment'});

		Lab.expect(fragment.nodeType).to.equal(11);
		Lab.expect(fragment.nodeName).to.equal('#document-fragment');

		done();
	});

	new DOMDocument().loadXML('<root />', function(error, document){
		var fragment;

		lab.test('Creation from document', function(done){
			fragment = document.createDocumentFragment();

			Lab.expect(fragment.nodeType).to.equal(11);
			Lab.expect(fragment.nodeName).to.equal('#document-fragment');

			done();
		});

		lab.test('Not a document', function(done){

			fragment = document.createDocumentFragment();

			//  despite the name implying to be some kind of document element, it should not have document specific
			//  methods, such as the create<Type> methods
			Lab.expect(fragment).not.has.property('createElement');
			Lab.expect(fragment).not.has.property('createAttribute');
			Lab.expect(fragment).not.has.property('createTextNode');
			Lab.expect(fragment).not.has.property('createCDATASection');
			Lab.expect(fragment).not.has.property('createComment');
			Lab.expect(fragment).not.has.property('createDocumentFragment');

			done();
		});

		lab.test('Append behaviour', function(done){
			var first = document.createElement('first'),
				root = document.documentElement,
				last, clone;

			fragment = document.createDocumentFragment();

			Lab.expect(fragment.appendChild(first)).to.equal(first);
			Lab.expect(fragment.childNodes.length).to.equal(1);
			Lab.expect(fragment.firstChild).to.equal(first);
			Lab.expect(fragment.lastChild).to.equal(first);

			Lab.expect(fragment.appendChild(document.createElement('last')).nodeName).to.equal('last');
			Lab.expect(fragment.childNodes.length).to.equal(2);

			Lab.expect(fragment.insertBefore(
				document.createTextNode('hello world'),
				fragment.lastChild
			).textContent).to.equal('hello world');
			Lab.expect(fragment.childNodes.length).to.equal(3);

			//  when a document fragment itself is appended in whatever way, its children will be appended, not the
			//  fragment itself, therefor the number of childNodes of the target should equal the number of childNodes
			//  of the fragment and the fragment itself don't have any childNodes left.
			clone = fragment.cloneNode(true);
			first = clone.firstChild;

			root.appendChild(document.createElement('fragmentholder'));
			Lab.expect(root.lastChild.appendChild(clone)).to.equal(clone);

			Lab.expect(root.lastChild.childNodes.length).to.equal(3);
			Lab.expect(clone.childNodes.length).to.equal(0);
			Lab.expect(root.lastChild.firstChild).to.equal(first);
			Lab.expect(root.lastChild.firstChild.parentNode).to.equal(root.lastChild);

			//  insertBefore
			clone = fragment.cloneNode(true);
			first = clone.firstChild;

			Lab.expect(root.lastChild.insertBefore(
				clone,
				root.lastChild.firstChild.nextSibling
			)).to.equal(clone);

			Lab.expect(root.lastChild.childNodes.length).to.equal(6);
			Lab.expect(clone.childNodes.length).to.equal(0);
			Lab.expect(root.lastChild.firstChild.nextSibling).to.equal(first);

			//  replaceChild
			clone = fragment.cloneNode(true);
			first = clone.firstChild;
			last  = root.lastChild;

			Lab.expect(root.replaceChild(
				clone,
				root.lastChild
			)).to.equal(last);

			Lab.expect(clone.childNodes.length).to.equal(0);
			Lab.expect(root.lastChild.previousSibling.previousSibling).to.equal(first);

			done();
		});
	});

});
