var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js'),
	DOMException = require('./../lib/dom/exception.js');


lab.experiment('CDATASection', function(){

	lab.test('properties', function(done){
		new DOMDocument().loadXML('<root />', function(error, document){

			var body = 'This is a cdata-section',
				cdata = document.createCDATASection(body);

			//  creation
			Lab.expect(cdata.nodeType).to.equal(4);
			Lab.expect(cdata.nodeName).to.equal('#cdata-section');
			Lab.expect(cdata.nodeValue).to.equal(cdata.data);
			Lab.expect(cdata.nodeValue).to.equal(body);
			Lab.expect(cdata.parentNode).to.equal(null);
			Lab.expect(cdata.ownerDocument).to.equal(document);
			Lab.expect(cdata.length).to.equal(23);

			Lab.expect(cdata.textContent).to.equal(cdata.data);
			cdata.textContent = 'Changed';
			Lab.expect(cdata.textContent).to.equal(cdata.data);

			Lab.expect(cdata + '').to.equal('[object DOMCDATASection]');
			done();
		});
	});

	lab.experiment('Content manipulation', function(){

		lab.test('replaceData', function(done){
			new DOMDocument().loadXML('<root />', function(error, document){
				var body = 'This is a cdata-section',
					cdata = document.createCDATASection(body);

				//  manipulate contents
				cdata.replaceData(10, 0, 'successful ');
				Lab.expect(cdata.length).to.equal(34);
				Lab.expect(cdata.nodeValue).to.equal(cdata.data);
				Lab.expect(cdata.nodeValue).to.equal('This is a successful cdata-section');

				cdata.replaceData(10, 7, 'wonder');
				Lab.expect(cdata.length).to.equal(33);
				Lab.expect(cdata.nodeValue).to.equal(cdata.data);
				Lab.expect(cdata.nodeValue).to.equal('This is a wonderful cdata-section');

				//  exceeding the boundaries of manipulation
				Lab.expect(function(){
					cdata.replaceData(80, 0, 'exception..');
				}).to.throw(DOMException, 'INDEX_SIZE_ERR');

				done();
			});
		});

		lab.test('insertData', function(done){
			new DOMDocument().loadXML('<root />', function(error, document){
				var body = 'This is a successful cdata-section',
					cdata = document.createCDATASection(body);

				//  manipulate contents
				cdata.insertData(10, 'most ');
				Lab.expect(cdata.length).to.equal(39);
				Lab.expect(cdata.nodeValue).to.equal(cdata.data);
				Lab.expect(cdata.nodeValue).to.equal('This is a most successful cdata-section');

				//  exceeding the boundaries of manipulation
				Lab.expect(function(){
					cdata.insertData(-1, 'exception...');
				}).to.throw(DOMException, 'INDEX_SIZE_ERR');

				done();
			});
		});

		lab.test('deleteData', function(done){
			new DOMDocument().loadXML('<root />', function(error, document){
				var body = 'This is a most wonderful cdata-section',
					cdata = document.createCDATASection(body);

				//  manipulate contents
				cdata.deleteData(10, 15);
				Lab.expect(cdata.length).to.equal(23);
				Lab.expect(cdata.nodeValue).to.equal(cdata.data);
				Lab.expect(cdata.nodeValue).to.equal('This is a cdata-section');

				//  exceeding the boundaries of manipulation
				Lab.expect(function(){
					cdata.deleteData(-1, 100);
				}).to.throw(DOMException, 'INDEX_SIZE_ERR');

				done();
			});
		});

	});

	lab.test('attachment and removal', function(done){

		new DOMDocument().loadXML('<root />', function(error, document){
			var body = 'This is a cdata-section',
				cdata = document.createCDATASection(body);

			//  newly create cdatas do not have a parentNode, but do belong to the document
			Lab.expect(cdata.parentNode).to.equal(null);
			Lab.expect(cdata.ownerDocument).to.equal(document);

			//  appending the cdata to an element will change its parent
			Lab.expect(document.documentElement.appendChild(cdata)).to.equal(cdata);
			Lab.expect(cdata.parentNode).to.equal(document.documentElement);

			//  as does removing it from the parent
			Lab.expect(document.documentElement.removeChild(cdata)).to.equal(cdata);
			Lab.expect(cdata.parentNode).to.equal(null);

			done();
		});

	});

});
