var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMException = require('./../lib/dom/exception.js');


lab.experiment('DOMException', function(){

	Object.keys(DOMException.prototype)
		.filter(function(key){
			return /^[A-Z_]+$/.test(key) && 'number' === typeof DOMException.prototype[key];
		})
		.forEach(function(key){

			lab.test(key, function(done){
				var code, message;

				Code.expect(function(){
					var exception = new DOMException(key);
					code = exception.code;
					message = exception.message;

					throw exception;
				}).to.throw(DOMException, key);

				Code.expect(code).to.equal(DOMException.prototype[key]);
				Code.expect(message).to.equal(key);

				done();
			});

		})
	;


	lab.test('UNDEFINED', function(done){
		var code, message;

		Code.expect(function(){
			var exception = new DOMException('UNDEFINED');
			code = exception.code;
			message = exception.message;

			throw exception;
		}).to.throw(DOMException, 'UNDEFINED');

		Code.expect(code).to.equal(null);
		Code.expect(message).to.equal('UNDEFINED');

		done();
	});

});
