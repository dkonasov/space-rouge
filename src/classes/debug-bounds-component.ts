import { GameObjectComponent } from "./game-object-component";
import { Shape } from "./shape";

export class DebugBoundsComponent extends GameObjectComponent {
	constructor(public bounds: Shape) {
		super();
	}
}
