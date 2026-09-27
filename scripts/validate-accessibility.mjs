import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = await readFile(
  path.join(root, "packages/accessibility/src/index.ts"),
  "utf8"
);
const styles = await readFile(
  path.join(
    root,
    "packages/accessibility/css/material-one-accessibility.css"
  ),
  "utf8"
);

for (const marker of [
  "createAccessibilityPolicy",
  "createAccessibilityPresentation",
  "resolveAccessibilityMotion",
  "auditInteractionTarget",
  "createLiveRegionAttributes",
  "MaterialOneAccessibilityPolicy"
]) {
  if (!source.includes(marker)) {
    throw new Error(`Accessibility runtime missing ${marker}`);
  }
}

for (const marker of [
  "prefers-reduced-motion",
  "prefers-contrast",
  "forced-colors: active",
  ":focus-visible",
  "data-mo-transparency"
]) {
  if (!styles.includes(marker)) {
    throw new Error(`Accessibility CSS missing ${marker}`);
  }
}

const opens = (styles.match(/{/g) ?? []).length;
const closes = (styles.match(/}/g) ?? []).length;
if (opens !== closes) {
  throw new Error("Accessibility CSS has unbalanced braces");
}

console.log(
  "Validated Material One accessibility policy, presentation, and CSS contracts."
);
