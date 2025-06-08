import type { Vector2 } from "three";
import { AXIS_INPUT_EVENT_NAME } from "../constants/axis-input";

export interface AxisInputEventPayload {
	vector: Vector2;
}

export type AxisInputEvent = CustomEvent<AxisInputEventPayload>;

declare global {
	interface HTMLElementEventMap {
		[AXIS_INPUT_EVENT_NAME]: AxisInputEvent;
	}
}
