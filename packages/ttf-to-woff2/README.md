# uwarp-ttf-to-woff2

Convert **TTF/OTF** font bytes to **WOFF2** using Google's [woff2](https://github.com/google/woff2) compiled to **WebAssembly** (via [`wawoff2`](https://github.com/fontello/wawoff2)).

**Live tool:** [Uwarp TTF → WOFF2](https://www.uwarp.design/ttf-to-woff2)

## Install

```bash
npm install uwarp-ttf-to-woff2
```

## API

```ts
import {
  convertTtfToWoff2,
  initWoff2,
  detectEnvironment,
} from "uwarp-ttf-to-woff2";

await initWoff2(); // optional; conversion initializes WASM on first use

const ttf = await fetch("/MyFont.ttf").then((r) => r.arrayBuffer());
const woff2 = await convertTtfToWoff2(ttf);
// use woff2 in @font-face or write to disk in Node
```

### Node vs browser

| Environment | Support |
|-------------|---------|
| **Node 18+** | Works out of the box (WASM, no native addon rebuild). |
| **Browser / bundlers** | Supported when your bundler can load `wawoff2`'s WASM glue (Vite, webpack, etc.). Mark `wawoff2` as not external if you bundle for the client. |
| **Native CLI speed** | Use [fonttools](https://fonttools.readthedocs.io/) / the official `woff2` binary if you need maximum throughput on the server. This package optimizes for **portability and in-app conversion**, matching the Uwarp web tool—not for batch CLI pipelines. |

## Integration notes

1. Call `initWoff2()` early in your app if you want to hide WASM startup latency before the user picks a file.
2. Input must be a valid **TTF or OTF** buffer; output is **WOFF2** bytes (`Uint8Array`).
3. For SSR, run conversion only on the server or in a worker where WASM is allowed.

## License

MIT · [Sherotree](https://github.com/sherotree)
