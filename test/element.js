var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	Element = require('./../lib/dom/element.js');


lab.experiment('Element', function(){

	lab.test('Direct creation', function(done){
		var element = new Element('nope');

		Code.expect(element.nodeType).to.equal(null);
		Code.expect(element.nodeName).to.equal(null);

		Code.expect(element.parentNode).to.equal(null);
		Code.expect(element.ownerDocument).to.equal(null);

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

			Code.expect(document.lastChild.nodeName).to.equal('#text');
			Code.expect(document.lastChild.previousSibling.nodeName).to.equal('html');

			Code.expect(strong.length).to.equal(1);
			Code.expect(strong[0].nodeName).to.equal('strong');
			Code.expect(strong[0].localName).to.equal('strong');
			Code.expect(strong[0] + '').to.equal('[object DOMStrongNode]');
			Code.expect(strong[0].prefix).to.equal(null);
			Code.expect(strong[0].firstChild).to.equal(strong[0].lastChild);
			Code.expect(strong.item(0)).to.equal(strong[0]);
			Code.expect(strong.item(100)).to.equal(null);

			body = strong[0].parentNode;
			bcn  = body.childNodes;
			Code.expect(body.nodeName).to.equal('body');
			Code.expect(body.prefix).to.equal(null);
			Code.expect(body.localName).to.equal('body');
			Code.expect(typeof body.baseURI).to.equal('string');
			Code.expect(body.baseURI).to.match(/\w+\/\w+/);

			Code.expect(document.getElementById('findme')).to.equal(strong[0]);

			//  childNodes should be a 'live' NodeList instance, which means it will adapt to changes
			Code.expect(bcn.length).to.equal(5);
			Code.expect(body.childNodes.length).to.equal(5);

			//  insert a last, insert b before it
			//  <body>....<b/><a/>
			Code.expect(body.appendChild(a)).to.equal(a);
			Code.expect(body.insertBefore(b, a)).to.equal(b);
			Code.expect(bcn.length).to.equal(7);
			Code.expect(body.childNodes.length).to.equal(7);

			Code.expect(a.parentNode).to.equal(body);
			Code.expect(b.parentNode).to.equal(body);
			Code.expect(a.previousSibling).to.equal(b);
			c = b.previousSibling;
			Code.expect(b.nextSibling).to.equal(a);
			Code.expect(a.nextSibling).to.equal(null);

			//  move a before b
			//  <body>....<a/><b/>
			Code.expect(body.insertBefore(a, b)).to.equal(a);
			Code.expect(a.parentNode).to.equal(body);
			Code.expect(b.parentNode).to.equal(body);
			Code.expect(a.previousSibling).to.equal(c);
			Code.expect(b.previousSibling).to.equal(a);
			Code.expect(a.nextSibling).to.equal(b);
			Code.expect(b.nextSibling).to.equal(null);

			Code.expect(body.removeChild(a)).to.equal(a);
			Code.expect(body.childNodes.length).to.equal(6);

			Code.expect(body.removeChild(b)).to.equal(b);
			Code.expect(body.childNodes.length).to.equal(5);

			Code.expect(body.removeChild(c)).to.equal(c);
			Code.expect(body.childNodes.length).to.equal(4);

			Code.expect(body.firstChild.previousSibling).to.equal(null);
			Code.expect(body.lastChild.nextSibling).to.equal(null);

			while (body.lastChild)
			{
				c = body.lastChild;
				Code.expect(body.removeChild(c)).to.equal(c);
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

			Code.expect(document.textContent).to.equal(null);

			//  initialization tests
			Code.expect(root.nodeName).to.equal('root');
			Code.expect(root.textContent).to.equal(content);

			//  add nodes with content
			for (i = 0; i < 10; ++i)
			{
				root.appendChild(document.createElement('added')).appendChild(document.createTextNode('Added #' + i));
				content += 'Added #' + i;
			}
			Code.expect(root.textContent).to.equal(content);
			Code.expect(root.childNodes.length).to.equal(children + 10);

			content = 'empty';
			root.textContent = content;
			Code.expect(root.textContent).to.equal(content);
			Code.expect(root.childNodes.length).to.equal(1);

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
			Code.expect(root.textContent).to.equal(content);
			Code.expect(root.childNodes.length).to.equal(10);

			for (i = 0; i < root.childNodes.length; ++i)
				Code.expect(root.childNodes[i].wholeText).to.equal(content);

			root.childNodes[4].replaceWholeText('trololo');
			Code.expect(root.childNodes.length).to.equal(1);
			Code.expect(root.textContent).to.equal('trololo');

			done();
		});

		new DOMDocument().loadXML('<root><first />one<middle/>two<middle/>three<last /></root>', function(error, document){
			var middle = document.getElementsByTagName('middle'),
				i;

			for (i = 0; i < middle.length; ++i)
				middle[i].parentNode.removeChild(middle[i]);

			Code.expect(document.documentElement.childNodes.length).to.equal(5);
			document.documentElement.childNodes[1].replaceWholeText('trololo');
			Code.expect(document.documentElement.childNodes.length).to.equal(3);
			Code.expect(document.documentElement.textContent).to.equal('trololo');
		});
	});

	lab.test('splitText', function(done){
		new DOMDocument().loadXML('<root>This is a text</root>', function(error, document){

			var root = document.documentElement,
				text = root.firstChild,
				remain;

			Code.expect(root.childNodes.length).to.equal(1);
			Code.expect(text.nodeType).to.equal(3);
			Code.expect(text.nodeValue).to.equal('This is a text');

			remain = text.splitText(6);
			Code.expect(text.nodeValue.length).to.equal(6);
			Code.expect(text.nextSibling).to.equal(remain);
			Code.expect(root.childNodes.length).to.equal(2);

			Code.expect(text.nodeValue).to.equal('This i');
			Code.expect(remain.nodeValue).to.equal('s a text');

			done();
		});
	});

});
