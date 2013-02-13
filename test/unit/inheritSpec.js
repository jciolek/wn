'use strict';

describe('Inherit', function () {
	var swn,
		A,
		B,
		C;
	
	beforeEach(function () {
		swn = wn.sandbox();
		A = function () {};
		B = function () {};
		C = function () {};
		
		A.prototype.fnA = function () {
			return 'A';
		};
		
		B.prototype.fnB = function () {
			return 'B';
		};
		
		C.prototype.fnC = function () {
			return 'C';
		};
	});


	it('should preserve the inheritance chain', function () {
		var	a, b, c;
		
		swn.inherit(B, A);
		swn.inherit(C, B);
		a = new A();
		b = new B();
		c = new C();
		
		expect(a instanceof A).toBeTruthy();
		
		expect(b instanceof B).toBeTruthy();
		expect(b instanceof A).toBeTruthy();
		expect(b.fnA()).toBe('A');
		
		expect(c instanceof C).toBeTruthy();
		expect(c instanceof B).toBeTruthy();
		expect(c instanceof A).toBeTruthy();
		expect(c.fnB()).toBe('B');
		expect(c.fnA()).toBe('A');
	});


	it('should allow children to override parent\'s properties', function () {
		var b, c;
		
		B.prototype.fnA = function () {
			return 'B';
		};
		swn.inherit(B, A);
		swn.inherit(C, B);
		b = new B();
		c = new C();
		
		expect(b.fnA()).toBe('B');
		expect(c.fnA()).toBe('B');		
	});
	

	it('should provide access to parent\'s prototype through the instance property \'parent\'', function () {
		var b;
		
		swn.inherit(B, A);
		b = new B();
		
		expect(b.parent).toBe(A.prototype);
	});


	it('should provide access to parent\'s constructor through the static property \'parent\'', function () {
		swn.inherit(B, A);
		
		expect(B.parent).toBe(A);
	});
	

	it('should give same results when called before or after changing child\'s prototype', function () {
		var b;
		
		B.prototype.stringBefore = 'before';
		swn.inherit(B, A);
		B.prototype.stringAfter = 'after';
		b = new B();
		
		expect(b.stringBefore).toBe('before');
		expect(b.stringAfter).toBe('after');
	});
	
	
	it('should take namespaces as parameters', function () {
		var D = function () {};
		
		swn('cA', A);
		swn('cB', B);
		swn('cC', C);
		swn.inherit('cB', 'cA');
		swn.inherit('cC', B);
		swn.inherit(D, 'cC');
		
		expect(B.parent).toBe(A);
		expect(C.parent).toBe(B);
		expect(D.parent).toBe(C);
	});
	
	
	it('should support copying static properties on demand', function () {
		A.fnA = A.prototype.fnA;
		
		expect(B.fnA).toBe(undefined);
		expect(C.fnA).toBe(undefined);

		swn.inherit(B, A);
		
		expect(B.fnA).toBe(undefined);
		
		swn.inherit(C, A, true);
		
		expect(C.fnA).toBe(A.fnA);
	});
});
