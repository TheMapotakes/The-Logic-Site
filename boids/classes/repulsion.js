class RepulsionRadius {
	constructor(x, y, lgSize, id) {
		this.id = id;
		this.position = new Victor(x, y);
		this.localGroup = flock.localGroups.find(
			(g) => g.position.x < this.position.x && this.position.x < g.position.x + lgSize && g.position.y < this.position.y && this.position.y < g.position.y + lgSize
		);
		this.size = 0;
		this.multiplier = 2.5;
		this.opacity = 0;
		this.opacityHex = '00';

		this.update = function(m2down, id) {
			if (m2down && this.id == id) {
				this.size += 1 * this.multiplier;
				this.opacity += 0.5;
			} else {
				this.size -= 2.5;
				this.opacity -= 0.5;
			}
			this.multiplier -= 0.01;
			this.opacityHex = Math.round(this.opacity).toString(16).padStart(2, '0');

			if (this.size < 0) return repulsions.splice(repulsions.indexOf(this), 1);

			this.render();
		};

		this.render = function() {
			var grad = ctx.createLinearGradient(this.position.x - this.size / 2, this.position.y - this.size / 2, this.position.x + this.size / 2, this.position.y + this.size / 2);
			grad.addColorStop(0, '#FF0000' + this.opacityHex);
			grad.addColorStop(1, '#FFE400' + this.opacityHex);

			drawCricle(grad, this.position.x, this.position.y, this.size);
		};
	}
}
