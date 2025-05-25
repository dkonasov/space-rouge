import {
	PolyhedronGeometry,
	IcosahedronGeometry,
	BufferAttribute,
	InterleavedBufferAttribute,
	Vector3,
} from "three";
import { createNormal } from "../utils/create-normal";
import hashObject from "object-hash";
import { AsteroidParams } from "./asteroid-params";

export class AsteroidGeometry {
	private _geometry: PolyhedronGeometry;
	private _positionAttribute: BufferAttribute | InterleavedBufferAttribute;
	private _verticesList: string[];
	private _verticesSet: Set<string>;
	private _verticesMap: Record<string, number[]>;
	private _childrenMap: Record<string, Set<string>>;
	private _processedVerticles: Set<string> = new Set();
	private _unprocessedVerticles: string[] = [];
	public boundingBox = new Vector3();

	private _moveVertex(vertexId: string, vector: Vector3, length: number) {
		const increment = vector.clone().multiplyScalar(length);
		this._verticesMap[vertexId][0] += increment.x;
		this._verticesMap[vertexId][1] += increment.y;
		this._verticesMap[vertexId][2] += increment.z;
	}

	private _updateBounds(vertexId: string) {
		const x = this._verticesMap[vertexId][0];
		const y = this._verticesMap[vertexId][1];
		const z = this._verticesMap[vertexId][2];

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

	private _getAvailableHeight(startVerticle: string, maxHeight: number) {
		if (this._processedVerticles.has(startVerticle)) {
			return 0;
		}

		let verticlesQueue: string[] = [...this._childrenMap[startVerticle]];
		let processedVerticles = new Set<string>(this._childrenMap[startVerticle]);
		processedVerticles.add(startVerticle);

		for (let i = 1; i < maxHeight; i++) {
			const nextVerticlesQueue: string[] = [];
			while (verticlesQueue.length) {
				const verticle = verticlesQueue.pop()!;
				if (this._processedVerticles.has(verticle)) {
					return i;
				}

				const children = Array.from(
					this._childrenMap[verticle].values(),
				).filter((child) => !processedVerticles.has(child));
				nextVerticlesQueue.push(...children);
				processedVerticles.add(verticle);
			}

			verticlesQueue = nextVerticlesQueue;
		}

		return maxHeight;
	}

	private _createMountainOrDeep(height: number, startVerticle: string) {
		const testVerticleChidlren = Array.from(
			this._childrenMap[startVerticle].values(),
		);
		const { getLengthFn } = this.params.config;

		const sign = Math.random() > 0.5 ? 1 : -1;

		const verticlesCoords = [
			this._verticesMap[testVerticleChidlren[0]],
			this._verticesMap[testVerticleChidlren[1]],
			this._verticesMap[testVerticleChidlren[2]],
		];

		const normal = createNormal(verticlesCoords);

		this._moveVertex(startVerticle, normal, getLengthFn(1, height) * sign);
		this._updateBounds(startVerticle);
		this._processedVerticles.add(startVerticle);
		let verticlesQueue: string[] = [];
		this._childrenMap[startVerticle].forEach((child) => {
			this._processedVerticles.add(child);
			verticlesQueue.push(child);
		});

		for (let i = 2; i <= height; i++) {
			const nextVerticlesQueue: string[] = [];
			while (verticlesQueue.length) {
				const verticle = verticlesQueue.pop()!;
				this._moveVertex(verticle, normal, getLengthFn(i, height) * sign);
				const children = Array.from(
					this._childrenMap[verticle].values(),
				).filter((child) => !this._processedVerticles.has(child));
				nextVerticlesQueue.push(...children);
			}

			verticlesQueue = nextVerticlesQueue;
		}
	}

	constructor(private params: AsteroidParams) {
		const geometry = new IcosahedronGeometry(1, 6);
		this._positionAttribute = geometry.getAttribute("position");

		this._verticesSet = new Set<string>();
		this._verticesList = [];
		this._verticesMap = {};

		const { scale, maxHeight } = this.params.config;

		geometry.scale(scale.x, scale.y, scale.z);

		for (let i = 0; i < this._positionAttribute.count; i++) {
			const x = this._positionAttribute.getX(i);
			const y = this._positionAttribute.getY(i);
			const z = this._positionAttribute.getZ(i);
			const hash = hashObject([x, y, z]);
			this._verticesMap[hash] = [x, y, z];
			this._verticesList.push(hash);
			this._verticesSet.add(hash);
		}

		this._unprocessedVerticles = [...this._verticesSet];

		this._childrenMap = {};

		for (let i = 2; i < this._verticesList.length; i += 3) {
			const triangle = this._verticesList.slice(i - 2, i + 1);

			triangle.forEach((vertex, index) => {
				if (!this._childrenMap[vertex]) {
					this._childrenMap[vertex] = new Set();
				}

				const prevElemIndex = index - 1;
				const nextElemIndex = (index + 1) % 3;

				this._childrenMap[vertex].add(triangle.at(prevElemIndex)!);

				this._childrenMap[vertex].add(triangle.at(nextElemIndex)!);
			});
		}

		while (this._unprocessedVerticles.length) {
			const height = Math.floor(Math.random() * maxHeight) + 1;
			const index = Math.floor(
				Math.random() * this._unprocessedVerticles.length,
			);
			const elem = this._unprocessedVerticles.splice(index, 1)[0];
			const availableHeight = this._getAvailableHeight(elem, height);
			if (availableHeight === 0) {
				continue;
			}
			this._createMountainOrDeep(availableHeight, elem);
		}

		for (let i = 0; i < this._verticesList.length; i++) {
			const verticle = this._verticesMap[this._verticesList[i]];

			this._positionAttribute.setXYZ(i, verticle[0], verticle[1], verticle[2]);
		}

		this._geometry = geometry;
	}

	get geometry() {
		return this._geometry;
	}
}
