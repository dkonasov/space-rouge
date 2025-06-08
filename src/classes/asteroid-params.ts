import { Vector3 } from "three";
import type { AsteroidConfig } from "../types/asteroid-config";

export class AsteroidParams {
	constructor(public config: AsteroidConfig) {}

	get maxBounds() {
		const { getLengthFn, maxHeight, scale } = this.config;
		const maxAbsoluteHeight = getLengthFn(0, maxHeight);

		return new Vector3(
			scale.x + maxAbsoluteHeight,
			scale.y + maxAbsoluteHeight,
			scale.z + maxAbsoluteHeight,
		);
	}
}
