// Source: https://github.com/AsyncBanana/microdiff/blob/f7b20ead1e356ac45b158c78b35a1eb9c09b2bb7/index.ts

const kRichTypes = { Date: true, RegExp: true, String: true, Number: true };

export function deepEqual(obj: any, newObj: any) {
  return _deepEqual({ obj }, { obj: newObj });
}

function _deepEqual(obj: any, newObj: any, _stack: any[] = []): boolean {
  for (const key in obj) {
    const objKey = obj[key];
    if (!(key in newObj)) {
      // remove
      return false;
    }
    const newObjKey = newObj[key];
    const areCompatibleObjects =
      typeof objKey === 'object' &&
      typeof newObjKey === 'object' &&
      Array.isArray(objKey) === Array.isArray(newObjKey);
    if (
      objKey &&
      newObjKey &&
      areCompatibleObjects &&
      !kRichTypes[
        Object.getPrototypeOf(objKey)?.constructor
          ?.name as keyof typeof kRichTypes
      ] &&
      !_stack.includes(objKey)
    ) {
      if (!_deepEqual(objKey, newObjKey, _stack.concat([objKey]))) {
        return false;
      }
    } else if (
      objKey !== newObjKey &&
      !(Number.isNaN(objKey) && Number.isNaN(newObjKey)) &&
      !(
        areCompatibleObjects &&
        (isNaN(objKey)
          ? objKey + '' === newObjKey + ''
          : +objKey === +newObjKey)
      )
    ) {
      // change
      return false;
    }
  }

  for (const key in newObj) {
    if (!(key in obj)) {
      // create
      return false;
    }
  }

  return true;
}
