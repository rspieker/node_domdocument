var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	Element = require('./../lib/dom/element.js');


lab.experiment('Element', function(){

	lab.test('Direct creation', function(done){
		var element = new Element('nope');

		Lab.expect(element.nodeType).to.equal(null);
		Lab.expect(element.nodeName).to.equal(null);

		Lab.expect(element.parentNode).to.equal(null);
		Lab.expect(element.ownerDocument).to.equal(null);

		done();
	});

	lab.test('Element', function(done){
		var time = process.hrtime(),
			length;

		new DOMDocument().load(__dirname + '/files/basic.xml', function(error, document){
			var strong = document.getElementsByTagName('strong'),
				a = document.createElement('a'),
				b = document.createElement('b'),
				c, bcn, body;

			Lab.expect(document.lastChild.nodeName).to.equal('html');

			Lab.expect(strong.length).to.equal(1);
			Lab.expect(strong[0].nodeName).to.equal('strong');
			Lab.expect(strong[0].localName).to.equal('strong');
			Lab.expect(strong[0] + '').to.equal('[object DOMStrongNode]');
			Lab.expect(strong[0].prefix).to.equal(null);
			Lab.expect(strong[0].firstChild).to.equal(strong[0].lastChild);
			Lab.expect(strong.item(0)).to.equal(strong[0]);
			Lab.expect(strong.item(100)).to.equal(null);

			body = strong[0].parentNode;
			bcn  = body.childNodes;
			Lab.expect(body.nodeName).to.equal('body');
			Lab.expect(body.prefix).to.equal(null);
			Lab.expect(body.localName).to.equal('body');
			Lab.expect(body.baseURI).to.be.a('string');
			Lab.expect(body.baseURI).to.match(/\w+\/\w+/);

			Lab.expect(document.getElementById('findme')).to.equal(strong[0]);

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

			Lab.expect(body.firstChild.previousSibling).to.equal(null);
			Lab.expect(body.lastChild.nextSibling).to.equal(null);

			while (body.lastChild)
			{
				c = body.lastChild;
				Lab.expect(body.removeChild(c)).to.equal(c);
			}

			done();
		});

	});

	lab.test('textContent', function(done){
		new DOMDocument('1.0', 'utf-8').loadXML('<root>My Text<child><![CDATA[My Child]]></child></root>', function(error, document){
			var root = document.documentElement,
				content = 'My TextMy Child',
				children = root.childNodes.length,
				i;

			Lab.expect(document.textContent).to.equal(null);

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

		new DOMDocument().loadXML('<root><first />one<middle/>two<middle/>three<last /></root>', function(error, document){
			var middle = document.getElementsByTagName('middle'),
				i;

			for (i = 0; i < middle.length; ++i)
				middle[i].parentNode.removeChild(middle[i]);

			Lab.expect(document.documentElement.childNodes.length).to.equal(5);
			document.documentElement.childNodes[1].replaceWholeText('trololo');
			Lab.expect(document.documentElement.childNodes.length).to.equal(3);
			Lab.expect(document.documentElement.textContent).to.equal('trololo');
		});
	});

});
