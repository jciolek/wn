// and those which also need onload notification
wn.loader.addMapping('files.common', '../test-common/js/common.js', true);

wn.require('files.common', function() {
	// preloading jQuery for later use, so far nothing depends on it
	wn.require('files.jQuery');
	
	var log = wn('log'),
		nsList, ns;

	function assert(condition) {
		return condition ? ' [ok]' : ' [error]';
	}
	
	function setup(name, namespace) {
		log('creating an object with property name = "' + name + '"');
		var obj = {
			name: name
		}
		log.goDown();
		log('obj.name = "' + obj.name + '"' + assert(obj.name === name));
		log('setting namespace "' + namespace + '" for the object');
		wn(namespace, obj);
		log.sub('(wn(\'' + namespace + '\') === obj) = ' + (wn(namespace) === obj) + assert(wn(namespace) === obj));
		log.sub('wn(\'' + namespace + '\').name = "' + wn(namespace).name + '"' + assert(wn(namespace).name === name));
		log.goUp();
	}
	
	log('namespace.js: loaded');

	setup('test', 'Test');
	setup('nest', 'Really.Nested.Namespace');
	setup('subtest', 'Test.name');
	
	log
		.goDown()
		.log('checking if object wn(\'Test\') hasn\'t been damaged')
		.sub('wn(\'Test\').name = "' + wn('Test').name + assert(wn('Test').name === 'test'))
		.goUp();
	
	log('setting multiple child namespaces: Test.child1, Test.child2').goDown();
	wn('Test.', {
		child1: 'child 1 of Test',
		child2: 'child 2 of Test'
	});
	log('wn(\'Test.child1\') = "' + wn('Test.child1') + '"' + assert(wn('Test.child1') === 'child 1 of Test'));
	log('wn(\'Test.child2\') = "' + wn('Test.child2') + '"' + assert(wn('Test.child2') === 'child 2 of Test'));
	log
		.log('checking if object wn(\'Test\') hasn\'t been damaged')
		.sub('wn(\'Test\').name = "' + wn('Test').name + assert(wn('Test').name === 'test'))
	
	log.goUp();
	
	log('accessing child namespaces of Test.').goDown();
	nsList = {
		checked: 0,
		items: {
			name: false,
			child1: false,
			child2: false
		}
	}
	for (ns in wn('Test.')) {
		if (!nsList.items[ns]) {
			nsList.checked++;
			nsList.items[ns] = true;
		}
		log(ns + ' = "' + wn('Test.' + ns) + '"' + assert(nsList.items[ns]));
	}
	log('child namespaces found: ' + nsList.checked + assert(nsList.checked === 3));
	log.goUp();
	
	wn.require('files.jQuery', function() {
		log('jQuery loaded').sub('colouring results');
		
		$('#log li').each(function(i, node) {
			$.each(node.childNodes, function(i, childNode) {
				if (childNode.nodeType === Node.TEXT_NODE) {
					if (childNode.nodeValue.search(/\[ok\]/) !== -1) {
						$(node).addClass('complete');
					} else if (childNode.nodeValue.search(/\[error\]/) !== -1) {
						$(node).addClass('error');
					}
					// break the loop - text node found
					return false;
				}
			});
		});
	});
});
