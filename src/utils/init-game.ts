import { GameRenderer } from "../classes/game-renderer";
import { GameScene } from "../classes/game-scene";
import { gameLost } from "../state";
import { initBackground } from "./init-background";
import { initInjector } from "./init-injector";
import { initMouseControls } from "./init-mouse-controls";
import { initPlayerShip } from "./init-player-ship";
import { initRenderer } from "./init-renderer";
import { initShipControls } from "./init-ship-controls";
import { preloadResources } from "./preload-resources";
import { spawnEnemies } from "./spawn-enemies";
import { effect } from "signal-utils/subtle/microtask-effect";

export async function initGame(parent: HTMLElement | DocumentFragment) {
	await preloadResources(({ loaded, total }) => {
		console.log(`Loaded ${loaded} of ${total} resources`);
	});

	const { scene, camera, renderer } = initRenderer();
	await initInjector(scene);

	parent.appendChild(renderer.domElement);

	const backgroundObject = initBackground();

	const gameScene = new GameScene(scene);

	gameScene.addGameObject(backgroundObject);

	initMouseControls(renderer.domElement);

	spawnEnemies(gameScene);

	const gameRenderer = new GameRenderer(renderer);
	gameRenderer.renderScene(gameScene, camera);

	effect(async () => {
		if (!gameLost.get()) {
			const [shipObject, bounds] = await initPlayerShip();
			gameScene.addGameObject(shipObject);
			initShipControls(shipObject, renderer.domElement, bounds);
		}
	});
}
