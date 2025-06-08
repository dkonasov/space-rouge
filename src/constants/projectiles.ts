import type { Projectile } from "../types/projectile";

export const projectiles = {
	barbaris: {
		damage: 50,
	},
} satisfies Record<string, Projectile>;
