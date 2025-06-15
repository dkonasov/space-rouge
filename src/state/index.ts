import { signal } from "@lit-labs/signals";

export const gameLost = signal(false);
export const score = signal(0);
export const health = signal(100);
export const gamePaused = signal(false);
export const gameStarted = signal(false);
