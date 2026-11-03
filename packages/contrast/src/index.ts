import {
  contrastRatio,
  normalizeColor,
  parseHex,
  relativeLuminance,
  type Rgb,
} from "./color.js";

export type { Rgb };
export { parseHex, relativeLuminance, contrastRatio, normalizeColor };

export type WcagLevel = "AA" | "AAA";

export type WcagTextSize = "normal" | "large";

export type WcagRequirement = {
  level: WcagLevel;
  textSize: WcagTextSize;
  minRatio: number;
};

/** WCAG 2.x minimum contrast ratios for text. */
export const WCAG_THRESHOLDS: readonly WcagRequirement[] = [
  { level: "AA", textSize: "normal", minRatio: 4.5 },
  { level: "AA", textSize: "large", minRatio: 3 },
  { level: "AAA", textSize: "normal", minRatio: 7 },
  { level: "AAA", textSize: "large", minRatio: 4.5 },
] as const;

export type WcagPassResult = {
  level: WcagLevel;
  textSize: WcagTextSize;
  minRatio: number;
  pass: boolean;
};

export type ContrastResult = {
  foreground: Rgb;
  background: Rgb;
  ratio: number;
  /** Rounded to two decimals for display. */
  ratioFormatted: string;
  wcag: WcagPassResult[];
};

function roundRatio(ratio: number): number {
  return Math.round(ratio * 100) / 100;
}

/**
 * Compute contrast ratio and WCAG AA/AAA pass/fail for normal and large text.
 */
export function evaluateContrast(
  foreground: string | Rgb,
  background: string | Rgb,
): ContrastResult {
  const fg = normalizeColor(foreground);
  const bg = normalizeColor(background);
  const ratio = contrastRatio(fg, bg);
  const rounded = roundRatio(ratio);

  const wcag: WcagPassResult[] = WCAG_THRESHOLDS.map((req) => ({
    level: req.level,
    textSize: req.textSize,
    minRatio: req.minRatio,
    pass: ratio >= req.minRatio,
  }));

  return {
    foreground: fg,
    background: bg,
    ratio: rounded,
    ratioFormatted: rounded.toFixed(2),
    wcag,
  };
}

/** Shorthand: get numeric contrast ratio only. */
export function getContrastRatio(
  foreground: string | Rgb,
  background: string | Rgb,
): number {
  return roundRatio(
    contrastRatio(normalizeColor(foreground), normalizeColor(background)),
  );
}

/** Check a single WCAG requirement. */
export function meetsWcag(
  foreground: string | Rgb,
  background: string | Rgb,
  level: WcagLevel,
  textSize: WcagTextSize,
): boolean {
  const ratio = contrastRatio(normalizeColor(foreground), normalizeColor(background));
  const req = WCAG_THRESHOLDS.find(
    (t) => t.level === level && t.textSize === textSize,
  );
  if (!req) return false;
  return ratio >= req.minRatio;
}
