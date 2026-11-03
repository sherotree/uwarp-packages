import { describe, expect, it } from "vitest";
import {
  evaluateContrast,
  getContrastRatio,
  meetsWcag,
  parseHex,
  relativeLuminance,
} from "./index.js";

describe("parseHex", () => {
  it("parses 6-digit hex with and without hash", () => {
    expect(parseHex("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex("000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("expands 3-digit shorthand", () => {
    expect(parseHex("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex("000")).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe("relativeLuminance", () => {
  it("matches known sRGB values", () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
  });
});

describe("contrast", () => {
  it("black on white is 21:1", () => {
    expect(getContrastRatio("#000", "#fff")).toBe(21);
  });

  it("evaluateContrast includes WCAG rows", () => {
    const result = evaluateContrast("#767676", "#ffffff");
    expect(result.ratio).toBeGreaterThan(4);
    expect(result.ratio).toBeLessThan(5);
    const aaNormal = result.wcag.find(
      (w) => w.level === "AA" && w.textSize === "normal",
    );
    expect(aaNormal?.pass).toBe(true);
  });

  it("meetsWcag for AA large text", () => {
    expect(meetsWcag("#000", "#fff", "AA", "large")).toBe(true);
    expect(meetsWcag("#777", "#888", "AA", "normal")).toBe(false);
  });

  it("accepts RGB objects", () => {
    expect(getContrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBe(
      21,
    );
  });
});
