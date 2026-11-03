import { describe, expect, it } from "vitest";
import { generatePalette, generateScale, parseSeedHex, rgbToHex } from "./index.js";

describe("parseSeedHex", () => {
  it("normalizes shorthand hex", () => {
    expect(rgbToHex(parseSeedHex("#f00"))).toBe("#ff0000");
  });
});

describe("generatePalette", () => {
  it("anchors 500 to the seed", () => {
    const seed = "#3b82f6";
    const palette = generatePalette(seed);
    expect(palette.seed).toBe("#3b82f6");
    expect(palette.scale[500]).toBe("#3b82f6");
  });

  it("produces 10 scale steps", () => {
    const scale = generateScale("#10b981");
    expect(Object.keys(scale)).toHaveLength(10);
    expect(scale[50]).toMatch(/^#[0-9a-f]{6}$/);
    expect(scale[900]).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("includes complementary and analogous hues", () => {
    const { harmonies } = generatePalette("#ff0000");
    expect(harmonies.base).toBe("#ff0000");
    expect(harmonies.complementary).toMatch(/^#[0-9a-f]{6}$/);
    expect(harmonies.analogous).toHaveLength(2);
  });

  it("lighter steps have higher hex luminance trend", () => {
    const scale = generateScale("#6366f1");
    const parseL = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    };
    expect(parseL(scale[50])).toBeGreaterThan(parseL(scale[900]));
  });
});
