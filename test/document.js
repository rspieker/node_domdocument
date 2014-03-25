var assert = require('assert'),
	DOMDocument = require('./../lib/dom.js');


suite('DOM', function(){

	test('Document', function(done){
		var dom = new DOMDocument(),
			time = process.hrtime(),
			length;

		dom.load(__dirname + '/test.xml', function(error, document){
			console.log(process.hrtime(time)[0] / 1e6);

			assert.equal(document.nodeType, 9);
			assert.equal(document.nodeName, '#document');

			assert.equal(document.childNodes.length, 2);
			console.log(document.childNodes[1], '' + document.childNodes[1]);

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

	test('Attribute', function(done){
		var dom = new DOMDocument(),
			time = process.hrtime();

		dom.load(__dirname + '/test.xml', function(error, document){
			var lang;

			console.log(process.hrtime(time)[0] / 1e6);

			//  lookups
			assert.equal(document.documentElement.attributes.length, 1);
			assert.equal(document.documentElement.attributes.item(0).name, 'lang');
			assert.equal(document.documentElement.attributes.item(0).value, 'en');
			assert.equal(document.documentElement.getAttribute('lang'), 'en');
			lang = document.documentElement.attributes.item(0);

			//  removal
			assert.equal(document.documentElement.attributes.removeNamedItem('lang') === lang, true);
			//  removing it again would result in null as it no longer exists
			assert.equal(document.documentElement.attributes.removeNamedItem('lang') === lang, false);


			done();
		});
	});
});
