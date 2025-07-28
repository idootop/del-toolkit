/**
 * [1,3,2] => [3,2,1]
 */
export function sortNumberDesc(a: number, b: number) {
  return b - a;
}

/**
 * [1,3,2] => [1,2,3]
 */
export function sortNumberAsc(a: number, b: number) {
  return a - b;
}

/**
 * ['1','3','2'] => ['3','2','1']
 */
export function sortStringDesc(a: string, b: string) {
  return b.localeCompare(a, undefined, { numeric: true });
}

/**
 * ['1','3','2'] => ['1','2','3']
 */
export function sortStringAsc(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true });
}
