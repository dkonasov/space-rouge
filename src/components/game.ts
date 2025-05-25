import { html, LitElement, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import "./game-canvas";
import "./game-over-message";
import { SignalWatcher } from "@lit-labs/signals";
import { gameLost } from "../state";
import "./player-score";
import "./health-bar";

@customElement("space-rouge-game")
export class Game extends SignalWatcher(LitElement) {
	render() {
		return html`
      <div>
        ${
					gameLost.get()
						? html`<game-over-message></game-over-message>`
						: nothing
				}
        <space-rouge-game-canvas></space-rouge-game-canvas>
        <player-score></player-score>
        <health-bar></health-bar>
      </div>
    `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"space-rouge-game": Game;
	}
}
