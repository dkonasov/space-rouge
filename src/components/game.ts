import { html, LitElement, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import "./game-canvas";
import "./game-over-message";
import { SignalWatcher } from "@lit-labs/signals";
import { gameLost, gamePaused } from "../state";
import "./player-score";
import "./health-bar";
import { BACK_COMMAND_EVENT_NAME } from "../constants/common-commands";

@customElement("space-rouge-game")
export class Game extends SignalWatcher(LitElement) {
	protected firstUpdated(): void {
		document.addEventListener(BACK_COMMAND_EVENT_NAME, this.pauseHandler);
	}

	pauseHandler = () => {
		if (gameLost.get()) return;
		gamePaused.set(!gamePaused.get());
	};

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
