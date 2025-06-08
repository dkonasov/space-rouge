import { Vector2 } from "three";
import { AXIS_INPUT_EVENT_NAME } from "../constants/axis-input";
import type { AxisInputEventPayload } from "../types/axis-input";
import { PRIMARY_FIRE_TRIGGERED_EVENT_NAME } from "../constants/fire-input";
import { effect } from "signal-utils/subtle/microtask-effect";
import { gameLost } from "../state";

export function initMouseControls(canvasElement: HTMLCanvasElement) {
	canvasElement.requestPointerLock();

	canvasElement.addEventListener("click", () => {
		canvasElement.requestPointerLock();
	});

	canvasElement.addEventListener("pointerdown", () => {
		canvasElement.dispatchEvent(
			new CustomEvent(PRIMARY_FIRE_TRIGGERED_EVENT_NAME),
		);
	});

	canvasElement.addEventListener("pointermove", (event) => {
		if (!document.pointerLockElement) {
			return;
		}

		canvasElement.dispatchEvent(
			new CustomEvent<AxisInputEventPayload>(AXIS_INPUT_EVENT_NAME, {
				detail: {
					vector: new Vector2(event.movementX, event.movementY),
				},
			}),
		);

		effect(() => {
			if (!gameLost.get()) {
				canvasElement.requestPointerLock();
			}
		});
	});
}
