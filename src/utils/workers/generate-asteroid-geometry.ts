import { Vector3 } from "three";
import { AsteroidGeometry } from "../../classes/asteroid-geometry";
import { AsteroidParams } from "../../classes/asteroid-params";

const minAsteroidScale = new Vector3(0.1, 0.1, 0.1);
const maxAsteroidScale = new Vector3(0.2, 0.2, 0.2);
const asteroidScaleRandomRange = maxAsteroidScale.clone().sub(minAsteroidScale);

function getLengthFn(level: number, maxLevel: number) {
	return (maxLevel - level) * 0.01 + 0.01;
}

const asteroidParams = new AsteroidParams({
	maxHeight: 3,
	scale: minAsteroidScale
		.clone()
		.add(
			asteroidScaleRandomRange
				.clone()
				.multiply(new Vector3(Math.random(), Math.random(), Math.random())),
		),
	getLengthFn: getLengthFn,
});

const asteroidGeo = new AsteroidGeometry(asteroidParams);

postMessage(
	structuredClone([
		asteroidGeo.geometry.getAttribute("position").array,
		asteroidGeo.geometry.getAttribute("normal").array,
		asteroidGeo.geometry.getAttribute("uv").array,
		asteroidGeo.boundingBox,
	]),
);

export default {};
