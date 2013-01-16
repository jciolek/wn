var InheritTest = TestCase('InheritTest');

InheritTest.prototype.setUp = function () {
	function A() {}
	A.sf = function sf() {
		return 'A.sf()';
	}
	wn.extend(A.prototype, {
		prop1: 'A::prop1',
		prop2: 'A::prop2',
		prop3: 'A::prop3'
	});
	wn('inherit.A', A);

	function B() {}
	wn.inherit(B, 'inherit.A', true);
	wn.extend(B.prototype, {
		prop2: 'B::prop2'
	});
	wn('inherit.B', B);


	function C() {}
	wn.inherit(C, B);
	wn.extend(C.prototype, {
		prop3: 'C::prop3'
	});
	wn('inherit.C', C);
}

InheritTest.prototype.testA = function () {
	var A = wn('inherit.A'),
		a = new A;
	
	assertSame('A should be the constructor of A', A, A.prototype.constructor);
	assertSame('A.sf() should return "A.sf()"', 'A.sf()', A.sf());
	assertTrue('a should be an instance of A', a instanceof A);
	assertSame('a.prop1 should be same as in A.prototype', 'A::prop1', a.prop1);
	assertSame('a.prop2 should be same as in A.prototype', 'A::prop2', a.prop2);
	assertSame('a.prop3 should be same as in A.prototype', 'A::prop3', a.prop3);
}

InheritTest.prototype.testB = function () {
	var A = wn('inherit.A'),
		B = wn('inherit.B'),
		b = new B;
	
	assertSame('B should be the constructor of B', B, B.prototype.constructor);
	assertSame('B.parent should point to A', A, B.parent);
	assertSame('Static method B.sf() should be copied', A.sf(), B.sf());
	assertTrue('b should be an instance of B', b instanceof B);
	assertTrue('b should be an instance of A', b instanceof A);
	assertSame('b.prop1 should be inherited', A.prototype.prop1, b.prop1);
	assertSame('b.prop2 should be overridden', 'B::prop2', b.prop2);
	assertSame('b.parent.prop2 should point to A.prototype.prop2', A.prototype.prop2, b.parent.prop2);
	assertSame('b.prop3 should be inherited', A.prototype.prop3, b.prop3);
}

InheritTest.prototype.testC = function () {
	var A = wn('inherit.A'),
		B = wn('inherit.B'),
		C = wn('inherit.C'),
		c = new C;
	
	assertSame('C should be the constructor of C', C, C.prototype.constructor);
	assertSame('C.parent should point to B', B, C.parent);
	assertSame('Static method C.sf() should not exist', undefined, C.sf);
	assertTrue('c should be an instance of C', c instanceof C);
	assertTrue('c should be an instance of B', c instanceof B);
	assertTrue('c should be an instance of A', c instanceof A);
	assertSame('c.prop1 should be inherited', A.prototype.prop1, c.prop1);
	assertSame('c.prop2 should be inherited', B.prototype.prop2, c.prop2);
	assertSame('c.prop3 should be overriden', 'C::prop3', c.prop3);
	assertSame('c.parent.prop3 should point to B.prototype.prop3', B.prototype.prop3, c.parent.prop3);
}
