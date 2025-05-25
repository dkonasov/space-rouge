import { Mesh, PlaneGeometry, ShaderMaterial } from "three";
import { GameObject } from "../classes/game-object";

import starfieldFragmentShader from "../assets/shaders/starfield/fragment.glsl";
import starfieldVertexShader from "../assets/shaders/starfield/vertex.glsl";
import { AnimatedShaderComponent } from "../classes/animated-shader-component";

export function initBackground() {
	const geometry = new PlaneGeometry(100, 100);
	const material = new ShaderMaterial({
		fragmentShader: starfieldFragmentShader,
		vertexShader: starfieldVertexShader,
	});

	const mesh = new Mesh(geometry, material);
	mesh.position.z = -10;

	const gameObject = new GameObject();

	gameObject.addComponent(new AnimatedShaderComponent(mesh));

	return gameObject;
}
