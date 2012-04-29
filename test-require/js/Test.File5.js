wn('log')
	.log('Test.File5.js: loaded; require():')
	.sub('Test.File6');

wn.require(
	'Test.File6', 
	function() {
		wn('log')
			.log('Test.File5.js: require() complete')
			.sub(wn('Test.File6'));
		
		wn('Test.File5', 'namespace "Test.File5" ok');
	}
);
