'use strict';

describe('Namespace', function () {
	var swn;
	
	beforeEach(function () {
		swn = wn.sandbox();
	});
	
	it('should return stored value, any type', function () {
		var obj = { text: 'hello' },
			fn = function () { return 'hello'; };

		swn('string', 'value');
		swn('number', 123);
		swn('boolean', true);
		swn('function',  fn);
		swn('object', obj);
		swn('null', null);
		
		expect(swn('string')).toBe('value');
		expect(swn('number')).toBe(123);
		expect(swn('boolean')).toBe(true);
		expect(swn('function')).toBe(fn);
		expect(swn('object')).toBe(obj);
		expect(swn('null')).toBe(null);
	});
	

	it('should allow to overwrite stored value', function () {
		swn('string', 'value');
		
		expect(swn('string')).toBe('value');
		
		swn('string', 'new value');
		
		expect(swn('string')).toBe('new value');
	});


	it('should create a child namespace when the parent is not defined', function () {
		swn('parent.child', 'hello');
		
		expect(swn('parent.child')).toBe('hello');
		expect(swn('parent')).toBe(undefined);
	});
	

	it('should create a child namespace when the parent is assigned a primitve', function () {
		swn('parent', 'parent');
		swn('parent.child', 'child');
		
		expect(typeof swn('parent')).toBe('string');
		expect(swn('parent')).toBe('parent');
		expect(swn('parent.child')).toBe('child');
	});
	
	
	it('should create a child namespace whithout affecting the object stored in the parent', function () {
		var parent = { name: 'parent' },
			parentRef = { name: 'parent' };

		swn('parent', parent);
		swn('parent.child', 'child');
		
		expect(swn('parent')).toBe(parent);
		expect(swn('parent')).toEqual(parentRef);
		expect(swn('parent.child')).toBe('child');
	});
	
	
	it('should provide equal access to namespaces with a leading \'.\'', function () {
		swn('.string', 'value');
		
		expect(swn('string')).toBe('value');
		expect(swn('.string')).toBe('value');
		
		swn('newString', 'newValue');
		
		expect(swn('newString')).toBe('newValue');
		expect(swn('.newString')).toBe('newValue');
	});


	it('should give access to the namespace object through the trailing dot notation', function () {
		var parentNso;
		
		swn('parent.child', 'child');
		parentNso = swn('parent.');
		
		expect(typeof parentNso).toBe('object');
		expect(parentNso.child).toBe('child');
	});


	it('should allow for assigning safely multiple child namespaces through the trailing dot notation', function () {
		var children = {
			childA: 'child A',
			childB: 'child B'
		};

		swn('parent.child', 'child');
		
		expect(swn('parent.child')).toBe('child');
		
		swn('parent.', children);
		
		expect(swn('parent.child')).toBe('child');
		expect(swn('parent.childA')).toBe('child A');
		expect(swn('parent.childB')).toBe('child B');
	});
	
	
	it('should overwrite conflicting namespaces during multiple child assignment', function () {
		var children = {
			childA: 'child A',
			childB: 'child B'
		};
		
		swn('parent.childA', 'child A old');
		
		expect(swn('parent.childA')).toBe('child A old');
		
		swn('parent.', children);;
		
		expect(swn('parent.childA')).toBe('child A');
		expect(swn('parent.childB')).toBe('child B');
	});
});
