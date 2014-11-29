var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DOMException = require('./../lib/dom/exception.js'),
	XMLSerializer = require('./../lib/xmlserializer.js');


lab.experiment('Processing Instruction', function(){

	lab.test('properties', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){

			var pi = document.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');

			//  creation
			Code.expect(pi.nodeType).to.equal(7);
			Code.expect(pi.nodeName).to.equal('xml-stylesheet');
			Code.expect(pi.parentNode).to.equal(null);
			Code.expect(pi.ownerDocument).to.equal(document);
			Code.expect(pi + '').to.equal('[object DOMProcessingInstruction]');

			done();
		});
	});


	lab.test('attachment', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){

			var pi = document.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');

			//  attachment

			document.appendChild(pi);
			Code.expect(new XMLSerializer().serializeToString(document)).to.equal('<root/><?xml-stylesheet href="mycss.css" type="text/css"?>');

			document.insertBefore(pi, document.documentElement);
			Code.expect(new XMLSerializer().serializeToString(document)).to.equal('<?xml-stylesheet href="mycss.css" type="text/css"?><root/>');

			done();
		});
	});

/*
If target does not match the Name production an "InvalidCharacterError" exception will be thrown.

If data contains "?>" an "InvalidCharacterError" exception will be thrown.
*/

});
