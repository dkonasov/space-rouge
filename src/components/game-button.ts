import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("game-button")
export class GameButton extends LitElement {
	static styles = css`
    .button {
      background: #fff;
      color: #000;
      font-size: 24px;
	  width: 100%;
    }
  `;

	render() {
		return html`<button class="button"><slot></slot></button>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"game-button": GameButton;
	}
}
