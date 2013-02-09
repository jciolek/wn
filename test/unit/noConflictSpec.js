describe('noConflict()', function () {
	var own = wn,
		nwn;
	
	beforeEach(function () {
		nwn = wn.noConflict();
	});
	
	afterEach(function () {
		wn = nwn;
	});
	
	it ('should revert the original value of global wn variable', function () {

		expect(wn).toBe(undefined);
	});
	
	it('should return wn()', function () {
		
		expect(nwn).toBe(own);
	});
});
