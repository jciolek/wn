RequireTest = AsyncTestCase('RequireTest');

RequireTest.prototype.setUp = function () {

	// common wn settings for tests
	wn.loader.urlPrefix = 'http://wn/src-test/';
	wn.loader.urlSuffix = '.js';
	// add mappings for files which do not follow naming convention
	wn.loader.addMapping('require.extraFile', 'http://wn/src-test/require/manual/extra.js');
	wn.loader.addMapping('require.additionalFile', 'http://wn/src-test/require/manual/additional.js');
	// second namespace defined in File1.js
	wn.loader.addMapping('require.File1.extra', 'http://wn/src-test/require/File1.js');
	// and those which also need onload notification
	wn.loader.addMapping('files.jQuery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', true);
}

RequireTest.prototype.testOnLoadSingle = function (queue) {

	assertSame('jQuery should not be defined, reset JS Test Driver and re-run', undefined, jQuery);
	
	queue.call('Require files.jQuery', function (callbacks) {
		wn.require('files.jQuery', callbacks.add(function () {
			assertNotSame('jQuery should be loaded', undefined, jQuery);
		}));
	});
};

RequireTest.prototype.testNamespaceSingle = function (queue) {
	queue.call('Require File1', function (callbacks) {
		wn.require('require.File1', callbacks.add(function () {
			assertSame('require.File1 should be loaded', 'File1', wn('require.File1').name);
		}));
	});
	
	queue.call('Require File1 again', function (callbacks) {
		wn('require.File1').name = 'File1*';
		wn.require('require.File1', callbacks.add(function () {
			assertSame('require.File1 should not be re-loaded', 'File1*', wn('require.File1').name);
		}));
	});
	
	queue.call('Require extra namespace from File1', function (callbacks) {
		wn.require('require.File1.extra', callbacks.add(function () {
			assertSame('require.File1.extra should be defined', 'File1.extra', wn('require.File1.extra').name);
			assertSame('require.File1 should not be re-loaded', 'File1*', wn('require.File1').name);
		}));
	});
};

RequireTest.prototype.testNamespaceMultiple = function (queue) {
	queue.call('Require File2, File3', function (callbacks) {
		wn.require(['require.File2', 'require.File3'], callbacks.add(function () {
			assertSame('require.File2 should be loaded', 'File2', wn('require.File2').name);
			assertSame('require.File3 should be loaded', 'File3', wn('require.File3').name);
			
			// nested call
			queue.call('Require File4 (nested)', function (callbacks) {
				wn.require('require.File4', callbacks.add(function () {
					assertSame('require.File4 should be loaded', 'File4', wn('require.File4').name);
				}));
			});
		}));
	});
	
	queue.call('Require extraFile, additionalFile', function (callbacks) {
		wn.require(['require.extraFile', 'require.additionalFile'], callbacks.add(function () {
			assertSame('require.extraFile should be loaded', 'extra', wn('require.extraFile').name);
			assertSame('require.additionalFile should be loaded', 'additional', wn('require.additionalFile').name);
		}));
	});
}

RequireTest.prototype.testNamespaceChained = function (queue) {
	queue.call('Require File5 <- File6, File7 <- File8', function (callbacks) {
		wn.require(['require.File5'], callbacks.add(function () {
			assertSame('require.File5 should be loaded', 'File5', wn('require.File5').name);
			assertSame('require.File5.File6 should be loaded', 'File6', wn('require.File5.File6').name);
			assertSame('require.File5 should not have property "File6"', undefined, wn('require.File5').File6);
			assertSame('require.File5.File7 should be loaded', 'File7', wn('require.File5.File7').name);
			assertSame('require.File5 should not have property "File7"', undefined, wn('require.File5').File7);
			assertSame('require.File5.File7.File8 should be loaded', 'File8', wn('require.File5.File7.File8').name);
			assertSame('require.File5.File7 should not have property "File8"', undefined, wn('require.File5.File7').File8);
		}));
	});
}
