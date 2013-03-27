var http = require('http'),
	url = require('url'),
	fs = require('fs');

http.createServer(function (req, res) {
	var pathname = url.parse(req.url).pathname;
	
	fs.readFile(__dirname + '/../test/unit/require' + pathname, function (err, data) {
		if (err) {
			res.end(err.toString());
		} else {
			res.setHeader('Content-Type', 'text/javascript');
			res.end(data);
		}
	});
}).listen(8800);
