import { type Mesh, ShaderMaterial } from "three";
import { Object3DComponent } from "./object-3d-component";

type UniformFactory = (timestamp: number) => Record<string, unknown>;

export class AnimatedShaderComponent extends Object3DComponent {
	private additionalUnifromsFactory: UniformFactory | null = null;

	private onRequestAnimationFrame(timestamp: number) {
		if (this.getGameObject().markedForDeletion) return;

		const time = timestamp - this.startTime;

		if (this.mesh.material instanceof ShaderMaterial) {
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
	}

	setAdditionalUniformsFactory(factory: UniformFactory) {
		this.additionalUnifromsFactory = factory;
	}

	private startTime = 0;
}
