import { Devtools, OnRafConfig } from "../types/devtools";

export class DevtoolsStub implements Devtools {
	onRaf(_config: OnRafConfig): void {}
}
