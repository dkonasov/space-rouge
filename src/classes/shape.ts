import type { Vector2 } from "three";

export abstract class Shape {
	abstract hasIntersection(
		other: Shape,
		shapePosition: Vector2,
		otherPosition: Vector2,
	): boolean;
}
