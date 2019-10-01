class Selector {
	constructor() {
		this.position = new Victor(0, 0);
		this.lastPosition = this.position;
		this.velocity = new Victor(0, 0);

		this.selected;

		this.move = function(x, y) {
			this.lastPosition = this.position;
			this.position = new Victor(x, y);
			this.velocity = new Victor(this.position.x - this.lastPosition.x, this.position.y - this.lastPosition.y);
			if (this.selected) {
				this.selected.position = this.position;
			}
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
					this.selected.radius++;
				} else {
					this.selected.radius--;
				}
			}
		};
	}
}
