class Cursor {
	constructor() {
		this.position = new Victor(0, 0);
		this.lastPosition = new Victor(0, 0);

		this.movenum = 0;

		this.move = function(x, y) {
			this.position = new Victor(x, y);
			this.movenum++;
			if (this.movenum % 25 == 0) {
				this.lastPosition = this.position;
				this.movenum = 0;
			}
		};

		this.render = function() {
			var orientationX = this.position.x - this.lastPosition.x;
			var orientationY = this.position.y - this.lastPosition.y;

			let rotation = Math.atan2(orientationY, orientationX);
			let x = this.position.x;
			let y = this.position.y;

			var grad = ctx.createLinearGradient(0, 0, 7, 7);
			grad.addColorStop(0, '#2CFAE4');
			grad.addColorStop(1, '#45BAAE');

			ctx.translate(x, y);
			ctx.rotate(rotation);

			ctx.strokeStyle = grad;

			ctx.beginPath();
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
