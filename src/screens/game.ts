import { html } from "lit";
import type { Screen } from "../types/screen";
import "../components/game";

export const GameScreen: Screen = () =>
	html`<space-rouge-game></space-rouge-game>`;
