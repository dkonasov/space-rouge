import type { Screen } from "../types/screen";

export class Router {
	constructor(private onScreenChange: (screen: Screen) => void) {}

	goToScreen(screen: Screen) {
		this.onScreenChange(screen);
	}
}
