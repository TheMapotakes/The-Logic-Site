class Selector {
	constructor() {
		this.position = new Vector();
		this.lastPosition = {
			pos  : new Vector(),
			time : Date.now()
		};
		this.velocity = new Vector();
		this.m1 = false;

		this.selected;

		this.movenum = 0;
		this.move = function(x, y) {
			if (this.movenum % 3 == 0) {
				this.lastPosition.pos = this.position;
				this.lastPosition.time = Date.now();
				this.movenum = 0;
			}
			this.position = new Vector(x, y);
			if (Date.now() - this.lastPosition.time > 300) {
				this.lastPosition.pos = this.position;
			}
			this.velocity = new Vector(this.position.x - this.lastPosition.pos.x, this.position.y - this.lastPosition.pos.y);

			if (this.selected) {
				this.selected.position = this.position;
			}

			this.movenum++;
		};

		this.select = function(o) {
			this.unselect();
			this.selected = o;
			this.selected.selected = true;
		};
		this.unselect = function() {
			if (this.selected) {
				this.selected.selected = false;
				this.selected.velocity = this.velocity;
				this.selected = undefined;
			}
		};
		this.scroll = function(up) {
			if (this.selected) {
				if (up) {
					this.selected.weight++;
				} else {
					this.selected.weight--;
				}
			}
		};
	}
}
