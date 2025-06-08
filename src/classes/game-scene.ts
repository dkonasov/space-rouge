import type { Scene } from "three";
import type { GameObject } from "./game-object";
import { getFrustrumBounds } from "../utils/get-frustrum-bounds";
import { Object3DComponent } from "./object-3d-component";
import { CollisionComponent } from "./collision-component";
import { CollisionTriggerComponent } from "./collision-trigger-component";
import { devtoolsSymbol, injector } from "../constants/injector";
import { DebugBoundsComponent } from "./debug-bounds-component";

const frustrumBounds = getFrustrumBounds();
const FRUSTRUM_BOUNDS_MAGNIFIER = 1.1;

export class GameScene {
	constructor(public scene: Scene) {
		requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
	}

	private gameObjects: Set<GameObject> = new Set();

	private onRequestAnimationFrame() {
		const gameObjectsWithColliders: GameObject[] = [];
		const gameObjectsWithTriggers: GameObject[] = [];
		const gameObjectsWithDebugBounds: GameObject[] = [];

		for (const gameObject of this.gameObjects) {
			const object3DComponent =
				gameObject.getComponentOrNull(Object3DComponent);

			if (object3DComponent) {
				const position = object3DComponent.position;

				if (
					gameObject.markedForDeletion ||
					position.x < frustrumBounds.left * FRUSTRUM_BOUNDS_MAGNIFIER ||
					position.x > frustrumBounds.right * FRUSTRUM_BOUNDS_MAGNIFIER ||
					position.y > frustrumBounds.top * FRUSTRUM_BOUNDS_MAGNIFIER ||
					position.y < frustrumBounds.bottom * FRUSTRUM_BOUNDS_MAGNIFIER
				) {
					gameObject.markedForDeletion = true;
					object3DComponent.removeFromScene(this.scene);
					this.gameObjects.delete(gameObject);
					gameObject.onDestroy();

					continue;
				}
			}

			if (import.meta.env.MODE !== "production") {
				const debugBoundsComponent =
					gameObject.getComponentOrNull(DebugBoundsComponent);

				if (debugBoundsComponent) {
					gameObjectsWithDebugBounds.push(gameObject);
				}
			}

			if (gameObject.getComponentOrNull(CollisionComponent)) {
				gameObjectsWithColliders.push(gameObject);
			}

			if (gameObject.getComponentOrNull(CollisionTriggerComponent)) {
				gameObjectsWithTriggers.push(gameObject);
			}
		}

		injector[devtoolsSymbol]?.onRaf({
			colliders: gameObjectsWithDebugBounds.map((obj) =>
				obj.getComponent(DebugBoundsComponent),
			),
		});

		for (const triggerObject of gameObjectsWithTriggers) {
			const triggerComponent = triggerObject.getComponent(
				CollisionTriggerComponent,
			);

			for (const colliderObject of gameObjectsWithColliders) {
				const colliderComponent =
					colliderObject.getComponent(CollisionComponent);

				triggerComponent.checkCollision(colliderComponent);
			}
		}

		requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
	}

	addGameObject(gameObject: GameObject) {
		this.gameObjects.add(gameObject);
		gameObject.addToScene(this);
	}
}
