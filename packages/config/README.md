# @del-wang/config

⚙️ Shareable configurations for linting, formatting and build tools.

## Installation

```shell
npm install -D @del-wang/config
```

## Get Started

### tsconfig.json

```json
{
  "extends": "@del-wang/config/typescript",
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### biome.json

```json
{
  "extends": ["@del-wang/config/biome"]
}
```

### lefthook.yml

```yml
extends:
  - "@del-wang/config/lefthook"
```

### tsup.config.ts

```ts
import { config } from "@del-wang/config/tsup";
import { defineConfig } from "tsup";

export default defineConfig(config);
```

## License

MIT License © 2025-PRESENT [Del Wang](https://del.wang)
