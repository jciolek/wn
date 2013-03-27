'use strict';

describe('Require', function () {
	var swn;
	
	beforeEach(function () {
		swn = wn.sandbox();
		swn.loader.urlPrefix = '';
	});
	
	it('should require File1 namespace', function () {
		var ns;
		
		waitsFor(function () {
			swn.require('File1', function () {
				ns = swn('File1');
				expect(ns.name).toBe('file1');
			});
		})
	});


	it('', function () {
		
	});


	it('', function () {
		
	});


	it('', function () {
		
	});


	it('', function () {
		
	});


	it('', function () {
		
	});


	it('', function () {
		
	});

});
