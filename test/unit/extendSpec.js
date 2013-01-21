'use strict';

describe('Extend', function () {

	function bindExtend () {
		var args = arguments;

		return function () {
			wn.extend.apply(wn, args);
		}
	}
	
	it('should only accept a minimum of two object or function parameters', function () {
		var obj = {},
			fn = function () {};
		
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

	it('by default should perform shallow extension', function () {
		var p = { object: {} },
			c = {};
			
			wn.extend(c, p);
			
			expect(c.object).toBe(p.object);
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
	
	it('should clone objects with correct prototype in deep extension', function () {
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
	}),
	
	it('should copy references to functions in deep extension', function () {
		var fn = function () {},
			p = { fn: fn },
			c = {};
		
		wn.extend(c, p, true);
		
		expect(c.fn).toBe(p.fn);
	});

	it('by default should overwrite child\'s property if the name matches', function () {
		var p = {name: 'parent', becomeNull: null, becomeUndefined: undefined},
			c = {name: ['child'], becomeNull: 'string', becomeUndefined: {}, onlyChild: 'intact'};
			
			wn.extend(c, p);
			
			expect(c.name).toBe('parent');
			expect(c.becomeNull).toBe(null);
			expect(c.becomeUndefined).toBeUndefined();
			expect(c.onlyChild).toBe('intact');
	});
});
