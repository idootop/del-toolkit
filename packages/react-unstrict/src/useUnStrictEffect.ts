/** biome-ignore-all lint/correctness/useHookAtTopLevel: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { shallowEqual } from '@del-wang/equals';
import { type DependencyList, useEffect, useRef } from 'react';

import { kIsReactDev } from './dev.js';

export function useUnStrictEffect(
  effect: () => void | VoidFunction,
  deps?: DependencyList,
) {
  if (kIsReactDev) {
    return _useUnStrictEffect(effect, deps || [{}]);
  }
  return useEffect(effect, deps);
}

function _useUnStrictEffect(
  effect: () => void | VoidFunction,
  deps?: DependencyList,
) {
  const refs = useRef({
    step1: 0,
    step2: 0,
    cleanup: null as null | VoidFunction,
    prevDeps: undefined as DependencyList | undefined,
  });

  useEffect(() => {
    const depsChanged = !shallowEqual(refs.current.prevDeps, deps);
    if (depsChanged) {
      // deps changed, reset counter
      refs.current.step1 = 0;
      refs.current.step2 = 0;
      refs.current.cleanup?.();
      refs.current.cleanup = null;
      refs.current.prevDeps = deps;
    }
    refs.current.step1++;
    if (refs.current.step2 === 0) {
      refs.current.cleanup = effect() as any;
    }
    return () => {
      refs.current.step2++;
      setTimeout(() => {
        if (refs.current.step1 === refs.current.step2) {
          refs.current.cleanup?.();
          refs.current.step2++;
        }
      });
    };
  }, deps);
}
