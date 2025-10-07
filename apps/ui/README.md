# Porto UI

## Installation

**package.json** (prepare script optional)

```json
{
  "dependencies": {
    "@porto/ui": "workspace:*"
  },
  "devDependencies": {
    "@pandacss/dev": "catalog:",
    "postcss": "catalog:"
  },
  "scripts": {
    "prepare": "panda codegen"
  }
}
```

**panda.config.ts**

```ts
import { defineConfig } from "@pandacss/dev";
import { portoUiConfig } from "@porto/ui/panda-config";

// app only using @porto/ui (no need for panda):
export default defineConfig(portoUiConfig);

// if the app uses panda:
export default defineConfig({
  ...portoUiConfig,
  include: [...portoUiConfig.include, "./src/**/*.{ts,tsx}"],
});
```

**vite.config.ts**

```ts
import { PortoUi } from "@porto/ui/vite-plugin";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [PortoUi()],
});
```

**postcss.config.cjs**

```js
module.exports = { plugins: { "@pandacss/dev/postcss": {} } };
```

**styles.css**

```css
@import "@porto/ui/base.css";
```

## Add chain icons

1. get official chain icon, in SVG
2. [optimize it](https://jakearchibald.github.io/svgomg/)
3. place it in `src/ChainIcon/icons/`
4. add a corresponding entry to `src/ChainIcon/icons.ts`
