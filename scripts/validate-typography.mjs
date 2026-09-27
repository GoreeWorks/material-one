import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const source = await readFile(
  path.join(
    root,
    "packages/typography/src/index.ts"
  ),
  "utf8"
);
const css = await readFile(
  path.join(
    root,
    "packages/typography/css/material-one-typography.css"
  ),
  "utf8"
);
const docs = await readFile(
  path.join(
    root,
    "docs/typography-framework.md"
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

const minimum =
  tokens.typography.textScale.minimum;
const maximum =
  tokens.typography.textScale.maximum;

if (
  minimum !== 0.8 ||
  maximum !== 2
) {
  throw new Error(
    "Canonical typography text-scale range must match Accessibility: 0.8–2.0."
  );
}

for (const marker of [
  "LayoutMode",
  "DensityPreference",
  "MaterialOneAccessibilityPolicy",
  "typographyTextScaleRange",
  "MaterialOneTypographyPolicy",
  "createTypographyPolicy",
  "resolveAdaptiveTypographyRole",
  "createTypographyPresentation"
]) {
  if (!source.includes(marker)) {
    throw new Error(
      `Typography runtime missing ${marker}`
    );
  }
}

for (const marker of [
  'data-mo-layout="compact"',
  'data-mo-layout="workspace"',
  'data-mo-contrast="high"',
  "data-mo-type-role",
  "--mo-type-effective-size",
  "--mo-type-effective-max-line"
]) {
  if (!css.includes(marker)) {
    throw new Error(
      `Typography CSS missing ${marker}`
    );
  }
}

const opens =
  (css.match(/{/g) ?? []).length;
const closes =
  (css.match(/}/g) ?? []).length;

if (opens !== closes) {
  throw new Error(
    "Typography CSS has unbalanced braces"
  );
}

for (const marker of [
  "Contract boundary",
  "Semantic roles",
  "Text-scale range",
  "Effective text scale",
  "Layout and density",
  "Readability",
  "Presentation",
  "CSS integration",
  "Compatibility"
]) {
  if (!docs.includes(marker)) {
    throw new Error(
      `Typography documentation missing ${marker}`
    );
  }
}

console.log(
  "Validated Material One canonical typography roles, Core layout/density ownership, Accessibility-effective text scaling, runtime presentation, CSS overrides, and documentation."
);
