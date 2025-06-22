const flags = new Set<string>();

export function runOnce(key: string, run: () => void) {
  if (flags.has(key)) return;
  flags.add(key);
  return run();
}

export function runOnceFn(key: string, run: () => void) {
  return () => runOnce(key, run);
}
