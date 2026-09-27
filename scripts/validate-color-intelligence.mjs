import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = await readFile(
  path.join(root, "packages/color-intelligence/src/index.ts"),
  "utf8"
);
const coding = await readFile(
  path.join(root, "packages/color-coding/src/index.ts"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/color-intelligence-system.md"),
  "utf8"
);

for (const marker of [
  "ColorIntelligenceRequest",
  "ColorIntelligenceResolution",
  "resolveColorIntelligence",
  "createColorIntelligencePresentation",
  "semanticColor",
  "semanticStatusPair",
  "createColorCodeAssignment",
  "priorityColorCode"
]) {
  if (!source.includes(marker)) {
    throw new Error(`Color intelligence runtime missing ${marker}`);
  }
}

for (const marker of [
  "GoreeWorksPriorityLevel",
  '"horizon"',
  '"current"',
  '"pulse"',
  '"beacon"',
  '"surge"',
  '"apex"'
]) {
  if (!coding.includes(marker)) {
    throw new Error(`Color coding priority contract missing ${marker}`);
  }
}

for (const marker of [
  "Contract boundary",
  "Semantic interface color",
  "Status color",
  "Categorical color",
  "GoreeWorks priority color",
  "Decision rule"
]) {
  if (!docs.includes(marker)) {
    throw new Error(`Color intelligence documentation missing ${marker}`);
  }
}

console.log(
  "Validated Material One color-purpose routing, semantic/categorical boundaries, and GoreeWorks priority color contracts."
);
