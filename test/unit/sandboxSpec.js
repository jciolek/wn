'use strict';

describe('Sandboxed wn', function () {
	var swn;
	
	beforeEach(function () {
		swn = wn.sandbox();
	});
	
	it('should be a new function', function () {
		expect(typeof swn).toBe('function');
		expect(swn).not.toBe(wn);
	});
	
	it('should have same static methods as wn.sandbox', function () {
		var sm;
		
		for (sm in wn.sandbox) {
			if (wn.hasOwnProperty(sm) && typeof wn[sm] === 'function') {
				expect(swn[sm]).toBe(wn[sm]);
			}
		}
	});
	
	it('should not share namespaces with other wn instances', function () {
		var swn2 = wn.sandbox(); 
		
		swn('namespace', 'hello');
		
		expect(swn('namespace')).toBe('hello');
		expect(wn('namespace')).toBe(undefined);
		expect(swn2('namespace')).toBe(undefined);
	});
});
