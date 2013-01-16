var NamespaceTest = TestCase('NamespaceTest');

NamespaceTest.prototype.setUp = function () {}

NamespaceTest.prototype.testSimple = function () {
	var namespace = {
			name: 'namespace'
		};
	
	wn('namespace', namespace);

	assertSame('wn("namespace") should return the object stored', wn('namespace'), namespace);
};

NamespaceTest.prototype.testChild = function () {
	var child = {
			name: 'namespace.child'
		};

	wn('namespace.child', child);
	
	assertSame('wn("namespace").name should stay intact', 'namespace', wn('namespace').name);
	assertSame('wn("namespace") should not have property "child"', undefined, wn('namespace').child);
	assertSame('wn("namespace.child") should return the object stored', child, wn('namespace.child'));
}

NamespaceTest.prototype.testMultiple = function () {
	var namespaces = {
			multi_one: 'namespace.multi_one',
			multi_two: {
				name: 'namespace.multi_two'
			}
		};

	wn('namespace.', namespaces);
	
	assertSame('wn("namespace").name should stay intact', 'namespace', wn('namespace').name);
	assertSame('wn("namespace.child")should stay intact', 'namespace.child', wn('namespace.child').name);
	assertSame('wn("namespace") should not have property "multi_one"', undefined, wn('namespace').multi_one);
	assertSame('wn("namespace") should not have property "multi_two"', undefined, wn('namespace').multi_two);
	assertSame('wn("namespace.multi_one") should be defined', namespaces.multi_one, wn('namespace.multi_one'));
	assertSame('wn("namespace.multi_two") should be defined', namespaces.multi_two, wn('namespace.multi_two'));
}

NamespaceTest.prototype.testNested = function () {
	var nested = {
		name: 'namespace.really.nested.deeply'
	}
	
	wn('namespace.really.nested.deeply', nested);
	
	assertSame('wn("namespace").name should stay intact', 'namespace', wn('namespace').name);
	assertSame('wn("namespace.child")should stay intact', 'namespace.child', wn('namespace.child').name);
	assertSame('wn("namespace.multi_one") should stay intact', 'namespace.multi_one', wn('namespace.multi_one'));
	assertSame('wn("namespace.multi_two") should stay intact', 'namespace.multi_two', wn('namespace.multi_two').name);
	assertSame('wn("namespace") should not have property "really"', undefined, wn('namespace').really);
	assertSame('wn("namespace.really.nested.deeply") should return the object stored', nested, wn('namespace.really.nested.deeply'));
}

NamespaceTest.prototype.testOverwrite = function () {
	var child = {
			name_new: 'namespace.child (new)'
		},
		namespaces = {
			multi_two: {
				name_new: 'namespace.multi_two (new)'
			}
		};
	
	wn('namespace.child', child);
	
	assertSame('wn("namespace.child") should be overwritten', child, wn('namespace.child'));
	
	wn('namespace.', namespaces);
	
	assertSame('wn("namespace.name_two") should be overwritten', namespaces.multi_two, wn('namespace.multi_two'));	
}

NamespaceTest.prototype.testAccessMultiple = function () {
	var namespaces = wn('namespace.'),
		expected = {
			child: 1,
			multi_one: 1,
			multi_two: 1,
			'really.': 1
		},
		ns,
		counter = 0;
	
	for (ns in namespaces) {
		if (namespaces.hasOwnProperty(ns)) {
			assertSame('only defined namespaces should exist', 1, expected[ns]);
			counter += 1;
		}
	}
	
	assertSame('there should be exactly 4 defined namespaces', 4, counter);
}

NamespaceTest.prototype.testDotNotation = function () {
	var child_new = {
		name: 'child new'
	};
	
	wn('.namespace.child_new', child_new);
	assertSame('wn(".namespace.child_new") and wn("namespace.child_new") should be identical', wn('namespace.child_new'), wn('.namespace.child_new'));
}
