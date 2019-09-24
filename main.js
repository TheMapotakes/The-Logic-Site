(function scroll(text) {
	document.title = text;
	setTimeout(function() {
		scroll(text.substr(1) + text.substr(0, 1));
	}, 100);
})('  Caltrop does stuff  ');

class Color {
	constructor(clr) {
		this.color = clr;
		this.gradient = Math.random() * 100;
		this.idealGradient;
		this.updateSpeed = Math.random() / 100;
		this.update = function() {
			this.gradient = this.idealGradient > this.gradient ? this.gradient + this.updateSpeed : this.gradient + this.updateSpeed * -1;
		};
		this.new = function() {
			this.idealGradient = Math.random() * 100;
			this.updateSpeed = Math.random() / 50;
		};
	}
}
var Colors = [
	new Color('#ff71ce'),
	new Color('#01cdfe'),
	new Color('#05ffa1'),
	new Color('#b967ff'),
	new Color('#fffb96')
];
let e = document.getElementById('html');
let step = 0;
setInterval(() => {
	let str = 'radial-gradient(';
	for (let i = 0; i < Colors.length; i++) {
		if (!step) Colors[i].new();
		str += `${Colors[i].color} ${Colors[i].gradient}% ${i == Colors.length - 1 ? ')' : ', '}`;
		Colors[i].update();
	}
	e.style.backgroundImage = str;
	step++;
	if (step > 1000) step = 0;
}, 5);
