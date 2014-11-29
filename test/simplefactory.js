var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	factory = require('./../lib/simple/factory.js');


lab.experiment('SimpleFactory', function(){

	lab.test('instance (jit)', function(done){

		Code.expect(function(){
			factory.instance({});
		}).to.throw('NOT_SUPPORTED_ERR');

		done();
	});

	lab.experiment('Simple creation', function(){

		lab.test('Element', function(done){

			var simple = factory.create(1, 'node', {param:'foo'});

			Code.expect(simple.type).to.equal(1);
			Code.expect(simple.name).to.equal('node');
			//  attributes
			Code.expect(simple.data[0].type).to.equal(2);
			Code.expect(simple.data[0].name).to.equal('param');
			Code.expect(simple.data[0].data).to.equal('foo');

			Code.expect(simple.index(simple)).to.equal(false);

			done();
		});

		lab.test('CData', function(done){

			var simple = factory.create(4, '#cdata-section', 'foo');

			Code.expect(simple.type).to.equal(4);
			Code.expect(simple.name).to.equal('#cdata-section');
			Code.expect(simple.data).to.equal('foo');

			simple.append(factory.create(4, '#void', 'bar'));

			Code.expect(simple.data).to.equal('foobar');

			done();
		});

		lab.test('Document', function(done){

			var simple = factory.create(9, '#document', 'uri');

			Code.expect(simple.type).to.equal(9);
			Code.expect(simple.name).to.equal('#document');
			Code.expect(simple.data).to.equal('uri');
			Code.expect(simple.prop.uri).to.equal('uri');

			done();
		});

		lab.test('Normalization', function(done){

			var simple = factory.create(1, 'node');

			simple.append(factory.create(3, '#text', 'foo'));
			simple.append(factory.create(3, '#text', 'bar'));
			simple.append(factory.create(3, '#text', ''));
			simple.append(factory.create(3, '#text', 'baz'));

			Code.expect(simple.child.length).to.equal(4);
			simple.normalize();
			Code.expect(simple.child.length).to.equal(1);
			Code.expect(simple.child[0].data).to.equal('foobarbaz');

			done();
		});

		lab.test('Serialization', function(done){

			var simple = factory.create(1, 'node');

			simple.append(factory.create(3, '#text', 'foo'));
			simple.append(factory.create(8, '#comment', 'baz'));
			simple.append(factory.create(3, '#text', 'bar'));

			Code.expect(simple.serialize()).to.equal('<node>foobar</node>');
			Code.expect(simple.serialize({
				preserveComment: true
			})).to.equal('<node>foo<!--baz-->bar</node>');

			simple.append(factory.create(3, '#text', '<'));
			Code.expect(simple.serialize({
				preserveComment: true
			})).to.equal('<node>foo<!--baz-->bar&lt;</node>');


			simple = factory.create(1, 'pre', {special:'é'});

			Code.expect(simple.serialize({})).to.equal('<pre special="é"/>');
			Code.expect(simple.serialize({format:'html'})).to.equal('<pre special=é></pre>');

			done();
		});

	});

});
