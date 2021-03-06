/*!*
 * WebNicer (WN) JavaScript Library v1.0.4
 * http://bitbucket.org/jciolek/webnicer
 *
 * @preserve
 * @author Jacek Ciolek <j.ciolek@webnicer.com>
 * @licence Copyright 2012-2013, Jacek Ciolek
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * http://bitbucket.org/jciolek/webnicer/wiki/Licence
 */

(function (global){
	var _wn = global.wn,
		wn;
	
	/**
	 * Standalone, unobtrusive library which provides:
	 * - module-style namespaces for organizing libraries, objects and values globally
	 * - support for defining dependencies between namespaces and loading required files seamlessly
	 * - support for classical single inheritance of constructor functions
	 */
	function Webnicer()
	{
		var webnicer = function (ns, obj) {
				return webnicer.ns(ns, obj);
			};
			
			// populate all the properties
			Webnicer.extend(webnicer, Webnicer);

			// fill in the gaps - instance specific
			webnicer.nsObj = {};
			webnicer.loader = new Loader();
		
		return webnicer;
	}
	
	/**
	 * Extends objects with other objects - deep or shallow, in- or excluding properties from prototype.
	 * 
	 * @param {Object} child - Object to be extended (extendee)
	 * @param {Object} parent - Object extending the child (extender)
	 * @param {Boolean} [deep] - (optional) deep extension, false by default
	 * @param {Boolean} [overwrite] - (optional) overwrite objects by parent's clones in deep, false by default
	 * 
	 * @description Modifies provided child. Works on pairs of any object, even a function and an array.
	 * However function always overwrites an object, even in deep extention.
	 * Always overwrites primitives with objects and vice versa.
	 * This function has no internal dependecies, can be easily borrowed.
	 */
	Webnicer.extend = function extend(child, parent, deep, overwrite)
	{
		var	cType = typeof child,
			pType = typeof parent,
			allowedTypes = {
				'object': true,
				'function': true
			},
			F = function () {},
			i, p, c;
		
		deep = deep || false;
		overwrite = overwrite || false;
		
		// check input parameters
		if (!(pType in allowedTypes && cType in allowedTypes)) {
			throw new TypeError('WN::extend(): Type mismatch. Trying to extend ' + cType + ' with ' + pType + '.');
		}
		
		if (child === null || parent === null) {
			throw new TypeError('WN::extend(): child and parent cannot be null.');
		}
		
		for (i in parent) {
			if (parent.hasOwnProperty(i)) {
				p = parent[i];
				c = child[i];
				
				// shallow copy
				// always overwrite when parent's property is null, not an object
				// or a function where the child's property is not a function
				if (!deep || p === null || !(typeof p in allowedTypes)) {
					child[i] = p;
					continue;
				}
				
				// deep copy
				if (overwrite || !(typeof c in allowedTypes)) {
					if (typeof p === 'function') {
						c = (function () {
							var _p = p.__wnCloneOf || p,
								fn = function () {
									return _p.apply(this, arguments);
								};

							fn.__wnCloneOf = _p;
							return fn;
						})();
					} else {
						// initialize compatible type
						// WARNING! instances of some built-in constructors made this way may not work, e.g. Date()
						// if the constructor requires parameters it won't work either
						// unless the properties are public
						try {
							c = new p.constructor();
						} catch (e) {
							F.prototype = p.constructor.prototype;
							c = new F();
						}
					}
				}
	
				// extend child's property
				child[i] = extend(c, p, deep, overwrite);
			}
		}
		return child;
	};
	
	// now the method is in place, extend own prototype
	Webnicer.extend(Webnicer, {
		// has to be filled in by the constructor
		nsObj: null,
		loader: null,
		
		sandbox: Webnicer,
		/**
		 * Requires the presence of given namespaces.
		 * Optionally sets callback to be called when all required namespaces are present.
		 * 
		 * @param {array} nsArr - Array of required namespaces
		 * @param {function} [callback] - (optional) Function to be called when all required namespaces are present.
		 */
		require: function (nsArr, callback)
		{
			var reqObj = new Request(callback),
				nsStr;
			
			// ns may be a string or an array - unify handling
			if (typeof nsArr === 'string') {
				nsArr = [nsArr];
			}
			
			// ns has to be an array at this point
			if (!(nsArr instanceof Array)) {
				throw new TypeError('WN::require(): nsArr parameter is expected to be a String or an Array. ' + typeof ns + ' given.');
			}
				
			// if callback is present it has to be a function
			if (callback !== undefined && typeof callback !== 'function') {
				throw new TypeError('WN::require(): callback parameter is expected to be a Function. ' + typeof callback + ' given.');
			}
	
	
			while (nsStr = nsArr.shift()) {
				
				// collect missing namespaces - might be null or undefined
				if (this.ns(nsStr) == undefined) {
					if (nsStr.charAt(0) !== '.') {
						nsStr = '.' + nsStr;
					}
					reqObj.add(nsStr);
				}
			}
			
			// send request to the loader only if it cannot be finished straightaway
			if (!reqObj.finish()) {
				this.loader.request(reqObj);
			}
		},
		
		/**
		 * Sets or gets a value on give namespace path.
		 * 
		 * @param {Object} ns - Dot separated namespace path, excluding WN
		 * @param {Object} [obj] - (optional) Object to be set as the last segment of the namespace path
		 * 
		 * @description Creates the namespace path recursively and sets given object as the last segment of the path.
		 * If the second parameter is not defined function acts as a getter.
		 * Allows for setting leaf and parent nodes with the same name as an aid to inheritance, e.g. 'User' and 'User.Admin'
		 */
		ns: function (nsStr, obj)
		{		
			var nsArr = [],
				l = 0,
				i = 0,
				j,
				nsRootObj = this.nsObj,
				nsObj = nsRootObj,
				isGet = (obj === undefined),
				isLeaf = true,
				isLast = false,
				nsCurr = '',
				nsCurrPath = '';
	
			// don't accept rubbish parameters
			if (typeof nsStr != 'string' || nsStr.length === 0) {
				throw new TypeError('WN::ns(): nsStr parameter is expected to be a non-zero length String. ' + typeof nsStr + ': "' + nsStr + '" given.');
			}
			
			// make sure there is '.' at the beginning of the namespace string 
			if (nsStr.charAt(0) !== '.') {
				nsStr = '.' + nsStr;
			}
			
			// if called as a getter just search in the index
			if (isGet) {
				return nsObj[nsStr];
			}
			
			// acting as a setter from this point onwards
			// check if we are dealing with a leaf or a parent node
			if (nsStr.charAt(nsStr.length - 1) == '.') {
				isLeaf = false;
				nsStr = nsStr.substr(0, nsStr.length - 1);
			}
			
			// if we are setting a parent node it has to be an object
			if (!isLeaf && (typeof obj != 'object' || obj instanceof Array)) {
				throw new TypeError('WN::ns(): obj parameter is expected to be a non-Array Object, ' + typeof obj + ' given.');
			}
			
			nsArr = nsStr.split('.');
			// go through the path and create missing objects along the way
			for (i = 0, l = nsArr.length; i < l; i++) {
				isLast = (l - 1 <= i);
				nsCurr = nsArr[i] + (!isLast || !isLeaf ? '.' :'');
				nsCurrPath += nsCurr;
				
				// object on the path does not exist
				if (nsObj[nsCurr] === undefined) {
					if (!isLast || !isLeaf) {
						nsRootObj[nsCurrPath] = nsObj[nsCurr] = {};
					}
				}
				
				// on the last path segment and setting
				if (isLast) {
					// extend the parent node with new properties
					if (!isLeaf) {
						for (j in obj) {
							// TODO: re-index if the object defines ns parent nodes
							if (obj.hasOwnProperty(j)  && obj[j] !== undefined) {
								nsObj[nsCurr][j] = obj[j];
								nsRootObj[nsCurrPath + j] = obj[j];
								// notify the loader about new arrival for each child namespace
								this.loader.notify(nsCurrPath + j);
							}
						}
					// or simply set the leaf
					} else {
						nsRootObj[nsCurrPath] = nsObj[nsCurr] = obj;
					}
					// notify the loader about new arrival
					// for a leaf or a parent node 
					this.loader.notify(nsCurrPath);
				}
				
				nsObj = nsObj[nsCurr];
			}
	
			return nsObj;
		},
		
		/**
		 * Provides classical inheritance for constructors
		 * 
		 * @param {function} C - Child constructor function
		 * @param {function|string} P - Parent constructor function or namespace for it
		 * @param {boolean} copyStatic - Indicates whether constructor function properties should be copied as well
		 * 
		 * @description Preserves inheritance chain, therefore:
		 * Child instanceof Parent == true
		 * Child instanceof GrandParent == true
		 */
		inherit: (function () {
			var F = function () {};
			
			return function (C, P, copyStatic) {
				var PProto,
					CProto;
					
				P = typeof P === 'string' && this.ns(P) || P;
				C = typeof C === 'string' && this.ns(C) || C;
				copyStatic = copyStatic || false;
				
				// be strict about the types of parameters given
				if (typeof C !== 'function') {
					throw new TypeError('WN::inherit(): C parameter is expected to be a function, ' + typeof C + ' given.');
				}
				if (typeof P !== 'function') {
					throw new TypeError('WN::inherit(): P parameter is expected to be a function, ' + typeof P + ' given.');
				}
				
				PProto = P.prototype,
				CProto = C.prototype;
				
				F.prototype = PProto;
				C.prototype = new F();
				// copy instance properties
				this.extend(C.prototype, CProto);

				C.prototype.constructor = C;
				C.prototype.parent = PProto;
				
				// copy constructor properties
				if (copyStatic) {
					this.extend(C, P);
				}
	
				C.parent = P;
			};
		})()
	});


	/**
	 * Takes care of loading requested scripts and notifying interested parties.
	 * 
	 * @description Can notify on script load or when required namespace has been set.
	 * @see methods notify() and addMapping()
	 */
	function Loader()
	{
		this.required = {};
		this.requested = {};
		this.nsMapping = {};
	}
	
	Webnicer.extend(Loader.prototype, {
//		required: null,
//		requested: null,
		urlPrefix: '/js/',
		urlSuffix: '.js',
//		nsMapping: null,
		
		/**
		 * Converts a namespace into a url
		 * 
		 * @param {string} ns - The namespace to be converted into a url.
		 * @returns {string} - The resulting url.
		 * 
		 * @description This method can be easily replaced in order to provide environment specific and more sophisticated conversion.
		 */
		ns2url: function(ns)
		{
			// internally all namespaces start with '.' - get rid of it
			// namespace ending with '.' means parent - file should end with '_'
			// namespace path reflects directory path so all remaining '.'s are replaced with '/'s
			return this.urlPrefix + ns.replace(/^\./, '').replace(/\.$/, '_').replace(/\./g, '/') + this.urlSuffix;
		},
		
		/**
		 * Adds custom ns -> url mapping which does not follow general rules implemented by ns2url().
		 * 
		 * @param {string} ns - The namespace to be mapped.
		 * @param {string} url - The url to be mapped onto.
		 * @param {boolean} noNS - Indicates whether the requested script does not set required namespace.
		 * 
		 * @description Allows for adding files which do not follow gerneal location pattern
		 * or do not set namespaces.
		 * @see method ns2url()
		 */
		addMapping: function(ns, url, noNs)
		{
			if (typeof ns !== 'string' || ns.length === 0 || ns === '.') {
				throw new TypeError('WN::addMapping(): ns parameter is expected to be a non-zero length string. ' + typeof ns + ': "' + ns + '" + given.');
			}
			
			// internally all namespaces start with '.'
			if (ns.charAt(0) !== '.') {
				ns = '.' + ns;
			}

			this.nsMapping[ns] = new RequestURL(url, noNs);
		},
		
		/**
		 * Request namespaces from given Request object to be loaded.
		 * 
		 * @param {object} reqObj - Request object containing required namespaces.
		 * @return {boolean} - true if the request could be finished, false otherwise.
		 * 
		 * @description Converts namespaces to urls and request all files that has not been already loaded.
		 * @see method Request::finish()
		 */
		request: function(reqObj)
		{
			var _this = this,
				scriptNode,
				scriptNodeFirst,
				nsObj = reqObj.nsObj,
				ns,
				urlObj,
				url;
			
			for (ns in nsObj) {
				urlObj = this.nsMapping[ns] || new RequestURL(this.ns2url(ns));
				url = urlObj.url;
				
				// cater for non-namespace requests
				// if the url corresponding with the current namespace has been loaded remove the namespace from the request object
				if (this.requested[url] === true) {
					reqObj.del(ns);
					continue;
				}
				
				// add request object to the notification list
				if (this.required[ns] === undefined) {
					this.required[ns] = [];
				}
				this.required[ns].push(reqObj);

				// request include file if not requested before
				if (this.requested[url] === undefined) {
					this.requested[url] = false;
					
					scriptNode = document.createElement('script');
					scriptNode.type = 'text/javascript';
					scriptNode.src = url;
					scriptNode.async = true;
					// provide support for scripts which do not set any namespaces
					if (urlObj.noNs) {
						scriptNode.onload = (function() {
							var _ns = ns,
								_url = url;
	
							return function(e) {
								_this.requested[_url] = true;
								_this.notify.call(_this, _ns);
							};
						})();
						// one browser needs special treatment - have a guess
						scriptNode.onreadystatechange = (function() {
							var _scriptNode = scriptNode;
							
							return function() {
								if (_scriptNode.readyState === 'loaded' || _scriptNode.readyState === 'complete') {
									_scriptNode.onreadystatechange = null;
									_scriptNode.onload();
								}
							};
						})();
					}
					scriptNodeFirst = document.getElementsByTagName('script')[0];
					scriptNodeFirst.parentNode.insertBefore(scriptNode, scriptNodeFirst);
				}
			}
			
			// if requested only loaded files then there is nothing to wait for
			// otherwise notify() will pick up
			return reqObj.finish();
		},
		
		/**
		 * Notifies all Request objects in the collection about new namespace arrival.
		 * 
		 * @param {string} newNs - The new namespace.
		 * 
		 * @description Attempts to finish all Requests for the given namespace.
		 */
		notify: function(newNs)
		{
			var reqArr,
				reqObj;
			
			// anyone interested in the new namespace?
			reqArr = this.required[newNs];
			if (reqArr !== undefined) {
				
				// go through all request objects subsribed to the current namespace
				while (reqObj = reqArr.shift()) {
				
					// remove new namespace from the wish list
					reqObj.del(newNs);
					
					// try to finish the current request
					reqObj.finish();
				}
				
				// everyone notified, list no longer useful
				delete this.required[newNs];
			}
		}		
	});

	/**
	 * Represents URL to be requested
	 * 
	 * @constructor
	 * @param {string} url - The URL
	 * @param {boolean} noNs - Indicates whether the requested script does not set required namespace. 
	 */
	function RequestURL(url, noNs)
	{
		if (typeof url !== 'string' || url.length === 0) {
			throw new TypeError('RequestURL(): url parameter is expected to be a non-zero length string. ' + typeof url + ': "' + url + '" given.');
		}
		
		this.url = url || '';
		this.noNs = Boolean(noNs || false);
	}
	
	/**
	 * Represents a request for multiple namespaces
	 * 
	 * @constructor
	 * @param {function} callback - The callback function to be called when the request is satisfied
	 */
	function Request(callback) {
		this.nsObj = {};
		this.callback = callback;
	}
	
	Webnicer.extend(Request.prototype, {
		nsObj: null,
		callback: null,
		finished: false,
		length: 0,
		
		/**
		 * Remove namespace from the collection
		 * 
		 * @param {string} ns - The namespace to be removed
		 * @return {boolean} - true if the namespace was deleted, false otherwise (it didn't exist)
		 */
		del: function(ns)
		{
			var status = false;
			
			if (this.nsObj.hasOwnProperty(ns)) {
				delete this.nsObj[ns];
				this.length--;
				status = true;
			}
			
			return status;
		},
		
		/**
		 * Add a namespace to the collection
		 * 
		 * @param {string} ns - The namespace to be added
		 * @return {boolean} - true if the namespace was added, false otherwise (it did exist)
		 * 
		 * @description If the Request if finished throws an error.
		 * @see method finish()
		 */
		add: function(ns)
		{
			var status = false;
			
			if (this.fihised) {
				throw new Error('Request::add(): tried to add the namespace ' + ns + ' to finished Request.');
			}
			
			if (!this.nsObj.hasOwnProperty(ns)) {
				this.nsObj[ns] = null;
				this.length++;
				status = true;
			}
			
			return status;
		},

		/**
		 * Attempts to finish the request
		 * 
		 * @return {boolean} - true if the request has been finished, false otherwise
		 * @description Tries to call the callback funcion but only after there are no namespaces left in the collection.
		 * This method can be called multiple times. Subsequential calls after it is has succeeded will just return true. 
		 */
		finish: function()
		{
			// run callback only if not finished before and there all requests are satisfied
			if (!this.finished && this.length === 0) {
				if (typeof this.callback === 'function') {
					// don't block the execution thread, callbacks may be heavy
					setTimeout(this.callback, 0);
				}
				this.finished = true;
			}
			
			return this.finished;
		}
	});

	wn = Webnicer.sandbox();
	wn.noConflict = function () {
		global.wn = _wn;
		return wn;
	};
	
	// add wn to the global namespace
	global.wn = wn;
	
})(window);