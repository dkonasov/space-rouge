import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import { GameObject } from "../classes/game-object";
import { Object3DComponent } from "../classes/object-3d-component";

export function initTestObject() {
	const geometry = new BoxGeometry(1, 1, 1);
	const material = new MeshStandardMaterial({
		color: 0xffffff,
	});
	const cube = new Mesh(geometry, material);

	const testObject = new GameObject();
	testObject.addComponent(new Object3DComponent(cube));

	return testObject;
}
