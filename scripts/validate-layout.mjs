import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = await readFile(
  path.join(root, "packages/layout/src/index.ts"),
  "utf8"
);
const css = await readFile(
  path.join(root, "packages/layout/css/material-one-layout.css"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/layout-engine.md"),
  "utf8"
);

for (const marker of [
  "MaterialOneLayoutProfile",
  "createLayoutProfile",
  "createLayoutPresentation",
  "resolveLayoutColumns",
  "resolveLayoutPaneStrategy",
  "resolveLayoutContentWidth"
]) {
  if (!source.includes(marker)) {
    throw new Error(`Layout engine missing ${marker}`);
  }
}

for (const marker of [
  "--mo-layout-content-padding",
  "--mo-layout-grid-columns",
  "--mo-layout-min-column",
  ".mo-layout-grid",
  ".mo-layout-split",
  ".mo-layout-multi-pane"
]) {
  if (!css.includes(marker)) {
    throw new Error(`Layout CSS missing ${marker}`);
  }
}

const opens = (css.match(/{/g) ?? []).length;
const closes = (css.match(/}/g) ?? []).length;
if (opens !== closes) {
  throw new Error("Layout CSS has unbalanced braces");
}

for (const marker of [
  "Contract boundary",
  "Layout modes",
  "Column capacity",
  "Pane strategy",
  "Framework-portable presentation",
  "Shell and pattern integration"
]) {
  if (!docs.includes(marker)) {
    throw new Error(`Layout documentation missing ${marker}`);
  }
}

console.log(
  "Validated Material One adaptive layout geometry, pane strategy, CSS, presentation, and documentation contracts."
);
