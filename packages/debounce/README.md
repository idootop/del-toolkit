# @del-wang/debounce

🚰 Debounce and throttle functions for JavaScript/TypeScript

## Installation

```shell
npm install @del-wang/debounce
```

## Get Started

### Debounce

Delays function execution until after specified time has elapsed since the last call.

```ts
import { debounce } from "@del-wang/debounce";

const search = debounce((query: string) => {
  console.log("Searching for:", query);
}, 300);

// Only the last call will execute after 300ms
search("a");
search("ab");
search("abc"); // Only this will log: "Searching for: abc"
```

Perfect for:

- Search input fields
- Form validation
- Window resize handlers
- API calls triggered by user input

### Throttle

Limits function execution to at most once per specified time interval.

```ts
import { throttle } from "@del-wang/debounce";

const onScroll = throttle(() => {
  console.log("Scroll event handled");
}, 100);

// Will execute at most once every 100ms
window.addEventListener("scroll", onScroll);
```

Perfect for:

- Scroll event handlers
- Mouse move events
- Button click protection
- Performance-critical animations

## License

MIT License © 2025-PRESENT [Del Wang](https://del.wang)
