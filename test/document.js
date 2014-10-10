var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js');


lab.experiment('Document', function(){

	lab.test('Node existence and typing', function(done){

		new DOMDocument().load(__dirname + '/test.xml', function(error, document){
			var length;

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
				child = a.adoptNode(b.documentElement.firstChild);

				Lab.expect(child.ownerDocument).to.equal(a);
				tmp.appendChild(child);
			}

			done();
		}

		new DOMDocument().load(__dirname + '/test.xml', function(error, document){
			docs.push(document);
			if (docs.length === 2)
				test();
		});

		new DOMDocument().load(__dirname + '/test.xml', function(error, document){
			docs.push(document);
			if (docs.length === 2)
				test();
		});
	});

	lab.test('Element', function(done){
		var time = process.hrtime(),
			length;

		new DOMDocument().load(__dirname + '/test.xml', function(error, document){
			var strong = document.getElementsByTagName('strong'),
				a = document.createElement('a'),
				b = document.createElement('b'),
				c, bcn, body;

			Lab.expect(strong.length).to.equal(1);
			Lab.expect(strong[0].nodeName).to.equal('strong');
			Lab.expect(strong[0].localName).to.equal('strong');
			Lab.expect(strong[0].prefix).to.equal(null);

			body = strong[0].parentNode;
			bcn  = body.childNodes;
			Lab.expect(body.nodeName).to.equal('body');

			//  childNodes should be a 'live' NodeList instance, which means it will adapt to changes
			Lab.expect(bcn.length).to.equal(8);
			Lab.expect(body.childNodes.length).to.equal(8);

			//  insert a last, insert b before it
			//  <body>....<b/><a/>
			Lab.expect(body.appendChild(a)).to.equal(a);
			Lab.expect(body.insertBefore(b, a)).to.equal(b);
			Lab.expect(bcn.length).to.equal(10);
			Lab.expect(body.childNodes.length).to.equal(10);

			Lab.expect(a.parentNode).to.equal(body);
			Lab.expect(b.parentNode).to.equal(body);
			Lab.expect(a.previousSibling).to.equal(b);
			c = b.previousSibling;
			Lab.expect(b.nextSibling).to.equal(a);
			Lab.expect(a.nextSibling).to.equal(null);

			//  move a before b
			//  <body>....<a/><b/>
			Lab.expect(body.insertBefore(a, b)).to.equal(a);
			Lab.expect(a.parentNode).to.equal(body);
			Lab.expect(b.parentNode).to.equal(body);
			Lab.expect(a.previousSibling).to.equal(c);
			Lab.expect(b.previousSibling).to.equal(a);
			Lab.expect(a.nextSibling).to.equal(b);
			Lab.expect(b.nextSibling).to.equal(null);

			Lab.expect(body.removeChild(a)).to.equal(a);
			Lab.expect(body.childNodes.length).to.equal(9);

			Lab.expect(body.removeChild(b)).to.equal(b);
			Lab.expect(body.childNodes.length).to.equal(8);

			Lab.expect(body.removeChild(c)).to.equal(c);
			Lab.expect(body.childNodes.length).to.equal(7);

			done();
		});
	});


	lab.test('Attribute', function(done){
		var time = process.hrtime(),
			lang, head, i;

		new DOMDocument().load(__dirname + '/test.xml', function(error, document){

			//  lookups on the element.attributes property
			Lab.expect(document.documentElement.attributes.length).to.equal(1);
			lang = document.documentElement.attributes.item(0);
			Lab.expect(lang.name).to.equal('lang');
			Lab.expect(lang.value).to.equal('en');
			Lab.expect(lang.ownerElement.nodeName).to.equal('html');

			//  lookups on the element itself
			Lab.expect(document.documentElement.getAttribute('lang')).to.equal('en');

			//  removal (we cannot let mocha compare the result to lang, so we do it ourselves and see it it resolves to true)
			Lab.expect(document.documentElement.attributes.removeNamedItem('lang') === lang).to.equal(true);
			Lab.expect(document.documentElement.attributes.length).to.equal(0);

			//  removing it again would result in null as it no longer exists
			Lab.expect(document.documentElement.attributes.removeNamedItem('lang')).to.equal(null);

			//  manipulating
			document.documentElement.setAttribute('lang', 'nl');
			Lab.expect(document.documentElement.attributes.length).to.equal(1);
			Lab.expect(document.documentElement.getAttribute('lang')).to.equal('nl');

			for (i = 0; i < 10; ++i)
			{
				document.documentElement.setAttribute('test' + i, i);
				Lab.expect(document.documentElement.attributes.length).to.equal(2 + i);
				Lab.expect(document.documentElement.getAttribute('test' + i)).to.equal(i);
			}

			for (i = 10; i >= 0; --i)
			{
				document.documentElement.removeAttribute('test' + i);
				Lab.expect(document.documentElement.attributes.length).to.equal(1 + i);
			}

			lang = document.documentElement.attributes.item(0);
			Lab.expect(document.documentElement.removeAttributeNode(lang) === lang).to.equal(true);
			Lab.expect(document.documentElement.attributes.length).to.equal(0);


			head = document.getElementsByTagName('head');
			head[0].setAttributeNode(lang);

			done();
		});
	});

	lab.test('textContent', function(done){
		new DOMDocument('1.0', 'utf-8').loadXML('<root>My Text<child>My Child</child></root>', function(error, document){
			var root = document.documentElement,
				content = 'My TextMy Child',
				children = root.childNodes.length,
				i;

			//  initialization tests
			Lab.expect(root.nodeName).to.equal('root');
			Lab.expect(root.textContent).to.equal(content);

			//  add nodes with content
			for (i = 0; i < 10; ++i)
			{
				root.appendChild(document.createElement('added')).appendChild(document.createTextNode('Added #' + i));
				content += 'Added #' + i;
			}
			Lab.expect(root.textContent).to.equal(content);
			Lab.expect(root.childNodes.length).to.equal(children + 10);

			content = 'empty';
			root.textContent = content;
			Lab.expect(root.textContent).to.equal(content);
			Lab.expect(root.childNodes.length).to.equal(1);

			done();
		});
	});

	lab.test('wholeText', function(done){
		var dom = new DOMDocument('1.0', 'utf-8'),
			time = process.hrtime();

		dom.loadXML('<root />', function(error, document){
			var root = document.documentElement,
				content = '',
				i;

			//  add nodes with content
			for (i = 0; i < 10; ++i)
			{
				root.appendChild(document.createTextNode('Added #' + i));
				content += 'Added #' + i;
			}
			Lab.expect(root.textContent).to.equal(content);
			Lab.expect(root.childNodes.length).to.equal(10);

			for (i = 0; i < root.childNodes.length; ++i)
				Lab.expect(root.childNodes[i].wholeText).to.equal(content);

			root.childNodes[4].replaceWholeText('trololo');
			Lab.expect(root.childNodes.length).to.equal(1);
			Lab.expect(root.textContent).to.equal('trololo');

			done();
		});
	});

});
