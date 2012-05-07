wn.require('log', function() {
	wn('log')
		.log('Test/File2.js: loaded; require():')
		.sub('Test.File3', 'Test.File4.extra', 'Test.File5', 'Test.Parent.');
	
	wn.require([
			'Test.File3',
			'Test.File4.extra',
			'Test.File5',
			'Test.Parent.'
		],
		function() {
			wn('log')
				.log('Test/File2.js: require() complete')
				.sub(
					wn('Test.File3'),
					wn('Test.File4.extra'),
					wn('Test.File5'),
					wn('Test.Parent.child1'),
					wn('Test.Parent.child2')
				);
			
			wn('Test.File2', 'namespace "Test.File2" ok');
		}
	);
});
