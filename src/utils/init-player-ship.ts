import {
	AnimationClip,
	AnimationMixer,
	Mesh,
	NumberKeyframeTrack,
	Vector2,
} from "three";
import { GameObject } from "../classes/game-object";
import { Object3DComponent } from "../classes/object-3d-component";
import { loadGltf } from "./load-gltf";
import { createProjectile } from "./create-projectile";
import { WeaponComponent } from "../classes/weapon-component";
import { Rectangle } from "../classes/rectangle";
import { CollisionTriggerComponent } from "../classes/collision-trigger-component";
import { DamageComponent } from "../classes/damage-component";
import { AnimationComponent } from "../classes/animation-component";
import { Animation } from "../classes/animation";
import { gameLost, health } from "../state";
import { DebugBoundsComponent } from "../classes/debug-bounds-component";

export async function initPlayerShip() {
	const shipModel = await loadGltf(
		`${import.meta.env.BASE_URL}spaceship_4.glb`,
	);
	const shipObject = new GameObject();
	const size = 0.03;
	shipModel.scene.scale.set(size, size, size);

	const bounds = new Rectangle(0, 0);

	if (shipModel.scene.children[0] instanceof Mesh) {
		const mesh = shipModel.scene.children[0] as Mesh;
		const positionAttribute = mesh.geometry.getAttribute("position");

		for (let i = 0; i < positionAttribute.count; i++) {
			const x = positionAttribute.getX(i) * size * mesh.scale.x;
			const z = positionAttribute.getZ(i) * size * mesh.scale.z;

			if (x > bounds.width / 2) {
				bounds.width = x * 2;
			}

			if (z > bounds.height / 2) {
				bounds.height = z * 2;
			}
		}
	}

	const objectComponent = new Object3DComponent(shipModel.scene);

	if (!(shipModel.scene.children[0] instanceof Mesh)) {
		throw new Error("Ship model is not a mesh");
	}

	shipObject.addComponent(objectComponent);

	const weaponComponent = new WeaponComponent(
		createProjectile,
		new Vector2(0, 0.02),
	);
	shipObject.addComponent(weaponComponent);

	const track = new NumberKeyframeTrack(
		".material.emissiveIntensity",
		[0, 0.125, 0.25],
		[0, 0.5, 0],
	);
	const clip = new AnimationClip("emissive", -1, [track]);
	const mixer = new AnimationMixer(shipModel.scene.children[0]);
	const animationComponent = new AnimationComponent();
	animationComponent.animations.damage = new Animation(mixer, clip);

	const damageComponent = new DamageComponent(100);

	shipObject.addComponent(damageComponent);

	damageComponent.onDeath(() => {
		// TODO: maybe delegate some of this logic?
		shipObject.markedForDeletion = true;
		gameLost.set(true);

		document.exitPointerLock();
	});

	shipObject.addComponent(animationComponent);

	const triggerComponent = new CollisionTriggerComponent(bounds);
	let destroying = false;

	triggerComponent.onTrigger((other) => {
		if (destroying) {
			return;
		}

		destroying = true;
		setTimeout(() => {
			const damagePerCollision = 34;
			other
				.getGameObject()
				.getComponentOrNull(DamageComponent)
				?.inflictDamage(999);

			damageComponent.inflictDamage(damagePerCollision);
			health.set(health.get() - damagePerCollision);

			destroying = false;
		}, 200);
	});

	shipObject.addComponent(triggerComponent);

	if (import.meta.env.MODE !== "production") {
		const debugBoundsComponent = new DebugBoundsComponent(bounds);

		shipObject.addComponent(debugBoundsComponent);
	}

	return [shipObject, bounds] as const;
}
