import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const tokens = JSON.parse(
  await readFile(path.join(root, "tokens/material-one.tokens.json"), "utf8")
);

const theme = tokens.themeIntelligence;
if (!theme) throw new Error("Missing themeIntelligence token contract.");
if (theme.minimumTextContrast < 4.5) {
  throw new Error("Theme intelligence must require at least 4.5:1 text contrast.");
}
if (theme.preserveSemanticStatusMeaning !== true) {
  throw new Error("Theme intelligence must preserve semantic status meaning.");
}

for (const role of ["success", "warning", "error", "information", "disabled"]) {
  if (!theme.userAccentMustNotRedefine.includes(role)) {
    throw new Error(`User accents must not redefine semantic role: ${role}`);
  }
}

const visualization = tokens.visualization;
if (!visualization) throw new Error("Missing visualization token contract.");

if (visualization.categoricalPaletteSource !== "color.coding") {
  throw new Error("Categorical visualization must use Material One color coding.");
}
if (visualization.semanticStatusSource !== "color.semantic") {
  throw new Error("Visualization status must use Material One semantic colors.");
}
if (visualization.nonColorCueRequired !== true) {
  throw new Error("Visualizations must require non-color cues.");
}

const expectedPatterns = ["solid", "stripe", "dot", "crosshatch"];
for (const pattern of expectedPatterns) {
  if (!visualization.patterns.includes(pattern)) {
    throw new Error(`Missing visualization pattern: ${pattern}`);
  }
}

const css = await readFile(
  path.join(
    root,
    "packages/data-visualization/css/material-one-data-visualization.css"
  ),
  "utf8"
);

for (const marker of [
  "mo-viz-bar-fill",
  "data-mo-viz-pattern",
  "mo-viz-heatmap",
  "mo-viz-tooltip",
  "prefers-reduced-motion",
  "forced-colors: active",
  "--mo-sem-success",
  "--mo-sem-error"
]) {
  if (!css.includes(marker)) {
    throw new Error(`Visualization CSS is missing ${marker}`);
  }
}

const themeSource = await readFile(
  path.join(root, "packages/theme-intelligence/src/index.ts"),
  "utf8"
);

for (const marker of [
  "createAdaptiveSemanticScheme",
  "createValidatedSemanticScheme",
  "ensureContrast",
  "validateSemanticTheme"
]) {
  if (!themeSource.includes(marker)) {
    throw new Error(`Theme intelligence source is missing ${marker}`);
  }
}

const report = {
  tokenVersion: tokens.version,
  themeIntelligence: {
    minimumTextContrast: theme.minimumTextContrast,
    schemes: theme.schemes,
    contrastModes: theme.contrastModes,
    preservesSemanticStatusMeaning: theme.preserveSemanticStatusMeaning
  },
  visualization: {
    categoricalPaletteSource: visualization.categoricalPaletteSource,
    semanticStatusSource: visualization.semanticStatusSource,
    nonColorCueRequired: visualization.nonColorCueRequired,
    patterns: visualization.patterns,
    forcedColors: visualization.forcedColorsUsesSystemColors,
    reducedMotion: visualization.reducedMotionDisablesTransitions
  }
};

await mkdir(path.join(root, "build"), { recursive: true });
await writeFile(
  path.join(root, "build/theme-visualization-report.json"),
  JSON.stringify(report, null, 2) + "\n"
);

console.log(
  "Validated Material One theme intelligence, semantic visualization rules, accessibility fallbacks, and non-color encodings."
);
