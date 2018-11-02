/**
 * 文件上传组件
 * @author yanxiaosong
 * IE8+
 */

/*==============================================================================================*//*

 ### 功能说明
 ```
 FileUploader({
 uploadUrl: 上传URL,
 uploadElem: 上传Form,
 callback: 文件上传完成后回调,
 errCallback: 文件上传失败后回调,
 uploading: 进度更新回调,
 imgElem：预览图片,
 onchange：预览图片,
 crossOrigin：是否开启跨域上传,
 crossOriginSrc：跨域上传接收页面URL,
 });
 ```
 > 对跨域上传做了支持,如果开启了跨域上传，会自动在fileForm上面覆盖一个包含上传页面的iframe
 > 然后使用postMessage进行页面间通信，页面的图片数据会通过Base64码进行传输预览。

 *//*=============================================================================================*/

/*==============================================================================================*//*

 ### 更新日志

 * 2016-6-16    增加功能，文件大小、文件类型限制
 * 2016-6-1     精简参数，调整代理html
 * 2016-5-5     完善功能说明
 * 2016-4-22 	添加了使用说明

 *//*=============================================================================================*/
/**
 * 扩展元素组件
 * @module FileUploader
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([
			'./sha1.js',
		], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('./sha1.js'));
	} else {
		root.FileUploader = factory(
			root.sha1
		);
	}
})(this, function (Hashes) {


	function msg(obj){
		obj.messageType = "uploadMsg";
		return JSON.stringify(obj);
	}

	/**
	 * 分析返回值  object | string => object
	 * @param resContent
	 */
	function parseRetData(resContent) {
		try {
			var retData = JSON.parse(resContent);
		}catch(e){
			retData = resContent;
		}
		return retData;
	}

	/**
	 * 文件上传组件
	 * @param {Object} config                       	- 基础配置对象
	 * @param {string} config.uploadUrl               	- 文件上传接口URL
	 * @param {string=} config.crossOriginSrc           - 跨域上传iframe代理URL
	 * @param {string=} config.fileType               	- 文件类型 需要小写字母 示例："txt,js,jpg,png,jpeg" | ['text','js']
	 * @param {string=} config.fileSize               	- 文件大小，单位kb 示例: "10-200" | "10~200" |"200"
	 * @param {element} config.uploadElem            	- 文件上传表单元素
	 * @param {element=} config.imgElem            		- 图片文件预览元素
	 * @param {function=} config.callback       		- 成功回调
	 * @param {function=} config.errCallback       		- 失败回调
	 * @param {function=} config.uploading       		- 上传中回调
	 * @param {function=} config.beforeSend       		- 上传开始回调
	 * @param {function=} config.onchange       		- 文件选中、改变回调，可以在这个回调函数中写入 send方法
	 * @returns {{send: send}}							- 返回包含操作方法的对象
	 * @constructor
	 * @alias module:FileUploader
	 * @example
	 *   var fp = new FileUploader({
     *   	uploadUrl : "http://dove.zol.com.cn/saas.pin/ftp/fileUpload",
     *   	// 上传Form
     *   	uploadElem: fileUploadElem,
     *   	// 文件类型限制
     *   	fileType:"txt,js,jpg,png,jpeg",
     *   	// 文件大小限制
     *   	fileSize:"10-200",
     *   	// 跨域模式
     *   	crossOriginSrc:"http://dove.zol.com.cn/saas.pin/upload/fileSpy.html",
     *   	// 图片
     *   	imgElem : document.querySelector('img'),
     *   	//文件上传完成后回调函数
     *   	callback: function(resContent) {
     *   	    console.log(resContent);
     *   	},
     *   	errCallback: function(resContent) {
     *   	    console.log(resContent);
     *   	},
     *   	// 进度
     *   	uploading: function(percent) {
     *   	    console.log("Uploading:" + percent);
     *   	},
     *   	// onchange
     *   	onchange:function(){
     *   	    console.log("change");
     *   	}
     * });
	 * // 发送文件
	 * fp.send();
	 *
	 *
	 *
	 */
	var FileUploader = function(config) {
		var options = {
			// url
			uploadUrl : "",
			// formElem
			uploadElem:null,
			// success
			callback : null,
			errCallback :null,
			// uploading
			uploading: null,
			// beforeSend
			beforeSend: null,
			// img preview elem
			imgElem : null,
			// cross-origin : 是否需要跨域
			crossOriginSrc:null,
			// onchange
			onchange:null,
			// 文件类型
			fileType:'',
			// 文件大小 kb
			fileSize:null
		};
		// 参数合并
		for (var an in config) {
			if(!config.hasOwnProperty(an))continue;
			options[an] = config[an];
		}


		// 文件类型&大小检查
		function fileInspect() {
			var file = options.uploadElem.files[0];
			if(!file){
				options.errCallback&&options.errCallback("没有选中任何文件");
				return false;
			}
			// 检查文件类型是否符合标准
			var typeMatch = true;
			if(options.fileType){
				typeMatch = false;
				if($wd.isString(options.fileType)){
					options.fileType = options.fileType.split(',');
				}
				if(isArray(options.fileType)){
					options.fileType.forEach(function (type) {
						$wd.isString(type) && file.name.match(/\.[^.]*$/) && file.name.match(/\.[^.]*$/)[0].toLowerCase().indexOf(type) >= 0 && (typeMatch = true);
					});
				}
			}
			if(!typeMatch){
				options.errCallback&&options.errCallback("文件类型错误！正确类型:"+ options.fileType.join(','));
				return false;
			}
			if ($wd.isString(options.fileSize)) {
				var fileLimit = options.fileSize.split(/~|-|,/);
				var compareSize = file.size / 1024;
				if (fileLimit.length == 2) {
					if (compareSize < fileLimit[0] || compareSize > fileLimit[1]) {
						options.errCallback && options.errCallback("文件大小错误("+parseInt(compareSize)+"kb)!尺寸范围：" + fileLimit.join('~')+' kb');
						return false;
					}
				}
				else if (fileLimit.length == 1) {
					if (compareSize > fileLimit[0]) {
						options.errCallback && options.errCallback("文件大小错误("+parseInt(compareSize)+"kb)！文件需要小于 " + fileLimit[0]+ " kb");
						return false;
					}
				} else {
					console.log("Error : 文件大小配置错误！");
					return false;
				}
			}
			return true;
		}

		/*
		 * 跨域上传
		 */
		var uploadElemState = 0;
		if(options.crossOriginSrc){
			// 阻止表单事件
			options.uploadElem.onclick = function(event){
				event.preventDefault();
				return false;
			};
			// 构造iframe代理
			var proxyContainer = document.createElement('div');
			proxyContainer.style.display = "inline-block";
			proxyContainer.style.width = $(options.uploadElem).width()+'px';
			proxyContainer.style.height = $(options.uploadElem).height()+'px';
			proxyContainer.style.position = "relative";
			proxyContainer.style.top = (-$(options.uploadElem).height())+'px';
			proxyContainer.style.zIndex = "3000";
			var proxyElem = document.createElement('iframe');
			proxyElem.src = options.crossOriginSrc;
			proxyElem.style.cssText = "filter: alpha(opacity=0);-moz-opacity: 0;opacity: 0;width: 100%;height: 100%;border: 0;";
			proxyElem.name = "_proxyElem_";

			proxyContainer.appendChild(proxyElem);
			options.uploadElem.parentElement.insertBefore(proxyContainer,options.uploadElem);
			window.onmessage = function(event){
				try{
					var message = JSON.parse(event.data);
				}catch(e){
					console.log('Error:接受消息非JSON字符串，无法解析！');
					return;
				}
				if(message.operate){
					switch (message.operate){
						case 'callback':
							options.callback(parseRetData(message.data));
							proxyElem.src = options.crossOriginSrc+"?r="+Math.random();
							break;
						case 'errCallback':
							options.errCallback(parseRetData(message.data));
							break;
						case 'uploading':
							options.uploading(message.data);
							break;
						case 'imgSrc':
							isElement(options.imgElem) && (options.imgElem.src = message.data);
							break;
						case 'onchange':
							options.onchange&&options.onchange();
							break;
						default:
							break;
					}
				}
				// iframe已就绪
				if(message.state && message.state=='ready'){
					console.log("upload iframe is ready!");
					uploadElemState = 1;
					// 推送配置消息
					window['_proxyElem_'] ?
						window['_proxyElem_'].postMessage(msg({
							operate: 'config',
							uploadUrl: options.uploadUrl,
							imgElem: options.imgElem ? true : null,
							fileSize:options.fileSize,
							fileType:options.fileType
						}), '*') :
						console.log("Error : 代理iframe异常！");
				}
			};
			return {
				send:function(){
					if(uploadElemState){
						window['_proxyElem_'].postMessage(msg({
							operate:'send'
						}),'*');
					}else{
						console.log("iframe 尚未就绪！");
					}
				}
			};
		}

		/*
		 * XHR上传文件
		 */
		var xhr = new XMLHttpRequest();
		options.uploadElem.addEventListener('change',function(){
			var file = options.uploadElem.files[0];
			if(!fileInspect()){
				options.uploadElem.value = "";
				return;
			}
			// 图片预览
			if( options.imgElem ) {
				var reader = new FileReader();
				options.onchange && options.onchange();
				reader.onload = function (evt) {
					options.imgElem.src = evt.target.result;
				};
				// 读取文件并转换为DataUrl
				reader.readAsDataURL(file);
			}
		});

		return {
			send:function(){
				var file = options.uploadElem.files[0];
				if(!file){
					options.errCallback&&options.errCallback("没有选中任何文件");
					return;
				}

				var formData = new FormData();
				$wd.isFunction(options.beforeSend) && options.beforeSend(file);
				formData.append("files", file);

				// 上传状态
				xhr.onreadystatechange = function() {
					if ( xhr.readyState == 4 ){
						if( xhr.status == 200 ){
							options.callback&&options.callback(parseRetData(xhr.responseText));
						}else{
							options.errCallback&&options.errCallback(xhr.responseText);
						}
					}
				};
				// 上传进度
				/**
				 * @param {{loaded,total}} evt
				 */
				xhr.upload.onprogress = function(evt) {
					var loaded = evt.loaded;
					var total = evt.total;
					var percent = Math.floor(100 * loaded / total);
					options.uploading && options.uploading(percent);
				};
				xhr.open("post", options.uploadUrl);

				/**
				 * 带上登录secret
				 * @type {string}
                 */
				var secret = sessionStorage.getItem('secret')?sessionStorage.getItem('secret'):"";
				var key = sessionStorage.getItem('key')?sessionStorage.getItem('key'):"";
				var timeStamp = (new Date()).valueOf()+'';
				var timeWord = Hashes.hex_hmac(secret,timeStamp).toString().toUpperCase();
				var authorParams = {
					key:key,
					timeStamp:timeStamp,
					timeWord:timeWord
				};
				var authorStr = JSON.stringify(authorParams);
				xhr.setRequestHeader("Authorization", authorStr);
				xhr.send(formData);
			}
		}
	};
	FileUploader.prototype={};

	return FileUploader;
});