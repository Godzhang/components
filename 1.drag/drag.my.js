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
};
Drag.prototype = {
	constructor: Drag,
	run: function(){
		var self = this,
			elem = this.elem,
			randomPosition = this.settings.randomPosition, //位置
			direction = this.settings.direction, //方向
			handler = this.settings.handler,
			parent = this.settings.parent,
			isDown = false, //记录鼠标是否按下
			fun = this.settings, //使用外部函数
			X = 0,
			Y = 0,
			moveX, moveY;
		//阻止冒泡
		elem.onmousedown = function(event){
			event = pub.getEvent(event);
			pub.stopPropagation(event);
		};
		
	}
}


























window.Drag = Drag;
})();