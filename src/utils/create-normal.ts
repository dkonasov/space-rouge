import { Vector3 } from "three";

export function createNormal(points: number[][]) {
	const p1 = new Vector3(points[0][0], points[0][1], points[0][2]);
	const p2 = new Vector3(points[1][0], points[1][1], points[1][2]);
	const p3 = new Vector3(points[2][0], points[2][1], points[2][2]);

	const v1 = p2.clone().sub(p1);
	const v2 = p3.clone().sub(p1);

	return v1.cross(v2).normalize();
}
