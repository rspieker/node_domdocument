var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	factory = require('./../lib/simple/factory.js');


lab.experiment('SimpleFactory', function(){

	lab.test('instance (jit)', function(done){

		Lab.expect(function(){
			factory.instance({});
		}).to.throw('NOT_SUPPORTED_ERR');

		done();
	});

	lab.experiment('Simple creation', function(){

		lab.test('Element', function(done){

			var simple = factory.create(1, 'node', {param:'foo'});

			Lab.expect(simple.type).to.equal(1);
			Lab.expect(simple.name).to.equal('node');
			//  attributes
			Lab.expect(simple.data[0].type).to.equal(2);
			Lab.expect(simple.data[0].name).to.equal('param');
			Lab.expect(simple.data[0].data).to.equal('foo');

			Lab.expect(simple.index(simple)).to.equal(false);

			done();
		});

		lab.test('CData', function(done){

			var simple = factory.create(4, '#cdata-section', 'foo');

			Lab.expect(simple.type).to.equal(4);
			Lab.expect(simple.name).to.equal('#cdata-section');
			Lab.expect(simple.data).to.equal('foo');

			simple.append(factory.create(4, '#void', 'bar'));

			Lab.expect(simple.data).to.equal('foobar');

			done();
		});

		lab.test('Document', function(done){

			var simple = factory.create(9, '#document', 'uri');

			Lab.expect(simple.type).to.equal(9);
			Lab.expect(simple.name).to.equal('#document');
			Lab.expect(simple.data).to.equal('uri');
			Lab.expect(simple.prop.uri).to.equal('uri');

			done();
		});

		lab.test('Normalization', function(done){

			var simple = factory.create(1, 'node');

			simple.append(factory.create(3, '#text', 'foo'));
			simple.append(factory.create(3, '#text', 'bar'));
			simple.append(factory.create(3, '#text', ''));
			simple.append(factory.create(3, '#text', 'baz'));

			Lab.expect(simple.child.length).to.equal(4);
			simple.normalize();
			Lab.expect(simple.child.length).to.equal(1);
			Lab.expect(simple.child[0].data).to.equal('foobarbaz');

			done();
		});

		lab.test('Serialization', function(done){

			var simple = factory.create(1, 'node');

			simple.append(factory.create(3, '#text', 'foo'));
			simple.append(factory.create(8, '#comment', 'baz'));
			simple.append(factory.create(3, '#text', 'bar'));

			Lab.expect(simple.serialize()).to.equal('<node>foobar</node>');
			Lab.expect(simple.serialize({
				preserveComment: true
			})).to.equal('<node>foo<!--baz-->bar</node>');

			simple.append(factory.create(3, '#text', '<'));
			Lab.expect(simple.serialize({
				preserveComment: true
			})).to.equal('<node>foo<!--baz-->bar&lt;</node>');


			simple = factory.create(1, 'pre', {special:'é'});

			Lab.expect(simple.serialize({})).to.equal('<pre special="é"></pre>');

			done();
		});

	});

});
