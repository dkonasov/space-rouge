import { SignalWatcher } from "@lit-labs/signals";
import { css, html, LitElement } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { customElement } from "lit/decorators.js";
import { effect } from "signal-utils/subtle/microtask-effect";
import { gamePaused } from "../state";
import { provide } from "@lit/context";
import { Router } from "../classes/router";
import { routerContext } from "../context/router-context";
import { PauseMenuScreen } from "../screens/pause-menu";
import "./router-outlet";

@customElement("pause-dialog")
export class PauseDialog extends SignalWatcher(LitElement) {
	static styles = css`
    .dialog {
        background: #000000;
        color: #ffffff;
        height: 50vh;
        width: 50vw;
    }
    `;

	private dialogRef = createRef<HTMLDialogElement>();

	protected firstUpdated(): void {
		// todo: usnubscribe
		effect(() => {
			if (gamePaused.get()) {
				this.dialogRef.value?.showModal();
			} else {
				this.dialogRef.value?.close();
			}
		});
	}

	@provide({ context: routerContext })
	router: Router = new Router(PauseMenuScreen);

	render() {
		return html`<dialog class="dialog" ${ref(this.dialogRef)}>
        <router-outlet></router-outlet>
        </dialog>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"pause-dialog": PauseDialog;
	}
}
