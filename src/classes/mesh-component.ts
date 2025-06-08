import type { Mesh } from "three";
import { Object3DComponent } from "./object-3d-component";

export class MeshComponent extends Object3DComponent {
	constructor(public mesh: Mesh) {
		super(mesh);
	}
}
