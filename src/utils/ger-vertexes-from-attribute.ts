import {
	type BufferAttribute,
	type InterleavedBufferAttribute,
	Vector3,
} from "three";

export function getVertexesFromAttribute(
	positionAttrib: BufferAttribute | InterleavedBufferAttribute,
) {
	const positions: Vector3[] = [];

	for (let i = 0; i < positionAttrib.count; i += 4) {
		const a = new Vector3(
			positionAttrib.getX(i),
			positionAttrib.getY(i),
			positionAttrib.getZ(i),
		);
		const b = new Vector3(
			positionAttrib.getX(i + 1),
			positionAttrib.getY(i + 1),
			positionAttrib.getZ(i + 1),
		);
		const c = new Vector3(
			positionAttrib.getX(i + 2),
			positionAttrib.getY(i + 2),
			positionAttrib.getZ(i + 2),
		);
		const d = new Vector3(
			positionAttrib.getX(i + 3),
			positionAttrib.getY(i + 3),
			positionAttrib.getZ(i + 3),
		);
		positions.push(a, b, c, d, c, b);
	}

	return positions;
}
