;window.onload = function(){
	document.body.addEventListener('click',function(e){
		if(e.target.tagName == 'I'){
			var list = e.target.parentNode.classList;
			list = Array.prototype.slice.call(list);
			if(list.indexOf('on')>-1){
				e.target.parentNode.classList.remove('on');
			}else{
				e.target.parentNode.classList.add('on');
			}
		}
	})
}