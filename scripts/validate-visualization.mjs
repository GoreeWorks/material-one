import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const source = await readFile(
  path.join(
    root,
    "packages/data-visualization/src/index.ts"
  ),
  "utf8"
);
const css = await readFile(
  path.join(
    root,
    "packages/data-visualization/css/material-one-data-visualization.css"
  ),
  "utf8"
);
const docs = await readFile(
  path.join(
    root,
    "docs/data-visualization-system.md"
  ),
  "utf8"
);
const tokens = JSON.parse(
  await readFile(
    path.join(
      root,
      "tokens/material-one.tokens.json"
    ),
    "utf8"
  )
);

if (
  tokens.visualization
    .categoricalPaletteSource !==
  "color.coding"
) {
  throw new Error(
    "Visualization categorical series must use Color Coding."
  );
}

if (
  tokens.visualization
    .semanticStatusSource !==
  "color.semantic"
) {
  throw new Error(
    "Visualization status must use Semantic Colors."
  );
}

if (
  tokens.visualization
    .nonColorCueRequired !== true
) {
  throw new Error(
    "Visualization must require redundant non-color cues."
  );
}

for (const marker of [
  "MaterialOneVisualizationPolicy",
  "createVisualizationPolicy",
  "createVisualizationPresentation",
  "createSeriesPresentation",
  "createStatusVisualizationPresentation",
  "MaterialOneAccessibilityPolicy",
  "resolveMotionRecipe"
]) {
  if (!source.includes(marker)) {
    throw new Error(
      `Visualization runtime missing ${marker}`
    );
  }
}

for (const marker of [
  'data-mo-viz-motion="reduced"',
  'data-mo-viz-motion="none"',
  'data-mo-viz-contrast="high"',
  'data-mo-viz-forced-colors="active"',
  "--mo-viz-transition-duration",
  "--mo-viz-transition-easing"
]) {
  if (!css.includes(marker)) {
    throw new Error(
      `Visualization CSS missing ${marker}`
    );
  }
}

const opens =
  (css.match(/{/g) ?? []).length;
const closes =
  (css.match(/}/g) ?? []).length;

if (opens !== closes) {
  throw new Error(
    "Visualization CSS has unbalanced braces"
  );
}

for (const marker of [
  "Contract boundary",
  "Color semantics",
  "Redundant encoding",
  "Effective motion",
  "Contrast and forced colors",
  "Visualization presentation",
  "Series presentation",
  "Status presentation",
  "Accessible summaries",
  "CSS integration",
  "Compatibility"
]) {
  if (!docs.includes(marker)) {
    throw new Error(
      `Visualization documentation missing ${marker}`
    );
  }
}

console.log(
  "Validated Material One adaptive visualization color semantics, redundant encoding, Accessibility-effective motion/contrast/forced-colors policy, runtime presentation, CSS hooks, and documentation."
);
