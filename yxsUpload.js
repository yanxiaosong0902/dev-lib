;(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['./yxs.js'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('./yxs.js'));
	} else {
		root.FileUploader = factory(root.$yxs);
	}
})(this, function($yxs){
	var FileUploader = function(config){
		var options = {
			uploadUrl:'',
			imgElem:'',
			uploadElem:null,
			callback:null,
			errCallback:null,
			uploading:null,
			beforeSend:null,
			fileType:'',
			onChange:null,
			fileSize:null//kb
		};
		for(var item in config){
			if(config.hasOwnProperty(item)){
				options[item] = config[item];
			}
		}

		//文件类型&&大小检查
		function fileInspect(){
			var file = options.uploadElem.files[0];
			if(!file){
				console.log('没有选择文件');
				return false
			}
			var typeMatch = true;
			if(options.fileType){
				typeMatch = false;
				if($yxs.isString(options.fileType)){
					options.fileType = options.fileType.split(',');
				}
				if(isArray(options.fileType)){
					options.fileType.forEach(function (type) {
						$yxs.isString(type) && file.name.match(/\.[^.]*$/) && file.name.match(/\.[^.]*$/)[0].toLowerCase().indexOf(type) >= 0 && (typeMatch = true);
					});
				}
			}
			if(!typeMatch){
				options.errCallback&&options.errCallback("文件类型错误！正确类型:"+ options.fileType.join(','));
				return false;
			}
			if ($yxs.isString(options.fileSize)) {
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
			return true
		}
		/*
		XHR上传
		*/
		var xhr = new XMLHttpRequest();
		options.uploadElem.addEventListener('change',function(e){
			var file = options.uploadElem.files[0];
			if(!fileInspect()){
				options.uploadElem.value = "";
				return;
			}
			if( options.imgElem ) {
				var reader = new FileReader();
				options.onChange && options.onChange();
				// 读取文件并转换为DataUrl
				reader.readAsDataURL(file);
				reader.onload = function (evt) {
					options.imgElem.src = evt.target.result;
				};
			}
		})
		return {
			send:function(){
				var file = options.uploadElem.files[0];
				if(!file){
					options.errCallback&&options.errCallback("没有选中任何文件");
					return;
				}

				var formData = new FormData();
				$yxs.isFunction(options.beforeSend) && options.beforeSend(file);
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
				console.log(formData.get('files'));
				xhr.send(formData);
			}
		}
	}
	FileUploader.prototype={};

	return FileUploader;
})