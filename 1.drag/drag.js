(function(document){
	var drag = function(options){
		var defaults = {
			direction: "all"
		};
		var settings = pub.extend(defaults,options);

		var dragging = null,
			diffX = 0,
			diffY = 0;
		
		function handleEvent(ev){
			//获取事件和目标
			ev = ev || window.event;
			var target = ev.target || ev.srcElement;

			//确定事件类型
			switch(event.type){
				case "mousedown":
					if(target.className.indexOf("draggable") > -1){
						dragging = target;
						diffX = ev.clientX - target.offsetLeft;
						diffY = ev.clientY - target.offsetTop;
					}
					break;

				case "mousemove":
					var posX = ev.clientX - diffX,
						posY = ev.clientY - diffY;

					if(dragging != null){
						switch(settings.direction){
							case "all":
								dragging.style.left = posX + "px";
								dragging.style.top = posY + "px";
								break;
							case "x":
								dragging.style.left = posX + "px";
								break;
							case "y":
								dragging.style.top = posY + "px";
								break;
						}
					}
					break;

				case "mouseup":
					dragging = null;
					break;
			}
		};

		return {
			enable: function(){
				document.addEventListener("mousedown", handleEvent);
				document.addEventListener("mousemove", handleEvent);
				document.addEventListener("mouseup", handleEvent);
			},
			disable: function(){
				document.removeEventListener("mousedown", handleEvent);
				document.removeEventListener("mousemove", handleEvent);
				document.removeEventListener("mouseup", handleEvent);
			}
		}
	}
	window.drag = drag;
})(document);

