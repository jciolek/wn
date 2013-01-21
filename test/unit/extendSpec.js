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
	
	it('by default should extend objects with objects (in deep)', function () {
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
	
	it('by default should extend functions with objects (in deep)', function () {
		var p = { prop: { age: 12 } },
			c = { prop: function () {} };
		
		c.prop.town = 'London';
		wn.extend(c, p, true);
		
		expect(typeof c.prop).toBe('function');
		expect(c.prop.town).toBe('London');
		expect(c.prop.age).toBe(12);
	});
	
	it('should overwrite objects with functions (in deep)', function () {
		var fn = function () {},
			p = { prop: fn },
			c = { prop: {} };
		
		wn.extend(c, p, true);
		
		expect(c.fn).toBe(p.fn);
	});

	it('should clone object with their respective prototype (in deep)', function () {
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
	
	it('should overwrite objects with primitives (in deep)', function () {
		var p = {becomeString: 'string', becomeNull: null, becomeUndefined: undefined, becomeBoolean: true},
			c;
			
		c = {becomeString: {}, becomeNull: {}, becomeUndefined: {}, becomeBoolean: {} };
		wn.extend(c, p);
		
		expect(c.becomeString).toBe('string');
		expect(c.becomeNull).toBe(null);
		expect(c.becomeUndefined).toBeUndefined();
		expect(c.becomeBoolean).toBe(true);
	});
	
	it('should be able to overwrite objects with cloned objects', function () {
		var p = { object: { name: 'parent', parentOnly: true }, },
			c = { object: { name: 'child', childOnly: true} };
			
		wn.extend(c, p, true, true);
		
		expect(c.object).not.toBe(p.object);
		expect(c.object).toEqual(p.object);
	});
});
