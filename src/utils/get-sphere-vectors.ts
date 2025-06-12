import { Vector3 } from "three";

export function getSphereVectors(segments: number) {
	const startVector = new Vector3(0, 0.5, 0);
	const baseAngle = Math.PI / (segments / 2);
	const result: Vector3[] = [startVector];

	for (let i = 1; i < segments / 2; i++) {
		const baseIterationVector = startVector
			.clone()
			.applyAxisAngle(new Vector3(1, 0, 0), baseAngle * i);
		result.push(baseIterationVector);

		for (let j = 1; j < segments; j++) {
			result.push(
				baseIterationVector
					.clone()
					.applyAxisAngle(new Vector3(0, 1, 0), j * baseAngle),
			);
		}
	}

	result.push(new Vector3(0, -0.5, 0));

	for (const vector of result) {
		vector.applyAxisAngle(new Vector3(1, 0, 0), baseAngle / 2);
	}

	return result;
}
