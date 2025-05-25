type MemoryMeasurementsResult = {
	bytes: number;
};

declare global {
	interface Performance {
		measureUserAgentSpecificMemory?(): Promise<MemoryMeasurementsResult>;
	}
}

export {};
