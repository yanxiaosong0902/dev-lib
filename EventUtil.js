
;(function(root,factory){
	if(typeof define === 'function' && define.amd){
		define([],factory);
	}else if(typeof exports === 'object'){
		module.exports = factory()
	}else{
		root.EventUtil = factory()
	}
})(this,function(){
	const EventUtil = {
		getEvent(event){
		return event?event:window.event
		},
		getTarget(event){
			return event.target||event.srcElement
		},
		preventDefault(event){
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue = true
			}
		},
		stopPropagation(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble = true
			}
		},
		addHandler(element,type,handler){
			if(element.addEventListener){
				element.addEventListener(type,handler,false);
			}else if(element.attachEvent){
				element.attachEvent("on"+type,handler);
			}else{
				element["on"+type] = handler;
			}
		},
		removeHandler(element,type,handler){
			if(element.removeEventListener){
				element.removeEventListener(type,handler,false);
			}else if(element.detachEvent){
				element.detachEvent("on"+type,handler);
			}else{
				element["on"+type] = null;
			}
		}
	}
	window.EventUtil = EventUtil;

	return EventUtil
})