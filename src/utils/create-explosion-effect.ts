import { BoxGeometry, Mesh, ShaderMaterial, Vector3 } from "three";
import { getVertexesFromAttribute } from "./ger-vertexes-from-attribute";

import simpleExplosionVertexShader from "../assets/shaders/simple-explosion/vertex.glsl";
import simpleExplosionFragmentShader from "../assets/shaders/simple-explosion/fragment.glsl";
import { getSphereVectors } from "./get-sphere-vectors";
import { GameObject } from "../classes/game-object";
import { AnimatedShaderComponent } from "../classes/animated-shader-component";

const sphereVectors = getSphereVectors(12);

export function createExplosionEffect() {
	const scale = 1;
	const geometry = new BoxGeometry(scale, scale, scale);
	const positionAttrib = geometry.getAttribute("position");
	const animationDuration = 2000;

	const positions: Vector3[] = getVertexesFromAttribute(positionAttrib);

	const material = new ShaderMaterial({
		vertexShader: simpleExplosionVertexShader,
		fragmentShader: simpleExplosionFragmentShader,
		transparent: true,
		uniforms: {
			cubePosition: {
				value: new Vector3(0, 0, 0),
			},
			u_time: {
				value: 0,
			},
			positions: {
				value: positions,
			},
			scale: {
				value: scale,
			},
			animationCompletion: {
				value: 0,
			},
			points: {
				value: sphereVectors.map((vector) => {
					return vector.clone();
				}),
			},
		},
	});

	const mesh = new Mesh(geometry, material);
	mesh.position.z = scale + 0.1;

	const object3DComponent = new AnimatedShaderComponent(mesh);

	object3DComponent.setAdditionalUniformsFactory((timestamp) => {
		const animationCompletion =
			(timestamp % animationDuration) / animationDuration;

		return {
			points: sphereVectors.map((vector) => {
				return vector.clone().multiplyScalar(animationCompletion);
			}),
		};
	});

	const obj = new GameObject();
	obj.addComponent(object3DComponent);

	setTimeout(() => {
		obj.markedForDeletion = true;
	}, animationDuration);

	return obj;
}
