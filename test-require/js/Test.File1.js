wn('log')
	.log('Test.File1.js: loaded; require():')
	.sub('Test.File2', 'Test.File3');

wn.require([
		'Test.File2',
		'Test.File3'
	],
	function() {
		wn('log')
			.log('Test.File1.js: require() complete')
			.sub(wn.ns('Test.File2'), wn.ns('Test.File3'));

		wn('Test.File1', 'namespace "Test.File1" ok');
	}
);
