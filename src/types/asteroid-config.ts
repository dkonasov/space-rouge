import type { Vector3 } from "three";

export interface AsteroidConfig {
	scale: Vector3;
	getLengthFn: (level: number, maxLevel: number) => number;
	maxHeight: number;
}
