import {
  mkdir,
  readFile,
  writeFile
} from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = JSON.parse(
  await readFile(
    path.join(
      root,
      "tokens/material-one.tokens.json"
    ),
    "utf8"
  )
);
const css = await readFile(
  path.join(root, "tokens/css/material-one.css"),
  "utf8"
);
const runtime = await readFile(
  path.join(
    root,
    "packages/tokens/src/index.ts"
  ),
  "utf8"
);
const wrapperCss = await readFile(
  path.join(
    root,
    "packages/tokens/css/material-one-tokens.css"
  ),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/design-token-system.md"),
  "utf8"
);

const groups = [
  "color",
  "typography",
  "spacing",
  "shape",
  "motion",
  "interaction",
  "loading",
  "elevation",
  "themeIntelligence",
  "visualization"
];

if (source.name !== "Material One Tokens") {
  throw new Error(
    "Canonical token source has an unexpected name."
  );
}

if (!/^\d+\.\d+\.\d+$/.test(source.version)) {
  throw new Error(
    "Canonical token source version must use x.y.z."
  );
}

for (const group of groups) {
  if (!(group in source)) {
    throw new Error(
      `Canonical token source missing ${group}`
    );
  }
}

function leafCount(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return 1;
  }

  return Object.values(value)
    .map(leafCount)
    .reduce((sum, count) => sum + count, 0);
}

const counts = Object.fromEntries(
  groups.map((group) => [
    group,
    leafCount(source[group])
  ])
);
const totalTokens = Object.values(counts)
  .reduce((sum, count) => sum + count, 0);

if (totalTokens < 150) {
  throw new Error(
    `Expected at least 150 canonical tokens, found ${totalTokens}.`
  );
}

for (const marker of [
  "--mo-space-md",
  "--mo-shape-extra-large",
  "--mo-target-touch",
  "--mo-motion-standard",
  "--mo-elevation-3",
  "--mo-sem-primary",
  "--mo-code-rose"
]) {
  if (!css.includes(marker)) {
    throw new Error(
      `Canonical token CSS missing ${marker}`
    );
  }
}

if (
  !wrapperCss.includes(
    '@import "../../../tokens/css/material-one.css";'
  )
) {
  throw new Error(
    "Token package stylesheet must reference the canonical token CSS source."
  );
}

for (const marker of [
  "materialOneTokenGroups",
  "MaterialOneTokenPath",
  "flattenMaterialOneTokens",
  "validateMaterialOneTokens",
  "readMaterialOneToken",
  "findMaterialOneTokens",
  "tokenCssVariable"
]) {
  if (!runtime.includes(marker)) {
    throw new Error(
      `Token runtime missing ${marker}`
    );
  }
}

for (const marker of [
  "Source-of-truth boundary",
  "Required groups",
  "Canonical paths",
  "Token inventory",
  "CSS traceability",
  "Package stylesheet"
]) {
  if (!docs.includes(marker)) {
    throw new Error(
      `Token documentation missing ${marker}`
    );
  }
}

const report = {
  name: source.name,
  version: source.version,
  totalTokens,
  groups: counts,
  stylesheet:
    "packages/tokens/css/material-one-tokens.css"
};

await mkdir(
  path.join(root, "build"),
  { recursive: true }
);
await writeFile(
  path.join(
    root,
    "build/design-token-report.json"
  ),
  JSON.stringify(report, null, 2) + "\n"
);

console.log(
  `Validated ${totalTokens} Material One design tokens across ${groups.length} required groups.`
);
