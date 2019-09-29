class Line {
	constructor(clr, pos1, pos2) {
		var material = new THREE.LineBasicMaterial({ color: clr });
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(pos1.x, pos1.y, pos1.z));
		geometry.vertices.push(new THREE.Vector3(pos2.x, pos2.y, pos2.z));

		return new THREE.Line(geometry, material);
	}
}
