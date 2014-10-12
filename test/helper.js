var Lab = require('lab'),
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
		Lab.expect(helper.combine({}, complex)).to.eql(complex);
		Lab.expect(helper.combine(complex, {})).to.eql(complex);

		//  here we make a copy, which starts (most right) with an object containing some of the keys of 'complex' and we
		//  expect those to be overridden
		copy = helper.combine(complex, {leet:1, pi: 0});
		Lab.expect(copy).to.eql(complex);

		//  now we turn it around
		copy = helper.combine({leet:1, pi: 3.14}, complex);
		Lab.expect(copy).not.to.eql(complex);
		//  but...
		Lab.expect(copy.leet).to.equal(1);
		Lab.expect(copy.pi).to.equal(3.14);
		Lab.expect(copy.pi).not.to.equal(Math.PI);

		//  Step up the complexity, combining two object which use the same keys but different values
		Lab.expect(helper.combine(complex, confuse)).to.eql(complex);
		Lab.expect(helper.combine(confuse, complex)).to.eql(confuse);

		//  Combine objects and scalar types, which should fully ignore the scalar types
		Lab.expect(helper.combine(true, {ok:true})).to.eql({ok:true});
		Lab.expect(helper.combine(1, 'two', {ok:true})).to.eql({ok:true});
		Lab.expect(helper.combine('two', {ok:true})).to.eql({ok:true});
		Lab.expect(helper.combine(true, false, 1, 'two', {ok:true})).to.eql({ok:true});
		Lab.expect(helper.combine(true, false, 1, {ok:true}, 'two')).to.eql({ok:true});
		Lab.expect(helper.combine(true, false, {ok:true}, 1, 'two')).to.eql({ok:true});
		Lab.expect(helper.combine(true, {ok:true}, false, 1, 'two')).to.eql({ok:true});
		Lab.expect(helper.combine({ok:true}, true, false, 1, 'two')).to.eql({ok:true});

		//  NULL is an Object type, try to combine it with an object, it should have no effect on the object
		Lab.expect(helper.combine(null, {ok:true})).to.eql({ok:true});
		Lab.expect(helper.combine({ok:true}, null)).to.eql({ok:true});

		//  Array is an Object type, try to combine it with an object, it should result in an object, converting the array keys (indices) to object properties
		Lab.expect(helper.combine({ok:true}, [1, 2, 3])).to.eql({0:1, 1:2, 2:3, ok:true});
		Lab.expect(helper.combine([1, 2, 3], {ok:true})).to.eql({0:1, 1:2, 2:3, ok:true});

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
				magic: {},
				setter: {
					set: true,
					key: 'test2'
				},
				setter2: {
					set: true
				}
			};
		};
		Deco.prototype.___get_magic = function(){
			return 'magical';
		};


		deco = new Deco();
		helper.decorate(deco, property);


		Lab.expect(deco.key).to.equal('ok');
		Lab.expect(deco.lockedKey).to.equal('ok');
		Lab.expect(deco.lockedValue).to.equal('test');
		Lab.expect(deco.lockedUnknown).to.equal(null);

		//  removal should trigger the internal getter flow which has nothing to execute or lookup and must trigger null
		Lab.expect(deco.magic).to.equal('magical');
		deco.___get_magic = false;
		Lab.expect(deco.magic).to.equal(null);

		deco.setter = 'x'
		Lab.expect(deco.setter).to.equal('x');

		deco.setter2 = 'y'
		Lab.expect(deco.setter2).to.equal(null);

		done();
	});

});
