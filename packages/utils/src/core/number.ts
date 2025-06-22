export function randomInt(_min: number, _max?: number) {
  let min = _min;
  let max = _max;
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function clamp(num: number, min: number, max: number): number {
  return num < max ? (num > min ? num : min) : max;
}

export function toInt(str: string) {
  return Number.parseInt(str, 10);
}

export function toDouble(str: string) {
  return Number.parseFloat(str);
}
