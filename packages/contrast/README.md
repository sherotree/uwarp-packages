# uwarp-contrast

WCAG 2.x relative luminance contrast ratios and AA/AAA pass/fail for foreground/background color pairs.

**Live tool:** [Uwarp Colour Contrast Checker](https://www.uwarp.design/colour-contrast-checker)

## Install

```bash
npm install uwarp-contrast
```

## API

```ts
import {
  evaluateContrast,
  getContrastRatio,
  meetsWcag,
  parseHex,
} from "uwarp-contrast";

// Hex (#RGB / #RRGGBB, optional #) or { r, g, b } (0–255)
getContrastRatio("#000000", "#ffffff"); // 21

const report = evaluateContrast("767676", "#ffffff");
// report.ratio, report.ratioFormatted, report.wcag (AA/AAA × normal/large)

meetsWcag("#000", "#fff", "AA", "normal"); // true
```

## License

MIT · [Sherotree](https://github.com/sherotree)
