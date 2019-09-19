class LocalGroup {
	constructor(id, x, y, size) {
		this.x = x;
		this.y = y;

		this.id = id;
		this.boids = [];
		this.neighbours = [];

		this.position = new Victor(x * size, y * size);

		this.assignBoids = function(boids) {
			this.boids = [];
			for (let b of boids) {
				if (this.position.x <= b.position.x && b.position.x < this.position.x + size && this.position.y <= b.position.y && b.position.y < this.position.y + size) {
					this.boids.push(b);
					b.localGroup = this;
				}
			}
		};
		this.getNeighbours = function(flock) {
			this.neighbours = flock.localGroups.filter(
				(g) =>
					(g.x == this.x - 1 && g.y == this.y) ||
					(g.x == this.x + 1 && g.y == this.y) ||
					(g.x == this.x && g.y == this.y - 1) ||
					(g.x == this.x && g.y == this.y + 1) ||
					(g.x == this.x + 1 && g.y == this.y + 1) ||
					(g.x == this.x - 1 && g.y == this.y - 1) ||
					(g.x == this.x + 1 && g.y == this.y - 1) ||
					(g.x == this.x - 1 && g.y == this.y + 1)
			);
		};
		this.getRelevantBoids = function() {
			var boids = [];
			for (let n of this.neighbours) {
				boids.push(...n.boids);
			}
			boids.push(...this.boids);
			return boids;
		};

		this.render = function(clr) {
			ctx.strokeStyle = clr;
			ctx.beginPath();
			ctx.moveTo(this.position.x, this.position.y);
			ctx.lineTo(this.position.x + size, this.position.y);
			ctx.lineTo(this.position.x + size, this.position.y + size);
			ctx.lineTo(this.position.x, this.position.y + size);
			ctx.lineTo(this.position.x, this.position.y);
			ctx.stroke();
			ctx.closePath();
		};
	}
}
