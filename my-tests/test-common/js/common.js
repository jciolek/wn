// common wn settings for tests
wn.loader.urlPrefix = 'js/';
wn.loader.urlSuffix = '.js';
wn.loader.addMapping('files.jQuery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', true);

// logging function which prettyfies the test log
wn('log', (function() {
	var logNodeCurr = document.createElement('ul'),
		logNodeArr = [];
	
	document.getElementById('log').appendChild(logNodeCurr);
	
	function log() {
		return log.log.apply(log, arguments);
	}
	
	log.log = function()
	{
		var logItemNode,
			text,
			i, l;
			
		for (i = 0, l = arguments.length; i < l; i++) {
			text = arguments[i];
			logItemNode = document.createElement('li');
			logItemNode.innerHTML = text;
			logNodeCurr.appendChild(logItemNode);
	
			if (window.console) {
				console.log(text);
			}
		} 
		
		return this;
	}

	log.sub = function()
	{
		this.goDown();
		this.log.apply(this, arguments);
		this.goUp();
		
		return this;
	}

	log.goDown = function()
	{
		var logItemNode = logNodeCurr.lastChild;
		
		logNodeArr.push(logNodeCurr);
		logNodeCurr = document.createElement('ul');
		logItemNode.appendChild(logNodeCurr);
		
		return this;
	}
	
	log.goUp = function()
	{
		logNodeCurr = logNodeArr.pop();
		
		return this;
	}
	
	return log;
})());

wn('log')('common.js: loaded');
