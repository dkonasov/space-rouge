import type { Devtools } from "../types/devtools";

export const devtoolsSymbol = Symbol("devtools");

export type DependeciesMap = {
	[devtoolsSymbol]?: Devtools;
};

export const injector: DependeciesMap = {};
