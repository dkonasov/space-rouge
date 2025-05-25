export interface FrustrumBounds {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export function getFrustrumBounds(): FrustrumBounds {
	const ratio = window.innerWidth / window.innerHeight;

	return {
		top: 1,
		right: ratio,
		bottom: -1,
		left: -ratio,
	};
}
