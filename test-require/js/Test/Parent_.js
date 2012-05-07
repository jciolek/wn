wn.require('log', function() {
	wn('log')
		.log('Test/Parent_.js: loaded; require(): none');
	
	wn('Test.Parent.', {
		child1: 'namespace Test.Parent.child1 ok',
		child2: 'namespace Test.Parent.child2 ok'
	});
});
