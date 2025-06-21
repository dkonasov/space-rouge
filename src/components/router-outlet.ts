import { consume } from "@lit/context";
import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { routerContext } from "../context/router-context";
import type { Router } from "../classes/router";
import { SignalWatcher } from "@lit-labs/signals";

@customElement("router-outlet")
export class RouterOutlet extends SignalWatcher(LitElement) {
	@consume({ context: routerContext })
	_routerContext!: Router;

	render() {
		return this._routerContext.screen.get();
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"router-outlet": RouterOutlet;
	}
}
