# UI Playground

A development playground for testing and showcasing UI components.

## Development

From this directory, run:

```sh
pnpm i
pnpm dev
```

The playground will be available at <http://localhost:5175/>

## Adding Components

1. Create a new route file in `src/routes/` (e.g., `src/routes/my-component.tsx`)
2. Add a link to the component in the sidebar navigation in `src/routes/__root.tsx`
3. Display your component variations and examples in the route file

## Structure

- `src/routes/` - Component showcase pages
- `src/styles.css` - Global styles
- `src/router.tsx` - Router configuration
