# uwarp-palette

Generate a practical color palette from a seed hex: a **Tailwind-friendly 50–900 scale** (step `500` is your seed) plus **complementary** and **analogous** (±30° hue) harmony colors.

**Live tools:** [Uwarp Color Tools](https://www.uwarp.design/tools/color) — also see palette generators on [Uwarp](https://www.uwarp.design).

## Install

```bash
npm install uwarp-palette
```

## API

```ts
import { generatePalette, generateScale, SCALE_STEPS } from "uwarp-palette";

const palette = generatePalette("#3b82f6");
// palette.seed, palette.scale[50..900], palette.harmonies.complementary, .analogous

const scaleOnly = generateScale("#10b981");
// Record<50|100|...|900, `#rrggbb`>

// Optional: override lightness per step (percent)
generatePalette("#000", { lightnessMap: { 900: 12 } });
```

## License

MIT · [Sherotree](https://github.com/sherotree)
