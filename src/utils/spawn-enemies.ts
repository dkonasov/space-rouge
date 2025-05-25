import { BufferAttribute, BufferGeometry, Vector2, Vector3 } from "three";
import { GameScene } from "../classes/game-scene";
import { Object3DComponent } from "../classes/object-3d-component";
import { generateAsteroid } from "./generate-asteroid";
import { getFrustrumBounds } from "./get-frustrum-bounds";
import { MovementComponent } from "../classes/movement-component";
import AsteroidGeometryGenerator from "./workers/generate-asteroid-geometry.ts?worker";
import { gameLost } from "../state";

const frustrumBounds = getFrustrumBounds();
const SPAWN_INTERVAL_MIN = 800;
const SPAWN_INTERVAL_MAX = 1000;
const MIN_ENEMIES_PER_ROW = 6;
const MAX_ENEMIES_PER_ROW = 10;

export async function spawnEnemies(scene: GameScene) {
	let lastSpawnTimestamp = -1;
	let spawnInterval =
		Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN) +
		SPAWN_INTERVAL_MIN;

	const onFrameRequested = async (time: number) => {
		if (
			(lastSpawnTimestamp === -1 ||
				time - lastSpawnTimestamp > spawnInterval) &&
			!gameLost.get()
		) {
			lastSpawnTimestamp = time;
			spawnInterval =
				Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN) +
				SPAWN_INTERVAL_MIN;

			const enemiesCount =
				Math.round(Math.random() * MAX_ENEMIES_PER_ROW) + MIN_ENEMIES_PER_ROW;

			const promises: Promise<
				[Float32Array, Float32Array, Float32Array, Vector3]
			>[] = [];

			for (let i = 0; i < enemiesCount; i++) {
				const promise = new Promise<
					[Float32Array, Float32Array, Float32Array, Vector3]
				>((resolve) => {
					const asteroidGeneratorWorker = new AsteroidGeometryGenerator();

					asteroidGeneratorWorker.onmessage = (event) => {
						const geometry = event.data;
						asteroidGeneratorWorker.terminate();
						resolve(geometry);
					};
				});

				promises.push(promise);
			}

			const geometries = await Promise.all(promises);

			let fieldWidth = frustrumBounds.right - frustrumBounds.left;
			let margin = 0.2;
			const segmentWidth = Math.max(margin * 2, fieldWidth / enemiesCount);

			for (let i = 0; i < enemiesCount; i++) {
				const geometry = new BufferGeometry();
				geometry.setAttribute(
					"position",
					new BufferAttribute(geometries[i][0], 3),
				);
				geometry.setAttribute(
					"normal",
					new BufferAttribute(geometries[i][1], 3),
				);
				geometry.setAttribute("uv", new BufferAttribute(geometries[i][2], 2));

				const [asteroid] = generateAsteroid(geometry, geometries[i][3]);

				const posX =
					segmentWidth * i +
					margin +
					Math.random() * (segmentWidth - margin * 2) -
					fieldWidth / 2;

				asteroid
					.getComponent(Object3DComponent)
					.move(new Vector2(posX, frustrumBounds.top + Math.random() * 0.3));

				const asteroidMovementComponent = new MovementComponent({
					inert: true,
				});
				asteroidMovementComponent.setVelocity(new Vector2(0, -0.01));

				asteroid.addComponent(asteroidMovementComponent);

				scene.addGameObject(asteroid);
			}
		}

		requestAnimationFrame(onFrameRequested);
	};

	requestAnimationFrame(onFrameRequested);
}
