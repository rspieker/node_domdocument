var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	XMLSerializer = require('./../lib/xmlserializer.js');


function serialize(document, options)
{
	return new XMLSerializer().serializeToString(document, options);
}


lab.experiment('XMLSerializer', function(){

	lab.test('Comment', function(done){
		new DOMDocument().loadXML('<!--comment-->', function(error, document){

			Code.expect(serialize(document)).to.equal('');
			Code.expect(serialize(document, {preserveComment: true})).to.equal('<!--comment-->');

			done();
		});
	});

	lab.test('CDATASection', function(done){
		new DOMDocument().loadXML('<root><![CDATA[data]]></root>', function(error, document){

			Code.expect(serialize(document)).to.equal('<root><![CDATA[data]]></root>');
			Code.expect(serialize(document, {preserveComment: true})).to.equal('<root><![CDATA[data]]></root>');

			done();
		});
	});

	lab.test('Simple document', function(done){
		new DOMDocument().loadXML('<!DOCTYPE html>\n<!--Copyright® 2014, Company - all rights reversed-->\n<html><head><!--<title>nope</title>--><title>yep</title></head></html>', function(error, document){

			Code.expect(serialize(document)).to.equal('<!DOCTYPE html>  <html><head><title>yep</title></head></html>');
			Code.expect(serialize(document, {preserveComment:true})).to.equal('<!DOCTYPE html> <!--Copyright® 2014, Company - all rights reversed--> <html><head><!--<title>nope</title>--><title>yep</title></head></html>');
			Code.expect(serialize(document, {preserveWhiteSpace:true})).to.equal('<!DOCTYPE html>\n\n<html><head><title>yep</title></head></html>');
			Code.expect(serialize(document, {preserveWhiteSpace:true, preserveComment:true})).to.equal('<!DOCTYPE html>\n<!--Copyright® 2014, Company - all rights reversed-->\n<html><head><!--<title>nope</title>--><title>yep</title></head></html>');

			done();
		});
	});

});
