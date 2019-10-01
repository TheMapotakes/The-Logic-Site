var screen;
var aliveId;
$(document).ready(function() {
	screen = document.getElementsByClassName('gotWrap')[0];
	document.getElementsByClassName('overlay')[0].innerHTML = 'AV-' + (~~(Math.random() * 2) + 1);
});
function removeEl() {
	cells = [];
	screen.innerHTML = '';
}
function handleCellClick(id) {
	var x = id.split('.')[0];
	var y = id.split('.')[1];

	for (let cell of cells) {
		if (cell.x == x && cell.y == y) cell.toggle();
	}
}

class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.activated = false;
		this.nextState = 0;

		this.getElement = function() {
			return document.getElementById(this.x + '.' + this.y);
		};
		this.activate = function() {
			var el = this.getElement();
			this.activated = true;
			el.style.animation = 'glow 1s ease-in-out infinite alternate';
			el.style.webkitAnimation = 'glow 1s ease-in-out infinite alternate';
			el.style.backgroundColor = '#FFB500';
		};
		this.deactivate = function() {
			var el = this.getElement();
			this.activated = false;
			el.style.animation = '';
			el.style.webkitAnimation = '';
			el.style.backgroundColor = '#00000000';
		};
		this.toggle = function() {
			if (!this.activated) this.activate();
			else this.deactivate();
		};

		this.getAliveNeighbours = function() {
			let n = 0;
			for (let cell of cells) {
				if (cell.x == this.x - 1 && cell.y == this.y && cell.activated) n++;
				if (cell.x == this.x + 1 && cell.y == this.y && cell.activated) n++;
				if (cell.x == this.x && cell.y == this.y - 1 && cell.activated) n++;
				if (cell.x == this.x && cell.y == this.y + 1 && cell.activated) n++;
				if (cell.x == this.x - 1 && cell.y == this.y + 1 && cell.activated) n++;
				if (cell.x == this.x - 1 && cell.y == this.y - 1 && cell.activated) n++;
				if (cell.x == this.x + 1 && cell.y == this.y + 1 && cell.activated) n++;
				if (cell.x == this.x + 1 && cell.y == this.y - 1 && cell.activated) n++;
			}
			return n;
		};
		this.setNextState = function() {
			var n = this.getAliveNeighbours();
			if (this.activated) {
				if (n >= 2 && n <= 3) this.nextState = 0;
				else this.nextState = -1;
			} else {
				if (n == 3) this.nextState = 1;
				else this.nextState = 0;
			}
		};
		this.update = function() {
			switch (this.nextState) {
				case 1:
					this.activate();
					break;
				case -1:
					this.deactivate();
					break;
				default:
					this.nextState = 0;
					break;
			}
		};

		if (Math.random() > 0.9) this.activate();
	}
}

var cells = [];
var start = new Audio('audio/startup.wav');
function init() {
	aliveId = Math.random();
	var curId = aliveId;
	removeEl();
	var space = '                       ';
	var ascii = `
${space}     _____                               __   _      _  __     
${space}    / ____|                             / _| | |    (_)/ _|    
${space}   | |  __  __ _ _ __ ___   ___    ___ | |_  | |     _| |_ ___ 
${space}   | | |_ |/ _\` | '_ \` _ \\ / _ \\  / _ \\|  _| | |    | |  _/ _ \\
${space}   | |__| | (_| | | | | | |  __/ | (_) | |   | |____| | ||  __/
${space}    \\_____|\\__,_|_| |_| |_|\\___|  \\___/|_|   |______|_|_| \\___|
${space}       Space - Toggle Pause\tLMB - Toggle Cell Active                                                  
                                                                                                                                                                                 
    `;
	screen.innerHTML = '<div class="ascii-art">' + ascii + '</div>';
	setTimeout(() => addGrid(curId), 4200);

	start = new Audio('audio/startup.wav');
	start.play();
}

function addGrid(id) {
	removeEl();
	let str = '';
	for (let y = 0; y <= 50; y++) {
		str += '<div class="cellwrap">';
		for (let x = 0; x <= 70; x++) {
			str += '<div class="cell" id="' + x + '.' + y + '" onclick="handleCellClick(this.id)"></div>';
		}
		str += '</div>';
	}
	if (id != aliveId) return;
	screen.innerHTML = str;
	var beep = new Audio('audio/startBeep.wav');
	beep.play();
	cells = [];
	for (let x = 0; x <= 70; x++) {
		for (let y = 0; y <= 50; y++) {
			cells.push(new Cell(x, y));
		}
	}
	if (id == aliveId) {
		update();
		loopId = Math.random();
		loopAudio(loopId);
	}
}

function shutdown() {
	removeEl();
	loopId = -1;
	loop.pause();
	start.pause();
	var shut = new Audio('audio/shutdown.wav');
	shut.play();
	aliveId = -1;
}

var loopId;
var loop = new Audio('audio/loop.wav');
function loopAudio(id) {
	if (loopId == id) {
		loop = new Audio('audio/loop.wav');
		loop.play();
		setTimeout(() => loopAudio(id), 54000);
	}
}

var doStep = true;

document.onkeydown = function(e) {
	if (e.keyCode == 32) {
		if (doStep) {
			doStep = false;
		} else {
			doStep = true;
			update();
		}
	}
};
function update() {
	if (doStep) requestAnimationFrame(update);
	for (let cell of cells) {
		cell.setNextState();
	}
	for (let cell of cells) {
		cell.update();
	}
}
