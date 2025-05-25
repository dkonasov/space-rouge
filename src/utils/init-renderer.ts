import {
	DirectionalLight,
	OrthographicCamera,
	Scene,
	WebGLRenderer,
} from "three";
import { getFrustrumBounds } from "./get-frustrum-bounds";

export function initRenderer() {
	const scene = new Scene();

	// camera setup
	const frustrumBounds = getFrustrumBounds();
	const camera = new OrthographicCamera(
		frustrumBounds.left,
		frustrumBounds.right,
		frustrumBounds.top,
		frustrumBounds.bottom,
		1,
		1000,
	);
	camera.position.z = 10;
	camera.lookAt(0, 0, -1);

	// light setup
	const light = new DirectionalLight(0xffffff, 0.8); // soft white light
	light.position.set(-3.5, 0, 10);
	scene.add(light);

	const renderer = new WebGLRenderer();

	renderer.setSize(window.innerWidth, window.innerHeight);

	return { scene, camera, renderer };
}
