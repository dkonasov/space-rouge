import { GameObjectComponent } from "./game-object-component";
import { Shape } from "./shape";

export class CollisionComponent extends GameObjectComponent {
	constructor(public collider: Shape) {
		super();
	}
}
