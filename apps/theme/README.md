# Porto Theme

Theming system for Porto with multiple export formats.

## Files

- `porto-theme.ts` - The default Porto theme
- `export-theme.ts` - CLI tool to export the theme in various formats

Related files in `~internal/lib`:

- `~internal/lib/theme-mappings.ts` - Generated mappings (`./export-theme.ts --as tailwind_mappings`)
- `~internal/lib/Theme.ts` - Theme runtime utilities

## Export Formats

```bash
./export-theme.ts --as css                # CSS variables
./export-theme.ts --as css_commented      # Same as previous with comments
./export-theme.ts --as tailwind           # Tailwind @theme format
./export-theme.ts --as tailwind_commented # Same as previous with comments
./export-theme.ts --as json               # JSON format (see `~internal/lib/TailwindTheme.ts` to convert it back to Tailwind)
./export-theme.ts --as tailwind_mappings  # Tailwind mappings (see `~internal/lib/TailwindThemeMappings.ts`)
```

## CLI Options

```bash
$ ./export-theme.ts --help

Usage: export-theme.ts [options]

Options:
  --as <format>      Output format (default: css).
                     Supported formats: css, css_commented, json, tailwind, tailwind_commented, tailwind_mappings.
  --help, -h         Show this help message.
  --out              File to write the exported theme to. Prints to stdout if not specified.
  --watch, -w        Watch for changes and re-export the theme. Requires an output file.
```

## Theme development

```bash
pnpm dev
```

This will start a watcher that re-export the theme to `~internal/styles/porto-theme.css` whenever `porto-theme.ts` is modified.

To add a new theme property:

1. Add the property to the `Theme` type in Porto (`../../src/theme/Theme.ts`).
2. Add it to `porto-theme.ts`.
3. Generate the mappings: `pnpm export:mappings`
