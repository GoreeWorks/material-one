import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = await readFile(
  path.join(root, "packages/shape/src/index.ts"),
  "utf8"
);
const css = await readFile(
  path.join(root, "packages/shape/css/material-one-shape.css"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/shape-framework.md"),
  "utf8"
);

for (const marker of [
  "shapeTokens",
  "shapeRoles",
  "ShapeRole",
  "ShapeToken",
  "createShapePolicy",
  "resolveShapeToken",
  "createShapePresentation",
  "shapeCssVariable",
  "shapeRoleCssVariable"
]) {
  if (!source.includes(marker)) {
    throw new Error(`Shape runtime missing ${marker}`);
  }
}

for (const marker of [
  "--mo-shape-control",
  "--mo-shape-card",
  "--mo-shape-floating",
  'data-mo-shape-style="minimal"',
  'data-mo-shape-style="expressive"'
]) {
  if (!css.includes(marker)) {
    throw new Error(`Shape CSS missing ${marker}`);
  }
}

const opens = (css.match(/{/g) ?? []).length;
const closes = (css.match(/}/g) ?? []).length;
if (opens !== closes) {
  throw new Error("Shape CSS has unbalanced braces");
}

for (const marker of [
  "Contract boundary",
  "Semantic shape roles",
  "Experience style",
  "Layout adaptation",
  "Framework-portable presentation",
  "Component integration"
]) {
  if (!docs.includes(marker)) {
    throw new Error(`Shape documentation missing ${marker}`);
  }
}

console.log(
  "Validated Material One semantic shape policy, CSS aliases, presentation, and documentation contracts."
);
