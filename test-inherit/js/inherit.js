// and those which also need onload notification
wn.loader.addMapping('files.common', '../test-common/js/common.js', true);

wn.require('files.common', function() {
	// preloading jQuery for later use, so far nothing depends on it
	wn.require('files.jQuery');
	
	var log = wn('log');
	function assert(condition) {
		return condition ? ' [ok]' : ' [error]';
	}
	
	log('inherit.js: loaded');
	log('constructor function A() with properties prop1, prop2, prop3; instance a').goDown();
	function A()
	{
		
	}
	wn.extend(A.prototype, {
		prop1: 'prop1 from A',
		prop2: 'prop2 from A',
		prop3: 'prop3 from A'
	});
	var a = new A;
	
	log('A.prototype.constructor = ' + A.prototype.constructor + assert(A.prototype.constructor === A));
	log('a instanceof A: ' + (a instanceof A) + assert(a instanceof A));
	log('a.prop1: ' + a.prop1 + assert(a.prop1 === 'prop1 from A'));
	log('a.prop2: ' + a.prop2 + assert(a.prop2 === 'prop2 from A'));
	log('a.prop3: ' + a.prop3 + assert(a.prop3 === 'prop3 from A'));
	log.goUp();
	
	log('constructor function B() with property prop2 inheriting from A(); instance b').goDown();
	function B() {
		
	}
	wn.extend(B.prototype, {
		prop2: 'prop2 from B'
	});
	wn.inherit(B, A);
	var b = new B;
	
	log('B.prototype.constructor: ' + B.prototype.constructor + assert(B.prototype.constructor === B));
	log('b instanceof B: ' + (b instanceof B) + assert(b instanceof B));
	log('b instanceof A: ' + (b instanceof A) + assert(b instanceof A));
	log('b.prop1: ' + b.prop1 + assert(b.prop1 == 'prop1 from A'));
	log('b.prop2: ' + b.prop2 + assert(b.prop2 == 'prop2 from B'));
	log('b.prop3: ' + b.prop3 + assert(b.prop3 == 'prop3 from A'));
	log('b.parent.prop2: ' + b.parent.prop2 + assert(b.parent.prop2 === 'prop2 from A'));
	log.goUp();
	
	log('constructor function C() with property prop3 inheriting from B(); instance c').goDown();
	function C() {
		
	}
	wn.extend(C.prototype, {
		prop3: 'prop3 from C'
	});
	wn.inherit(C, B);
	var c = new C;
	
	log('C.prototype.constructor: ' + C.prototype.constructor + assert(C.prototype.constructor === C));
	log('c instanceof C: ' + (c instanceof C) + assert(c instanceof C));
	log('c instanceof B: ' + (c instanceof B) + assert(c instanceof B));
	log('c instanceof A: ' + (c instanceof A) + assert(c instanceof A));
	log('c.prop1: ' + c.prop1 + assert(c.prop1 == 'prop1 from A'));
	log('c.prop2: ' + c.prop2 + assert(c.prop2 == 'prop2 from B'));
	log('c.prop3: ' + c.prop3 + assert(c.prop3 == 'prop3 from C'));
	log('c.parent.prop3: ' + c.parent.prop3 + assert(c.parent.prop3 === 'prop3 from A'));
	log.goUp();

	wn.require('files.jQuery', function() {
		log('jQuery loaded').sub('colouring results');
		$('#log > ul > li > ul > li:contains("[ok]")').addClass('complete');
	});
});
