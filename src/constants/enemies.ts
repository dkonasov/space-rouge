import type { Enemy } from "../types/enemy";

export const enemies = {
	asteroid: {
		health: 100,
		reward: 50,
	},
} satisfies Record<string, Enemy>;
