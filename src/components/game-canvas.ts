import { LitElement, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
import { initGame } from "../utils/init-game";

@customElement("space-rouge-game-canvas")
export class GameCanvas extends LitElement {
	protected async firstUpdated(_changedProperties: PropertyValues) {
		await initGame(this.renderRoot);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"space-rouge-game-canvas": GameCanvas;
	}
}
