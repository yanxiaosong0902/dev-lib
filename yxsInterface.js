;(function(root,factory){
	if(typeof define === 'function'&&define.amd){
		define([],factory);
	}else if(typeof exports === 'object'){
		module.exports = factory();
	}else{
		root.$InterfaceProxy = factory();
	}
})(this,function(){
	function isType(type) {
        return function (obj) {
            return {}.toString.call(obj) === "[object " + type + "]";
        }
    }
    var isObject = isType("Object");
	function objClone(obj) {
        var newObj = {};
        for (var an in obj) {
            if (!obj.hasOwnProperty(an))continue;
            newObj[an] = isObject(obj[an]) ? objClone(obj[an]) : obj[an];
        }
        return newObj;
    }
	function InterfaceProxy(opt,addtion){
		var _opt = objClone(opt);
		this.opt = _opt;
		return this.init()
	}
	InterfaceProxy.prototype = {
		init:function(){
			var opt = this.opt;
			for(prop in opt){
				this[prop] = function(){
					var params = opt[prop];
					console.log(params);
				}
			}
		}
	}
	window.InterfaceProxy = InterfaceProxy;

	return InterfaceProxy
})