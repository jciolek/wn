var SandboxTest = TestCase('SandboxTest');

SandboxTest.prototype.testInstance = function () {
	var swn = wn.sandbox();
	
	assertFalse('sandbox should return a new function', wn === swn);
	
	swn('sandbox', 'sandbox');
	
	assertSame('sandboxed wn should have the namespace "sandbox" defined', 'sandbox', swn('sandbox'));
	assertSame('wn should not have the namespace "sandbox" defined', undefined, wn('sandbox'));
}
