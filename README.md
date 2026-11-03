# uwarp-packages

Monorepo of npm libraries for [Uwarp](https://www.uwarp.design) design tools, maintained by **Sherotree**.

| Package | Description | Uwarp tool |
|---------|-------------|------------|
| [`uwarp-contrast`](./packages/contrast) | WCAG 2.x contrast ratio + AA/AAA checks | [Colour contrast checker](https://www.uwarp.design/colour-contrast-checker) |
| [`uwarp-palette`](./packages/palette) | Seed hex → scale + harmonies | [Color tools](https://www.uwarp.design/tools/color) |
| [`uwarp-ttf-to-woff2`](./packages/ttf-to-woff2) | TTF/OTF → WOFF2 (WASM) | [TTF to WOFF2](https://www.uwarp.design/ttf-to-woff2) |

## Development

Requirements: **Node.js 18+**, npm (workspaces).

```bash
npm install
npm run build
npm test
```

## Publishing (not automated in CI)

From the repo root, after bumping versions as needed:

```bash
npm publish -w uwarp-contrast --access public
npm publish -w uwarp-palette --access public
npm publish -w uwarp-ttf-to-woff2 --access public
```

Or from each package directory:

```bash
cd packages/contrast && npm publish --access public
```

You need npm login and permission to publish the `@`-free package names on npm.

## License

MIT · Sherotree
