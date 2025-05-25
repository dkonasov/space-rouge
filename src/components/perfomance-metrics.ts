import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("performance-metrics")
export class PerformanceMetrics extends LitElement {
	static styles? = css`
    :host {
      display: block;
      position: fixed;
      top: 50px;
      left: 0;
      background: #005;
      color: #fff;
      width: 80px;
      height: 48px;
    }
  `;

	@state()
	private memoryUsage = 0;

	render() {
		return html`<div>${this.memoryUsage.toFixed(2)} GiB</div>`;
	}

	protected firstUpdated() {
		this.measureMemory();

		setInterval(() => {
			this.measureMemory();
		}, 5000);
	}

	private async measureMemory() {
		if (performance.measureUserAgentSpecificMemory) {
			this.memoryUsage =
				(await performance.measureUserAgentSpecificMemory()).bytes /
				(1024 * 1024 * 1024);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"performance-metrics": PerformanceMetrics;
	}
}
