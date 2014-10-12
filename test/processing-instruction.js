var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DOMException = require('./../lib/dom/exception.js'),
	XMLSerializer = require('./../lib/xmlserializer.js');


lab.experiment('Processing Instruction', function(){

	lab.test('properties', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){

			var pi = document.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');

			//  creation
			Lab.expect(pi.nodeType).to.equal(7);
			Lab.expect(pi.nodeName).to.equal('xml-stylesheet');
			Lab.expect(pi.parentNode).to.equal(null);
			Lab.expect(pi.ownerDocument).to.equal(document);
			Lab.expect(pi + '').to.equal('[object DOMProcessingInstruction]');

			done();
		});
	});


	lab.test('attachment', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){

			var pi = document.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');

			//  attachment

			document.appendChild(pi);
			Lab.expect(new XMLSerializer().serializeToString(document)).to.equal('<root></root><?xml-stylesheet href="mycss.css" type="text/css"?>');

			document.insertBefore(pi, document.documentElement);
			Lab.expect(new XMLSerializer().serializeToString(document)).to.equal('<?xml-stylesheet href="mycss.css" type="text/css"?><root></root>');

			done();
		});
	});

/*
If target does not match the Name production an "InvalidCharacterError" exception will be thrown.

If data contains "?>" an "InvalidCharacterError" exception will be thrown.
*/

});
