;(function(root,factory){
	if(typeof define === 'function'&&define.amd){
		define(['./yxsInterface.js'],factory);
	}else if(typeof exports === 'object'){
		module.exports = factory(require('./yxsInterface.js'));
	}else{
		root.$Interface = factory(root.InterfaceProxy);
	}
})(this,function(InterfaceProxy){
	var inerfaceOptions = {};
	var __origin__ = 'http://www.baidu.com'
	interfaceOptions = {
		'getData':{
			name:'getData',
			jsonp:'jsonpCallback',
			pathname:'/s/go/getData',
			origin:__origin__,
			type:'post',
			params:{
				id:'',
				page:'',
			},
			return:{}
		}
	};
	window.$Interface = new InterfaceProxy(interfaceOptions);

	return $Interface
})