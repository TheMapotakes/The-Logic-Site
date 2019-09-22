var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var selector = new Selector();

canvas.onmousedown = function(e) {
	x = e.clientX - (this.offsetLeft - document.documentElement.scrollLeft);
	y = e.clientY - (this.offsetTop - document.documentElement.scrollTop);
	switch (e.which) {
		case 1:
			selector.m1 = true;
			var foundElement = false;
			for (let o of renderList) {
				if (o.moveable && Math.pow(x - o.position.x, 2) + Math.pow(y - o.position.y, 2) < Math.pow(o.weight, 2)) {
					selector.select(o);
					foundElement = true;
					break;
				}
			}
			if (!foundElement) {
				renderList.push(new Ball(x, y, null, true, true, false, true));
				selector.select(renderList[renderList.length - 1]);
			}
			break;
		case 2:
			break;
		case 3:
			drawCricle('#000000', x, y, 10, false);
			break;
		default:
			break;
	}
};
canvas.onmouseup = function(e) {
	if (e.which == 1) {
		selector.unselect();
		selector.m1 = false;
	}
};
canvas.onmousemove = function(e) {
	x = e.clientX - (this.offsetLeft - document.documentElement.scrollLeft);
	y = e.clientY - (this.offsetTop - document.documentElement.scrollTop);
	selector.move(x, y);
};
canvas.onwheel = function(e) {
	e.preventDefault();
	selector.scroll(e.deltaY < 0);
};

var GY = 0.01,
	GX = 0;
trailLength = 10;

document.getElementById('gx').oninput = function() {
	GX = parseFloat(this.value);
	document.getElementById('gxNum').value = this.value;
};
document.getElementById('gy').oninput = function() {
	GY = parseFloat(this.value);
	document.getElementById('gyNum').value = this.value;
};
document.getElementById('gxNum').oninput = function() {
	GX = parseFloat(this.value);
	document.getElementById('gx').value = this.value;
};
document.getElementById('gyNum').oninput = function() {
	GY = parseFloat(this.value);
	document.getElementById('gy').value = this.value;
};
document.getElementById('showTrails').oninput = function() {
	trailLength = this.checked ? 10 : 0;
};
document.getElementById('reset').onclick = function() {
	GX = 0;
	document.getElementById('gx').value = 0;
	document.getElementById('gxNum').value = 0;
	GY = 0.01;
	document.getElementById('gy').value = 0.01;
	document.getElementById('gyNum').value = 0.01;
	trailLength = 10;
	document.getElementById('showTrails').checked = true;
};
document.getElementById('murder').onclick = function() {
	renderList.length = 0;
};
document.getElementById('bounce').oninput = function() {
	hExtraOrdinare(this.value);
	document.getElementById('bounceNum').value = this.value;
};
document.getElementById('bounceNum').oninput = function() {
	hExtraOrdinare(this.value);
	document.getElementById('bounce').value = this.value;
};

function hExtraOrdinare(n) {
	for (let o of renderList) {
		o.restitution = n;
	}
}

var lastCalledTime;
var fps;
function getFPS() {
	if (!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
		return;
	}
	delta = (Date.now() - lastCalledTime) / 1000;
	lastCalledTime = Date.now();
	fps = 1 / delta;
}

var renderList = [];

function loop() {
	window.requestAnimationFrame(loop);
	getFPS();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let o of renderList) {
		for (let o2 of renderList) {
			o.handleCollision(o2);
		}
		o.update();
		o.draw();
	}
}
loop();
