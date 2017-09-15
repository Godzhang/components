(function(){
	var obj = Object.prototype;

	var toString = obj.toString;

	var pub = {
		addEvent: function(element, type, handler){
			if(element.addEventListener){
				element.addEventListener(type, handler, false);
			}else if(element.attachEvent){
				element.attachEvent('on' + type, handler);
			}else{
				element["on" + type] = handler;
			}
		},
		removeEvent: function(element, type, handler){
			if(element.removeEventListener){
				element.removeEventListener(type, handler, false);
			}else if(element.detachEvent){
				element.detachEvent('on' + type, handler);
			}else{
				element["on" + type] = null;
			}
		},
		getEvent: function(event){
			return event ? event : window.event;
		},
		getTarget: function(event){
			return event.target || event.srcElement;
		},
		preventDefault: function(event){
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue = false;
			}
		},
		stopPropagetion: function(event){
			if(event.stopPropagetion){
				event.stopPropagetion();
			}else{
				event.cancelBubble = true;
			}	
		},
		keys: function(obj){
			if(toString.call(obj) != '[object Object]') return [];

			if(Object.keys){
				return Object.keys(obj);
			}

			var res = [];
			for(var key in obj){
				if(obj.hasOwnProperty(key)){
					res.push(key);
				}
			}
			return res;
		},
		//返回新对象
		extend: function(first, second){
			var result = {},
				i = 0,
				len = arguments.length;

			for(; i < len; i++){
				var obj = arguments[i],
					keys = pub.keys(obj),
					length = keys.length,
					j = 0, key;

				for(; j < length; j++){
					key = keys[j];

					if(obj[key] !== undefined){
						result[key] = obj[key];
					}
				}
			}
			return result;
		}

	}
	window.pub = pub;
})();