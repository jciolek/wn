/**
 * WebNicer (WN) JavaScript Library v1.0.2
 * http://bitbucket.org/jciolek/webnicer
 *
 * @preserve
 * @author Jacek Ciolek <j.ciolek@webnicer.com>
 * @licence Copyright 2012-2013, Jacek Ciolek
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * http://bitbucket.org/jciolek/webnicer/wiki/Licence
 */
(function(global){function Webnicer(){var prop,webnicer=function(ns,obj){return webnicer.ns(ns,obj)};for(prop in Webnicer){if(Webnicer.hasOwnProperty(prop)){webnicer[prop]=Webnicer[prop]}}webnicer.nsObj={};webnicer.loader=new Loader;return webnicer}Webnicer.extend=function extend(child,parent,deep,proto){var deep=deep||false,proto=proto||false,cType=typeof child,pType=typeof parent,i,p,c;if(pType!=="object"&&pType!=="function"||cType!=="object"&&cType!=="function"){throw new TypeError("WN::extend(): Type mismatch. Trying to extend "+cType+" with "+pType+".")}for(i in parent){if(proto||parent.hasOwnProperty(i)){p=parent[i];c=child[i];if(!deep){if(p!==undefined||c===null){child[i]=p}continue}if(typeof p=="object"){if(p!==null){if(typeof c!="object"){c=p instanceof Array?[]:{}}child[i]=extend(c,p,deep,proto)}else if(c===undefined){child[i]=null}}else{if(p!==undefined||c===null){child[i]=p}}}}return child};Webnicer.extend(Webnicer,{nsObj:null,loader:null,sandbox:Webnicer,require:function(nsArr,callback){var reqObj=new Request(callback),nsStr;if(typeof nsArr==="string"){nsArr=[nsArr]}if(!(nsArr instanceof Array)){throw new TypeError("WN::require(): nsArr parameter is expected to be a String or an Array. "+typeof ns+" given.")}if(callback!==undefined&&typeof callback!=="function"){throw new TypeError("WN::require(): callback parameter is expected to be a Function. "+typeof callback+" given.")}while(nsStr=nsArr.shift()){if(this.ns(nsStr)==undefined){if(nsStr.charAt(0)!=="."){nsStr="."+nsStr}reqObj.add(nsStr)}}if(!reqObj.finish()){this.loader.request(reqObj)}},ns:function(nsStr,obj){var nsArr=[],l=0,i=0,j,nsRootObj=this.nsObj,nsObj=nsRootObj,isGet=obj===undefined,isLeaf=true,isLast=false,nsCurr="",nsCurrPath="";if(typeof nsStr!="string"||nsStr.length==0){throw new TypeError("WN::ns(): nsStr parameter is expected to be a non-zero length String. "+typeof nsStr+': "'+nsStr+'" given.')}if(nsStr.charAt(0)!=="."){nsStr="."+nsStr}if(isGet){return nsObj[nsStr]}if(nsStr.charAt(nsStr.length-1)=="."){isLeaf=false;nsStr=nsStr.substr(0,nsStr.length-1)}if(!isLeaf&&(typeof obj!="object"||obj instanceof Array)){throw new TypeError("WN::ns(): obj parameter is expected to be a non-Array Object, "+typeof obj+" given.")}nsArr=nsStr.split(".");for(i=0,l=nsArr.length;i<l;i++){isLast=l-1<=i;nsCurr=nsArr[i]+(!isLast||!isLeaf?".":"");nsCurrPath+=nsCurr;if(nsObj[nsCurr]===undefined){if(!isLast||!isLeaf){nsRootObj[nsCurrPath]=nsObj[nsCurr]={}}}if(isLast){if(!isLeaf){for(j in obj){if(obj.hasOwnProperty(j)&&obj[j]!=undefined){nsObj[nsCurr][j]=obj[j];nsRootObj[nsCurrPath+j]=obj[j];this.loader.notify(nsCurrPath+j)}}}else{nsRootObj[nsCurrPath]=nsObj[nsCurr]=obj}this.loader.notify(nsCurrPath)}nsObj=nsObj[nsCurr]}return nsObj},inherit:function(){var F=function(){};return function(C,P,copyStatic){copyStatic=copyStatic||false;if(typeof P==="string"){P=this.ns(P)}if(typeof C!=="function"){throw new TypeError("WN::inherit(): C parameter is expected to be a function, "+typeof C+" given.")}if(typeof P!=="function"){throw new TypeError("WN::inherit(): P parameter is expected to be a function, "+typeof P+" given.")}var PPrototype=P.prototype,CPrototype=C.prototype;F.prototype=PPrototype;C.prototype=new F;this.extend(C.prototype,CPrototype);C.prototype.constructor=C;C.prototype.parent=PPrototype;if(copyStatic){this.extend(C,P)}C.parent=P}}()});function Loader(){this.required={};this.requested={};this.nsMapping={}}Webnicer.extend(Loader.prototype,{urlPrefix:"/js/",urlSuffix:".js",ns2url:function(ns){return this.urlPrefix+ns.replace(/^\./,"").replace(/\.$/,"_").replace(/\./g,"/")+this.urlSuffix},addMapping:function(ns,url,noNs){if(typeof ns!=="string"||ns.length===0||ns==="."){throw new TypeError("WN::addMapping(): ns parameter is expected to be a non-zero length string. "+typeof ns+': "'+ns+'" + given.')}if(ns.charAt(0)!=="."){ns="."+ns}this.nsMapping[ns]=new RequestURL(url,noNs)},request:function(reqObj){var _this=this,scriptNode,scriptNodeFirst,nsObj=reqObj.nsObj,ns,urlObj,url;for(ns in nsObj){urlObj=this.nsMapping[ns]||new RequestURL(this.ns2url(ns));url=urlObj.url;if(this.requested[url]===true){reqObj.del(ns);continue}if(this.required[ns]===undefined){this.required[ns]=[]}this.required[ns].push(reqObj);if(this.requested[url]===undefined){this.requested[url]=false;scriptNode=document.createElement("script");scriptNode.type="text/javascript";scriptNode.src=url;scriptNode.async=true;if(urlObj.noNs){scriptNode.onload=function(){var _ns=ns,_url=url;return function(e){_this.requested[_url]=true;_this.notify.call(_this,_ns)}}();scriptNode.onreadystatechange=function(){var _scriptNode=scriptNode;return function(){if(_scriptNode.readyState==="loaded"||_scriptNode.readyState==="complete"){_scriptNode.onreadystatechange=null;_scriptNode.onload()}}}()}scriptNodeFirst=document.getElementsByTagName("script")[0];scriptNodeFirst.parentNode.insertBefore(scriptNode,scriptNodeFirst)}}return reqObj.finish()},notify:function(newNs){var reqArr,reqObj;reqArr=this.required[newNs];if(reqArr!==undefined){while(reqObj=reqArr.shift()){reqObj.del(newNs);reqObj.finish()}delete this.required[newNs]}}});function RequestURL(url,noNs){if(typeof url!=="string"||url.length==0){throw new TypeError("RequestURL(): url parameter is expected to be a non-zero length string. "+typeof url+': "'+url+'" given.')}this.url=url||"";this.noNs=Boolean(noNs||false)}function Request(callback){this.nsObj={};this.callback=callback}Webnicer.extend(Request.prototype,{nsObj:null,callback:null,finished:false,length:0,del:function(ns){var status=false;if(this.nsObj.hasOwnProperty(ns)){delete this.nsObj[ns];this.length--;status=true}return status},add:function(ns){var status=false;if(this.fihised){throw new Error("Request::add(): tried to add the namespace "+ns+" to finished Request.")}if(!this.nsObj.hasOwnProperty(ns)){this.nsObj[ns]=null;this.length++;status=true}return status},finish:function(){if(!this.finished&&this.length==0){if(typeof this.callback==="function"){setTimeout(this.callback,0)}this.finished=true}return this.finished}});global.wn=Webnicer.sandbox()})(window);