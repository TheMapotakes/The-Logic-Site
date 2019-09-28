var logo = document.getElementById('logo');
var moveX = 1.5;
var moveY = 1.5;
var curLogo = 0;

updateLogo();
logo.style.marginLeft = Math.floor(Math.random() * (window.innerWidth - 500)) + 'px';
logo.style.marginTop = Math.floor(Math.random() * (window.innerHeight - 300)) + 'px';

function move() {
	let curX = parseFloat(logo.style.marginLeft.replace('px', ''));
	curY = parseFloat(logo.style.marginTop.replace('px', ''));

	if (curX > window.innerWidth - 370) {
		moveX = -1.5;
		updateLogo();
	} else if (curX < -30) {
		moveX = 1.5;
		updateLogo();
	}
	if (curY > window.innerHeight - 175) {
		moveY = -1.5;
		updateLogo();
	} else if (curY < -25) {
		moveY = 1.5;
		updateLogo();
	}

	logo.style.marginLeft = curX + moveX + 'px';
	logo.style.marginTop = curY + moveY + 'px';
}
function updateLogo() {
	var newLogo = Math.floor(Math.random() * 5);
	while (newLogo == curLogo) {
		newLogo = Math.floor(Math.random() * 5);
	}
	logo.src = './assets/logo' + newLogo + '.png';
	curLogo = newLogo;
}

function loop() {
	requestAnimationFrame(loop);
	move();
}
loop();
