(function(){
	function Drag(elem, options){
		this.elem = elem;
		this.x = 0;
		this.y = 0;
		this.defaults = {
			parent: 'parent',
			randomPosition: true,
			direction: 'all',
			handler: false,
			dragStart: function(x, y){},
			dragEnd: function(x, y){},
			dragMove: function(x, y){}
		};
		this.settings = pub.extend(this.defaults, options);
		this.run();
	};
	Drag.prototype = {
		constructor: Drag,
		run: function(){
			var self = this,
				elem = self.elem,
				randomPosition = self.settings.randomPosition, //位置
				direction = self.settings.direction.toLowerCase(), //方向
				handler = self.settings.handler,
				parent = self.settings.parent,
				isDown = false, //记录鼠标是否按下
				fun = self.settings, //使用外部函数
				X = 0,
				Y = 0,
				moveX, moveY;
			//阻止冒泡
			pub.addEvent(document,"mousedown", function(event){
				event = pub.getEvent(event);
				var target = pub.getTarget(event);
				if(target.nodeName.toLowerCase() !== 'img'){
					pub.stopPropagetion(event);
				}
				pub.preventDefault(event);
			});
			//初始化判断
			if(parent == 'parent'){
				parent = elem.parentNode;
			}else{
				parent = document.querySelector(parent);
			}
			if(!handler){
				handler = elem;
			}else{
				handler = document.querySelector(handler);
			}
			//初始化
			parent.style.position = "relative";
			elem.style.position = "absolute";
			var boxWidth = 0,
				boxHeight = 0,
				sonWidth = 0,
				sonHeight = 0;
			//初始化盒子和元素的大小
			initSize();
			if(randomPosition){randomPlace();}
			pub.addEvent(window,"resize", function(){
				initSize();
				if(randomPosition){randomPlace();}
			});
			//初始化函数
			function initSize(){
				boxWidth = parent.clientWidth;
				boxHeight = parent.clientHeight;
				sonWidth = elem.clientWidth;
				sonHeight = elem.clientHeight;
			}
			function randomPlace(){
				if(randomPosition){
					var randX = parseInt(Math.random() * (boxWidth - sonWidth));
					var randY = parseInt(Math.random() * (boxHeight - sonHeight));
					switch(direction){
						case "all":
							elem.style.top = randY + "px";
							elem.style.left = randX + "px";
							break;
						case "x":
							elem.style.top = randY + "px";
							break;
						case "y":
							elem.style.left = randX + "px";
							break;
					}
				}
			}
			//添加处理事件
			pub.addEvent(handler, 'mousedown', function(event){
				event = pub.getEvent(event);
				isDown = true;
				X = event.pageX;	//记录点击位置
				Y = event.pageY;
				self.x = elem.offsetLeft;  //元素距离父元素距离
				self.y = elem.offsetTop;
				fun.dragStart(parseInt(elem.style.left), parseInt(elem.style.top));
				return false;
			});
			pub.addEvent(document, 'mouseup', function(event){
				fun.dragEnd(parseInt(elem.style.left), parseInt(elem.style.top));
				isDown = false;
			});
			pub.addEvent(document, 'mousemove', function(event){
				event = pub.getEvent(event);
				moveX = self.x + event.pageX - X;
				moveY = self.y + event.pageY - Y;

				function move(direction){
					if(!isDown) return;

					switch(direction){
						case "all":
							elem.style.top = moveY + "px";
							elem.style.left = moveX + "px";
							if(moveX < 0){
								elem.style.left = 0;
							}
							if(moveX > (boxWidth - sonWidth)){
								elem.style.left = boxWidth - sonWidth + "px";
							}
							if(moveY < 0){
								elem.style.top = 0;
							}
							if(moveY > (boxHeight- sonHeight)){
								elem.style.top = boxHeight - sonHeight + "px";
							}
							break;
						case "x":
							elem.style.left = moveX + "px";
							if(moveX < 0){
								elem.style.left = 0;
							}
							if(moveX > (boxWidth - sonWidth)){
								elem.style.left = boxWidth - sonWidth + "px";
							}
							break;
						case "y":
							elem.style.top = moveY + "px";
							if(moveY < 0){
								elem.style.top = 0;
							}
							if(moveY > (boxHeight- sonHeight)){
								elem.style.top = boxHeight - sonHeight + "px";
							}
							break;
					}
				}

				if(isDown){
					fun.dragMove(parseInt(elem.style.left), parseInt(elem.style.top));
				}else{
					return false;
				}

				move(direction);
			});
		}
	};

	window.Drag = Drag;
})();