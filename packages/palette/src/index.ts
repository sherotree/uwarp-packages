import {
  hslToRgb,
  parseSeedHex,
  rgbToHex,
  rgbToHsl,
  rotateHue,
  type Hsl,
  type Rgb,
} from "./color.js";

export type { Rgb, Hsl };
export { parseSeedHex, rgbToHex, rgbToHsl, hslToRgb };

/** Tailwind-style scale keys from light tint to dark shade. */
export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type ScaleStep = (typeof SCALE_STEPS)[number];

export type PaletteScale = Record<ScaleStep, string>;

export type HarmonySet = {
  /** Seed color as hex. */
  base: string;
  complementary: string;
  analogous: [string, string];
};

export type GeneratedPalette = {
  seed: string;
  seedRgb: Rgb;
  /** Primary scale anchored so step 500 matches the seed hue/saturation. */
  scale: PaletteScale;
  harmonies: HarmonySet;
};

export type GeneratePaletteOptions = {
  /**
   * Lightness targets for each scale step (percent 0–100).
   * Defaults mirror a practical Tailwind-like ramp.
   */
  lightnessMap?: Partial<Record<ScaleStep, number>>;
};

const DEFAULT_LIGHTNESS: Record<ScaleStep, number> = {
  50: 97,
  100: 94,
  200: 86,
  300: 74,
  400: 62,
  500: 50,
  600: 42,
  700: 34,
  800: 26,
  900: 18,
};

function buildScale(baseHsl: Hsl, lightnessMap: Record<ScaleStep, number>): PaletteScale {
  const scale = {} as PaletteScale;
  for (const step of SCALE_STEPS) {
    const l = lightnessMap[step];
    const s =
      step <= 300
        ? Math.min(100, baseHsl.s * 1.05)
        : step >= 700
          ? Math.min(100, baseHsl.s * 1.1)
          : baseHsl.s;
    scale[step] = rgbToHex(hslToRgb({ h: baseHsl.h, s, l }));
  }
  return scale;
}

function buildHarmonies(seedHex: string, baseHsl: Hsl): HarmonySet {
  const comp = rgbToHex(hslToRgb(rotateHue(baseHsl, 180)));
  const anaLeft = rgbToHex(hslToRgb(rotateHue(baseHsl, -30)));
  const anaRight = rgbToHex(hslToRgb(rotateHue(baseHsl, 30)));
  return {
    base: seedHex,
    complementary: comp,
    analogous: [anaLeft, anaRight],
  };
}

/**
 * From a seed hex, produce a Tailwind-friendly 50–900 scale plus complementary
 * and analogous harmony colors (fixed ±30° on the hue wheel).
 */
export function generatePalette(
  seedHex: string,
  options: GeneratePaletteOptions = {},
): GeneratedPalette {
  const rgb = parseSeedHex(seedHex);
  const normalizedSeed = rgbToHex(rgb);
  const baseHsl = rgbToHsl(rgb);

  const lightnessMap = { ...DEFAULT_LIGHTNESS, ...options.lightnessMap } as Record<
    ScaleStep,
    number
  >;

  // Anchor step 500 to the seed's actual lightness while keeping hue/saturation.
  lightnessMap[500] = baseHsl.l;

  const scale = buildScale(baseHsl, lightnessMap);
  scale[500] = normalizedSeed;

  return {
    seed: normalizedSeed,
    seedRgb: rgb,
    scale,
    harmonies: buildHarmonies(normalizedSeed, baseHsl),
  };
}

/** Return only the scale as a plain object (hex values). */
export function generateScale(
  seedHex: string,
  options?: GeneratePaletteOptions,
): PaletteScale {
  return generatePalette(seedHex, options).scale;
}
