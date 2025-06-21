import { consume } from "@lit/context";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import type { Router } from "../classes/router";
import { routerContext } from "../context/router-context";
import { GameScreen } from "../screens/game";
import "./game-button";
import { SettingsScreen } from "../screens/settings-screen";

@customElement("space-rouge-main-menu")
export class MainMenu extends LitElement {
	static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
    }

	.menuInner {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
  `;

	@consume({ context: routerContext })
	_routerContext!: Router;

	private _startGame() {
		this._routerContext.goToScreen(GameScreen);
	}

	private _goToSettings() {
		this._routerContext.goToScreen(SettingsScreen);
	}

	render() {
		return html`
		<div class="menuInner">
			<game-button @click="${this._startGame}">
				Start Game
			</game-button>
			<game-button @click="${this._goToSettings}">
				Settings
			</game-button>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"space-rouge-main-menu": MainMenu;
	}
}
