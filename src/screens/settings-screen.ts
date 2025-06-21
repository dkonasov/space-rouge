import { html } from "lit";
import type { Screen } from "../types/screen";
import "../components/settings";

export const SettingsScreen: Screen = () =>
	html`<space-rouge-settings></space-rouge-settings>`;
