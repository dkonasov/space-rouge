import type { GameObject } from "./game-object";

export class GameObjectComponent {
	protected gameObject: GameObject | null = null;

	setGameObject(gameObject: GameObject) {
		this.gameObject = gameObject;
	}

	getGameObject(): GameObject {
		if (!this.gameObject) {
			throw new Error("GameObject is not set");
		}

		return this.gameObject;
	}

	onDestroy() {}
}
