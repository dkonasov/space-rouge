import { Vector2 } from "three";
import { GameObjectComponent } from "./game-object-component";
import { Object3DComponent } from "./object-3d-component";

export interface MovementComponentConstraints {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
}

export interface MovementComponentOptions {
	constraints?: MovementComponentConstraints;
	inert?: boolean;
}

const UPDATES_PERSECOND = 120;
const UPDATE_PERIOD = 1000 / UPDATES_PERSECOND;

export class MovementComponent extends GameObjectComponent {
	private timeFromLastUpdate = 0;

	private onRequestAnimationFrame(time: DOMHighResTimeStamp) {
		if (this.gameObject?.markedForDeletion) return;

		const deltaTime = time - this.timeFromLastUpdate;

		if (deltaTime < UPDATE_PERIOD) {
			requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
			return;
		}

		this.timeFromLastUpdate = time - (deltaTime % UPDATE_PERIOD);

		// TODO: figure out why multiplier here can sometimes be unexpectedly high
		const multiplier = Math.min(Math.floor(deltaTime / UPDATE_PERIOD), 3);

		let velocity = this.velocity.clone().multiplyScalar(multiplier);

		const object3DComponent =
			this.gameObject?.getComponentOrNull(Object3DComponent);

		if (object3DComponent) {
			let maxX = velocity.x;
			let maxY = velocity.y;
			let minX = velocity.x;
			let minY = velocity.y;

			if (this.constraints.right) {
				maxX = this.constraints.right - object3DComponent.position.x;

				if (maxX < 0) {
					maxX = 0;
				}
			}

			if (this.constraints.top) {
				maxY = this.constraints.top - object3DComponent.position.y;

				if (maxY < 0) {
					maxY = 0;
				}
			}

			if (this.constraints.left) {
				minX = this.constraints.left - object3DComponent.position.x;

				if (minX > 0) {
					minX = 0;
				}
			}

			if (this.constraints.bottom) {
				minY = this.constraints.bottom - object3DComponent.position.y;

				if (minY > 0) {
					minY = 0;
				}
			}

			velocity = new Vector2(
				Math.min(Math.max(minX, velocity.x), maxX),
				Math.min(Math.max(minY, velocity.y), maxY),
			);

			object3DComponent.move(velocity);
		}
		requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
	}

	constructor(options?: MovementComponentOptions) {
		super();

		if (options?.constraints) {
			this.constraints = options.constraints;
		}

		this.inert = options?.inert ?? false;

		requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
	}

	private velocity: Vector2 = new Vector2();
	private stopTime = 30;
	private stopTimeout: number | null = null;
	private constraints: MovementComponentConstraints = {};
	private inert = false;

	setVelocity(velocity: Vector2) {
		this.velocity = velocity;

		if (!this.inert) {
			if (this.stopTimeout !== null) {
				clearTimeout(this.stopTimeout);
			}

			this.stopTimeout = setTimeout(() => {
				this.velocity.set(0, 0);
			}, this.stopTime);
		}
	}

	getVelocity() {
		return this.velocity;
	}
}
