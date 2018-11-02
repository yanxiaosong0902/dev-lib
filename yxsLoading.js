;(function(root,factory){
	if(typeof define === 'function' && define.amd){
		define([],factory);
	}else if(typeof exports === 'object'){
		module.exports = factory();
	}else{
		root.$Loading = factory();
	}
})(this,function(){
	var si;
	function mask(){
		var frag = document.createDocumentFragment();
		var page = document.createElement('DIV');
		page.innerHTML = '<div class="yxs-moon"></div><div class="yxs-dot">请稍等，正在加载</div><div class="yxs-png"></div><div id="yxs-roll-rotate"></div>';
		page.className = 'yxs-mask';
		page.id = 'yxs-mask';
		frag.appendChild(page);
		return frag
	}
	function styleCss(position,top,left){
		var styleEl = document.createElement('style');
		styleEl.type = 'text/css';
		styleEl.innerHTML = 
			'.yxs-mask{width:100vw;height:100vh;background:#c1c1c1;z-index:9999;opacity:0.8;font-size:14px}'
			+
			'#yxs-mask{left:'+left+';top:'+top+';position:'+position+'}'
			+
			".yxs-moon {" +
            "        position: absolute;" +
            "        left: 45%;" +
            "        top: 35%;" +
            "        width: 150px;" +
            "        height: 150px;" +
            "		 display:none;"+
            "        border-radius: 200px;" +
            "        animation: wind 1.0s linear infinite;" +
            "        animation-delay: 0.1s;" +
            "        -moz-animation: wind 1.0s linear infinite;" +
            "        -moz-animation-delay: 0.1s;" +
            "        -webkit-animation: wind 1.0s linear infinite;" +
            "        -webkit-animation-delay: 0.1s;" +
            "        z-index: 99999;" +
            "    }" +
            "    .yxs-moon {" +
            "        box-shadow: inset -10px 0 2px #333;" +
            "    }" +
            "    @keyframes wind {" +
            "        0% {" +
            "            transform: rotate(0deg);" +
            "        }" +
            "        100% {" +
            "            transform: rotate(360deg);" +
            "        }" +
            "    }" +
            "    @-moz-keyframes wind {" +
            "        0% {" +
            "            -moz-transform: rotate(0deg);" +
            "        }" +
            "        100% {" +
            "            -moz-transform: rotate(360deg);" +
            "        }" +
            "    }" +
            "    @-webkit-keyframes wind {" +
            "        0% {" +
            "            -webkit-transform: rotate(0deg);" +
            "        }" +
            "        100% {" +
            "            -webkit-transform: rotate(360deg);" +
            "        }" +
            "}"
            +
            '.yxs-dot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:none;color:#fff}'
            +
            '.yxs-png{display:none}'
            +'#yxs-roll-rotate{display: block;'+
			'width: 50px;'+
			'height: 50px;'+
			'display:none;'+
			'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);'+
			'border-radius: 100%;'+
			'background: transparent;'+
			'border:4px solid #fff;'+
			'border-bottom-color: transparent;'+
			'-webkit-animation-fill-mode: both;'+
          	'animation-fill-mode: both;'+
          	'-webkit-animation: rotate 1s 0s linear infinite;'+
          	'animation: rotate 1s 0s linear infinite;}'+
          	'@keyframes rotate {'+
			  	'0% {'+
			    '-webkit-transform: rotate(0deg) scale(1);'+
			    '        transform: rotate(0deg) scale(1); }'+

			  	'50% {'+
			    '-webkit-transform: rotate(180deg) scale(0.6);'+
			    '        transform: rotate(180deg) scale(0.6); }'+

			  	'100% {'+
			    '-webkit-transform: rotate(360deg) scale(1);'+
			    '      	transform: rotate(360deg) scale(1); '+
			    '}' +
			'}'
			;
		document.querySelector('head').appendChild(styleEl);
	}
	function showMask(position){
		var top = document.documentElement.scrollTop||document.body.scrollTop;
		var left = document.documentElement.scrollLeft||document.body.scrollLeft;
		var el = document.getElementById('yxs-mask');
		if(el){
			el.style.display = 'block';
		}
		else{
			document.body.appendChild(mask());
		}
		
		if(position === 'absolute'){
			document.body.style.overflow = 'hidden';
			styleCss(position,top+'px',left+'px');
		}
		else{
			styleCss(position,0,0);
		}
		setTimeout(function(){window.scrollTo(left,top)},0);
		document.getElementById('yxs-mask').addEventListener('click',function(e){
			if(e.target.id === 'yxs-mask'){
				e.target.style.display = 'none';
				window.clearInterval(si);
			}
		})
	}
	function end(){
		window.clearInterval(si);
		document.getElementById('yxs-mask').style.display ='none';
	}
	function loading(position,type,speed){
		showMask(position);
		if(type == 1){
			document.getElementsByClassName('yxs-moon')[0].style.display = 'block';
		}else if(type == 2){
			var el_dot = document.getElementsByClassName('yxs-dot')[0];
			el_dot.style.display = 'block';
			si = setInterval(tipText,500);
			function tipText(){
				var textL = el_dot.innerText.length;
				switch(textL){
					case 8:
						el_dot.innerText = '请稍等，正在加载.';
						break;
					case 9:
						el_dot.innerText = '请稍等，正在加载..';
						break;
					case 10:
						el_dot.innerText = '请稍等，正在加载...';
						break;
					case 11:
						el_dot.innerText = '请稍等，正在加载....';
						break;
					case 12:
						el_dot.innerText = '请稍等，正在加载.....';
						break;
					case 13:
						el_dot.innerText = '请稍等，正在加载';
						break;
					default:
						break;	
				}
			}
		}
		else if(type === 3){
			document.getElementById('yxs-roll-rotate').style.display = 'block'
		}
	}
	window.$Loading = {
		showMask:function(position){
			showMask(position);
		},
		loading:function(position,type,speed){
			loading(position,type,speed);
		},
		end:end
	}
	return $Loading
})