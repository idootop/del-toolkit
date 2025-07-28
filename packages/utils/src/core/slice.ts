import { randomInt } from './number.js';

export function firstOf<T>(items?: T[]) {
  return items ? (items.length < 1 ? undefined : items[0]) : undefined;
}

export function lastOf<T>(items?: T[]) {
  return items?.length ? items[items.length - 1] : undefined;
}

export function pickOne<T>(items: T[]) {
  return items.length < 1 ? undefined : items[randomInt(items.length - 1)];
}

export function range(_start: number, _end?: number) {
  let start = _start;
  let end = _end;
  if (!end) {
    end = start;
    start = 0;
  }
  return Array.from({ length: end - start }, (_, index) => start + index);
}

export function toSet<T>(items: T[], byKey?: (e: T) => string | number) {
  if (byKey) {
    const keys: Record<string | number, boolean> = {};
    const items: T[] = [];
    for (const e of items) {
      const key = byKey(e);
      if (!keys[key]) {
        items.push(e);
        keys[key] = true;
      }
    }
    return items;
  }
  return Array.from(new Set(items));
}

export function inserts<T>(oldItems: T[], index: number, newItems: T | T[]) {
  if (Array.isArray(newItems)) {
    oldItems.splice(index + 1, 0, ...newItems);
  } else {
    oldItems.splice(index + 1, 0, newItems);
  }
  return oldItems;
}
