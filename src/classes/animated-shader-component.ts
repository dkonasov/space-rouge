import { type Mesh, ShaderMaterial } from "three";
import { Object3DComponent } from "./object-3d-component";
import { effect } from "signal-utils/subtle/microtask-effect";
import { gamePaused } from "../state";

type UniformFactory = (timestamp: number) => Record<string, unknown>;

export class AnimatedShaderComponent extends Object3DComponent {
	private additionalUnifromsFactory: UniformFactory | null = null;
	private gamePausedAt = -1;
	private timeShift = 0;

	private onRequestAnimationFrame(timestamp: number) {
		if (this.getGameObject().markedForDeletion) {
			this.cancelEffect();
			return;
		}

		const time = timestamp - this.startTime - this.timeShift;

		if (this.mesh.material instanceof ShaderMaterial && this.gamePausedAt < 0) {
			this.mesh.material.uniformsNeedUpdate = true;
			this.mesh.material.uniforms.u_time.value = time;

			const additionalUniforms = this.additionalUnifromsFactory?.(time);

			if (additionalUniforms) {
				for (const [key, value] of Object.entries(additionalUniforms)) {
					if (!(this.mesh.material instanceof ShaderMaterial)) return;

					if (this.mesh.material.uniforms[key]) {
						this.mesh.material.uniforms[key].value = value;
					}
				}
			}
		}
		requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
	}

	constructor(private mesh: Mesh) {
		super(mesh);
		requestAnimationFrame((timestamp) => {
			this.startTime = timestamp;
			if (this.mesh.material instanceof ShaderMaterial) {
				this.mesh.material.uniforms.u_time = {
					value: timestamp,
				};

				const additionalUniforms = this.additionalUnifromsFactory?.(timestamp);

				if (additionalUniforms) {
					for (const [key, value] of Object.entries(additionalUniforms)) {
						if (!(this.mesh.material instanceof ShaderMaterial)) return;

						if (this.mesh.material.uniforms[key]) {
							this.mesh.material.uniforms[key].value = value;
						}
					}
				}
			}
			requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
		});

		this.cancelEffect = effect(() => {
			if (gamePaused.get()) {
				this.gamePausedAt = performance.now();
			}

			if (this.gamePausedAt >= 0 && !gamePaused.get()) {
				this.timeShift += performance.now() - this.gamePausedAt;
				this.gamePausedAt = -1;
			}
		});
	}

	setAdditionalUniformsFactory(factory: UniformFactory) {
		this.additionalUnifromsFactory = factory;
	}

	private startTime = 0;
	private cancelEffect: () => void;
}
