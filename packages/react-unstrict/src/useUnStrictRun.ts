/** biome-ignore-all lint/correctness/useHookAtTopLevel: <explanation> */
import { useEffect, useRef } from 'react';

import { kIsReactDev } from './dev.js';

export function useUnStrictRun(fn: () => void) {
  if (kIsReactDev) {
    return _useUnStrictRun(fn);
  }
  fn();
}

function _useUnStrictRun(fn: () => void) {
  const count = useRef(0);

  count.current++;
  if (count.current === 1) {
    fn();
  }

  useEffect(() => {
    count.current = 0;
  });
}
