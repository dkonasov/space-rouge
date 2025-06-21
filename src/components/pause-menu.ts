import { consume } from "@lit/context";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import type { Router } from "../classes/router";
import { routerContext } from "../context/router-context";
import { SettingsScreen } from "../screens/settings-screen";
import { gamePaused } from "../state";

@customElement("pause-menu")
export class PauseMenu extends LitElement {
	// todo: maybe should use style abstraction, as we share styles with main menu here
	static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

	.menuInner {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
    `;

	@consume({ context: routerContext })
	_routerContext!: Router;

	private _goToSettings() {
		this._routerContext.goToScreen(SettingsScreen);
	}

	private _resumeGame() {
		gamePaused.set(false);
	}

	render() {
		return html`
            <div class="menuInner">
             <game-button @click="${this._resumeGame}">
				Resume game
			</game-button>
            <game-button @click="${this._goToSettings}">
				Settings
			</game-button>
            </div>
        `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"pause-menu": PauseMenu;
	}
}
