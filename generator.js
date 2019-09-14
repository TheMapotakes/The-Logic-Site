var canvas  = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var scale = 40;
var height = 20;
var width = 20;

var autoMaze = true;
var stepByStep = true;
var loop = false;
var delay = 100;

var visited = '#BEBEBE' + 90
var walls = '#000000'
var currentTileColor = '#00FF00'
var backtrackColor = '#FF0000'

var colorVisited = document.getElementById('visited');
var colorWalls = document.getElementById('walls');
var colorCurrentTile = document.getElementById('currentTile');
var colorCurrentTileback = document.getElementById('currentTileback');

colorVisited.onchange = function() {visited = this.value + 90};
colorWalls.onchange = function() {walls = this.value};
colorCurrentTile.onchange = function() {currentTileColor = this.value};
colorCurrentTileback.onchange = function() {backtrackColor = this.value};

var grid = [];

var currentTile;
var stack = [];

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

function changeSeed(i) {
    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
};

function random() {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
};

function resetRNG() {
    m_w = (123456789 + seed) & mask;
    m_z = (987654321 - seed) & mask;
};

var seed = Date.now()
changeSeed(seed);

class Tile {
	constructor(x,y) {
		this.x = Math.floor(x);
		this.y = Math.floor(y);

		this.visited = false;

		this.gCost;
		this.hCost;
		this.fCost = this.gCost + this.hCost;

		this.path = false;

		this.edge = (this.x == 0 || this.x == width-1) || (this.y == 0 || this.y == height-1)
		this.walls = [true, true, true, true];

		this.createLine = function(x,y,x2,y2) {
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
			if(this.walls[0]) this.createLine(posX,posY,posX+scale,posY);
			if(this.walls[1]) this.createLine(posX+scale,posY,posX+scale,posY+scale);
			if(this.walls[2]) this.createLine(posX+scale,posY+scale,posX,posY+scale);
			if(this.walls[3]) this.createLine(posX,posY+scale,posX,posY);

			if(this.visited) {
				ctx.fillStyle = visited;
				ctx.fillRect(posX, posY, scale, scale);
			};
		};

		this.randomValidNeighbour = function() {
			let neighbouring = [
				grid.filter(t => t.x+1 == this.x && t.y == this.y)[0],
				grid.filter(t => t.x-1 == this.x && t.y == this.y)[0],
				grid.filter(t => t.y+1 == this.y && t.x == this.x)[0],
				grid.filter(t => t.y-1 == this.y && t.x == this.x)[0]
			];
			return neighbouring.sort((a,b) => 0.5 - random()).filter(t => t && !t.visited)[0];
		};
		this.visit = function() {
			this.visited = true;
			this.draw();
		};
		this.defineCosts = function(start, end) {
			this.gCost = Math.abs((start.x - this.x) + (start.y - this.y));
			this.hCost = Math.abs((end.x - this.x) + (end.y - this.y));
			this.fCost = this.gCost + this.hCost;
		};
	};
};

var heightSlider = document.getElementById('height');
var widthSlider = document.getElementById('width');

var heightNumField = document.getElementById('heightNum');
var widthNumField = document.getElementById('widthNum');

var mazeCheck = document.getElementById('autoMazeCheck');
var genMazeButton = document.getElementById('Mazeify');

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

heightNumField.oninput = function() {height = this.value; init(width, this.value);};
widthNumField.oninput = function() {width = this.value; init(this.value, height);};

heightSlider.oninput = function() {height = this.value; init(width, this.value);};
widthSlider.oninput = function() {width = this.value; init(this.value, height);};

mazeCheck.oninput = function() {autoMaze = this.checked; if(this.checked) init(width, height)}
genMazeButton.onclick = function() {init(width, height, true)}

seedSlider.oninput = function() {seed = this.value; changeSeed(seed); seedNumField.value = seed; init(width, height, false)};
seedNumField.oninput = function() {seed = this.value; changeSeed(seed); seedSlider.value = seed; init(width, height, false)};

stepCheck.oninput = function() {stepByStep = this.checked; init(width, height)}
loopCheck.oninput = function() {loop = this.checked}
delayNumField.oninput = function() {delay = this.value; init(width, height); delaySlider.value = this.value};
delaySlider.oninput = function() {delay = this.value; init(width, height); delayNumField.value = this.value};



const drawAll = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(let i = 0; i < grid.length; i++) {
		grid[i].draw();
	};
};

const removeWalls = function(curr, next) {
	var posX = curr.x - next.x;
	var posY = curr.y - next.y;

	if(posX >= 1) {
		grid.find(t => t.x == curr.x && t.y == curr.y).walls[3] = false;
		grid.find(t => t.x == next.x && t.y == next.y).walls[1] = false;
	} else if(posX <= -1) {
		grid.find(t => t.x == curr.x && t.y == curr.y).walls[1] = false;
		grid.find(t => t.x == next.x && t.y == next.y).walls[3] = false;
	};

	if(posY >= 1) {
		grid.find(t => t.x == curr.x && t.y == curr.y).walls[0] = false;
		grid.find(t => t.x == next.x && t.y == next.y).walls[2] = false;
	} else if(posY <= -1) {
		grid.find(t => t.x == curr.x && t.y == curr.y).walls[2] = false;
		grid.find(t => t.x == next.x && t.y == next.y).walls[0] = false;
	};

	drawAll();
};

function generateMaze(start, end) {
	while(true) {
		if(grid.filter(t => !t.visited).length) {
			currentTile.path = true;
			var next = currentTile.randomValidNeighbour();
			if(next) {
				removeWalls(currentTile, next);
				currentTile = next;
				stack.push(currentTile);
				currentTile.visit();
			} else if(stack.length) {
				currentTile.path = false;
				currentTile = stack.pop();
			} else {
				break;
			};
		} else {
			break;
		};
		end.walls = [false, false, false, false];
		drawAll();
	};
	resetRNG()
};
var opID;
function generateMazeStepByStep(start, end) {
	var stack = [];
	var intervalVar;
	opID = Math.random();

	clearInterval(intervalVar);

	var drawStep = function(end, id) {
		var next = currentTile.randomValidNeighbour();

		if(next && id == opID) {
			removeWalls(currentTile, next);
			currentTile = next;
			stack.push(currentTile);
			currentTile.visit(true);

			ctx.fillStyle = currentTileColor;
			ctx.fillRect(currentTile.x * scale, currentTile.y * scale, scale, scale);

		} else if(stack.length && id == opID) {
			currentTile = stack.pop();

			ctx.fillStyle = backtrackColor;
			ctx.fillRect(currentTile.x * scale, currentTile.y * scale, scale, scale);
		} else {
			clearInterval(intervalVar);
			drawAll();
			resetRNG();
			if(loop) init(width, height, false);
			end.walls = [false, false, false, false];
		};
	};
	intervalVar = setInterval(drawStep, delay, end, opID);
};

init(width, height);
function init(width,height, forced) {
	resetRNG()
	canvas.height = Math.ceil((height * scale) + scale / 2);
	canvas.width = Math.ceil((width * scale) + scale / 2);

	heightNumField.value = height;
	widthNumField.value = width;
	heightSlider.value = height;
	widthSlider.value = width;

	grid = [];
	for(let x = 0; x < width; x++) {
		for(let y = 0; y < height; y++) {
			grid.push(new Tile(
				x,
				y
			));
		};
	};

	if(autoMaze || forced) {
		var edges = grid.filter(t => t.edge).sort((a,b) => 0.5 - random());
		var start = edges[0];

		var opX = ((start.x - Math.ceil((width-1) / 2)) * -1) + Math.ceil((width-1) / 2) -1
		var opY = ((start.y - Math.ceil((height-1) / 2)) * -1) + Math.ceil((height-1) / 2) -1

		var end = grid.find(t => t.x == opX && t.y == opY);


		currentTile = start;
		currentTile.walls = [false, false, false, false];
	};

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(let i = 0; i < grid.length; i++) {
		if(grid[i].x == currentTile.x && grid[i].y == currentTile.y) grid[i].visited = true;
		grid[i].draw();
	};

	resetRNG();
	if(autoMaze || forced) {
		if(stepByStep) {
			generateMazeStepByStep(start, end);
		} else generateMaze(start, end);
		
	};
};