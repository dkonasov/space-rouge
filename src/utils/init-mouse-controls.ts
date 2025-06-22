import { Vector2 } from "three";
import { AXIS_INPUT_EVENT_NAME } from "../constants/axis-input";
import type { AxisInputEventPayload } from "../types/axis-input";
import { PRIMARY_FIRE_TRIGGERED_EVENT_NAME } from "../constants/fire-input";
import { effect } from "signal-utils/subtle/microtask-effect";
import { gameLost, inverseX, inverseY } from "../state";
import { BACK_COMMAND_EVENT_NAME } from "../constants/common-commands";

const pointerLockChangeHandler = () => {
	if (!document.pointerLockElement && !gameLost.get()) {
		document.dispatchEvent(new CustomEvent(BACK_COMMAND_EVENT_NAME));
	}
};

export function initMouseControls(canvasElement: HTMLCanvasElement) {
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

		const directionX = inverseX.get() ? -1 : 1;
		const directionY = inverseY.get() ? -1 : 1;

		canvasElement.dispatchEvent(
			new CustomEvent<AxisInputEventPayload>(AXIS_INPUT_EVENT_NAME, {
				detail: {
					vector: new Vector2(
						event.movementX * directionX,
						event.movementY * directionY,
					),
				},
			}),
		);
	});

	effect(async () => {
		if (!gameLost.get()) {
			await canvasElement.requestPointerLock();
			document.addEventListener("pointerlockchange", pointerLockChangeHandler);
		} else {
			document.removeEventListener(
				"pointerlockchange",
				pointerLockChangeHandler,
			);
		}
	});
}
