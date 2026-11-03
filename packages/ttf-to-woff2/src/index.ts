import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(fileURLToPath(import.meta.url));

type CompressFn = (buffer: Buffer | Uint8Array) => Promise<Uint8Array>;

let compressFn: CompressFn | null = null;
let initPromise: Promise<void> | null = null;

function loadCompress(): CompressFn {
  if (!compressFn) {
    const wawoff2 = require("wawoff2") as { compress: CompressFn };
    compressFn = wawoff2.compress.bind(wawoff2);
  }
  return compressFn;
}

function waitForWasmRuntime(): Promise<void> {
  const compress = loadCompress();
  return compress(new Uint8Array([0x00, 0x01, 0x00, 0x00])).then(
    () => undefined,
    () => undefined,
  );
}

/** Load the embedded WOFF2 WASM module (idempotent). */
export async function initWoff2(): Promise<void> {
  if (!initPromise) {
    initPromise = waitForWasmRuntime();
  }
  await initPromise;
}

export type ConvertOptions = {
  /** When true (default), call {@link initWoff2} before converting. */
  ensureInitialized?: boolean;
};

function toUint8Array(input: ArrayBuffer | Uint8Array): Uint8Array {
  if (input instanceof Uint8Array) return input;
  return new Uint8Array(input);
}

/**
 * Convert a TTF or OTF font buffer to WOFF2 using Google's woff2 (WebAssembly).
 *
 * Works in Node and in bundlers that can load `wawoff2`'s WASM bindings. This is
 * not a replacement for native `fonttools`/`woff2` CLIs on the server; it targets
 * the same in-browser workflow as [Uwarp's converter](https://www.uwarp.design/ttf-to-woff2).
 */
export async function convertTtfToWoff2(
  input: ArrayBuffer | Uint8Array,
  options: ConvertOptions = {},
): Promise<Uint8Array> {
  const { ensureInitialized = true } = options;
  const bytes = toUint8Array(input);
  if (bytes.byteLength === 0) {
    throw new Error("convertTtfToWoff2: input is empty");
  }

  const compress = loadCompress();
  if (ensureInitialized) {
    await initWoff2();
  }

  const result = await compress(bytes);
  return result instanceof Uint8Array ? result : new Uint8Array(result);
}

export type EnvironmentHint = "node" | "browser" | "unknown";

/** Best-effort runtime hint for logging or UI copy. */
export function detectEnvironment(): EnvironmentHint {
  const g = globalThis as typeof globalThis & {
    window?: { document?: unknown };
    process?: { versions?: { node?: string } };
  };
  if (typeof g.window !== "undefined" && typeof g.window.document !== "undefined") {
    return "browser";
  }
  if (typeof g.process !== "undefined" && g.process.versions?.node) {
    return "node";
  }
  return "unknown";
}
