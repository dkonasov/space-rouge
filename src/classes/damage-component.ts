import { AnimationComponent } from "./animation-component";
import { GameObjectComponent } from "./game-object-component";

export class DamageComponent extends GameObjectComponent {
	private onDeathCallback: (() => void) | null = null;
	constructor(private _health: number) {
		super();
	}

	onDeath(callback: () => void) {
		this.onDeathCallback = callback;
	}

	inflictDamage(damage: number) {
		this._health -= damage;
		this.gameObject
			?.getComponentOrNull(AnimationComponent)
			?.animations.damage?.play();

		if (this._health <= 0 && this.onDeathCallback) {
			this.onDeathCallback();
		}
	}
}
