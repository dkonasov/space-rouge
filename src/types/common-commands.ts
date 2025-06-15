import { BACK_COMMAND_EVENT_NAME } from "../constants/common-commands";

export type BackCommandEvent = CustomEvent;

declare global {
	interface HTMLElementEventMap {
		[BACK_COMMAND_EVENT_NAME]: BackCommandEvent;
	}
}
