import { SignalWatcher } from "@lit-labs/signals";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { health } from "../state";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("health-bar")
export class HealthBar extends SignalWatcher(LitElement) {
	static styles = css`
    :host {
      width: 20px;
      display: block;
      left: 0;
      bottom: 0;
      position: fixed;
    }

    .high {
      background: #0f0;
    }

    .medium {
      background: #ff0;
    }

    .low {
      background: #f00;
    }
  `;

	render() {
		const classes = {
			high: health.get() > 66,
			medium: health.get() <= 66 && health.get() > 33,
			low: health.get() <= 33,
		};

		const styles = {
			width: "20px",
			height: `${health.get()}px`,
		};

		return html`
      <div class=${classMap(classes)} style=${styleMap(styles)}></div>
    `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"health-bar": HealthBar;
	}
}
