(function(){
	var camelRegExp = /-([a-z])/gi;
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
		stopPropagation: function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble = true;
			}	
		},
		getRelatedTarget: function(event){
			if(event.relatedTarget){
				return event.relatedTarget;
			}else if(event.toElement){
				return event.toElement;
			}else if(event.fromElement){
				return event.fromElement;
			}else{
				return null;
			}
		},
		hasFeature: function(name, version){
			return document.implementation.hasFeature(name, version);
		},
		getButton: function(event){
			if(pub.hasFeature("MouseEvents", "2.0")){
				return event.button;
			}else{
				switch(event.button){
					case 0:
					case 1:
					case 3:
					case 5:
					case 7:
						return 0;
					case 2:
					case 6:
						return 2;
					case 4:
						return 1;
				}
			}
		},
		getWheelDelta: function(event){
			if(event.wheelDelta){
				return event.wheelDelta;
			}else{
				return -event.detail * 40;
			}
		},
		getCharCode: function(event){
			//触发keypress事件才有值
			if(typeof event.charCode === "number"){
				return event.charCode;
			}else{
				return event.keyCode;
			}
		},
		getCodeString: function(event){
			var keyCode = pub.getCharCode(event);
			return String.fromCharCode(keyCode);
		},
		//获取计算后的样式
		getComputedStyle: function(elem, pseudo){
			if(window.getComputedStyle){
				return window.getComputedStyle(elem, pseudo);
			}else{
				return elem.currentStyle;
			}
		},
		//获取具体样式，不支持驼峰写法
		getPropertyValue: function(elem, style, pseudo){
			if(window.getComputedStyle){
				return window.getComputedStyle(elem, pseudo).getPropertyValue(style);
			}else{
				style = pub.camelCase(style);
				//IE9+支持currentStyle.getPropertyValue方法
				return elem.currentStyle.getAttribute(style);
			}			
		},
		//阻止右键上下文菜单
		preventContextmenu: function(event){
			pub.addEvent(document, "contextmenu", function(event){
				event = pub.getEvent(event);
				pub.preventDefault(event);
			});
		},
		//返回表单选中文字
		getSelectedText: function(textbox){
			if(typeof textbox.selectionStart === "number"){
				return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
			}else if(document.selection){
				return document.selection.createRange().text;
			}
		},
		//选择文本指定范围
		selectText: function(textbox, startIndex, endIndex){
			if(textbox.setSelectionRange){
				textbox.focus();
				textbox.setSelectionRange(startIndex, endIndex);
			}else if(textbox.createTextRange){
				var range = textbox.createTextRange();
				range.collapse(true);
				range.moveStart("character", startIndex);
				range.moveEnd("character", endIndex);
				range.select();
			}
		},
		//获取剪切板内容
		getClipboardText: function(event){
			var clipboardData = (event.clipboardData || window.clipboardData);
			return clipboardData.getData("text");
		},
		setClipboardText: function(event){
			if(event.clipboardData){
				return event.clipboardData.setData("text/plain", value);
			}else if(window.clipboardData){
				return window.clipboardData.setData("text", value);
			}
		},
		//添加规则
		insertRule: function(sheet, selectorText, cssText, pos){
			if(sheet.insertRule){
				sheet.insertRule(selectorText + "{" + cssText + "}", pos);
			}else if(sheet.addRule){
				sheet.addRule(selectorText, cssText, pos);
			}
		},
		//删除规则
		deleteRule: function(sheet, index){
			if(sheet.deleteRule){
				sheet.deleteRule(index);
			}else if(sheet.removeRule){
				sheet.removeRule(index);
			}
		},
		//获取元素偏移量
		getElementLeft: function(elem){
			var actualLeft = elem.offsetLeft;
			var current = elem.offsetParent;

			while(current !== null){
				actualLeft += current.offsetLeft;
				current = current.offsetParent;
			}

			return actualLeft;
		},
		getElementTop: function(elem){
			var actualTop = elem.offsetTop;
			var current = elem.offsetParent;

			while(current !== null){
				actualTop += current.offsetTop;
				current = current.offsetParent;
			}

			return actualTop;
		},
		//获取视口(客户区)大小，不包括滚动条
		getViewport: function(){
			if(document.compatMode == "BackCompat"){
				return {
					width: document.body.clientWidth,
					height: document.body.clientHeight
				};
			}else{
				return {
					width: document.documentElement.clientWidth,
					height: document.documentElement.clientHeight
				};
			}
		},
		//确定元素相对于视口左上角(0,0)的位置
		getBoundingClientRect: function(elem){
			var scrollTop = document.documentElement.scrollTop;
			var scrollLeft = document.documentElement.scrollLeft;

			if(elem.getBoundingClientRect){
				if(typeof arguments.callee.offset != "number"){
					var scrollTop = document.documentElement.scrollTop;
					var temp = document.createElement("div");
					temp.style.cssText = "position: absolute;left: 0;top: 0;";
					document.body.appendChild(temp);
					arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
					document.body.removeChild(temp);
					temp = null;
				}

				var rect = elem.getBoundingClientRect();
				var offset = arguments.callee.offset;

				return {
					left: rect.left + offset,
					right: rect.right + offset,
					top: rect.top + offset,
					bottom: rect.bottom + offset
				};
			}else{
				var actualLeft = pub.getElementLeft(elem);
				var actualTop = pub.getElementTop(elem);

				return {
					left: actualLeft - scrollLeft,
					right: actualLeft + elem.offsetWidth - scrollLeft,
					top: actualTop - scrollTop,
					bottom: actualTop + elem.offsetHeight - scrollTop
				}
			}
		},
		nodeFilter: ['NodeFilter.SHOW_ALL','NodeFilter.SHOW_ELEMENT','NodeFilter.SHOW_TEXT'],
		//创建treewalker
		createTreeWalker: function(root, nodeFilter, elem, ifskip){
			var filter,skiporreject, treewalker;

			if(root.nodeType !== 1 && root !== document) return null;
			if(!elem){
				filter = null;
			}else{
				filter = function(node){
					if(ifskip){
						skiporreject = NodeFilter.FILTER_SKIP;
					}else{
						skiporreject = NodeFilter.FILTER_REJECT;
					}
					return node.tagName.toLowerCase() == elem ? NodeFilter.FILTER_ACCEPT : skiporreject;
				}
			}

			treewalker = document.createTreeWalker(root, nodeFilter, filter, false);

			return treewalker;
		},


		camelCase: function(str){
			return str.replace(/^-ms-/,"ms-").replace(camelRegExp, function(all, letter){
				return letter.toUpperCase();
			});
		},
		keys: function(obj){
			if(toString.call(obj) !== '[object Object]') return [];

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