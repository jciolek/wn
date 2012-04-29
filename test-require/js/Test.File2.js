wn('log')
	.log('Test.File2.js: loaded; require():')
	.sub('Test.File3', 'Test.File4.extra', 'Test.File5');

wn.require([
		'Test.File3',
		'Test.File4.extra',
		'Test.File5'
	],
	function() {
		wn('log')
			.log('Test.File2.js: require() complete')
			.sub(wn.ns('Test.File3'), wn.ns('Test.File4.extra'), wn.ns('Test.File5'));
		
		wn('Test.File2', 'namespace "Test.File2" ok');
	}
);
