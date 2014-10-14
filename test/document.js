var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	Document = require('./../lib/dom/document.js'),
	DOMException = require('./../lib/dom/exception.js'),
	XMLSerializer = require('./../lib/xmlserializer.js');


lab.experiment('Document', function(){

	lab.test('Direct creation', function(done){
		var document = new Document();

		Lab.expect(document.nodeType).to.equal(9);
		Lab.expect(document.nodeName).to.equal('#document');

		Lab.expect(document.documentElement).to.equal(null);

		done();
	});

	lab.test('Node existence and typing', function(done){

		new DOMDocument().load(__dirname + '/files/basic.xml', function(error, document){
			var length;

			Lab.expect(document.attributes).to.equal(null);
			Lab.expect(document.namespaceURI).to.equal(null);

			Lab.expect(document.nodeType).to.equal(9);
			Lab.expect(document.nodeName).to.equal('#document');

			//  Basic traversal
			Lab.expect(document.childNodes.length).to.equal(2);

			Lab.expect(document.firstChild).to.equal(document.childNodes[0]);
			Lab.expect(document.firstChild.nodeType).to.equal(8);
			Lab.expect(document.firstChild.nodeName).to.equal('#comment');
			Lab.expect(document.firstChild.nodeValue).to.equal('  Don\'t get blown away by the apparent XML syntax, HTML5 allows for this  ');
			Lab.expect(document.firstChild.nodeValue).to.equal(document.firstChild.data);

			//  append '*haha*' to the firstChild (#comment)
			document.firstChild.appendData('*haha*');
			Lab.expect(document.firstChild.nodeValue).to.equal('  Don\'t get blown away by the apparent XML syntax, HTML5 allows for this  *haha*');
			Lab.expect(document.firstChild.nodeValue).to.equal(document.firstChild.data);

			//  remove the first 12 characters
			document.firstChild.deleteData(0, 12);
			Lab.expect(document.firstChild.nodeValue).to.equal('blown away by the apparent XML syntax, HTML5 allows for this  *haha*');
			Lab.expect(document.firstChild.nodeValue).to.equal(document.firstChild.data);

			//  remove more characters than available
			length = document.firstChild.nodeValue.length;
			document.firstChild.deleteData(length - 24, 100);
			Lab.expect(document.firstChild.nodeValue).to.equal('blown away by the apparent XML syntax, HTML5');
			Lab.expect(document.firstChild.nodeValue).to.equal(document.firstChild.data);

			//  replace 'XML' with 'XHTML'
			document.firstChild.replaceData(27, 3, 'XHTML');
			Lab.expect(document.firstChild.nodeValue).to.equal('blown away by the apparent XHTML syntax, HTML5');
			Lab.expect(document.firstChild.nodeValue).to.equal(document.firstChild.data);

			//  obtain the first 10 characters
			Lab.expect(document.firstChild.substringData(0, 10)).to.equal('blown away');
			Lab.expect(document.firstChild.nodeValue).to.equal(document.firstChild.data);

			//  obtain the last 10 characters starting 5 chars from the end.
			length = document.firstChild.nodeValue.length;
			Lab.expect(document.firstChild.substringData(length - 5, 10)).to.equal('HTML5');

			//  test the data property
			Lab.expect(document.firstChild.nodeValue).to.equal(document.firstChild.data);

			done();
		});

	});


	lab.test('Multiple Documents', function(done){
		var docs = [];

		function test()
		{
			var a = docs.pop(),
				b = docs.pop(),
				tmp = a.createElement('imported'),
				child;

			while (b.documentElement.firstChild)
			{
				child = b.documentElement.firstChild;
				//  verify the child node to be part of document B and in B's documentElement
				Lab.expect(child.ownerDocument).to.equal(b);
				Lab.expect(child.parentNode).to.equal(b.documentElement);

				//  we expect the child itself not to be changed (e.g. not a copy, but a true move)
				Lab.expect(a.adoptNode(child)).to.equal(child);
				//  it should no longer be 'connected' to a parent
				Lab.expect(child.parentNode).to.equal(null);

				//  verify the child node to be part of document A
				Lab.expect(child.ownerDocument).to.equal(tmp.ownerDocument);
				tmp.appendChild(child);
				Lab.expect(child.parentNode).to.equal(tmp);

			}

			//  create a new node, which has no parent and no children, in order to test all flows of adoptNode
			child = b.createElement('adopt');
			Lab.expect(child.ownerDocument).to.equal(b);
			Lab.expect(child.parentNode).to.equal(null);
			Lab.expect(child.firstChild).to.equal(null);
			Lab.expect(a.adoptNode(child)).to.equal(child);
			Lab.expect(child.ownerDocument).to.equal(a);

			//  import the child from (now) A into B, a shallow import
			tmp = b.importNode(a.documentElement);
			Lab.expect(tmp.ownerDocument).to.equal(b);
			Lab.expect(tmp.childNodes.length).to.equal(0);
			Lab.expect(tmp.firstChild).to.equal(null);
			Lab.expect(b.documentElement.appendChild(tmp)).to.equal(tmp);
			Lab.expect(tmp.parentNode).to.equal(b.documentElement);

			//  import the child from (now) A into B, a deep import
			tmp = b.importNode(a.documentElement, true);
			Lab.expect(tmp.ownerDocument).to.equal(b);
			Lab.expect(tmp.childNodes.length).to.equal(7);
			Lab.expect(tmp.firstChild).not.to.equal(null);
			Lab.expect(tmp.firstChild.nodeType).to.equal(3);
			Lab.expect(b.documentElement.appendChild(tmp)).to.equal(tmp);
			Lab.expect(tmp.parentNode).to.equal(b.documentElement);

			done();
		}

		new DOMDocument().load(__dirname + '/files/basic.xml', function(error, document){
			docs.push(document);
			if (docs.length === 2)
				test();
		});

		new DOMDocument().load(__dirname + '/files/basic.xml', function(error, document){
			docs.push(document);
			if (docs.length === 2)
				test();
		});
	});

	lab.test('getElementById', function(done){
		new DOMDocument().loadXML('<root><item id="one">one</item><nest><nested id="one">one</nested></nest></root>', function(error, document){

			//  the id 'one' occurs more than once in the document, it should return nothing at all (not even null)
			Lab.expect(document.getElementById('one')).to.equal(undefined);
			//  the id 'two' does not exist, it should return null
			Lab.expect(document.getElementById('two')).to.equal(null);

			done();
		});
	});

	lab.test('normalizeDocument', function(done){
		new DOMDocument().loadXML('<root>one<middle id="remove" />two</root>', function(error, document){
			var remove = document.getElementById('remove');

			Lab.expect(remove.parentNode.removeChild(remove)).to.equal(remove);
			Lab.expect(new XMLSerializer().serializeToString(document)).to.equal('<root>onetwo</root>');
			//  we expect two textnodes to be the remaining children
			Lab.expect(document.documentElement.childNodes.length).to.equal(2);
			//  highlander!
			document.normalizeDocument();
			//  now, there can be only one.
			Lab.expect(document.documentElement.childNodes.length).to.equal(1);

			done();
		});
	});

	lab.test('getElementsByTagName', function(done){
		new DOMDocument().loadXML('<root><one /><two><one /></two></root>', function(error, document){
			var two = document.getElementsByTagName('two');

			Lab.expect(two.length).to.equal(1);
			Lab.expect(document.getElementsByTagName('one').length).to.equal(2);
			Lab.expect(two[0].getElementsByTagName('one').length).to.equal(1);

			done();
		});
	});


});
