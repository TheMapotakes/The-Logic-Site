function drawCricle(color, x, y, size) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
}

class Boid {
	constructor(startLocation) {
		this.id = Math.floor(rng.random() * 10000);
		this.debug = false;
		this.localGroup;
		this.boostChance = rng.random() / 1000;

		if (!startLocation) startLocation = new Victor(rng.random() * canvas.width, rng.random() * canvas.height);

		this.position = startLocation;
		this.acceleration = new Victor(rng.random() * 2 - 1, rng.random() * 2 - 1);
		this.velocity = new Victor(rng.random() * 2 - 1, rng.random() * 2 - 1);

		this.move = function() {
			this.boostChance += 0.000000001;

			this.velocity.add(this.acceleration);
			if (rng.random() < this.boostChance) {
				this.boostChance = 0;
				this.velocity.maxMagnitude(maxSpeed / 2);
			}
			this.velocity.limitMagnitude(maxSpeed);
			this.position.add(this.velocity);

			if (this.position.x < 0) {
				this.position.x = canvas.width;
			} else if (this.position.x > canvas.width) this.position.x = 0;

			if (this.position.y < 0) {
				this.position.y = canvas.height;
			} else if (this.position.y > canvas.height) this.position.y = 0;
		};

		this.seperation = function(boids) {
			var avg = new Victor(0, 0);
			var inRange = 0;
			for (let boid of boids) {
				let dist = this.position.distance(boid.position);
				if (dist < seperationPerceptionRange && boid.id != this.id) {
					inRange++;
					let diff = new Victor(this.position.x, this.position.y);
					diff.subtract(boid.position);
					diff.divide({ x: dist, y: dist });

					avg = diff.add(avg);
				}
			}
			if (inRange) {
				avg.divide({ x: inRange, y: inRange });
				avg.limitMagnitude(maxSpeed);
				avg.subtract(this.velocity);
				avg.limitMagnitude(maxForce);
			}
			return avg;
		};

		this.align = function(boids) {
			var avg = new Victor(0, 0);
			var inRange = 0;
			for (let boid of boids) {
				if (boid.id == this.id) continue;
				if (this.debug) boid.drawHeading('#0000FF');
				let dist = this.position.distance(boid.position);
				if (dist < alignmentPerceptionRange) {
					inRange++;
					avg = {
						x : avg.x + boid.velocity.x,
						y : avg.y + boid.velocity.y
					};
				}
			}
			if (inRange) {
				avg = {
					x : clamp(avg.x / inRange - this.velocity.x, -maxForce, maxForce),
					y : clamp(avg.y / inRange - this.velocity.y, -maxForce, maxForce)
				};
			}
			return new Victor(avg.x, avg.y);
		};

		this.cohersion = function(boids) {
			var avg = new Victor(0, 0);
			var inRange = 0;
			for (let boid of boids) {
				let dist = this.position.distance(boid.position);
				if (dist < cohersionPerceptionRange && boid.id != this.id) {
					inRange++;
					avg = {
						x : avg.x + boid.position.x,
						y : avg.y + boid.position.y
					};
				}
			}
			if (inRange) {
				avg.x /= inRange;
				avg.y /= inRange;

				if (this.debug) {
					ctx.fillStyle = '#66FF66';
					//ctx.fillRect(avg.x - 5, avg.y - 5, avg.x + 5, avg.y + 5);
				}

				avg = {
					x : clamp(avg.x - (this.position.x + this.velocity.x), -maxForce, maxForce),
					y : clamp(avg.y - (this.position.y + this.velocity.y), -maxForce, maxForce)
				};
			}
			return new Victor(avg.x, avg.y);
		};

		this.behave = function() {
			if (!this.localGroup) return;
			var boids = this.localGroup.getRelevantBoids();

			var alignment = this.align(boids).multiply({
				x : alignmentMultiplier,
				y : alignmentMultiplier
			});
			var cohersion = this.cohersion(boids).multiply({
				x : cohersionMultiplier,
				y : cohersionMultiplier
			});
			var seperation = this.seperation(boids).multiply({
				x : seperationMultiplier,
				y : seperationMultiplier
			});

			this.acceleration = new Victor(0, 0);
			this.acceleration.add(seperation);
			this.acceleration.add(cohersion);
			this.acceleration.add(alignment);
		};

		this.drawHeading = function(color) {
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(this.position.x, this.position.y);
			ctx.lineTo(this.position.x + this.velocity.x * 50, this.position.y + this.velocity.y * 50);
			ctx.closePath();
			ctx.stroke();
		};

		this.render = function() {
			let rotation = Math.atan2(this.velocity.y, this.velocity.x);
			let x = this.position.x - -6 * this.velocity.x;
			let y = this.position.y - -9 * this.velocity.y;

			if (this.debug) {
				drawCricle('#FF000055', this.position.x, this.position.y, seperationPerceptionRange);
				drawCricle('#00FF0055', this.position.x, this.position.y, alignmentPerceptionRange);
				drawCricle('#0000FF55', this.position.x, this.position.y, cohersionPerceptionRange);

				this.drawHeading('#FF0000');

				if (this.localGroup) {
					for (let g of this.localGroup.neighbours) {
						g.render('#5FF');
					}

					this.localGroup.render('#FF0000');
				}
			}

			ctx.translate(x, y);
			ctx.rotate(rotation);

			ctx.beginPath();
			ctx.strokeStyle = this.debug ? '#AAAAE5' : '#E7E7E7';
			ctx.moveTo(0, 0);
			ctx.lineTo(0, 12);
			ctx.lineTo(12, 6);
			ctx.closePath();
			ctx.stroke();

			ctx.rotate(rotation * -1);
			ctx.translate(x * -1, y * -1);
		};
	}
}
