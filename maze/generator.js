var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var scale = 40;
var height = 20;
var width = 20;

var autoMaze = true;
var stepByStep = true;
var loop = false;
var delay = 100;

var visited = '#BEBEBE' + 90;
var walls = '#000000';
var currentTileColor = '#00FF00';
var backtrackColor = '#FF0000';

var colorVisited = document.getElementById('visited');
var colorWalls = document.getElementById('walls');
var colorCurrentTile = document.getElementById('currentTile');
var colorCurrentTileback = document.getElementById('currentTileback');

colorVisited.onchange = function() {
	visited = this.value + 90;
};
colorWalls.onchange = function() {
	walls = this.value;
};
colorCurrentTile.onchange = function() {
	currentTileColor = this.value;
};
colorCurrentTileback.onchange = function() {
	backtrackColor = this.value;
};

var grid = [];
var done = false;

var start;
var end;

var currentTile;
var stack = [];

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

function changeSeed(i) {
	m_w = (123456789 + i) & mask;
	m_z = (987654321 - i) & mask;
}

function random() {
	m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
	m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
	var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
	result /= 4294967296;
	return result;
}

function resetRNG() {
	m_w = (123456789 + seed) & mask;
	m_z = (987654321 - seed) & mask;
}

var seed = Date.now();
changeSeed(seed);

var lastSelected = {};

var infoDiv = document.getElementById('info');

class Tile {
	constructor(x, y) {
		this.x = Math.floor(x);
		this.y = Math.floor(y);

		this.visited = false;
		this.closed = false;

		this.gCost;
		this.hCost;
		this.fCost = this.gCost + this.hCost;

		this.parent = undefined;

		this.edge = this.x == 0 || this.x == width - 1 || (this.y == 0 || this.y == height - 1);

		this.walls = [
			true,
			true,
			true,
			true
		]; //top left bottom right

		this.createLine = function(x, y, x2, y2) {
			ctx.beginPath();
			ctx.lineWidth = Math.ceil(scale / 16);
			ctx.moveTo(x, y);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.closePath();
		};

		this.draw = function() {
			let posX = this.x * scale;
			let posY = this.y * scale;

			ctx.strokeStyle = walls;
			if (this.walls[0]) this.createLine(posX, posY, posX + scale, posY);
			if (this.walls[1]) this.createLine(posX + scale, posY, posX + scale, posY + scale);
			if (this.walls[2]) this.createLine(posX + scale, posY + scale, posX, posY + scale);
			if (this.walls[3]) this.createLine(posX, posY + scale, posX, posY);

			if (this.visited) {
				ctx.fillStyle = visited;
				ctx.fillRect(posX, posY, scale, scale);
			}

			if (this.selected) {
				ctx.fillStyle = '#FF00FF55';
				ctx.fillRect(posX, posY, scale, scale);
			}
		};

		this.randomValidNeighbour = function() {
			let neighbouring = [
				grid.filter((t) => t.x + 1 == this.x && t.y == this.y)[0],
				grid.filter((t) => t.x - 1 == this.x && t.y == this.y)[0],
				grid.filter((t) => t.y + 1 == this.y && t.x == this.x)[0],
				grid.filter((t) => t.y - 1 == this.y && t.x == this.x)[0]
			];
			return neighbouring.sort((a, b) => 0.5 - random()).filter((t) => t && !t.visited)[0];
		};

		this.visit = function() {
			this.visited = true;
			this.draw();
		};
		this.defineCosts = function(start, end) {
			if (!start || !end) return;
			this.gCost = Math.abs(start.x - this.x) + Math.abs(start.y - this.y);
			this.hCost = Math.abs(end.x - this.x) + Math.abs(end.y - this.y);
			this.fCost = this.gCost + this.hCost;
		};

		this.mostCostEffectiveNeighbourWhichImGonnaUseToSolveThisMaze = function(end) {
			let neighbouring = [];

			let top = grid.find((t) => t.y == this.y - 1 && t.x == this.x && !t.walls[2] && !t.closed);
			let left = grid.find((t) => t.y == this.y && t.x == this.x - 1 && !t.walls[3] && !t.closed);
			let bottom = grid.find((t) => t.y == this.y + 1 && t.x == this.x && !t.walls[0] && !t.closed);
			let right = grid.find((t) => t.y == this.y && t.x == this.x + 1 && !t.walls[1] && !t.closed);

			if (top) neighbouring.push(top);
			if (left) neighbouring.push(left);
			if (bottom) neighbouring.push(bottom);
			if (right) neighbouring.push(right);
			for (let i = 0; i < neighbouring.length; i++) {
				neighbouring[i].defineCosts({ x: this.x, y: this.y }, end);
			}

			neighbouring = neighbouring.sort((a, b) => a.fCost - b.fCost);

			return neighbouring[0];
		};

		this.selected = false;

		this.select = function() {
			if (lastSelected) lastSelected.selected = false;
			this.selected = true;
			drawAll();

			infoDiv.innerHTML =
				'<p>X: ' +
				this.x +
				'</p>' +
				'<p>Y: ' +
				this.y +
				'</p>' +
				'<p>Walls: ' +
				JSON.stringify(this.walls) +
				'</p>' +
				'<p>Edge: ' +
				this.edge +
				'</p>' +
				'<p>Visited: ' +
				this.visited +
				'</p>' +
				'<p>g/h/f - Cost: ' +
				this.gCost +
				', ' +
				this.hCost +
				', ' +
				this.fCost +
				'</p>';

			lastSelected = this;
		};
	}
}

canvas.onmousemove = function(e) {
	let pointX = e.clientX - (this.offsetLeft + scale);
	let pointY = e.clientY - (this.offsetTop + scale - document.documentElement.scrollTop);
	let selected = grid.find((t) => t.x <= pointX && t.x * scale >= pointX && t.y <= pointY && t.y * scale >= pointY);
	if (!selected) {
		if (lastSelected) lastSelected.selected = false;
		drawAll();
		return;
	}
	selected.select();
};

var heightSlider = document.getElementById('height');
var widthSlider = document.getElementById('width');

var heightNumField = document.getElementById('heightNum');
var widthNumField = document.getElementById('widthNum');

var mazeCheck = document.getElementById('autoMazeCheck');
var genMazeButton = document.getElementById('Mazeify');
var solveButton = document.getElementById('solve');

var seedSlider = document.getElementById('seedSlider');
var seedNumField = document.getElementById('seedNum');

var stepCheck = document.getElementById('stepbystepCheck');
var loopCheck = document.getElementById('loop');
var delayNumField = document.getElementById('delayNum');
var delaySlider = document.getElementById('delaySlider');

heightNumField.value = height;
widthNumField.value = width;
seedSlider.value = seed;
seedNumField.value = seed;

loopCheck.checked = false;

heightNumField.oninput = function() {
	height = this.value;
	init(width, this.value);
};
widthNumField.oninput = function() {
	width = this.value;
	init(this.value, height);
};

heightSlider.oninput = function() {
	height = this.value;
	init(width, this.value);
};
widthSlider.oninput = function() {
	width = this.value;
	init(this.value, height);
};

mazeCheck.oninput = function() {
	autoMaze = this.checked;
	if (this.checked) init(width, height);
};
genMazeButton.onclick = function() {
	init(width, height, true);
};
solveButton.onclick = function() {
	alert('Do it yourself!');
};

seedSlider.oninput = function() {
	seed = this.value;
	changeSeed(seed);
	seedNumField.value = seed;
	init(width, height, false);
};
seedNumField.oninput = function() {
	seed = this.value;
	changeSeed(seed);
	seedSlider.value = seed;
	init(width, height, false);
};

stepCheck.oninput = function() {
	stepByStep = this.checked;
	init(width, height);
};
loopCheck.oninput = function() {
	loop = this.checked;
};
delayNumField.oninput = function() {
	delay = this.value;
	init(width, height);
	delaySlider.value = this.value;
};
delaySlider.oninput = function() {
	delay = this.value;
	init(width, height);
	delayNumField.value = this.value;
};

const drawAll = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < grid.length; i++) {
		grid[i].draw();
		grid[i].defineCosts(start, end);
	}
};

const removeWalls = function(curr, next) {
	var posX = curr.x - next.x;
	var posY = curr.y - next.y;

	if (posX >= 1) {
		grid.find((t) => t.x == curr.x && t.y == curr.y).walls[3] = false;
		grid.find((t) => t.x == next.x && t.y == next.y).walls[1] = false;
	} else if (posX <= -1) {
		grid.find((t) => t.x == curr.x && t.y == curr.y).walls[1] = false;
		grid.find((t) => t.x == next.x && t.y == next.y).walls[3] = false;
	}

	if (posY >= 1) {
		grid.find((t) => t.x == curr.x && t.y == curr.y).walls[0] = false;
		grid.find((t) => t.x == next.x && t.y == next.y).walls[2] = false;
	} else if (posY <= -1) {
		grid.find((t) => t.x == curr.x && t.y == curr.y).walls[2] = false;
		grid.find((t) => t.x == next.x && t.y == next.y).walls[0] = false;
	}

	drawAll();
};

function generateMaze(start, end) {
	while (true) {
		if (grid.filter((t) => !t.visited).length) {
			currentTile.path = true;
			var next = currentTile.randomValidNeighbour();
			if (next) {
				removeWalls(currentTile, next);
				currentTile = next;
				stack.push(currentTile);
				currentTile.visit();
			} else if (stack.length) {
				currentTile.path = false;
				currentTile = stack.pop();
			} else {
				break;
			}
		} else {
			break;
		}
		end.walls = [
			false,
			false,
			false,
			false
		];
		drawAll();
	}
	resetRNG();
}
var opID;
function generateMazeStepByStep(start, end) {
	var stack = [];
	var intervalVar;
	opID = Math.random();

	clearInterval(intervalVar);

	var drawStep = function(end, id, start) {
		var next = currentTile.randomValidNeighbour();

		if (next && id == opID) {
			removeWalls(currentTile, next);
			currentTile = next;
			stack.push(currentTile);
			currentTile.visit(true);

			ctx.fillStyle = currentTileColor;
			ctx.fillRect(currentTile.x * scale, currentTile.y * scale, scale, scale);
		} else if (stack.length && id == opID) {
			currentTile = stack.pop();

			ctx.fillStyle = backtrackColor;
			ctx.fillRect(currentTile.x * scale, currentTile.y * scale, scale, scale);
		} else {
			clearInterval(intervalVar);
			drawAll();
			resetRNG();
			if (loop) init(width, height, false);
			end.walls = [
				false,
				false,
				false,
				false
			];
			drawAll();
			resetRNG();
		}
	};
	intervalVar = setInterval(drawStep, delay, end, opID, start);
}

function solveMaze(start, end) {
	var intervalVar;
	clearInterval(intervalVar);

	currentTile = start;
	var stack = [];

	function drawSolve(start, end, id) {
		var next = currentTile.mostCostEffectiveNeighbourWhichImGonnaUseToSolveThisMaze(end);

		console.log(stack.length);

		if (currentTile.x == end.x && currentTile.y == end.y) {
			console.log('DONE');
			clearInterval(intervalVar);
			drawAll();
			resetRNG();
		} else {
			if (next && id == opID) {
				currentTile = next;
				stack.push(currentTile);
				currentTile.closed = true;

				drawAll();

				ctx.fillStyle = currentTileColor;
				ctx.fillRect(currentTile.x * scale, currentTile.y * scale, scale, scale);
			} else if (stack.length && id == opID) {
				currentTile = stack.pop();
				ctx.fillStyle = backtrackColor;
				ctx.fillRect(currentTile.x * scale, currentTile.y * scale, scale, scale);
			} else {
				console.log('FAILURE');
				clearInterval(intervalVar);
				drawAll();
				resetRNG();
			}
		}
	}
	intervalVar = setInterval(drawSolve, delay, start, end, opID);
}

init(width, height);
function init(width, height, forced) {
	resetRNG();
	canvas.height = Math.ceil(height * scale + scale / 2);
	canvas.width = Math.ceil(width * scale + scale / 2);

	heightNumField.value = height;
	widthNumField.value = width;
	heightSlider.value = height;
	widthSlider.value = width;

	grid = [];
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			grid.push(new Tile(x, y));
		}
	}

	if (autoMaze || forced) {
		var edges = grid.filter((t) => t.edge).sort((a, b) => 0.5 - random());
		start = edges[0];

		var opX = (start.x - Math.ceil((width - 1) / 2)) * -1 + Math.ceil((width - 1) / 2) - 1;
		var opY = (start.y - Math.ceil((height - 1) / 2)) * -1 + Math.ceil((height - 1) / 2) - 1;

		end = grid.find((t) => t.x == opX && t.y == opY);

		currentTile = start;
		currentTile.walls = [
			false,
			false,
			false,
			false
		];
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < grid.length; i++) {
		if (grid[i].x == currentTile.x && grid[i].y == currentTile.y) grid[i].visited = true;
		grid[i].draw();
	}

	resetRNG();
	if (autoMaze || forced) {
		if (stepByStep) {
			generateMazeStepByStep(start, end);
		} else generateMaze(start, end);
	}
}
