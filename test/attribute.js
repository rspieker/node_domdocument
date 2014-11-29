var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js');


lab.experiment('Attributes', function(){

	lab.test('direct access', function(done){
		var lang, head, i;

		new DOMDocument().load(__dirname + '/files/basic.xml', function(error, document){

			//  lookups on the element.attributes property
			Code.expect(document.documentElement.attributes.length).to.equal(1);
			lang = document.documentElement.attributes.item(0);
			Code.expect(lang.name).to.equal('lang');
			Code.expect(lang.value).to.equal('en');
			Code.expect(lang.ownerElement.nodeName).to.equal('html');

			//  lookups on the element itself
			Code.expect(document.documentElement.getAttribute('lang')).to.equal('en');

			//  removal
			Code.expect(document.documentElement.attributes.removeNamedItem('lang')).to.equal(lang);
			Code.expect(document.documentElement.attributes.length).to.equal(0);

			//  removing it again would result in null as it no longer exists
			Code.expect(document.documentElement.attributes.removeNamedItem('lang')).to.equal(null);

			//  Access unknown attributes
			Code.expect(document.documentElement.attributes.getNamedItem('nope')).to.equal(null);
			Code.expect(document.documentElement.attributes.removeNamedItem('nope')).to.equal(null);

			//  manipulating
			document.documentElement.setAttribute('lang', 'nl');
			Code.expect(document.documentElement.attributes.length).to.equal(1);
			Code.expect(document.documentElement.getAttribute('lang')).to.equal('nl');

			//  set it again (covers a slight variation of the underlying flow)
			Code.expect(document.documentElement.hasAttribute('lang')).to.equal(true);
			document.documentElement.setAttribute('lang', 'en');
			Code.expect(document.documentElement.attributes.length).to.equal(1);
			Code.expect(document.documentElement.getAttribute('lang')).to.equal('en');

			//  remove it
			Code.expect(document.documentElement.removeAttribute('lang')).to.equal(undefined);
			Code.expect(document.documentElement.attributes.length).to.equal(0);
			Code.expect(document.documentElement.getAttribute('lang')).to.equal(null);
			Code.expect(document.documentElement.hasAttribute('lang')).to.equal(false);

			//  remove it again, no problem (+coverage)
			Code.expect(document.documentElement.removeAttribute('lang')).to.equal(undefined);
			Code.expect(document.documentElement.hasAttribute('lang')).to.equal(false);

			for (i = 0; i < 10; ++i)
			{
				document.documentElement.setAttribute('test' + i, i);
				Code.expect(document.documentElement.attributes.length).to.equal(1 + i);
				Code.expect(document.documentElement.getAttribute('test' + i)).to.equal(i);
			}

			for (i = 10; i >= 0; --i)
			{
				document.documentElement.removeAttribute('test' + i);
				Code.expect(document.documentElement.attributes.length).to.equal(i);
			}

			document.documentElement.setAttribute('lang', 'nl');
			lang = document.documentElement.attributes.item(0);
			Code.expect(document.documentElement.removeAttributeNode(lang)).to.equal(lang);
			Code.expect(document.documentElement.attributes.length).to.equal(0);

			//  remove it again, it should be null
			Code.expect(document.documentElement.removeAttributeNode(lang)).to.equal(null);
			//  access the 100th item, which we know isn't there
			Code.expect(document.documentElement.attributes.item(100)).to.equal(null);


			head = document.getElementsByTagName('head');
			head[0].setAttributeNode(lang);

			done();
		});
	});

});
