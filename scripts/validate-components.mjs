import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const componentSource = await readFile(
  path.join(root, "packages/components/src/index.ts"),
  "utf8"
);
const runtimeSource = await readFile(
  path.join(root, "packages/core/src/runtime.ts"),
  "utf8"
);

for (const marker of [
  "createAdaptiveComponentContext",
  "createComponentContract",
  "createComponentPresentation",
  "createButtonRecipe",
  "createSurfaceRecipe",
  "createCardRecipe",
  "createFieldRecipe",
  "createNavigationRecipe"
]) {
  if (!componentSource.includes(marker)) {
    throw new Error(`Component foundation missing ${marker}`);
  }
}

for (const marker of [
  "materialOneComponentStates",
  "normalizeComponentState",
  "createComponentRuntime"
]) {
  if (!runtimeSource.includes(marker)) {
    throw new Error(`Component runtime missing ${marker}`);
  }
}

for (const state of [
  "default",
  "hovered",
  "focused",
  "pressed",
  "selected",
  "disabled",
  "loading",
  "success",
  "warning",
  "error"
]) {
  if (!runtimeSource.includes(`"${state}"`)) {
    throw new Error(`Missing canonical component state ${state}`);
  }
}

for (const alias of ["idle", "hover", "focus", "active"]) {
  if (!runtimeSource.includes(`case "${alias}"`)) {
    throw new Error(`Missing legacy state alias ${alias}`);
  }
}

for (const typedContract of [
  "SemanticColorRole",
  "TypographyRole",
  "MotionIntent",
  "ShapeRole",
  "ShapeToken",
  "semanticCssVariable",
  "typographyCssVariable",
  "motionCssVariables",
  "resolveShapeToken",
  "shapeCssVariable"
]) {
  if (!componentSource.includes(typedContract)) {
    throw new Error(`Typed component presentation missing ${typedContract}`);
  }
}

console.log("Validated Material One adaptive, typed presentation, and runtime contracts.");
