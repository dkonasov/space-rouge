import {
	type PolyhedronGeometry,
	IcosahedronGeometry,
	type BufferAttribute,
	type InterleavedBufferAttribute,
	Vector3,
} from "three";
import type { AsteroidParams } from "./asteroid-params";
import { createNoise3D } from "simplex-noise";

export class AsteroidGeometry {
	private _geometry: PolyhedronGeometry;
	private _positionAttribute: BufferAttribute | InterleavedBufferAttribute;
	private _noiseGenerator = createNoise3D();
	public boundingBox = new Vector3();

	private _updateBounds(x: number, y: number, z: number) {
		if (x > this.boundingBox.x / 2 || x < -this.boundingBox.x / 2) {
			this.boundingBox.x = Math.abs(x) * 2;
		}

		if (y > this.boundingBox.y / 2 || y < -this.boundingBox.y / 2) {
			this.boundingBox.y = Math.abs(y) * 2;
		}

		if (z > this.boundingBox.z / 2 || z < -this.boundingBox.z / 2) {
			this.boundingBox.z = Math.abs(z) * 2;
		}
	}

	constructor(private params: AsteroidParams) {
		const geometry = new IcosahedronGeometry(1, 6);
		this._positionAttribute = geometry.getAttribute("position");

		const { scale, maxHeight } = this.params.config;

		geometry.scale(scale.x, scale.y, scale.z);

		const noiseScale = 7;

		for (let i = 0; i < this._positionAttribute.count; i++) {
			const x = this._positionAttribute.getX(i);
			const y = this._positionAttribute.getY(i);
			const z = this._positionAttribute.getZ(i);

			const magnitude =
				(this._noiseGenerator(x * noiseScale, y * noiseScale, z * noiseScale) +
					1) /
				2;
			const baseVector = new Vector3(x, y, z);
			const basis = baseVector.clone().normalize();
			const offset = basis.multiplyScalar(magnitude * maxHeight);

			const newX = x + offset.x;
			const newY = y + offset.y;
			const newZ = z + offset.z;

			this._positionAttribute.setXYZ(i, newX, newY, newZ);

			this._updateBounds(newX, newY, newZ);
		}

		this._geometry = geometry;
	}

	get geometry() {
		return this._geometry;
	}
}
