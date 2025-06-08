import type { GameObjectComponent } from "./game-object-component";
import { Object3DComponent } from "./object-3d-component";
import type { GameScene } from "./game-scene";

export class GameObject {
	private components: GameObjectComponent[] = [];

	private validateComponent(component: GameObjectComponent) {
		if (
			component instanceof Object3DComponent &&
			this.components.some((c) => c instanceof Object3DComponent)
		) {
			throw new Error("Object3DComponent already exists");
		}
	}

	scene: GameScene | null = null;

	markedForDeletion = false;

	addToScene(gameScene: GameScene) {
		for (const component of this.components) {
			if (component instanceof Object3DComponent) {
				component.addToScene(gameScene.scene);
			}

			this.scene = gameScene;
			return;
		}

		throw new Error("No Object3DComponent found");
	}

	addComponent(component: GameObjectComponent) {
		this.validateComponent(component);

		this.components.push(component);
		component.setGameObject(this);
	}

	getComponent<T extends GameObjectComponent>(
		type: new (...args: any[]) => T,
	): T {
		const component = this.findComponent(type);

		if (!component) {
			throw new Error(`Component ${type.name} not found`);
		}

		return component as T;
	}

	findComponent<T extends GameObjectComponent>(
		type: new (...args: any[]) => T,
	): T | null {
		const component = this.components.find((c) => c instanceof type);

		if (!component) {
			return null;
		}

		return component as T;
	}

	getComponentOrNull<T extends GameObjectComponent>(
		type: new (...args: any[]) => T,
	): T | null {
		try {
			return this.getComponent(type);
		} catch {
			return null;
		}
	}

	onDestroy() {
		for (const component of this.components) {
			component.onDestroy();
		}
	}
}
