// add mappings for files which do not follow naming convention
wn.loader.addMapping('Test.File3', 'js/file3.js');
wn.loader.addMapping('Test.File4', 'js/file4.js');
// second namespace defined in files4.js
wn.loader.addMapping('Test.File4.extra', 'js/file4.js');
// and those which also need onload notification
wn.loader.addMapping('files.common', '../test-common/js/common.js', true);

wn.require('files.common', function() {
	wn('log')
		.log('require.js: 1st require() complete')
		.sub('files.common loaded ok, log operational')
		.log('require.js: 2nd (chained) require():')
		.sub('files.jQuery', 'Test.File5', 'Test.File1');
	
	// you can also chain wn.require() calls:
	wn.require([
			'files.jQuery',
			'Test.File5',
			'Test.File1'
		],
		function() {
			wn('log')
				.log('require.js: 2nd (chained) require() complete')
				.sub(wn('Test.File5'), wn('Test.File1'), 'testing jQuery: adding class "complete" to relevant log entries');

			$('#log > ul > li:contains("complete")').addClass('complete');
		}
	);	
})
