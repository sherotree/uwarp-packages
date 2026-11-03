export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

const HEX_LONG = /^#?([0-9a-fA-F]{6})$/;
const HEX_SHORT = /^#?([0-9a-fA-F]{3})$/;

function expandShort(hex: string): string {
  const m = HEX_SHORT.exec(hex.trim());
  if (!m) return hex.trim();
  const [a, b, c] = m[1].split("");
  return `#${a}${a}${b}${b}${c}${c}`;
}

export function parseSeedHex(hex: string): Rgb {
  const normalized = expandShort(hex);
  const m = HEX_LONG.exec(normalized.startsWith("#") ? normalized : `#${normalized}`);
  if (!m) throw new Error(`Invalid seed hex: ${hex}`);
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const clamp = (v: number) => Math.round(Math.min(255, Math.max(0, v)));
  const to2 = (v: number) => clamp(v).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;
  const max = Math.max(rs, gs, bs);
  const min = Math.min(rs, gs, bs);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rs:
        h = ((gs - bs) / d + (gs < bs ? 6 : 0)) / 6;
        break;
      case gs:
        h = ((bs - rs) / d + 2) / 6;
        break;
      default:
        h = ((rs - gs) / d + 4) / 6;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.min(100, Math.max(0, s)) / 100;
  const lig = Math.min(100, Math.max(0, l)) / 100;

  if (sat === 0) {
    const v = Math.round(lig * 255);
    return { r: v, g: v, b: v };
  }

  const q = lig < 0.5 ? lig * (1 + sat) : lig + sat - lig * sat;
  const p = 2 * lig - q;
  const hk = hue / 360;

  const hueToRgb = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  return {
    r: Math.round(hueToRgb(hk + 1 / 3) * 255),
    g: Math.round(hueToRgb(hk) * 255),
    b: Math.round(hueToRgb(hk - 1 / 3) * 255),
  };
}

export function rotateHue(hsl: Hsl, degrees: number): Hsl {
  return { ...hsl, h: hsl.h + degrees };
}
