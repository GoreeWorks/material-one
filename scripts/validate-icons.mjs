import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const source = await readFile(
  path.join(root, "packages/icons/src/index.ts"),
  "utf8"
);
const css = await readFile(
  path.join(root, "packages/icons/css/material-one-icons.css"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/iconography-system.md"),
  "utf8"
);

for (const marker of [
  "MaterialOneIconPurpose",
  "MaterialOneIconSize",
  "MaterialOneIconPresentation",
  "resolveIconSize",
  "resolveIconStrokeWidth",
  "createMaterialOneIconRegistry",
  "getMaterialOneIcon",
  "createIconPresentation"
]) {
  if (!source.includes(marker)) {
    throw new Error(
      `Iconography runtime missing ${marker}`
    );
  }
}

for (const marker of [
  "--mo-icon-size",
  "--mo-icon-stroke-width",
  'data-mo-icon-style="outline"',
  'data-mo-icon-style="filled"',
  'data-mo-icon-mirrored="true"',
  "forced-colors: active"
]) {
  if (!css.includes(marker)) {
    throw new Error(
      `Iconography CSS missing ${marker}`
    );
  }
}

const opens = (css.match(/{/g) ?? []).length;
const closes = (css.match(/}/g) ?? []).length;
if (opens !== closes) {
  throw new Error(
    "Iconography CSS has unbalanced braces"
  );
}

for (const marker of [
  "Geometry",
  "Weight",
  "Size",
  "Purpose",
  "State geometry",
  "Direction and RTL",
  "Registry",
  "Framework-portable presentation"
]) {
  if (!docs.includes(marker)) {
    throw new Error(
      `Iconography documentation missing ${marker}`
    );
  }
}

console.log(
  "Validated Material One icon geometry, purpose, registry, RTL, accessibility, presentation, CSS, and documentation contracts."
);
