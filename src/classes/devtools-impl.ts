import {
	type BufferGeometry,
	Mesh,
	MeshBasicMaterial,
	type Object3D,
	PlaneGeometry,
	type Scene,
	type WebGLRenderer,
} from "three";
import type { Devtools, OnRafConfig } from "../types/devtools";
import GUI from "lil-gui";
import { Object3DComponent } from "./object-3d-component";
import { Rectangle } from "./rectangle";
import Stats from "three/examples/jsm/libs/stats.module.js";
import "../components/perfomance-metrics";
import { AXIS_INPUT_EVENT_NAME } from "../constants/axis-input";

interface State {
	showColliders: boolean;
}

export class DevtoolsImpl implements Devtools {
	private state: State = {
		showColliders: false,
	};

	private stats = new Stats();

	private colliderFrames: Object3D[] = [];

	onRaf(config: OnRafConfig): void {
		for (const obj of this.colliderFrames) {
			this.scene.remove(obj);
		}

		this.stats.update();

		if (this.state.showColliders) {
			for (const collider of config.colliders) {
				const obj = collider.getGameObject().getComponent(Object3DComponent);
				const shape = collider.bounds;

				let geometry: BufferGeometry;
				if (shape instanceof Rectangle) {
					geometry = new PlaneGeometry(shape.width, shape.height);
				} else {
					throw new Error("Unsupported collider shape");
				}

				const material = new MeshBasicMaterial({
					wireframe: true,
					color: 0x00ff00,
				});

				const mesh = new Mesh(geometry, material);
				mesh.position.x = obj.position.x;
				mesh.position.y = obj.position.y;
				mesh.position.z = obj.position.z;

				this.scene.add(mesh);
				this.colliderFrames.push(mesh);
			}
		}
	}

	constructor(
		private scene: Scene,
		renderer: WebGLRenderer,
	) {
		const gui = new GUI();
		document.body.appendChild(this.stats.dom);
		gui.add(this.state, "showColliders");

		const pmComponent = document.createElement("performance-metrics");

		document.body.appendChild(pmComponent);

		renderer.domElement.addEventListener(AXIS_INPUT_EVENT_NAME, () => {
			console.debug("Axis input event");
		});
	}
}
