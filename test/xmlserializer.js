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

	lab.experiment('docType', function(){
		lab.test('no publicId, no systemId (HTML5)', function(done){
			new DOMDocument().loadXML('<!DOCTYPE html>', function(error, document){
				Code.expect(serialize(document)).to.equal('<!DOCTYPE html>');
				Code.expect(serialize(document, {format:null})).to.equal('<!DOCTYPE html>');

				done();
			});
		});

		lab.test('publicId, systemId (HTML 4.01 Strict)', function(done){
			new DOMDocument().loadXML('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">', function(error, document){
				Code.expect(serialize(document)).to.equal('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">');
				Code.expect(serialize(document, {format:null})).to.equal('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">');

				done();
			});
		});

		lab.test('publicId, no systemId (HTML 5 - deprecated)', function(done){
			new DOMDocument().loadXML('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0//EN">', function(error, document){
				Code.expect(serialize(document)).to.equal('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0//EN">');
				Code.expect(serialize(document, {format:null})).to.equal('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0//EN">');

				done();
			});
		});

		lab.test('no publicId, systemId (HTML 5 Legacy devices)', function(done){
			new DOMDocument().loadXML('<!DOCTYPE html system "about:legacy-compat">', function(error, document){
				Code.expect(serialize(document)).to.equal('<!DOCTYPE html SYSTEM "about:legacy-compat">');
				Code.expect(serialize(document, {format:null})).to.equal('<!DOCTYPE html SYSTEM "about:legacy-compat">');

				done();
			});
		});

	});

	lab.test('Entities', function(done){
		new DOMDocument().loadXML('<ent>&</ent>', function(error, document){

			Code.expect(serialize(document)).to.equal('<ent>&amp;</ent>');
			Code.expect(serialize(document, {entity: {}})).to.equal('<ent>&#38;</ent>');
			Code.expect(serialize(document, {entity: {'&': '&awesome;'}})).to.equal('<ent>&awesome;</ent>');

			done();
		});
	});

	lab.test('Comment', function(done){
		new DOMDocument().loadXML('<!--comment-->', function(error, document){

			Code.expect(serialize(document)).to.equal('');
			Code.expect(serialize(document, {preserveComment: true})).to.equal('<!--comment-->');
			Code.expect(serialize(document, {preserveComment: function(content){
				return content === 'comment';
			}})).to.equal('<!--comment-->');

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

	lab.test('Whitespace preservation for specific element-names', function(done){
		new DOMDocument().loadXML('<div>\n\t<pre>\n\t\ttest\n\t</pre>\n</div>', function(error, document){
			Code.expect(serialize(document)).to.equal('<div> <pre>\n\t\ttest\n\t</pre> </div>');

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

	lab.test('Attribute quoting', function(done){
		new DOMDocument().loadXML('<root noquote="test" single="my \' quote" double=\'my " quote\' quoted="multiple items" alsoquoted="this=special" />', function(error, document){

			Code.expect(serialize(document)).to.equal('<root noquote="test" single="my \' quote" double=\'my " quote\' quoted="multiple items" alsoquoted="this=special"/>');
			Code.expect(serialize(document, {format:'html'})).to.equal('<root noquote=test single="my \' quote" double=\'my " quote\' quoted="multiple items" alsoquoted="this=special"></root>');

			done();
		});
	});

	lab.test('Boolean attributes and autofill', function(done){
		new DOMDocument().loadXML('<root selected="selected" empty="" disabled="" />', function(error, document){

			Code.expect(serialize(document)).to.equal('<root selected="selected"/>');
			Code.expect(serialize(document, {format:'html'})).to.equal('<root selected disabled></root>');

			Code.expect(serialize(document, {removeEmptyAttributes:false})).to.equal('<root selected="selected" empty="" disabled=""/>');
			Code.expect(serialize(document, {format:'html', removeEmptyAttributes:false})).to.equal('<root selected empty="" disabled></root>');

			done();
		});
	});

	lab.test('Self-closing, mandatory end-tags', function(done){
		new DOMDocument().loadXML('<div id="case"><script type="text/javascript" src="/path/to/file.js"></script><br /></div>', function(error, document){

			Code.expect(serialize(document)).to.equal('<div id="case"><script type="text/javascript" src="/path/to/file.js"/><br/></div>');
			Code.expect(serialize(document, {format:'html'})).to.equal('<div id=case><script type=text/javascript src=/path/to/file.js></script><br></div>');

			done();
		});
	});

});
