'use strict';

describe('Extend', function () {

	it('should only accept a minimum of two object or function parameters', function () {
		var obj = {},
			fn = function () {};
		
		function bindExtend () {
			var args = arguments;
	
			return function () {
				wn.extend.apply(wn, args);
			}
		}
		
		expect(bindExtend()).toThrow();
		expect(bindExtend(obj)).toThrow();
		expect(bindExtend(fn)).toThrow();

		expect(bindExtend(obj, obj)).not.toThrow();
		expect(bindExtend(obj, fn)).not.toThrow();
		expect(bindExtend(fn, obj)).not.toThrow();
		expect(bindExtend(fn, fn)).not.toThrow();
		
		expect(bindExtend('string', obj)).toThrow();
		expect(bindExtend(1, obj)).toThrow();
		expect(bindExtend(true, obj)).toThrow();
		expect(bindExtend(null, obj)).toThrow();

		expect(bindExtend(obj, 'string')).toThrow();
		expect(bindExtend(obj, 1)).toThrow();
		expect(bindExtend(obj, true)).toThrow();
		expect(bindExtend(obj, null)).toThrow();
	});
	
	it('should return the augmented child object', function () {
		var p = {},
			c = {};
			
		expect(wn.extend(c, p)).toBe(c);
	});

	it('by default should perform shallow extension', function () {
		var p = { object: {} },
			c = {};
			
		wn.extend(c, p);
		
		expect(c.object).toBe(p.object);
	});
	
	it('should overwrite matching properties (in shallow)', function () {
		var p = { object: { name: 'parent' }, another: 'string' },
			c = { object: { age: 12 }, another : {} };
		
		wn.extend(c, p);
		
		expect(c.object).toBe(p.object);
		expect(c.another).toBe('string');
	});
	
	it('should be able to perform deep extension', function () {
		var p = { object: { deep: { name: 'deep object'} } },
			c = {};
			
		wn.extend(c, p, true);
		
		expect(c.object).not.toBe(p.object);
		expect(c.object).toEqual(p.object);
		expect(c.object.deep).not.toBe(p.object.deep);
		expect(c.object.deep).toEqual(p.object.deep);
	});
	
	it('by default should extend an object with an object (in deep)', function () {
		var p = { object: { name: 'parent', deep: { street: 'High'} } },
			c = { object: { age: 12, deep: { town: 'London' } } };
		
		wn.extend(c, p, true);
		
		expect(c.object).not.toBe(p.object);
		expect(c.object.age).toBe(12);
		expect(c.object.name).toBe('parent');
		expect(c.object.deep).not.toBe(p.object.deep);
		expect(c.object.deep.town).toBe('London');
		expect(c.object.deep.street).toBe('High');
	});
	
	it('by default should extend a function with an object (in deep)', function () {
		var p = { prop: { age: 12 } },
			c = { prop: function () {} };
		
		c.prop.town = 'London';
		wn.extend(c, p, true);
		
		expect(typeof c.prop).toBe('function');
		expect(c.prop.town).toBe('London');
		expect(c.prop.age).toBe(12);
	});
	
	it('by default should extend a function with a function (in deep)', function () {
		var fnP = function () {},
			fnC = function () {},
			p = { fn: fnP },
			c = { fn: fnC };
		
		fnP.prop = 'parent';
		fnC.another = 'child';
		
		wn.extend(c, p, true);
		
		expect(c.fn).toBe(fnC);
		expect(c.fn.prop).toBe('parent');
		expect(c.fn.another).toBe('child');
	});
	
	it('by default should extend an object with a function (in deep)', function () {
		var	p = { prop: function () {} },
			c = { prop: { age: 12 } };
		
		p.prop.town = 'London';
		wn.extend(c, p, true);
		
		expect(typeof c.prop).toBe('object');
		expect(c.prop).not.toBe(p.prop);
		expect(c.prop.town).toBe('London');
		expect(c.prop.age).toBe(12);
	});
	
	it('should clone a function preserving its functionality (in deep)', function () {
		var p = {
				fn: function (s) {
					this.value = s;
					return s;
				}
			},
			c = {};
		
		p.fn.prop = { town: 'London' };	
		wn.extend(c, p, true);
		
		expect(typeof c.fn).toBe('function');
		expect(c.fn).not.toBe(p.fn);
		expect(c.fn.prop).not.toBe(p.fn.prop);
		expect(c.fn.prop).toEqual(p.fn.prop);
		expect(c.fn('hello')).toBe('hello');
		expect(c.value).toBe('hello');
	});
	
	it('should clone always the same base function (in deep)', function () {
		var p = {
				fn: function (s) {
					this.value = s;
				}
			},
			c = {},
			g = {};
			
		wn.extend(c, p, true);
		wn.extend(g, c, true);
		
		expect(typeof g.fn).toBe('function');
		expect(g.fn.__wnCloneOf).toBe(p.fn);

		g.fn('hello');
		expect(g.value).toBe('hello');
		expect(c.value).toBeUndefined();
		expect(p.value).toBeUndefined();
	});
	
	it('should clone an object with its respective prototype (in deep)', function () {
		var O = function () {},
			p = { array: [1, 'a', true], object: new O() },
			c = {};
		
		wn.extend(c, p, true);
		
		expect(c.array).not.toBe(p.array);
		expect(c.array).toEqual(p.array);
		expect(c.array instanceof Array).toBeTruthy();
		
		expect(c.object).not.toBe(p.object);
		expect(c.object).toEqual(p.object);
		expect(c.object instanceof O).toBeTruthy();
	});
	
	it('should overwrite an object or a function with a primitive (in deep)', function () {
		var p = {becomeString: 'string', becomeNull: null, becomeUndefined: undefined, becomeBoolean: true},
			c,
			fn = function () {};
			
		c = {becomeString: {}, becomeNull: {}, becomeUndefined: {}, becomeBoolean: {} };
		wn.extend(c, p);
		
		expect(c.becomeString).toBe('string');
		expect(c.becomeNull).toBe(null);
		expect(c.becomeUndefined).toBeUndefined();
		expect(c.becomeBoolean).toBe(true);

		c = {becomeString: fn, becomeNull: fn, becomeUndefined: fn, becomeBoolean: fn };
		wn.extend(c, p);
		
		expect(c.becomeString).toBe('string');
		expect(c.becomeNull).toBe(null);
		expect(c.becomeUndefined).toBeUndefined();
		expect(c.becomeBoolean).toBe(true);
	});
	
	it('should be able to overwrite an object or a function instead of extending (in deep)', function () {
		var fn = function () { return 'child'; },
			p = { object: { parentOnly: true }, fn: function (s) { return s; } },
			c = { object: { childOnly: true}, fn: fn };
		
		fn.prop = 'hello';
		wn.extend(c, p, true, true);
		
		expect(c.object).not.toBe(p.object);
		expect(c.object).toEqual(p.object);
		
		expect(c.fn).not.toBe(p.fn);
		expect(c.fn('parent')).toBe('parent');
		expect(c.fn.prop).toBeUndefined();
	});
});
