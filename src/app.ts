import { LitElement, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MainMenuScreen } from "./screens/main-menu";
import { provide } from "@lit/context";
import { routerContext } from "./context/router-context";
import { Router } from "./classes/router";
import { isMobile } from "is-mobile";
import { UnsupportedDeviceScreen } from "./screens/unsopported-device-screen";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("space-rouge-app")
export class App extends LitElement {
	@state()
	private screen: TemplateResult = isMobile()
		? UnsupportedDeviceScreen()
		: MainMenuScreen();

	@provide({ context: routerContext })
	router: Router = new Router((screen) => {
		this.screen = screen();
	});

	render() {
		return this.screen;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"space-rouge-app": App;
	}
}
