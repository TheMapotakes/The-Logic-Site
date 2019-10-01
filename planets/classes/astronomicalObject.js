function drawCricle(color, x, y, size, outline) {
	outline ? (ctx.strokeStyle = color) : (ctx.fillStyle = color);
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.closePath();
	outline ? ctx.stroke() : ctx.fill();
}

function invertHex(hex) {
	return (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substr(1).toUpperCase();
}

class AstronomicalObject {
	constructor(x, y, type, mass, density, color, velX, velY, stationary, noTrail) {
		this.id = Math.floor(Math.random() * 100000);

		this.position = new Victor(x, y);
		this.velocity = new Victor(velX || 0, velY || 0);

		this.lastPositions = [];

		this.mass = parseFloat(mass);
		this.density = parseFloat(density);
		this.radius = Math.round(this.mass / this.density) * 5;
		this.type = type.toString();
		this.color = color;

		this.selectable = true;
		this.hasTrail = !noTrail;
		this.stationary = !!stationary;
		this.selected = false;

		this.update = function(G) {
			this.radius = Math.round(this.mass / this.density) * 5;
			if (this.mass < 1) this.remove();

			if (!this.selected && !this.stationary) {
				this.position.add(this.velocity);

				for (let i = 0; i < renderList.length; i++) {
					let o = renderList[i];
					if (!o.selected && o.id != this.id && o.id) {
						var dist = this.position.distanceSq(o.position);

						if (Math.sqrt(dist) < this.radius + o.radius) {
							//this.handleCollision(o);
							continue;
						}

						var g = o.mass / dist;
						var a = Math.atan2(o.position.y - this.position.y, o.position.x - this.position.x);

						let v = new Victor(g * Math.cos(a), g * Math.sin(a));
						this.velocity.add(v.multiply({ x: G, y: G }));
					}
				}
			}
			this.lastPositions.push(new Victor(this.position.x, this.position.y));
			if (this.lastPositions.length > 8) this.lastPositions.shift();
		};
		this.handleCollision = function(o) {
			if (this.type == 'Fragment') {
				this.remove();
				o.mass += ~~(this.mass / 2);
				return;
			}

			var relativeVelocity = new Victor(this.velocity.x, this.velocity.y).subtract(o.velocity);
			var averageVelocity = new Victor(this.velocity.x, this.velocity.y).add(o.velocity).divide(new Victor(2, 2));

			this.fragmentify(averageVelocity, ~~(this.mass / 2), 10);
		};

		this.fragmentify = function(avg, toMass, amt) {
			while (this.mass > toMass) {
				var mass = Math.ceil((this.mass - toMass) / amt);
				var position = new Victor(this.position.x, this.position.y).add(new Victor(avg.x, avg.y)); //.rotateByDeg(Math.floor(Math.floor() * 20) - 10);
				var velocity = new Victor(avg.x, avg.y);
				renderList.push(new AstronomicalObject(position.x, position.y, 'Fragment', mass, this.density, '#000000', velocity.x, velocity.y, false, true));
				this.mass -= mass;
			}
		};

		this.remove = function() {
			var index = renderList.indexOf(this);
			if (index > -1) {
				renderList.splice(index, 1);
			}
		};

		this.draw = function() {
			drawCricle(this.color, this.position.x, this.position.y, this.radius, false);
			if (this.selected) drawCricle(invertHex(this.color), this.position.x, this.position.y, this.radius, true);
			if (this.hasTrail) this.renderTrail();
		};
		this.renderTrail = function() {
			var size = this.radius;
			var opacity = 255;
			for (let i = this.lastPositions.length - 1; i > 0; i--) {
				opacity -= 255 / 8;
				size -= this.radius / 8;
				if (size < 0) size = 0;
				if (opacity < 0) opacity = 0;
				let c = this.lastPositions[i];
				drawCricle(this.color + opacity.toString(16).padStart(2, '0'), c.x, c.y, size, false);
			}
		};
	}
}
