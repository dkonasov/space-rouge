import { BACK_COMMAND_EVENT_NAME } from "../constants/common-commands";

export function initKeyboardControls() {
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			document.dispatchEvent(new CustomEvent(BACK_COMMAND_EVENT_NAME));
		}
	});
}
