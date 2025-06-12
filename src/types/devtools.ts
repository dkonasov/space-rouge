import type { DebugBoundsComponent } from "../classes/debug-bounds-component";

export interface OnRafConfig {
	colliders: DebugBoundsComponent[];
}

export interface Devtools {
	onRaf(config: OnRafConfig): void;
}

interface DevtoolsConstructor {
	new (): Devtools;
}

export declare let Devtools: DevtoolsConstructor;
