// @ts-nocheck
export const kIsReactDev =
  typeof window !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  (__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers?.get(1)?.bundleType === 1 || // Chrome, Firefox
    __REACT_DEVTOOLS_GLOBAL_HOOK__.renderers?.get(1) == null); // Safari
