import { Vector2 } from "three";
import type { CollisionComponent } from "./collision-component";
import { GameObjectComponent } from "./game-object-component";
import { Object3DComponent } from "./object-3d-component";
import type { Shape } from "./shape";

type TriigerHandler = (other: CollisionComponent) => void;

export class CollisionTriggerComponent extends GameObjectComponent {
	constructor(private collider: Shape) {
		super();
	}

	private handler: TriigerHandler | null = null;

	onTrigger(handler: TriigerHandler) {
		this.handler = handler;
	}

	checkCollision(other: CollisionComponent) {
		if (this.gameObject) {
			const otherGameObject = other.getGameObject();
			const otherPosition =
				otherGameObject.getComponent(Object3DComponent).position;
			const thisGameObject = this.gameObject;
			const thisPosition =
				thisGameObject.getComponent(Object3DComponent).position;

			const collided = this.collider.hasIntersection(
				other.collider,
				new Vector2(thisPosition.x, thisPosition.y),
				new Vector2(otherPosition.x, otherPosition.y),
			);

			if (collided && this.handler) {
				this.handler(other);
			}
		}
	}
}
