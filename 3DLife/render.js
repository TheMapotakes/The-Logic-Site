var scene = new THREE.Scene();
scene.background = new THREE.Color('#343434');
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 20, 100);
controls.update();

var grid = [];

function init(size, chance) {
	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}
	grid = [];
	size--;
	size += 0.5;
	scene.add(new Line('#FFFFFF', { x: -0.5, y: -0.5, z: -0.5 }, { x: size, y: -0.5, z: -0.5 }));
	scene.add(new Line('#FFFFFF', { x: -0.5, y: -0.5, z: -0.5 }, { x: -0.5, y: size, z: -0.5 }));
	scene.add(new Line('#FFFFFF', { x: -0.5, y: -0.5, z: -0.5 }, { x: -0.5, y: -0.5, z: size }));
	scene.add(new Line('#FFFFFF', { x: size, y: size, z: -0.5 }, { x: -0.5, y: size, z: -0.5 }));
	scene.add(new Line('#FFFFFF', { x: size, y: -0.5, z: size }, { x: -0.5, y: -0.5, z: size }));
	scene.add(new Line('#FFFFFF', { x: -0.5, y: size, z: -0.5 }, { x: -0.5, y: size, z: size }));
	scene.add(new Line('#FFFFFF', { x: -0.5, y: size, z: -0.5 }, { x: size, y: size, z: -0.5 }));
	scene.add(new Line('#FFFFFF', { x: size, y: size, z: -0.5 }, { x: size, y: size, z: size }));
	scene.add(new Line('#FFFFFF', { x: -0.5, y: size, z: size }, { x: size, y: size, z: size }));
	scene.add(new Line('#FFFFFF', { x: size, y: -0.5, z: size }, { x: size, y: size, z: size }));
	scene.add(new Line('#FFFFFF', { x: size, y: -0.5, z: -0.5 }, { x: size, y: -0.5, z: size }));
	scene.add(new Line('#FFFFFF', { x: size, y: -0.5, z: -0.5 }, { x: size, y: size, z: -0.5 }));
	scene.add(new Line('#FFFFFF', { x: -0.5, y: -0.5, z: size }, { x: -0.5, y: size, z: size }));
	size -= 0.5;

	controls.target = new THREE.Vector3(size / 2, size / 2, size / 2);
	controls.update();

	for (let i = 0; i <= size; i++) {
		grid[i] = [];
		for (let j = 0; j <= size; j++) {
			grid[i][j] = [];
			for (let k = 0; k <= size; k++) {
				grid[i][j][k] = new Cell(i, j, k, size, chance);
			}
		}
	}
}
var SIZE = 10;
var CHANCE = 0.1;
var SPEED = 300;
var MINA = 4;
var MAXA = 5;
var MINB = 5;
var MAXB = 5;

var doStep = true;

function draw() {
	requestAnimationFrame(draw);

	if (doStep) {
		doStep = false;
		setTimeout(() => {
			for (let x = 0; x < grid.length; x++) {
				for (let y = 0; y < grid[x].length; y++) {
					for (let z = 0; z < grid[x][y].length; z++) {
						grid[x][y][z].prepare(MINA, MAXA, MINB, MAXB);
					}
				}
			}
			for (let x = 0; x < grid.length; x++) {
				for (let y = 0; y < grid[x].length; y++) {
					for (let z = 0; z < grid[x][y].length; z++) {
						grid[x][y][z].update();
					}
				}
			}
			doStep = true;
		}, SPEED);
	}

	controls.update();
	renderer.render(scene, camera);
}

draw();
