var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DOMException = require('./../lib/dom/exception.js');


lab.experiment('Comment', function(){

	lab.test('properties', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){

			var body = 'This is a comment',
				comment = document.createComment(body);

			//  creation
			Code.expect(comment.nodeType).to.equal(8);
			Code.expect(comment.nodeName).to.equal('#comment');
			Code.expect(comment.nodeValue).to.equal(comment.data);
			Code.expect(comment.nodeValue).to.equal(body);
			Code.expect(comment.parentNode).to.equal(null);
			Code.expect(comment.ownerDocument).to.equal(document);
			Code.expect(comment.length).to.equal(17);

			Code.expect(comment.textContent).to.equal(comment.data);

			comment.textContent = 'Changed';
			Code.expect(comment.textContent).to.equal('Changed');
			Code.expect(comment.textContent).to.equal(comment.data);
			Code.expect(comment.nodeValue).to.equal(comment.data);

			comment.nodeValue = 'changed, once more';
			Code.expect(comment.textContent).to.equal('changed, once more');
			Code.expect(comment.textContent).to.equal(comment.data);
			Code.expect(comment.nodeValue).to.equal(comment.data);

			Code.expect(comment + '').to.equal('[object DOMComment]');

			done();
		});
	});

	lab.experiment('Content manipulation', function(){

		lab.test('replaceData', function(done){
			new DOMDocument().loadXML('<root />', function(error, document){
				var body = 'This is a comment',
					comment = document.createComment(body);

				//  manipulate contents
				comment.replaceData(10, 0, 'successful ');
				Code.expect(comment.length).to.equal(28);
				Code.expect(comment.nodeValue).to.equal(comment.data);
				Code.expect(comment.nodeValue).to.equal('This is a successful comment');

				comment.replaceData(10, 7, 'wonder');
				Code.expect(comment.length).to.equal(27);
				Code.expect(comment.nodeValue).to.equal(comment.data);
				Code.expect(comment.nodeValue).to.equal('This is a wonderful comment');

				//  exceeding the boundaries of manipulation
				Code.expect(function(){
					comment.replaceData(80, 0, 'exception..');
				}).to.throw(DOMException, 'INDEX_SIZE_ERR');

				done();
			});
		});

		lab.test('insertData', function(done){
			new DOMDocument().loadXML('<root />', function(error, document){
				var body = 'This is a successful comment',
					comment = document.createComment(body);

				//  manipulate contents
				comment.insertData(10, 'most ');
				Code.expect(comment.length).to.equal(33);
				Code.expect(comment.nodeValue).to.equal(comment.data);
				Code.expect(comment.nodeValue).to.equal('This is a most successful comment');

				//  exceeding the boundaries of manipulation
				Code.expect(function(){
					comment.insertData(-1, 'exception...');
				}).to.throw(DOMException, 'INDEX_SIZE_ERR');

				done();
			});
		});

		lab.test('deleteData', function(done){
			new DOMDocument().loadXML('<root />', function(error, document){
				var body = 'This is a most wonderful comment',
					comment = document.createComment(body);

				//  manipulate contents
				comment.deleteData(10, 15);
				Code.expect(comment.length).to.equal(17);
				Code.expect(comment.nodeValue).to.equal(comment.data);
				Code.expect(comment.nodeValue).to.equal('This is a comment');

				//  exceeding the boundaries of manipulation
				Code.expect(function(){
					comment.deleteData(-1, 100);
				}).to.throw(DOMException, 'INDEX_SIZE_ERR');

				done();
			});
		});

	});

	lab.test('attachment and removal', function(done){

		new DOMDocument().loadXML('<root />', function(error, document){
			var body = 'This is a comment',
				comment = document.createComment(body);

			//  newly create comments do not have a parentNode, but do belong to the document
			Code.expect(comment.parentNode).to.equal(null);
			Code.expect(comment.ownerDocument).to.equal(document);

			//  appending the comment to an element will change its parent
			Code.expect(document.documentElement.appendChild(comment)).to.equal(comment);
			Code.expect(comment.parentNode).to.equal(document.documentElement);

			//  as does removing it from the parent
			Code.expect(document.documentElement.removeChild(comment)).to.equal(comment);
			Code.expect(comment.parentNode).to.equal(null);

			done();
		});

	});

});
