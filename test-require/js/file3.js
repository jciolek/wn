wn.require('log', function() {
	wn('log')
		.log('file3.js: loaded; require():')
		.sub('Test.File4', 'files.jQuery');
		
	wn.require([
			'Test.File4',
			'files.jQuery'
		],
		function() {
			wn('log')
				.log('file3.js: require() complete')
				.sub(wn('Test.File4'), 'testing jQuery: ...');
	
			wn('Test.File3', 'namespace "Test.File3" ok');
		}
	);
})
