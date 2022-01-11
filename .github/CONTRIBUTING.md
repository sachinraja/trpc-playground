# Setup

This project uses the [pnpm](https://pnpm.io/) package manager. You must have it installed to contribute.

1. Install:

```sh
pnpm i
```

# Testing

Go to `apps/vite` and run `pnpm dev`. View the playground at http://localhost:3001 (the Express/tRPC server is at http://localhost:3000). You can edit the router at `apps/router/index.ts` and the Express server will automatically reload and the playground will resolve the new types. If you want to change how often the playground types are refreshed, you can change `refreshTypesTimeout` in `apps/vite/server/app.ts` to a different value (in milliseconds).
