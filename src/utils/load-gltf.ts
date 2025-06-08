import { type GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function loadGltf(url: string) {
	return new Promise<GLTF>((resolve, reject) => {
		new GLTFLoader().load(url, resolve, undefined, reject);
	});
}
