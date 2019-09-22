class Ball extends Generic {
	constructor(x, y, color, hasGravity, isMoveable, doesWrap) {
		super(hasGravity, isMoveable, doesWrap, x, y, color);

		this.draw = function() {
			if (trailLength) {
				var size = this.weight;
				var opacity = 255;
				for (let i = this.lastPositions.length - 1; i > 0; i--) {
					opacity -= Math.round(30 * (trailLength / 10));
					size -= Math.round(1 * (trailLength / 10));
					if (size < 1) size = 1;
					let c = this.lastPositions[i];
					drawCricle(this.color + opacity.toString(16).padStart(2, '0'), c.x, c.y, size, false);
				}
			}

			drawCricle(this.color, this.position.x, this.position.y, this.weight, false);
			if (this.selected) drawCricle('#E000FF', this.position.x, this.position.y, this.weight, true);
		};
	}
}
