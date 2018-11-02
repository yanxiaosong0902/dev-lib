;(function(root,factory){
	if(typeof define === 'object' && define.amd){
		define([],factory);
	}else if(typeof exports === 'function'){
		module.exports = factory();
	}else{
		root.$yxs = factory();
	}
})(this,function(){
	//类型判断
	var isType = type =>{
		return function(obj){
			return Object.prototype.toString.call(obj) === '[object '+type+']'
		}
	}

	var isObject = isType('Object');
	var isArray = isType('Array');
	var isString = function(obj){
		return isType('String')(obj) || obj instanceof String
	};
	var isNull = isType('Null');
	var isNumber = isType('Number');
	var isFunction = isType('Function');
	var isUndefined = isType('Undefined');
	var isElement = obj =>{
        return /^\[object HTML\w*Element]$/.test({}.toString.call(obj));
    }
    var isElementArray = function (obj) {
        return {}.toString.call(obj) == '[object HTMLCollection]' || {}.toString.call(obj) == '[object NodeList]';
    };
     var isTableElement = function (obj) {
        return /^\[object HTMLTable\w*Element]$/.test({}.toString.call(obj));
    };

    var $yxs = {};
    //url参数格式化
    var parseUrl = function(){
    	var url = window.location.search.replace(/^\?/,'');
    	var urlObj = {};
    	url = url.split('&');
    	url.forEach(e=>{
    		const obj = e.split('=');
    		const key = obj[0];
    		const value = obj[1];
    		urlObj[key] = value;
    	})
    	return urlObj
    }
    //时间格式化
    var dateFormat = function(date,fmt){
		if(typeof date == 'number'){
			date = new Date(date);
		}
		var o = {   
		    "M+" : date.getMonth()+1,                 //月份   
		    "d+" : date.getDate(),                    //日   
		    "h+" : date.getHours(),                   //小时   
		    "m+" : date.getMinutes(),                 //分   
		    "s+" : date.getSeconds(),                 //秒   
		    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
		    "S"  : date.getMilliseconds()             //毫秒   
		 };   
		if(/(y+)/.test(fmt)){ 
		    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
		}   
		for(var k in o){   
		 	if(new RegExp("("+ k +")").test(fmt)){   
		  		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			}
		}   
		return fmt;   
    }
	//转义空格换行等字符，便于入库和页面还原展示
	var parseSpaceAndBr = function(str){
		return str.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp');
	}
	//电话号码验证
	var checkPhone = function(phone){ 
		var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
		if(!myreg.test(phone)){  
			return false; 
		}
		else {
			return true
		}			
	}
	//电子邮箱验证
	var checkEmail = function(email){
        if(email==null) return;
        var reg=new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
        return reg.test(email)
    };
	//数组去重
	var parseArrSet = function(arr){
		if(typeof Set == 'function'){
			let _arr = new Set(arr);
			return [..._arr]
		}else{
			var _arr = [];
			arr.forEach(function(e,index){
				if(_arr.indexOf(e) == -1){
					_arr.push(e);
				}
			})
			return _arr
		}
	}
	//冒泡排序 时间复杂度O(n*n) 空间复杂度O(1)
	var bubbleSort = function(arr){
		var len = arr.length;
		for(var i = 0 ; i < len ; i ++){
			for(var j = 0 ; j < len-i-1; j++){
				if(arr[i]>arr[j]){
					var temp = arr[i];
					arr[i] = arr[j];
					arr[j] = temp;
				}
			}
		}
		return arr
	}
	//选择排序 时间复杂度O(n*n) 空间复杂度O(1)
	
	//插入排序 时间复杂度O(n*n) 空间复杂度O(1)
	
	//归并排序 时间复杂度O(n*logn) 空间复杂度O(1)
	
	//快速排序 时间复杂度O() 空间复杂度O(1)
	
	//希尔排序 时间复杂度O(n*n) 空间复杂度O(1)
	
    $yxs.parseUrl = parseUrl;
    $yxs.dateFormat = dateFormat;
	$yxs.checkEmail = checkEmail;
	$yxs.checkPhone = checkPhone;
    window.$yxs = $yxs;
    window.isArray = isArray;
    window.isNumber = isNumber;
    window.isObject = isObject;
    window.isString = isString;
    window.isElement = isElement;
    window.isFunction = isFunction;
    window.isUndefined = isUndefined;
    window.isElementArray = isElementArray;
    window.isTableElement = isTableElement;
	
    $yxs.isArray = isArray;
	$yxs.isNumber = isNumber;
	$yxs.isObject = isObject;
	$yxs.isString = isString;
	$yxs.isElement = isElement;
	$yxs.isFunction = isFunction;
	$yxs.isUndefined = isUndefined;
	$yxs.isElementArray = isElementArray;
	$yxs.isTableElement = isTableElement;


    return $yxs
})