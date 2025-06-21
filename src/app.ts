import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { MainMenuScreen } from "./screens/main-menu";
import { provide } from "@lit/context";
import { routerContext } from "./context/router-context";
import { Router } from "./classes/router";
import { isMobile } from "is-mobile";
import { UnsupportedDeviceScreen } from "./screens/unsopported-device-screen";
import "./components/router-outlet";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("space-rouge-app")
export class App extends LitElement {
	static styles = css`
	:host {
		display: block;
		height: 100vh;
	}
	`;

	@provide({ context: routerContext })
	router: Router = new Router(
		isMobile() ? UnsupportedDeviceScreen : MainMenuScreen,
	);

	render() {
		return html`<router-outlet></router-outlet>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"space-rouge-app": App;
	}
}
