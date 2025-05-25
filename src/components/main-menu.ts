import { consume } from "@lit/context";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { Router } from "../classes/router";
import { routerContext } from "../context/router-context";
import { GameScreen } from "../screens/game";
import "./game-button";

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
  `;

	@consume({ context: routerContext })
	_routerContext!: Router;

	private _startGame() {
		this._routerContext.goToScreen(GameScreen);
	}

	render() {
		return html`<game-button @click="${this._startGame}">
      Start Game
    </game-button>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"space-rouge-main-menu": MainMenu;
	}
}
