export function printJson(obj: any) {
  console.log(JSON.stringify(obj, undefined, 4));
}

export function repeat(text: string, count: number) {
  return Array(count).fill(text).join('');
}

export function toFixed(n: number, fractionDigits = 2) {
  let s = n.toFixed(fractionDigits);
  while (s[s.length - 1] === '0') {
    s = s.substring(0, s.length - 1);
  }
  if (s[s.length - 1] === '.') {
    s = s.substring(0, s.length - 1);
  }
  return s;
}

export function uuid(): string {
  const uuid = new Array(36);
  for (let i = 0; i < 36; i++) {
    uuid[i] = Math.floor(Math.random() * 16);
  }
  uuid[14] = 4;
  uuid[19] = uuid[19] &= ~(1 << 2);
  uuid[19] = uuid[19] |= 1 << 3;
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  return uuid.map((x) => x.toString(16)).join('');
}

/**
 * Compare [semver](https://semver.org/) version strings using the specified operator.
 *
 * @param v1 First version to compare
 * @param operator Allowed arithmetic operator to use
 * @param v2 Second version to compare
 * @returns `true` if the comparison between the firstVersion and the secondVersion satisfies the operator, `false` otherwise.
 *
 * @example
 * ```ts
 * compareVersion('10.1.8', '>', '10.0.4'); // return true
 * compareVersion('10.0.1', '=', '10.0.1'); // return true
 * compareVersion('10.1.1', '<', '10.2.2'); // return true
 * compareVersion('10.1.1', '<=', '10.2.2'); // return true
 * compareVersion('10.1.1', '>=', '10.2.2'); // return false
 * ```
 */
export function compareVersion(
  v1: string,
  operator: '<' | '<=' | '=' | '!=' | '>' | '>=',
  v2: string,
): boolean {
  const parseVersion = (version: string) => version.split('.').map(Number);

  const version1 = parseVersion(v1);
  const version2 = parseVersion(v2);

  // Pad the shorter version with zeros
  while (version1.length < version2.length) {
    version1.push(0);
  }
  while (version2.length < version1.length) {
    version2.push(0);
  }

  for (let i = 0; i < version1.length; i++) {
    if (version1[i]! < version2[i]!) {
      return operator === '<' || operator === '<=' || operator === '!=';
    }
    if (version1[i]! > version2[i]!) {
      return operator === '>' || operator === '>=' || operator === '!=';
    }
  }

  return operator === '=' || operator === '<=' || operator === '>=';
}
