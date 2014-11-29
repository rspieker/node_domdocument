var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	Document = require('./../lib/dom/document.js'),
	DOMException = require('./../lib/dom/exception.js'),
	XMLSerializer = require('./../lib/xmlserializer.js');


lab.experiment('Document', function(){

	lab.test('Direct creation', function(done){
		var document = new Document();

		Code.expect(document.nodeType).to.equal(9);
		Code.expect(document.nodeName).to.equal('#document');

		Code.expect(document.documentElement).to.equal(null);

		done();
	});

	lab.test('Node existence and typing', function(done){

		new DOMDocument().load(__dirname + '/files/basic.xml', function(error, document){
			var comment, length;

			Code.expect(document.attributes).to.equal(null);
			Code.expect(document.namespaceURI).to.equal(null);

			Code.expect(document.nodeType).to.equal(9);
			Code.expect(document.nodeName).to.equal('#document');

			//  Basic traversal
			Code.expect(document.childNodes.length).to.equal(6);
			Code.expect(document.doctype).to.equal(document.firstChild);
			Code.expect(document.firstChild).to.equal(document.childNodes[0]);
			Code.expect(document.firstChild.nodeType).to.equal(10);
			Code.expect(document.firstChild.name).to.equal('html');
			Code.expect(document.firstChild.nodeName).to.equal('html');

			comment = document.firstChild.nextSibling.nextSibling;

			Code.expect(comment.nodeValue).to.equal('  Don\'t get blown away by the apparent XML syntax, HTML5 allows for this  ');
			Code.expect(comment.nodeValue).to.equal(comment.data);

			//  append '*haha*' to the firstChild (#comment)
			comment.appendData('*haha*');
			Code.expect(comment.nodeValue).to.equal('  Don\'t get blown away by the apparent XML syntax, HTML5 allows for this  *haha*');
			Code.expect(comment.nodeValue).to.equal(comment.data);

			//  remove the first 12 characters
			comment.deleteData(0, 12);
			Code.expect(comment.nodeValue).to.equal('blown away by the apparent XML syntax, HTML5 allows for this  *haha*');
			Code.expect(comment.nodeValue).to.equal(comment.data);

			//  remove more characters than available
			length = comment.nodeValue.length;
			comment.deleteData(length - 24, 100);
			Code.expect(comment.nodeValue).to.equal('blown away by the apparent XML syntax, HTML5');
			Code.expect(comment.nodeValue).to.equal(comment.data);

			//  replace 'XML' with 'XHTML'
			comment.replaceData(27, 3, 'XHTML');
			Code.expect(comment.nodeValue).to.equal('blown away by the apparent XHTML syntax, HTML5');
			Code.expect(comment.nodeValue).to.equal(comment.data);

			//  obtain the first 10 characters
			Code.expect(comment.substringData(0, 10)).to.equal('blown away');
			Code.expect(comment.nodeValue).to.equal(comment.data);

			//  obtain the last 10 characters starting 5 chars from the end.
			length = comment.nodeValue.length;
			Code.expect(comment.substringData(length - 5, 10)).to.equal('HTML5');

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
				child, length;

			while (b.documentElement.firstChild)
			{
				child = b.documentElement.firstChild;
				//  verify the child node to be part of document B and in B's documentElement
				Code.expect(child.ownerDocument).to.equal(b);
				Code.expect(child.parentNode).to.equal(b.documentElement);

				//  we expect the child itself not to be changed (e.g. not a copy, but a true move)
				Code.expect(a.adoptNode(child)).to.equal(child);
				//  it should no longer be 'connected' to a parent
				Code.expect(child.parentNode).to.equal(null);

				//  verify the child node to be part of document A
				Code.expect(child.ownerDocument).to.equal(tmp.ownerDocument);
				tmp.appendChild(child);
				Code.expect(child.parentNode).to.equal(tmp);

			}

			//  create a new node, which has no parent and no children, in order to test all flows of adoptNode
			child = b.createElement('adopt');
			Code.expect(child.ownerDocument).to.equal(b);
			Code.expect(child.parentNode).to.equal(null);
			Code.expect(child.firstChild).to.equal(null);
			Code.expect(a.adoptNode(child)).to.equal(child);
			Code.expect(child.ownerDocument).to.equal(a);

			//  import the child from (now) A into B, a shallow import
			tmp = b.importNode(a.documentElement);
			Code.expect(tmp.ownerDocument).to.equal(b);
			Code.expect(tmp.childNodes.length).to.equal(0);
			Code.expect(tmp.firstChild).to.equal(null);
			Code.expect(b.documentElement.appendChild(tmp)).to.equal(tmp);
			Code.expect(tmp.parentNode).to.equal(b.documentElement);

			//  import the child from (now) A into B, a deep import
			length = a.documentElement.childNodes.length;

			tmp = b.importNode(a.documentElement, true);
			Code.expect(tmp.ownerDocument).to.equal(b);
			Code.expect(tmp.childNodes.length).to.equal(length);
			Code.expect(tmp.firstChild).not.to.equal(null);
			Code.expect(tmp.firstChild.nodeType).to.equal(3);
			Code.expect(b.documentElement.appendChild(tmp)).to.equal(tmp);
			Code.expect(tmp.parentNode).to.equal(b.documentElement);

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
			Code.expect(document.getElementById('one')).to.equal(undefined);
			//  the id 'two' does not exist, it should return null
			Code.expect(document.getElementById('two')).to.equal(null);

			done();
		});
	});

	lab.test('normalizeDocument', function(done){
		new DOMDocument().loadXML('<root>one<middle id="remove" />two</root>', function(error, document){
			var remove = document.getElementById('remove'),
				d = remove.___simple(function(){
					return this;
				});
			Code.expect(remove.parentNode.removeChild(remove)).to.equal(remove);
			Code.expect(new XMLSerializer().serializeToString(document)).to.equal('<root>onetwo</root>');
			//  we expect two textnodes to be the remaining children
			Code.expect(document.documentElement.childNodes.length).to.equal(2);
			//  highlander!
			document.normalizeDocument();
			//  now, there can be only one.
			Code.expect(document.documentElement.childNodes.length).to.equal(1);

			done();
		});
	});

	lab.test('getElementsByTagName', function(done){
		new DOMDocument().loadXML('<root><one /><two><one /></two></root>', function(error, document){
			var two = document.getElementsByTagName('two');

			Code.expect(two.length).to.equal(1);
			Code.expect(document.getElementsByTagName('one').length).to.equal(2);
			Code.expect(two[0].getElementsByTagName('one').length).to.equal(1);

			done();
		});
	});

	lab.test('unsupported createEntityReference', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){
			Code.expect(function(){
				document.createEntityReference('amp');
			}).to.throw('NOT_SUPPORTED_ERR');

			done();
		});
	});

});
