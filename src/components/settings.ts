import { consume } from "@lit/context";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { routerContext } from "../context/router-context";
import type { Router } from "../classes/router";
import "./game-button";
import { SignalWatcher } from "@lit-labs/signals";
import { inverseX, inverseY } from "../state";

@customElement("space-rouge-settings")
export class SettingsScreen extends SignalWatcher(LitElement) {
	@consume({ context: routerContext })
	_routerContext!: Router;

	static styles = css`
        :host {
            display: block;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
            
        .settings-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }`;

	private exit() {
		this._routerContext.goBack();
	}

	private invertX() {
		inverseX.set(!inverseX.get());
	}

	private invertY() {
		inverseY.set(!inverseY.get());
	}

	render() {
		return html`<div>
            <h1>Settings</h1>
            <form class="settings-form">
                <label><input type="checkbox" name="invet_x" ?checked=${inverseX.get()} @change="${this.invertX}" /> Invert X Axis</label>
                <label><input type="checkbox" name="invert_y" ?checked=${inverseY.get()} @change="${this.invertY}" /> Invert Y Axis</label>
                <game-button @click="${this.exit}">
				Back
			</game-button>
            </form>
        </div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"space-rouge-settings": SettingsScreen;
	}
}
