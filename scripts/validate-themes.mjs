import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const source = await readFile(
  path.join(root, "packages/themes/src/index.ts"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/theme-runtime.md"),
  "utf8"
);

for (const marker of [
  "LegacyMaterialOneTheme",
  "SemanticMaterialOneTheme",
  "resolveThemeSemanticScheme",
  "semanticSchemeToLegacyVariables",
  "createSemanticTheme",
  "createAdaptiveTheme",
  "validateMaterialOneTheme",
  "createThemePresentation",
  "createMaterialOneThemeRegistry",
  "getMaterialOneTheme",
  "serializeTheme"
]) {
  if (!source.includes(marker)) {
    throw new Error(
      `Theme runtime missing ${marker}`
    );
  }
}

for (const marker of [
  "--mo-color-primary",
  "--mo-surface-base",
  "--mo-text-primary",
  "--mo-status-error"
]) {
  if (!source.includes(marker)) {
    throw new Error(
      `Theme compatibility map missing ${marker}`
    );
  }
}

for (const marker of [
  "Source-of-truth boundary",
  "Semantic-first resolution",
  "Compatibility aliases",
  "Semantic theme creation",
  "Adaptive theme creation",
  "Validation",
  "Theme presentation",
  "Theme registry",
  "CSS serialization",
  "Migration"
]) {
  if (!docs.includes(marker)) {
    throw new Error(
      `Theme runtime documentation missing ${marker}`
    );
  }
}

console.log(
  "Validated Material One semantic-first theme resolution, adaptive generation, compatibility aliases, registries, presentation, serialization, and documentation."
);
