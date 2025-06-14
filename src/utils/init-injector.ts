import type { Scene, WebGLRenderer } from "three";
import { devtoolsSymbol, injector } from "../constants/injector";
import type { Devtools } from "../types/devtools";

export async function initInjector(scene: Scene, renderer: WebGLRenderer) {
	let devtools: Devtools;
	if (import.meta.env.MODE === "production") {
		const { DevtoolsStub } = await import("../classes/devtools-stub");
		devtools = new DevtoolsStub();
	} else {
		const { DevtoolsImpl } = await import("../classes/devtools-impl");
		devtools = new DevtoolsImpl(scene, renderer);
	}

	injector[devtoolsSymbol] = devtools;
}
