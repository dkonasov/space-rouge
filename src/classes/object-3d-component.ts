import { Object3D, Scene, Vector2, Vector3 } from "three";
import { GameObjectComponent } from "./game-object-component";

export class Object3DComponent extends GameObjectComponent {
	constructor(private object3D: Object3D) {
		super();
	}

	addToScene(scene: Scene) {
		scene.add(this.object3D);
	}

	removeFromScene(scene: Scene) {
		scene.remove(this.object3D);
	}

	set scale(scale: Vector3) {
		this.object3D.scale.copy(scale);
	}

	get position() {
		return this.object3D.position;
	}

	move(velocity: Vector2) {
		this.object3D.position.x += velocity.x;
		this.object3D.position.y += velocity.y;
	}

	rotate(axises: Vector3) {
		this.object3D.rotation.x = axises.x;
		this.object3D.rotation.y = axises.y;
		this.object3D.rotation.z = axises.z;
	}
}
