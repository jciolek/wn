wn.require(['File1'], function () {
	wn.require('File3', function () {
		wn.require('File2', function () {
			wn('File4', {
				name: 'file4'
			});
		});
	});
});
