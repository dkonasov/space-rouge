import {
	AnimationClip,
	AnimationMixer,
	BufferGeometry,
	Mesh,
	MeshStandardMaterial,
	NumberKeyframeTrack,
	TextureLoader,
	Vector2,
	Vector3,
} from "three";
import { GameObject } from "../classes/game-object";
import { Object3DComponent } from "../classes/object-3d-component";
import { AnimationComponent } from "../classes/animation-component";
import { Animation } from "../classes/animation";
import { Rectangle } from "../classes/rectangle";
import { CollisionComponent } from "../classes/collision-component";
import { DamageComponent } from "../classes/damage-component";
import { enemies } from "../constants/enemies";
import { createExplosionEffect } from "./create-explosion-effect";
import { score } from "../state";

const loader = new TextureLoader();
const texture = loader.load(`${import.meta.env.BASE_URL}stone_sample_1.png`);

const material = new MeshStandardMaterial({
	map: texture,
	emissive: 0xffffff,
	emissiveIntensity: 0,
});

export function generateAsteroid(
	geometry: BufferGeometry,
	boundingBox: Vector3,
) {
	const asteroidMesh = new Mesh(geometry, material.clone());
	const asteroidObject = new GameObject();
	const track = new NumberKeyframeTrack(
		".material.emissiveIntensity",
		[0, 0.125, 0.25],
		[0, 0.5, 0],
	);
	const clip = new AnimationClip("emissive", -1, [track]);
	const mixer = new AnimationMixer(asteroidMesh);
	const animationComponent = new AnimationComponent();
	animationComponent.animations.damage = new Animation(mixer, clip);
	const object3DComponent = new Object3DComponent(asteroidMesh);
	asteroidObject.addComponent(object3DComponent);
	asteroidObject.addComponent(animationComponent);

	const collisionBox = new Rectangle(boundingBox.x, boundingBox.y);
	asteroidObject.addComponent(new CollisionComponent(collisionBox));
	const damageComponent = new DamageComponent(enemies.asteroid.health);

	damageComponent.onDeath(() => {
		asteroidObject.markedForDeletion = true;

		const effect = createExplosionEffect();

		effect
			.getComponentOrNull(Object3DComponent)
			?.move(
				new Vector2(object3DComponent.position.x, object3DComponent.position.y),
			);

		asteroidObject.scene?.addGameObject(effect);

		score.set(score.get() + enemies.asteroid.reward);
	});
	asteroidObject.addComponent(damageComponent);

	return [asteroidObject, collisionBox] as const;
}
