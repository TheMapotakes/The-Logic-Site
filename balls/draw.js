function randomColor() {
	var color = Math.floor(Math.random() * 16777216).toString(16);
	return '#000000'.slice(0, -color.length) + color;
}

function drawCricle(color, x, y, size, outline) {
	outline ? (ctx.strokeStyle = color) : (ctx.fillStyle = color);
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.closePath();
	outline ? ctx.stroke() : ctx.fill();
}
