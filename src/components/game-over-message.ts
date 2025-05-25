import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "./game-button";
import { gameLost, score, health } from "../state";

@customElement("game-over-message")
export class GameOverMessage extends LitElement {
	private restartGame() {
		gameLost.set(false);
		score.set(0);
		health.set(100);
	}

	render() {
		return html`
      <div class="title">Game over</div>
      <game-button @click="${this.restartGame}">New game</game-button>
    `;
	}

	static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      gap: 1.5em;
    }

    .title {
      font-size: 4em;
    }
  `;
}

declare global {
	interface HTMLElementTagNameMap {
		"game-over-message": GameOverMessage;
	}
}
