import { Scene } from "three";
import { devtoolsSymbol, injector } from "../constants/injector";
import { Devtools } from "../types/devtools";

export async function initInjector(scene: Scene) {
	let devtools: Devtools;
	if (import.meta.env.MODE === "production") {
		const { DevtoolsStub } = await import("../classes/devtools-stub");
		devtools = new DevtoolsStub();
	} else {
		const { DevtoolsImpl } = await import("../classes/devtools-impl");
		devtools = new DevtoolsImpl(scene);
	}

	injector[devtoolsSymbol] = devtools;
}
