import { Camera, WebGLRenderer } from "three";
import { GameScene } from "./game-scene";

function animate(scene: GameScene, camera: Camera, renderer: WebGLRenderer) {
	renderer.render(scene.scene, camera);
}

export class GameRenderer {
	constructor(private renderer: WebGLRenderer) {}

	renderScene(scene: GameScene, camera: Camera) {
		this.renderer.setAnimationLoop(
			animate.bind(null, scene, camera, this.renderer),
		);
	}
}
