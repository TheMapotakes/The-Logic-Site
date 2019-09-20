class Flock {
	constructor(n) {
		this.desiredNumber = 100;
		this.boids = [];
		this.debug = false;
		for (let i = 0; i < Math.abs(n); i++) {
			this.boids.push(new Boid());
		}
		this.lastDebug = undefined;
		this.localGroups = [];

		this.createLocalGroups = function(size) {
			this.localGroups = [];
			let id = 0;
			for (let x = 0; x < Math.ceil(window.innerWidth) / size + 1; x++) {
				for (let y = 0; y < Math.ceil(window.innerHeight / size) + 1; y++) {
					this.localGroups.push(new LocalGroup(id, x, y, size));
					id++;
				}
				id++;
			}
			for (let group of this.localGroups) {
				group.getNeighbours(this);
			}
		};
		this.createLocalGroups(128);

		this.update = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (let group of this.localGroups) {
				group.assignBoids(this.boids);
				if (this.debug) group.render('#858585');
			}

			for (let boid of this.boids) {
				boid.render();
				boid.behave();
				boid.move();
			}
		};

		this.debugify = function(b) {
			if (this.boids[this.lastDebug]) this.boids[this.lastDebug].debug = false;
			this.debug = true;
			this.boids[b].debug = true;
			this.lastDebug = b;
		};

		this.undebugify = function() {
			if (this.boids[this.lastDebug]) this.boids[this.lastDebug].debug = false;
			this.debug = false;
		};
	}
}
