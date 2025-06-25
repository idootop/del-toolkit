// Source: https://github.com/facebook/react/blob/fda1f0b902b527089fe5ae7b3aa573c633166ec9/packages/shared/shallowEqual.js

export function shallowEqual(objA: any, objB: any) {
  if (is(objA, objB)) {
    return true;
  }
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    const currentKey = keysA[i]!;
    if (
      !Object.hasOwn(objB, currentKey) ||
      !is(objA[currentKey], objB[currentKey])
    ) {
      return false;
    }
  }
  return true;
}

function is(x: any, y: any) {
  return typeof Object.is === 'function'
    ? Object.is(x, y)
    : // biome-ignore lint/suspicious/noSelfCompare: just do it
      (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
}
