var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	helper = require('./../lib/helper.js');


lab.experiment('Helper', function(){

	lab.test('combine values', function(done){
		var complex = {
				leet: 1337,
				pi: Math.PI,
				string: 'The Quick Brown Fox Jumps Over The Lazy Dog',
				list: [1, 2, 'three', [4], {five:6}],
				nope: false,
				good: true,
				prop: {
					one: 2,
					three: 4.5,
					six: 'seven',
					eight: [9]
				}
			},
			confuse = {
				leet: 'nope',
				pi: 'Always gor for pie, the cake is a lie',
				string: false,
				list: "nope",
				nope: [4, 9],
				good: "ok",
				prop: {
					one: 1,
					three: 3,
					six: 'six',
					eight: [8]
				}
			},
			copy;
		;


		//  combine works from right to left, meaning the first argument will override anything that comes after that
		//  for everyone used to jQuery and the like, this is reversed argument order

		//  we expect it the exact same outcome when we combine our 'complex' with an empty object, regardless of direction
		Code.expect(helper.combine({}, complex)).to.deep.equal(complex);
		Code.expect(helper.combine(complex, {})).to.deep.equal(complex);

		//  here we make a copy, which starts (most right) with an object containing some of the keys of 'complex' and we
		//  expect those to be overridden
		copy = helper.combine(complex, {leet:1, pi: 0});
		Code.expect(copy).to.deep.equal(complex);

		//  now we turn it around
		copy = helper.combine({leet:1, pi: 3.14}, complex);
		Code.expect(copy).not.to.deep.equal(complex);
		//  but...
		Code.expect(copy.leet).to.equal(1);
		Code.expect(copy.pi).to.equal(3.14);
		Code.expect(copy.pi).not.to.equal(Math.PI);

		//  Step up the complexity, combining two object which use the same keys but different values
		Code.expect(helper.combine(complex, confuse)).to.deep.equal(complex);
		Code.expect(helper.combine(confuse, complex)).to.deep.equal(confuse);

		//  Combine objects and scalar types, which should fully ignore the scalar types
		Code.expect(helper.combine(true, {ok:true})).to.deep.equal({ok:true});
		Code.expect(helper.combine(1, 'two', {ok:true})).to.deep.equal({ok:true});
		Code.expect(helper.combine('two', {ok:true})).to.deep.equal({ok:true});
		Code.expect(helper.combine(true, false, 1, 'two', {ok:true})).to.deep.equal({ok:true});
		Code.expect(helper.combine(true, false, 1, {ok:true}, 'two')).to.deep.equal({ok:true});
		Code.expect(helper.combine(true, false, {ok:true}, 1, 'two')).to.deep.equal({ok:true});
		Code.expect(helper.combine(true, {ok:true}, false, 1, 'two')).to.deep.equal({ok:true});
		Code.expect(helper.combine({ok:true}, true, false, 1, 'two')).to.deep.equal({ok:true});

		//  NULL is an Object type, try to combine it with an object, it should have no effect on the object
		Code.expect(helper.combine(null, {ok:true})).to.deep.equal({ok:true});
		Code.expect(helper.combine({ok:true}, null)).to.deep.equal({ok:true});

		//  Array is an Object type, try to combine it with an object, it should result in an object, converting the array keys (indices) to object properties
		Code.expect(helper.combine({ok:true}, [1, 2, 3])).to.deep.equal({0:1, 1:2, 2:3, ok:true});
		Code.expect(helper.combine([1, 2, 3], {ok:true})).to.deep.equal({0:1, 1:2, 2:3, ok:true});

		done();
	});


	lab.test('decoration', function(done){
		var property = {
				test: 'ok',
				test2: null
			},
			deco;


		function Deco()
		{
			//  used in the decoration tests
		}
		Deco.prototype.___property = function(){
			return {
				key: {key: 'test'},
				lockedKey: {key: 'test', locked: true},
				lockedValue: {value: 'test', locked: true},
				lockedUnknown: {locked: true, key: 'do not define'},
				magic: {
					get: function(){
						return 'magical';
					}
				},
				setter: {
					set: true,
					key: 'test2'
				},
				setter2: {
					set: true
				}
			};
		};


		deco = new Deco();
		helper.decorate(deco, property);


		Code.expect(deco.key).to.equal('ok');
		Code.expect(deco.lockedKey).to.equal('ok');
		Code.expect(deco.lockedValue).to.equal('test');
		Code.expect(deco.lockedUnknown).to.equal(null);

		Code.expect(deco.magic).to.equal('magical');

		deco.setter = 'x'
		Code.expect(deco.setter).to.equal('x');

		deco.setter2 = 'y'
		Code.expect(deco.setter2).to.equal(null);

		done();
	});

});
