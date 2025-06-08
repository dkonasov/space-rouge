import { GameObjectComponent } from "./game-object-component";
import type { Animation } from "./animation";

export class AnimationComponent extends GameObjectComponent {
	animations: Record<string, Animation> = {};
}
