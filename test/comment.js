var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DOMException = require('./../lib/dom/exception.js');


lab.experiment('Comment', function(){

	lab.test('properties', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){

			var body = 'This is a comment',
				comment = document.createComment(body);

			//  creation
			Lab.expect(comment.nodeType).to.equal(8);
			Lab.expect(comment.nodeName).to.equal('#comment');
			Lab.expect(comment.nodeValue).to.equal(comment.data);
			Lab.expect(comment.nodeValue).to.equal(body);
			Lab.expect(comment.parentNode).to.equal(null);
			Lab.expect(comment.ownerDocument).to.equal(document);
			Lab.expect(comment.length).to.equal(17);

			Lab.expect(comment.textContent).to.equal(comment.data);

			comment.textContent = 'Changed';
			Lab.expect(comment.textContent).to.equal('Changed');
			Lab.expect(comment.textContent).to.equal(comment.data);
			Lab.expect(comment.nodeValue).to.equal(comment.data);

			comment.nodeValue = 'changed, once more';
			Lab.expect(comment.textContent).to.equal('changed, once more');
			Lab.expect(comment.textContent).to.equal(comment.data);
			Lab.expect(comment.nodeValue).to.equal(comment.data);

			Lab.expect(comment + '').to.equal('[object DOMComment]');

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
				Lab.expect(comment.length).to.equal(28);
				Lab.expect(comment.nodeValue).to.equal(comment.data);
				Lab.expect(comment.nodeValue).to.equal('This is a successful comment');

				comment.replaceData(10, 7, 'wonder');
				Lab.expect(comment.length).to.equal(27);
				Lab.expect(comment.nodeValue).to.equal(comment.data);
				Lab.expect(comment.nodeValue).to.equal('This is a wonderful comment');

				//  exceeding the boundaries of manipulation
				Lab.expect(function(){
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
				Lab.expect(comment.length).to.equal(33);
				Lab.expect(comment.nodeValue).to.equal(comment.data);
				Lab.expect(comment.nodeValue).to.equal('This is a most successful comment');

				//  exceeding the boundaries of manipulation
				Lab.expect(function(){
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
				Lab.expect(comment.length).to.equal(17);
				Lab.expect(comment.nodeValue).to.equal(comment.data);
				Lab.expect(comment.nodeValue).to.equal('This is a comment');

				//  exceeding the boundaries of manipulation
				Lab.expect(function(){
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
			Lab.expect(comment.parentNode).to.equal(null);
			Lab.expect(comment.ownerDocument).to.equal(document);

			//  appending the comment to an element will change its parent
			Lab.expect(document.documentElement.appendChild(comment)).to.equal(comment);
			Lab.expect(comment.parentNode).to.equal(document.documentElement);

			//  as does removing it from the parent
			Lab.expect(document.documentElement.removeChild(comment)).to.equal(comment);
			Lab.expect(comment.parentNode).to.equal(null);

			done();
		});

	});

});
