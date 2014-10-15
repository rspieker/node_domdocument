var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOM = require('./../lib/dom.js'),
	SAXParser = require('./../lib/sax.js');


function stream(file, done, encoding)
{
	new SAXParser().stream(__dirname + '/files/' + file, done, encoding);
}
function parse(data, done, encoding)
{
	new SAXParser().parse(data, done, encoding);
}

lab.experiment('SAX Parser', function(){

	lab.experiment('file streams', function(){

		lab.test('single comment', function(done){
			stream('comment.xml', function(error, document){

				Lab.expect(error).to.equal(null);
				Lab.expect(document.documentElement).to.equal(null);
				Lab.expect(document.firstChild.nodeType).to.equal(document.COMMENT_NODE);
				Lab.expect(document.firstChild.nodeType).to.equal(8);

				done();
			});
		});

		lab.test('larger file', function(done){

			stream('random.xml', function(error, document){

				Lab.expect(error).to.equal(null);
				Lab.expect(document.documentElement).not.to.equal(null);
				Lab.expect(document.documentElement.childNodes.length).to.be.at.least(1);

				done();
			}, 'utf-8');

		});

		lab.test('invalid characters', function(done){

			stream('error.xml', function(error, document){

				Lab.expect(error).to.be.an.instanceof(Error);
				Lab.expect(error).to.match(/invalid token/i);

				done();
			});

		});

	});

	lab.experiment('parse direct input', function(){

		lab.test('single comment', function(done){
			parse('<!--comment-->', function(error, document){

				Lab.expect(error).to.equal(null);
				Lab.expect(document.documentElement).to.equal(null);
				Lab.expect(document.firstChild.nodeType).to.equal(document.COMMENT_NODE);
				Lab.expect(document.firstChild.nodeType).to.equal(8);
				Lab.expect(document.firstChild.nodeValue).to.equal('comment');

				done();
			});
		});

		lab.test('single CDataSection', function(done){
			parse('<root><![CDATA[data]]></root>', function(error, document){

				Lab.expect(error).to.equal(null);
				Lab.expect(document.documentElement).not.to.equal(null);
				Lab.expect(document.documentElement.firstChild.nodeType).to.equal(document.CDATA_SECTION_NODE);
				Lab.expect(document.documentElement.firstChild.nodeType).to.equal(4);
				Lab.expect(document.documentElement.firstChild.nodeValue).to.equal('data');

				done();
			});
		});

		lab.test('invalid characters', function(done){

			parse('<&nope />', function(error, document){

				Lab.expect(error).to.be.an.instanceof(Error);
				Lab.expect(error).to.match(/invalid token/i);

				done();
			});

		});

	});

});
