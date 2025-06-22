# @del-wang/equals

🟰 Deep and shallow equal comparison for JavaScript

## Installation

```shell
npm install -D @del-wang/equals
```

## Usage

```ts
import { shallowEqual, deepEqual } from "@del-wang/equals";

// Shallow comparison - only first level
const obj1 = { a: 1, b: { x: 2 } };
const obj2 = { a: 1, b: { x: 2 } };
console.log(shallowEqual(obj1, obj2)); // false (different object references)

const sharedRef = { x: 2 };
const obj3 = { a: 1, b: sharedRef };
const obj4 = { a: 1, b: sharedRef };
console.log(shallowEqual(obj3, obj4)); // true (same reference)

// Deep comparison - all levels
console.log(deepEqual(obj1, obj2)); // true (deep equality)
```

## React Integration

The `shallowEqual` function is **identical** to React's internal implementation, perfect for optimizing React components:

```ts
import { shallowEqual } from "@del-wang/equals";
import { useEffect, useRef } from "react";

function useCustomHook(props: object) {
  const prevProps = useRef(props);

  useEffect(() => {
    if (!shallowEqual(prevProps.current, props)) {
      // Only execute when props actually change
      prevProps.current = props;
    }
  });
}
```

## Performance

- **shallowEqual**: O(n) - first-level properties only
- **deepEqual**: O(m) - all nested properties

It's recommended to use `shallowEqual` in most React scenarios unless deep comparison is specifically needed.

## License

MIT License © 2025-PRESENT [Del Wang](https://del.wang)
