var selector = new Selector();

function randomColor() {
	var color = Math.floor(Math.random() * 16777216).toString(16);
	return '#000000'.slice(0, -color.length) + color;
}
document.addEventListener(
	'contextmenu',
	function(e) {
		e.preventDefault();
	},
	false
);
var m2down = false;
var orbPreivew;
canvas.onmousedown = function(e) {
	x = e.clientX - (this.offsetLeft - document.documentElement.scrollLeft);
	y = e.clientY - (this.offsetTop - document.documentElement.scrollTop);
	switch (e.which) {
		case 1:
			for (let o of renderList) {
				var foundElement = false;
				if (o.selectable && Math.pow(x - o.position.x, 2) + Math.pow(y - o.position.y, 2) < Math.pow(o.radius, 2)) {
					selector.select(o);
					foundElement = true;
					break;
				}
			}
			if (!foundElement) {
				renderList.push(new AstronomicalObject(x, y, 'Planet', 5, 5, randomColor()));
				selector.select(renderList[renderList.length - 1]);
			}
			break;
		case 2:
			break;
		case 3:
			m2down = true;
			if (orbPreivew) orbPreivew.remove();
			orbPreivew = new Preview(x, y);

			break;
		default:
			break;
	}
};
canvas.onmouseup = function(e) {
	if (e.which == 1) {
		selector.unselect();
	} else if (e.which == 3) {
		renderList.push(orbPreivew.newO);
		orbPreivew.remove();
		m2down = false;
	}
};
canvas.onmousemove = function(e) {
	x = e.clientX - (this.offsetLeft - document.documentElement.scrollLeft);
	y = e.clientY - (this.offsetTop - document.documentElement.scrollTop);
	selector.move(x, y);

	if (m2down) {
		if (orbPreivew) orbPreivew.remove();
		orbPreivew = new Preview(x, y);
	}
};

class Preview {
	constructor(x, y) {
		this.id = 0;
		var mousePos = new Victor(x, y);

		var curIndex;
		var curNum = 0;
		for (let i = 0; i < renderList.length; i++) {
			if (renderList[i].id && renderList[i].mass >= 5) {
				let dist = mousePos.distance(renderList[i].position);
				if (1 / dist * renderList[i].mass > curNum) {
					curNum = 1 / dist * renderList[i].mass;
					curIndex = i;
				}
			}
		}
		var parent = renderList[curIndex];

		var dist = mousePos.distanceSq(parent.position);
		var g = parent.mass / dist;
		var a = Math.atan2(parent.position.y - mousePos.y, parent.position.x - mousePos.x);
		var orbV = new Victor(g * Math.cos(a), g * Math.sin(a)).rotateByDeg(90).multiply({ x: Math.sqrt(dist), y: Math.sqrt(dist) });

		this.newO = new AstronomicalObject(x, y, 'Planet', 5, 5, randomColor(), orbV.x, orbV.y, false);

		this.draw = function() {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(parent.position.x, parent.position.y);
			ctx.closePath();
			ctx.stroke();

			this.newO.draw();
		};
		this.update = function() {};
		this.remove = function() {
			var index = renderList.indexOf(this);
			if (index > -1) {
				renderList.splice(index, 1);
			}
		};
		renderList.push(this);
	}
}

canvas.onwheel = function(e) {
	e.preventDefault();
	selector.scroll(e.deltaY < 0);
};
