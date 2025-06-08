import { Vector2 } from "three";
import type { GameObject } from "./game-object";
import { GameObjectComponent } from "./game-object-component";
import { MovementComponent } from "./movement-component";
import { Object3DComponent } from "./object-3d-component";

export class WeaponComponent extends GameObjectComponent {
	constructor(
		private projectileObjectFactory: () => GameObject | Promise<GameObject>,
		private projectileSpeed: Vector2,
	) {
		super();
	}

	async fire() {
		if (!this.gameObject) {
			throw new Error("GameObject is not set");
		}

		const movementComponent = new MovementComponent({ inert: true });
		const projectile = await this.projectileObjectFactory();
		const object3DComponent = projectile.getComponent(Object3DComponent);
		const position = this.gameObject.getComponent(Object3DComponent).position;
		object3DComponent.move(new Vector2(position.x, position.y));
		movementComponent.setVelocity(this.projectileSpeed.clone());
		projectile.addComponent(movementComponent);

		this.gameObject?.scene?.addGameObject(projectile);
	}
}
