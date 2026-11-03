export type Rgb = { r: number; g: number; b: number };

const HEX_SHORT = /^#?([0-9a-fA-F]{3})$/;
const HEX_LONG = /^#?([0-9a-fA-F]{6})$/;

function expandShortHex(hex: string): string {
  const m = HEX_SHORT.exec(hex.trim());
  if (!m) return hex;
  const [a, b, c] = m[1].split("");
  return `#${a}${a}${b}${b}${c}${c}`;
}

/** Parse hex (#RGB, #RRGGBB, with or without `#`) into 0–255 RGB. */
export function parseHex(hex: string): Rgb {
  const normalized = expandShortHex(hex.trim());
  const m = HEX_LONG.exec(normalized);
  if (!m) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const n = parseInt(m[1], 16);
  return {
    r: (n >> 16) & 0xff,
    g: (n >> 8) & 0xff,
    b: n & 0xff,
  };
}

export function normalizeColor(input: string | Rgb): Rgb {
  if (typeof input === "string") {
    return parseHex(input);
  }
  const { r, g, b } = input;
  for (const [name, v] of [
    ["r", r],
    ["g", g],
    ["b", b],
  ] as const) {
    if (!Number.isFinite(v) || v < 0 || v > 255) {
      throw new Error(`Invalid RGB ${name}: ${v}`);
    }
  }
  return { r, g, b };
}

/** WCAG relative luminance for sRGB (0–1). */
export function relativeLuminance(rgb: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** Contrast ratio (1–21) per WCAG 2.x. */
export function contrastRatio(foreground: Rgb, background: Rgb): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
