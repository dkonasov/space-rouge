import { signal, computed, type Signal } from "@lit-labs/signals";
import type { Screen } from "../types/screen";
import { Stack } from "./stack";

export class Router {
	constructor(initialScreen: Screen) {
		this._screen = signal(initialScreen);
	}

	goToScreen(screen: Screen) {
		this._history.add(this._screen.get());
		this._screen.set(screen);
	}

	goBack() {
		const prevScreen = this._history.get();

		if (prevScreen) {
			this._screen.set(prevScreen);
		}
	}

	private _screen: Signal.State<Screen>;

	private _history = new Stack<Screen>();

	// expose screen as readonly computed
	public screen = computed(() => this._screen.get()());
}
