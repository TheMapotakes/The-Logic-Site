function toRGB(max, value) {
	return Math.round(255 * (value / max));
}
function toHex(n) {
	return n.toString(16).padStart(2, '0');
}

class Cube extends THREE.Mesh {
	constructor(x, y, z, size) {
		let hex = '#' + toHex(toRGB(size, x)) + toHex(toRGB(size, y)) + toHex(toRGB(size, z));
		super(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: hex }));

		this.hex = hex;

		this.position.x = x;
		this.position.y = y;
		this.position.z = z;
	}
}
