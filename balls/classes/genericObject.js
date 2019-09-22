function rotate(x, y, sin, cos, reverse) {
	return {
		x : reverse ? x * cos + y * sin : x * cos - y * sin,
		y : reverse ? y * cos - x * sin : y * cos + x * sin
	};
}
class Generic {
	constructor(hasGravity, isMoveable, doesWrap, x, y, color, weight) {
		this.id = ~~(Math.random() * 10000);
		this.selected = false;

		this.gravity = !!hasGravity;
		this.moveable = !!isMoveable;
		this.wraps = !!doesWrap;

		this.color = typeof color == 'string' ? color : randomColor();

		this.weight = !isNaN(weight) ? weight : 10;
		this.position = !isNaN(x) && !isNaN(y) ? new Vector(x, y) : new Vector().randomize(0, canvas.width * -1, false);
		this.rotation = 0;
		this.velocity = new Vector();
		this.acceleration = new Vector();
		this.restitution = -0.7;

		this.lastPositions = [];

		this.update = function() {
			if (this.moveable && this.gravity && !this.selected) {
				this.acceleration.y += GY;
				this.acceleration.x += GX;

				this.velocity.add(this.acceleration);
				this.position.add(this.velocity);
			}

			if (this.wraps) {
				if (this.position.x < 0) {
					this.position.x = canvas.width;
				} else if (this.position.x > canvas.width) this.position.x = 0;

				if (this.position.y < 0) {
					this.position.y = canvas.height;
				} else if (this.position.y > canvas.height) this.position.y = 0;
			} else {
				if (this.position.y > canvas.height - this.weight) {
					this.velocity.y *= this.restitution;
					this.velocity.x *= this.restitution * -1;
					this.position.y = canvas.height - this.weight;
				}
				if (this.position.x > canvas.width - this.weight) {
					this.velocity.x *= this.restitution;
					this.position.x = canvas.width - this.weight;
				}
				if (this.position.x < this.weight) {
					this.velocity.x *= this.restitution;
					this.position.x = this.weight;
				}
			}
			this.lastPositions.push(new Vector(this.position.x, this.position.y));
			if (this.lastPositions.length > trailLength) this.lastPositions.shift();
		};

		this.handleCollision = function(ball) {
			var dx = this.position.x - ball.position.x;
			var dy = this.position.y - ball.position.y;
			var distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < this.weight + ball.weight) {
				var angle = Math.atan2(dy, dx),
					sin = Math.sin(angle),
					cos = Math.cos(angle),
					pos0 = { x: 0, y: 0 },
					pos1 = rotate(dx, dy, sin, cos, true),
					vel0 = rotate(this.velocity.x, this.velocity.y, sin, cos, true),
					vel1 = rotate(ball.velocity.x, ball.velocity.y, sin, cos, true),
					vxTotal = vel0.x - vel1.x;

				vel0.x = ((this.weight - ball.weight) * vel0.x + 2 * ball.weight * vel1.x) / (this.weight + ball.weight);
				vel1.x = vxTotal + vel0.x;

				pos0.x += vel0.x;
				pos1.x += vel1.x;

				var pos0F = rotate(pos0.x, pos0.y, sin, cos, false),
					pos1F = rotate(pos1.x, pos1.y, sin, cos, false);

				var vel0F = rotate(vel0.x, vel0.y, sin, cos, false),
					vel1F = rotate(vel1.x, vel1.y, sin, cos, false);

				/*ball.position = new Vector(this.position.x + pos1F.x, this.position.y + pos1F.y);
				this.position = new Vector(this.position.x + pos0F.x, this.position.y + pos1F.y);*/

				this.velocity = new Vector(vel0F.x, vel0F.y);
				ball.velocity = new Vector(vel1F.x, vel1F.y);
			}
		};
	}
}
