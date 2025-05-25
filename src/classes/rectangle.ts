import { Vector2 } from "three";
import { Shape } from "./shape";

export class Rectangle extends Shape {
	hasIntersection(
		other: Shape,
		shapePosition: Vector2,
		otherPosition: Vector2,
	): boolean {
		if (other instanceof Rectangle) {
			const thisPonts = [
				new Vector2(
					shapePosition.x - this.width / 2,
					shapePosition.y + this.height / 2,
				),
				new Vector2(
					shapePosition.x + this.width / 2,
					shapePosition.y + this.height / 2,
				),
				new Vector2(
					shapePosition.x - this.width / 2,
					shapePosition.y - this.height / 2,
				),
				new Vector2(
					shapePosition.x + this.width / 2,
					shapePosition.y - this.height / 2,
				),
			];

			const otherPoints = [
				new Vector2(
					otherPosition.x - other.width / 2,
					otherPosition.y + other.height / 2,
				),
				new Vector2(
					otherPosition.x + other.width / 2,
					otherPosition.y + other.height / 2,
				),
				new Vector2(
					otherPosition.x - other.width / 2,
					otherPosition.y - other.height / 2,
				),
				new Vector2(
					otherPosition.x + other.width / 2,
					otherPosition.y - other.height / 2,
				),
			];

			for (const point of thisPonts) {
				if (
					point.x >= otherPoints[0].x &&
					point.x <= otherPoints[1].x &&
					point.y <= otherPoints[0].y &&
					point.y >= otherPoints[2].y
				) {
					return true;
				}
			}

			for (const point of otherPoints) {
				if (
					point.x >= thisPonts[0].x &&
					point.x <= thisPonts[1].x &&
					point.y <= thisPonts[0].y &&
					point.y >= thisPonts[2].y
				) {
					return true;
				}
			}
			return false;
		}

		throw new Error("Unkwown shape");
	}

	constructor(
		public width: number,
		public height: number,
	) {
		super();
	}
}
