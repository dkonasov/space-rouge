import { html, SignalWatcher } from "@lit-labs/signals";
import { css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { score } from "../state";

@customElement("player-score")
export class PlayerScore extends SignalWatcher(LitElement) {
	static styles = css`
    :host {
      display: block;
      position: fixed;
      bottom: 0;
      right: 0;
      color: #fff;
    }
  `;

	render() {
		return html`Total Score: ${score}`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"player-score": PlayerScore;
	}
}
