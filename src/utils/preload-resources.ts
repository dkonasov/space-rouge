export interface PreloadResourcesProgress {
	loaded: number;
	total: number;
}

export type PreloadedResourceUpdateHandler = (
	progress: PreloadResourcesProgress,
) => void;

export function preloadResources(
	progressHandler: PreloadedResourceUpdateHandler,
): Promise<void> {
	const resources = [
		`${import.meta.env.BASE_URL}spaceship_4.glb`,
		`${import.meta.env.BASE_URL}stone_sample_1.png`,
		`${import.meta.env.BASE_URL}projectile.glb`,
	];

	const totalResources = resources.length;
	let loadedResources = 0;

	const promises: Promise<unknown>[] = resources.map((resource) => {
		return fetch(resource).then(() => {
			loadedResources++;
			progressHandler({
				loaded: loadedResources,
				total: totalResources,
			});
		});
	});

	return Promise.all(promises).then(() => {});
}
