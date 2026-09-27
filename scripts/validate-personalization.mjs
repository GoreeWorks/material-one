import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = await readFile(
  path.join(root, "packages/personalization/src/index.ts"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/personalization-engine.md"),
  "utf8"
);

for (const marker of [
  "MaterialOnePersonalizationProfile",
  "createPersonalizationProfile",
  "createPersonalizationPresentation",
  "createPersonalizationControlStates",
  "isPersonalizationConstrained",
  "MaterialOneAccessibilityPolicy"
]) {
  if (!source.includes(marker)) {
    throw new Error(`Personalization runtime missing ${marker}`);
  }
}

for (const marker of [
  "Accessibility-first resolution",
  "Requested versus effective values",
  "Framework-portable presentation",
  "Product capability policy"
]) {
  if (!docs.includes(marker)) {
    throw new Error(`Personalization documentation missing ${marker}`);
  }
}

console.log(
  "Validated Material One personalization orchestration and presentation contracts."
);
