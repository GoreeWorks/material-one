import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = await readFile(
  path.join(root, "packages/controls/src/index.ts"),
  "utf8"
);
const css = await readFile(
  path.join(root, "packages/controls/css/material-one-controls.css"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/controls-interactions-system.md"),
  "utf8"
);

for (const marker of [
  "ComponentState",
  "createComponentPresentation",
  "ControlKind",
  "AnyControlRecipe",
  "createControlPresentation",
  "createAdaptiveControlPresentation",
  "MaterialOneAccessibilityPolicy",
  "createAdaptiveComponentPresentation",
  "createToggleRecipe",
  "createSliderRecipe",
  "createSegmentedRecipe",
  "createTabsRecipe",
  "createChipRecipe",
  "createDataTableRecipe",
  "createPaginationRecipe",
  "createProgressRecipe",
  "disclosurePresentation"
]) {
  if (!source.includes(marker)) {
    throw new Error(
      `Controls runtime missing ${marker}`
    );
  }
}

if (!source.includes("export type ControlState = ComponentState;")) {
  throw new Error(
    "Controls must alias the canonical component state contract."
  );
}

for (const marker of [
  "[data-mo-control]",
  'data-mo-state="disabled"',
  'data-mo-presentation="scrollable"',
  "--mo-control-target-size",
  "--mo-control-row-height"
]) {
  if (!css.includes(marker)) {
    throw new Error(
      `Controls CSS missing ${marker}`
    );
  }
}

for (const marker of [
  "Contract boundary",
  "Canonical state",
  "Adaptive recipes",
  "Presentation bridge",
  "Semantic defaults",
  "CSS integration",
  "Disclosure behavior"
]) {
  if (!docs.includes(marker)) {
    throw new Error(
      `Controls documentation missing ${marker}`
    );
  }
}

console.log(
  "Validated Material One canonical control state, adaptive recipes, presentation metadata, CSS hooks, and documentation."
);
