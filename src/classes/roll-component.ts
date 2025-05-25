import { Vector3 } from "three";
import { GameObjectComponent } from "./game-object-component";
import { MovementComponent } from "./movement-component";
import { Object3DComponent } from "./object-3d-component";

export class RollComponent extends GameObjectComponent {
	private onRequestAnimationFrame() {
		const object3DComponent =
			this.gameObject?.getComponentOrNull(Object3DComponent);
		const movementComponent =
			this.gameObject?.getComponentOrNull(MovementComponent);

		if (object3DComponent && movementComponent) {
			const velocity = movementComponent.getVelocity();

			const axis = new Vector3(0, 1, 0);
			const angle = Math.PI / 10;
			const threshold = 0.01;
			const absVelocity = Math.abs(velocity.x);

			if (absVelocity > threshold) {
				const multiplier = absVelocity / velocity.x;
				object3DComponent.rotate(axis.multiplyScalar(angle * multiplier));

				if (this.rotationRevertTimeout !== null) {
					clearTimeout(this.rotationRevertTimeout);
				}

				this.rotationRevertTimeout = setTimeout(() => {
					object3DComponent.rotate(new Vector3(0, 0, 0));
					if (this.rotationRevertTimeout !== null) {
						clearTimeout(this.rotationRevertTimeout);
					}
				}, 450);
			}
		}
		requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
	}

	private rotationRevertTimeout: number | null = null;

	constructor() {
		super();
		requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
	}
}
