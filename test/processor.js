var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOM = require('./../lib/dom.js'),
	Processor = require('./../lib/processor.js');


function stream(file, done, options)
{
	new Processor().stream(__dirname + '/files/' + file, done, options);
}
function parse(data, done, options)
{
	new Processor().parse(data, done, options);
}

lab.experiment('Processor (Parser)', function(){

	lab.experiment('file streams', function(){

		lab.test('single comment', function(done){
			stream('comment.xml', function(error, document){

				Code.expect(error).to.equal(null);
				Code.expect(document.documentElement).to.equal(null);
				Code.expect(document.firstChild.nodeType).to.equal(document.COMMENT_NODE);
				Code.expect(document.firstChild.nodeType).to.equal(8);

				done();
			});
		});

		lab.test('larger file', function(done){

			stream('random.xml', function(error, document){

				Code.expect(error).to.equal(null);
				Code.expect(document.documentElement).not.to.equal(null);
				Code.expect(document.documentElement.childNodes.length).to.be.at.least(1);

				done();
			}, {xmlMode: true});

		});

		lab.test('invalid characters', function(done){

			stream('error.xml', function(error, document){

				Code.expect(error).to.be.an.instanceof(Error);
				Code.expect(error).to.match(/invalid token/i);

				done();
			});

		});

		lab.test('invalid characters - force', function(done){

			stream('error.xml', function(error, document){

				Code.expect(error).to.equal(null);

				done();
			}, {validTagNames: false});

		});

	});

	lab.experiment('parse direct input', function(){

		lab.test('single comment', function(done){
			parse('<!--comment-->', function(error, document){

				Code.expect(error).to.equal(null);
				Code.expect(document.documentElement).to.equal(null);
				Code.expect(document.firstChild.nodeType).to.equal(document.COMMENT_NODE);
				Code.expect(document.firstChild.nodeType).to.equal(8);
				Code.expect(document.firstChild.nodeValue).to.equal('comment');

				done();
			});
		});

		lab.test('single CDataSection', function(done){
			parse('<root><![CDATA[data]]></root>', function(error, document){

				Code.expect(error).to.equal(null);
				Code.expect(document.documentElement).not.to.equal(null);
				Code.expect(document.documentElement.firstChild.nodeType).to.equal(document.CDATA_SECTION_NODE);
				Code.expect(document.documentElement.firstChild.nodeType).to.equal(4);
				Code.expect(document.documentElement.firstChild.nodeValue).to.equal('data');

				done();
			});
		});

		lab.test('invalid characters', function(done){

			parse('<&nope />', function(error, document){

				Code.expect(error).to.be.an.instanceof(Error);
				Code.expect(error).to.match(/invalid token/i);

				done();
			});

		});

		lab.test('invalid characters - forced', function(done){

			parse('<&nope />', function(error, document){

				Code.expect(error).to.equal(null);

				done();
			}, {validTagNames: false});

		});

	});

});
