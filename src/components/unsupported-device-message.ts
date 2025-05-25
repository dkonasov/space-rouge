import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("unsopported-device-message")
export class UnsupportedDeviceMessage extends LitElement {
	static styles = css`
    .unsupported-device-message {
      display: flex;
      flex-direction: column;
      height: 100vh;
      align-items: center;
      justify-content: center;
    }

    .unsupported-device-text {
      text-align: center;
    }
  `;

	render() {
		return html`<div class="unsupported-device-message">
      <h1>Unsupported Device</h1>
      <p class="unsupported-device-text">
        This device is not supported. Please use a laptop or desktop to play
        Space Rouge.
      </p>
    </div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"unsopported-device-message": UnsupportedDeviceMessage;
	}
}
