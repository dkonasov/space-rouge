export const PRIMARY_FIRE_TRIGGERED_EVENT_NAME = "onprimaryfiretriggered";

declare global {
	interface HTMLElementEventMap {
		[PRIMARY_FIRE_TRIGGERED_EVENT_NAME]: Event;
	}
}
