import { html } from "lit";
import "../components/unsupported-device-message";
import { Screen } from "../types/screen";

export const UnsupportedDeviceScreen: Screen = () =>
	html`<unsopported-device-message></unsopported-device-message>`;
