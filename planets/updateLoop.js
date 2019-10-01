var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var G = 9.8;

var renderList = [];
renderList.push(new AstronomicalObject(canvas.width / 2, canvas.height / 2, 'Star', 1000, 100, '#FFB200', 0, 0, true));

function draw() {
	requestAnimationFrame(draw);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < renderList.length; i++) {
		renderList[i].update(G);
		renderList[i].draw();
	}
}
draw();
