export const kIsBrowser = typeof window !== 'undefined';

export async function nextTick(frames = 1) {
  for (let i = 0; i < frames; i++) {
    await new Promise(requestAnimationFrame);
  }
}
