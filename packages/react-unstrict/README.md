# @del-wang/react-unstrict

✂️ Bypass React StrictMode double execution for consistent development behavior.

## Why?

React StrictMode double-invokes effects in development to detect side effects. This package ensures your code runs only once, maintaining consistency between development and production.

## Installation

```shell
npm install @del-wang/react-unstrict
```

## Get Started

### useUnStrictEffect


```ts
import { useUnStrictEffect } from "@del-wang/react-unstrict";

function Component() {
  useUnStrictEffect(() => {
    // Runs once, even in StrictMode
    console.log("API call");
    return () => console.log("Cleanup");
  }, []);

  return <div>Component</div>;
}
```

### useUnStrictRun


```ts
import { useUnStrictRun } from "@del-wang/react-unstrict";

function Component() {
  useUnStrictRun(() => {
    // Runs once per build, even though React calls build twice in dev mode
    console.log("Build logic executed");
  });

  return <div>Component</div>;
}
```

## License

MIT © [Del Wang](https://del.wang)
