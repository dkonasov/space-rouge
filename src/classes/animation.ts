import {
	type AnimationAction,
	type AnimationClip,
	type AnimationMixer,
	Clock,
	LoopOnce,
} from "three";

export class Animation {
	private action: AnimationAction;
	private clock: Clock;

	private onRequestAnimationFrame() {
		if (this.action.isRunning()) {
			const delta = this.clock.getDelta();
			this.mixer.update(delta);
			requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
		}
	}

	constructor(
		private mixer: AnimationMixer,
		clip: AnimationClip,
	) {
		this.action = this.mixer.clipAction(clip);
		this.action.setLoop(LoopOnce, 1);
		this.clock = new Clock();
	}

	play() {
		this.action.play();
		requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
	}
}
