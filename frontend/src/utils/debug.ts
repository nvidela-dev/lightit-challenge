// Debug settings that can be accessed outside React components
export const debugSettings = {
  throttleMs: 0,
  isOffline: false,
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const applyDebugSettings = async () => {
  if (debugSettings.isOffline) {
    throw new Error('Network request failed: Backend is offline (simulated)');
  }
  if (debugSettings.throttleMs > 0) {
    await sleep(debugSettings.throttleMs);
  }
};
