import { BufferAttribute, BufferGeometry, Vector2, type Vector3 } from "three";
import type { GameScene } from "../classes/game-scene";
import { Object3DComponent } from "../classes/object-3d-component";
import { generateAsteroid } from "./generate-asteroid";
import { getFrustrumBounds } from "./get-frustrum-bounds";
import { MovementComponent } from "../classes/movement-component";
import AsteroidGeometryGenerator from "./workers/generate-asteroid-geometry.ts?worker";
import { gameLost, gamePaused } from "../state";
import { effect } from "signal-utils/subtle/microtask-effect";

const frustrumBounds = getFrustrumBounds();
let spawnIntervalMin = 800;
let spawnIntervalMax = 1000;
let minEnemiesPerRow = 6;
let maxEnemiesPerRow = 10;
let interval: number;
let difficultyLevelTimeDelta = 0;
let gameWasPaused = false;

const MAX_DIFFICULTY_LEVEL = 10;
let difficultyChangedAt = Date.now();
const DIFFICULTY_INCREASE_PERIOD = 1000 * 20;
let level = -1;

function getSpawnInterval() {
	const min = 1800 - level * 100;
	const max = 2000 - level * 100;

	return [min, max];
}

function getEnemiesPerRow() {
	const min = Math.round(1 + level * 0.5);
	const max = Math.round(3 + level * 0.7);

	return [min, max];
}

function increaseLevel() {
	level++;

	const spawnInterval = getSpawnInterval();
	const enemiesPerRow = getEnemiesPerRow();

	spawnIntervalMin = spawnInterval[0];
	spawnIntervalMax = spawnInterval[1];
	minEnemiesPerRow = enemiesPerRow[0];
	maxEnemiesPerRow = enemiesPerRow[1];
}

function startLevelChanging(baseLevel = 0) {
	difficultyChangedAt = Date.now();
	level = baseLevel - 1;
	increaseLevel();
	interval = setInterval(() => {
		if (Date.now() - difficultyChangedAt >= DIFFICULTY_INCREASE_PERIOD) {
			increaseLevel();
			difficultyChangedAt = Date.now();
			if (level === MAX_DIFFICULTY_LEVEL) {
				clearInterval(interval);
			}
		}
	}, DIFFICULTY_INCREASE_PERIOD);
}

effect(() => {
	if (gameLost.get()) {
		clearInterval(interval);
	}
});

effect(() => {
	if (!gameLost.get()) {
		startLevelChanging();
	}
});

effect(() => {
	if (gamePaused.get()) {
		clearInterval(interval);
		difficultyLevelTimeDelta = Date.now() - difficultyChangedAt;
		gameWasPaused = true;
	} else if (gameWasPaused) {
		difficultyChangedAt = Date.now() - difficultyLevelTimeDelta;
		startLevelChanging(level);
	}
});

export async function spawnEnemies(scene: GameScene) {
	let lastSpawnTimestamp = -1;
	let spawnInterval =
		Math.random() * (spawnIntervalMax - spawnIntervalMin) + spawnIntervalMin;

	const onFrameRequested = async (time: number) => {
		if (
			(lastSpawnTimestamp === -1 ||
				time - lastSpawnTimestamp > spawnInterval) &&
			!gameLost.get() &&
			!gamePaused.get()
		) {
			lastSpawnTimestamp = time;
			spawnInterval =
				Math.random() * (spawnIntervalMax - spawnIntervalMin) +
				spawnIntervalMin;

			const enemiesCount =
				Math.round(Math.random() * maxEnemiesPerRow) + minEnemiesPerRow;

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

			const fieldWidth = frustrumBounds.right - frustrumBounds.left;
			const margin = 0.3;
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
