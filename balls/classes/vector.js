class Vector {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;

		//Methods
		this.add = function(v) {
			if (!isNaN(v.x) && !isNaN(v.y)) {
				this.x += v.x;
				this.y += v.y;
			} else if (!isNaN(v)) {
				this.x += parseFloat(v);
				this.y += parseFloat(v);
			} else throw new TypeError('Invalid Datatype');
			return this;
		};
		this.sub = function(v) {
			if (v.x && v.y) {
				this.x -= v.x;
				this.y -= v.y;
			} else if (!isNaN(v)) {
				this.x -= parseFloat(v);
				this.y -= parseFloat(v);
			} else throw new TypeError('Invalid Datatype');
			return this;
		};
		this.div = function(v) {
			if (v.x && v.y) {
				this.x /= v.x;
				this.y /= v.y;
			} else if (!isNaN(v)) {
				this.x /= parseFloat(v);
				this.y /= parseFloat(v);
			} else throw new TypeError('Invalid Datatype');
			return this;
		};
		this.mult = function(v) {
			if (v.x && v.y) {
				this.x *= v.x;
				this.y *= v.y;
			} else if (!isNaN(v)) {
				this.x *= parseFloat(v);
				this.y *= parseFloat(v);
			} else throw new TypeError('Invalid Datatype');
			return this;
		};
		this.randomize = function(min, max, forceInt) {
			if (isNaN(min) || isNaN(max)) throw new TypeError('Invalid Datatype');
			if (forceInt) {
				this.x = Math.random() * (max - min) + min;
				this.y = Math.random() * (max - min) + min;
				return this;
			} else {
				min = Math.ceil(min);
				max = Math.floor(max);
				this.x = Math.floor(Math.random() * (max - min + 1)) + min;
				this.y = Math.floor(Math.random() * (max - min + 1)) + min;
				return this;
			}
		};
		this.getRotation = function() {
			return Math.atan2(this.y, this.x);
		};
	}
}
