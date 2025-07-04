import { html } from "lit";
import "../components/unsupported-device-message";
import type { Screen } from "../types/screen";

export const UnsupportedDeviceScreen: Screen = () =>
	html`<unsopported-device-message></unsopported-device-message>`;
