import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const source = await readFile(
  path.join(root, "packages/loading/src/index.ts"),
  "utf8"
);
const css = await readFile(
  path.join(root, "packages/loading/css/material-one-loading.css"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/loading-framework.md"),
  "utf8"
);

for (const marker of [
  "MaterialOneLoadingPolicy",
  "MaterialOneLoadingProfile",
  "createLoadingPolicy",
  "createAdaptiveSkeletonRecipe",
  "createLoadingProfile",
  "createSkeletonPresentation",
  "createLoadingPresentation"
]) {
  if (!source.includes(marker)) {
    throw new Error(
      `Loading runtime missing ${marker}`
    );
  }
}

for (const marker of [
  'data-mo-loading-motion="reduced"',
  'data-mo-loading-motion="none"',
  'data-mo-loading-presentation="none"',
  'data-mo-loading-presentation="progress"',
  'aria-busy="false"',
  "--mo-loading-delay",
  "--mo-loading-minimum-visible"
]) {
  if (!css.includes(marker)) {
    throw new Error(
      `Loading CSS missing ${marker}`
    );
  }
}

const opens = (css.match(/{/g) ?? []).length;
const closes = (css.match(/}/g) ?? []).length;
if (opens !== closes) {
  throw new Error(
    "Loading CSS has unbalanced braces"
  );
}

for (const marker of [
  "Contract boundary",
  "Loading intent",
  "Presentation policy",
  "Effective motion",
  "Density",
  "Adaptive profile",
  "Skeleton presentation",
  "Loading-region presentation",
  "CSS integration",
  "Compatibility"
]) {
  if (!docs.includes(marker)) {
    throw new Error(
      `Loading documentation missing ${marker}`
    );
  }
}

console.log(
  "Validated Material One adaptive loading policy, effective motion, density, presentation metadata, CSS hooks, compatibility, and documentation."
);
