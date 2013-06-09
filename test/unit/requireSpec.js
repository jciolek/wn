'use strict';

// before you run this spec
// please remember to run:
// node scripts/web-server.js

describe('Require', function () {
	var swn,
		_wn;
	
	beforeEach(function () {
		swn = wn.sandbox();
		swn.loader.urlPrefix = '/';
		_wn = window.wn;
		window.wn = swn;
	});
	
	afterEach(function () {
		window.wn = _wn;
	});
	
	it('should require File1 taking string as a parameter', function () {
		var ns;
		
		expect(swn('File1')).toBeUndefined();
		
		runs(function () {
			swn.require('File1', function () {
				ns = swn('File1');
			});
		});
		
		waitsFor(function () {
			return ns !== undefined;
		});
		
		runs(function () {
			expect(ns.name).toBe('file1');
		});
	});

	it('should require File1 taking array as a parameter', function () {
		var ns;
		
		expect(swn('File1')).toBeUndefined();
		
		runs(function () {
			swn.require(['File1'], function () {
				ns = swn('File1');
			});
		});
		
		waitsFor(function () {
			return ns !== undefined;
		});
		
		runs(function () {
			expect(ns.name).toBe('file1');
		});
	});

	it('should require File2 and File1 (from File2)', function () {
		var ns;
		
		expect(swn('File1')).toBeUndefined();
		expect(swn('File2')).toBeUndefined();
		
		runs(function () {
			swn.require('File2', function () {
				ns = swn('File2');
			});
		});
		
		waitsFor(function () {
			return ns !== undefined;
		});
		
		runs(function () {
			expect(ns.name).toBe('file2');
			expect(swn('File1')).toBeDefined();
			expect(swn('File1').name).toBe('file1');
		});
	});


	it('should require File3, File2 and File1', function () {
		var ns;
		
		expect(swn('File1')).toBeUndefined();
		expect(swn('File2')).toBeUndefined();
		expect(swn('File3')).toBeUndefined();
		
		runs(function () {
			swn.require('File3', function () {
				ns = swn('File3');
			});
		});
		
		waitsFor(function () {
			return ns !== undefined;
		});
		
		runs(function () {
			expect(ns.name).toBe('file3');
			expect(swn('File1')).toBeDefined();
			expect(swn('File1').name).toBe('file1');
			expect(swn('File2')).toBeDefined();
			expect(swn('File2').name).toBe('file2');
		});
	});


	it('should require File4, File3, File2 and File1', function () {
		var ns;
		
		expect(swn('File1')).toBeUndefined();
		expect(swn('File2')).toBeUndefined();
		expect(swn('File3')).toBeUndefined();
		expect(swn('File4')).toBeUndefined();
		
		runs(function () {
			swn.require('File4', function () {
				ns = swn('File4');
			});
		});
		
		waitsFor(function () {
			return ns !== undefined;
		});
		
		runs(function () {
			expect(ns.name).toBe('file4');
			expect(swn('File1')).toBeDefined();
			expect(swn('File1').name).toBe('file1');
			expect(swn('File2')).toBeDefined();
			expect(swn('File2').name).toBe('file2');
			expect(swn('File3')).toBeDefined();
			expect(swn('File3').name).toBe('file3');
		});
	});


	it('should require File5, File5.File6, File5.File7, File5.File7.File8 from subdirectories', function () {
		var ns;
		
		expect(swn('File5')).toBeUndefined();
		expect(swn('File5.File6')).toBeUndefined();
		expect(swn('File5.File7')).toBeUndefined();
		expect(swn('File5.File7.File8')).toBeUndefined();
		
		runs(function () {
			swn.require('File5', function () {
				ns = swn('File5');
			});
		});
		
		waitsFor(function () {
			return ns !== undefined;
		});
		
		runs(function () {
			expect(ns.name).toBe('file5');
			expect(swn('File5.File6')).toBeDefined();
			expect(swn('File5.File6').name).toBe('file6');
			expect(swn('File5.File7')).toBeDefined();
			expect(swn('File5.File7').name).toBe('file7');
			expect(swn('File5.File7.File8')).toBeDefined();
			expect(swn('File5.File7.File8').name).toBe('file8');
		});
	});


	it('should require AdditionalFile, ExtraFile (manually mapped namespaces) and File1', function () {
		var ns;

		swn.loader.addMapping('AdditionalFile', '/manual/additional.js');
		swn.loader.addMapping('ExtraFile', '/manual/extra.js');
		
		expect(swn('AdditionalFile')).toBeUndefined();
		expect(swn('ExtraFile')).toBeUndefined();
		
		runs(function () {
			swn.require('ExtraFile', function () {
				ns = swn('ExtraFile');
			});
		});
		
		waitsFor(function () {
			return ns !== undefined;
		});
		
		runs(function () {
			expect(ns.name).toBe('extra');
			expect(swn('AdditionalFile')).toBeDefined();
			expect(swn('AdditionalFile').name).toBe('additional');
			expect(swn('File1')).toBeDefined();
			expect(swn('File1').name).toBe('file1');
		});
	});
});
