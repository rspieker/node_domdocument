var assert = require('assert'),
	DOMDocument = require('./../lib/dom.js');

function elapsed(time, prec)
{
	var delta = process.hrtime(time);
	prec = prec || 1e3;

	return Math.round(((delta[0] * 1e3) + (delta[1] / 1e6)) * prec) / prec;
}

suite('DOM', function(){

	test('Document', function(done){
		var dom = new DOMDocument(),
			time = process.hrtime(),
			length;

		dom.load(__dirname + '/test.xml', function(error, document){
//			console.log(elapsed(time));

			assert.equal(document.nodeType, 9);
			assert.equal(document.nodeName, '#document');

			assert.equal(document.childNodes.length, 2);

			assert.equal(document.firstChild.nodeValue, '  Don\'t get blown away by the apparent XML syntax, HTML5 allows for this  ');

			//  append '*haha*' to the firstChild (#comment)
			document.firstChild.appendData('*haha*');
			assert.equal(document.firstChild.nodeValue, '  Don\'t get blown away by the apparent XML syntax, HTML5 allows for this  *haha*');

			//  remove the first 12 characters
			document.firstChild.deleteData(0, 12);
			assert.equal(document.firstChild.nodeValue, 'blown away by the apparent XML syntax, HTML5 allows for this  *haha*');

			//  remove more characters than available
			length = document.firstChild.nodeValue.length;
			document.firstChild.deleteData(length - 24, 100);
			assert.equal(document.firstChild.nodeValue, 'blown away by the apparent XML syntax, HTML5');

			//  replace 'XML' with 'XHTML'
			document.firstChild.replaceData(27, 3, 'XHTML');
			assert.equal(document.firstChild.nodeValue, 'blown away by the apparent XHTML syntax, HTML5');

			//  obtain the first 10 characters
			assert.equal(document.firstChild.substringData(0, 10), 'blown away');

			//  obtain the last 10 characters starting 5 chars from the end.
			length = document.firstChild.nodeValue.length;
			assert.equal(document.firstChild.substringData(length - 5, 10), 'HTML5');

			//  test the data property
			assert.equal(document.firstChild.nodeValue, document.firstChild.data);

			done();
		});

	});

	test('Element', function(done){
		var dom = new DOMDocument(),
			time = process.hrtime(),
			length;

		dom.load(__dirname + '/test.xml', function(error, document){

			var strong = document.getElementsByTagName('strong');

			assert.equal(strong.length, 1);
			assert.equal(strong[0].nodeName, 'strong');
			assert.equal(strong[0].localName, 'strong');
			assert.equal(strong[0].prefix, null);

			done();
		});
	});

	test('Attribute', function(done){
		var dom = new DOMDocument(),
			time = process.hrtime(),
			lang, head, i;

		dom.load(__dirname + '/test.xml', function(error, document){
//			console.log(elapsed(time));

			//  lookups on the element.attributes property
			assert.equal(document.documentElement.attributes.length, 1);
			lang = document.documentElement.attributes.item(0);
			assert.equal(lang.name, 'lang');
			assert.equal(lang.value, 'en');
			assert.equal(lang.ownerElement.nodeName, 'html');

			//  lookups on the element itself
			assert.equal(document.documentElement.getAttribute('lang'), 'en');

			//  removal (we cannot let mocha compare the result to lang, so we do it ourselves and see it it resolves to true)
			assert.equal(document.documentElement.attributes.removeNamedItem('lang') === lang, true);
			assert.equal(document.documentElement.attributes.length, 0);

			//  removing it again would result in null as it no longer exists
			assert.equal(document.documentElement.attributes.removeNamedItem('lang'), null);

			//  manipulating
			assert.equal(document.documentElement.setAttribute('lang', 'nl'));
			assert.equal(document.documentElement.attributes.length, 1);
			assert.equal(document.documentElement.getAttribute('lang'), 'nl');

			for (i = 0; i < 10; ++i)
			{
				assert.equal(document.documentElement.setAttribute('test' + i, i));
				assert.equal(document.documentElement.attributes.length, 2 + i);
				assert.equal(document.documentElement.getAttribute('test' + i), i);
			}

			for (i = 10; i >= 0; --i)
			{
				document.documentElement.removeAttribute('test' + i);
				assert.equal(document.documentElement.attributes.length, 1 + i);
			}

			lang = document.documentElement.attributes.item(0);
			assert.equal(document.documentElement.removeAttributeNode(lang) === lang, true);
			assert.equal(document.documentElement.attributes.length, 0);


			head = document.getElementsByTagName('head');
			head[0].setAttributeNode(lang);

			done();
		});
	});

	test('textContent', function(done){
		var dom = new DOMDocument('1.0', 'utf-8'),
			time = process.hrtime();

		dom.loadXML('<root>My Text<child>My Child</child></root>', function(error, document){
			var root = document.documentElement,
				content = 'My TextMy Child',
				children = root.childNodes.length,
				i;

			//  initialization tests
			assert.equal(root.nodeName, 'root');
			assert.equal(root.textContent, content);

			//  add nodes with content
			for (i = 0; i < 10; ++i)
			{
				root.appendChild(document.createElement('added')).appendChild(document.createTextNode('Added #' + i));
				content += 'Added #' + i;
			}
			assert.equal(root.textContent, content);
			assert.equal(root.childNodes.length, children + 10);

			content = 'empty';
			root.textContent = content;
			assert.equal(root.textContent, content);
			assert.equal(root.childNodes.length, 1);

			done();
		});
	});

	test('wholeText', function(done){
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
			assert.equal(root.textContent, content);
			assert.equal(root.childNodes.length, 10);

			for (i = 0; i < root.childNodes.length; ++i)
				assert.equal(root.childNodes[i].wholeText, content);

			root.childNodes[4].replaceWholeText('trololo');
			assert.equal(root.childNodes.length, 1);
			assert.equal(root.textContent, 'trololo');

			done();
		});
	});

});
