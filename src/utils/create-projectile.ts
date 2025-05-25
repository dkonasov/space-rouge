import { Mesh, Vector3 } from "three";
import { GameObject } from "../classes/game-object";
import { Object3DComponent } from "../classes/object-3d-component";
import { loadGltf } from "./load-gltf";
import { Rectangle } from "../classes/rectangle";
import { CollisionTriggerComponent } from "../classes/collision-trigger-component";
import { DamageComponent } from "../classes/damage-component";
import { projectiles } from "../constants/projectiles";

export async function createProjectile() {
	const projectile = new GameObject();
	const projectileModel = await loadGltf(
		`${import.meta.env.BASE_URL}projectile.glb`,
	);

	const projectileModelComponent = new Object3DComponent(projectileModel.scene);
	const size = 0.02;
	projectileModelComponent.scale = new Vector3(size, size, size);

	projectile.addComponent(projectileModelComponent);

	if (projectileModel.scene.children[0] instanceof Mesh) {
		const mesh = projectileModel.scene.children[0] as Mesh;

		if (mesh.geometry.boundingBox) {
			const boundingBox = mesh.geometry.boundingBox.getSize(new Vector3());
			const collisionComponent = new CollisionTriggerComponent(
				new Rectangle(boundingBox.x * size, boundingBox.z * size),
			);

			collisionComponent.onTrigger((other) => {
				other
					.getGameObject()
					.getComponentOrNull(DamageComponent)
					?.inflictDamage(projectiles.barbaris.damage);

				projectile.markedForDeletion = true;
			});

			projectile.addComponent(collisionComponent);
		}
	}

	return projectile;
}
