import { AXIS_INPUT_EVENT_NAME } from "../constants/axis-input";
import { PRIMARY_FIRE_TRIGGERED_EVENT_NAME } from "../constants/fire-input";
import type { AxisInputEvent } from "../types/axis-input";
import { GameObjectComponent } from "./game-object-component";
import type { MovementComponent } from "./movement-component";
import { WeaponComponent } from "./weapon-component";

export class PlayerInputComponent extends GameObjectComponent {
	static sensivity = 0.01;

	eventsMap = {
		[AXIS_INPUT_EVENT_NAME]: (event: AxisInputEvent) => {
			this.movementComponent.setVelocity(
				event.detail.vector
					.clone()
					.multiplyScalar(PlayerInputComponent.sensivity),
			);
		},
		[PRIMARY_FIRE_TRIGGERED_EVENT_NAME]: () => {
			this.gameObject?.getComponent(WeaponComponent)?.fire();
		},
	};

	constructor(
		private movementComponent: MovementComponent,
		private canvas: HTMLCanvasElement,
	) {
		super();

		canvas.addEventListener(
			AXIS_INPUT_EVENT_NAME,
			this.eventsMap[AXIS_INPUT_EVENT_NAME],
		);

		canvas.addEventListener(
			PRIMARY_FIRE_TRIGGERED_EVENT_NAME,
			this.eventsMap[PRIMARY_FIRE_TRIGGERED_EVENT_NAME],
		);
	}

	onDestroy() {
		this.canvas.removeEventListener(
			AXIS_INPUT_EVENT_NAME,
			this.eventsMap[AXIS_INPUT_EVENT_NAME],
		);

		this.canvas.removeEventListener(
			PRIMARY_FIRE_TRIGGERED_EVENT_NAME,
			this.eventsMap[PRIMARY_FIRE_TRIGGERED_EVENT_NAME],
		);
	}
}
