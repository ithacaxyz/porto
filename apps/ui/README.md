# Porto UI

The library can be used in two ways:

- **Source Mode**: Uses TypeScript source files directly with full Panda CSS integration. Requires Panda and PostCSS to be installed as dependencies of the app.
- **Bundled Mode**: Uses a bundled version of the library.

## Source Mode Installation

**package.json**

```json
{
  "dependencies": {
    "@porto/ui": "workspace:*",
    "@ariakit/react": "catalog:",
    "porto": "workspace:*",
    "react": "catalog:",
    "react-dom": "catalog:"
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

export default defineConfig(portoUiConfig);
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

**src/styles.css**

```css
@import "../styled-system/styles.css";
```

**tsconfig.json**

```json
{
  "include": ["src", "styled-system"],
  "compilerOptions": {
    "paths": {
      "styled-system/*": ["./styled-system/*"]
    },
    "types": ["typed-query-selector/strict"]
  }
}
```

## Bundled Mode Installation

**package.json**

```json
{
  "dependencies": {
    "@porto/ui": "git+https://github.com/ithacaxyz/porto.git#main:apps/ui",
    "@ariakit/react": "*",
    "porto": "*",
    "react": ">=19",
    "react-dom": ">=19"
  }
}
```

**src/styles.css**

```css
@import "@porto/ui/styles.css";
```

**Note:** Before first use, build the library:

```bash
cd node_modules/@porto/ui && pnpm build
```

## Add chain icons

1. get official chain icon, in SVG
2. [optimize it](https://jakearchibald.github.io/svgomg/)
3. place it in `src/ChainIcon/icons/`
4. add a corresponding entry to `src/ChainIcon/icons.ts`
