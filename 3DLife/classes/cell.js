class Cell {
	constructor(x, y, z, s, c) {
		this.size = s;
		this.position = new THREE.Vector3(x, y, z);
		this.cube = new Cube(x, y, z, s);
		scene.add(this.cube);
		this.cube.scale.set(0.000001, 0.000001, 0.000001);

		this.nextState = 0;

		this.alive = false;

		this.activate = function() {
			this.alive = true;
			this.cube.scale.set(1, 1, 1);
		};
		this.deactivate = function() {
			this.alive = false;
			this.cube.scale.set(0.000001, 0.000001, 0.000001);
		};

		this.update = function() {
			switch (this.nextState) {
				case -1:
					this.deactivate();
					break;
				case 1:
					this.activate();
				case 0:
				default:
					this.nextState = 0;
					break;
			}
		};

		this.prepare = function(minA, maxA, minB, maxB) {
			var n = this.getNeighbours().length;
			if (this.alive) {
				if (n >= minA && n <= maxA) {
					this.nextState = 1;
				} else {
					this.nextState = -1;
				}
			} else {
				if (n >= minB && n <= maxB) this.nextState = 1;
			}
		};

		this.getNeighbours = function() {
			var neighbours = [];
			for (let x = this.position.x - 1; x <= this.position.x + 1; x++) {
				for (let y = this.position.y - 1; y <= this.position.y + 1; y++) {
					for (let z = this.position.z - 1; z <= this.position.y + 1; z++) {
						if (x == this.position.x && y == this.position.y && z == this.position.z) continue;
						if (grid[x] && grid[x][y] && grid[x][y][z] && grid[x][y][z].alive) {
							neighbours.push(grid[x][y][z]);
						}
					}
				}
			}
			return neighbours;
		};

		if (Math.random() < c) this.activate();
	}
}
