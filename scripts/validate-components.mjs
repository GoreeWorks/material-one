import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = await readFile(
  path.join(root, "packages/components/src/index.ts"),
  "utf8"
);

for (const marker of [
  "ComponentState",
  "createComponentContract",
  "createButtonRecipe",
  "createSurfaceRecipe",
  "createCardRecipe",
  "createFieldRecipe",
  "createNavigationRecipe"
]) {
  if (!source.includes(marker)) {
    throw new Error(`Component foundation missing ${marker}`);
  }
}

for (const state of [
  "default",
  "focused",
  "pressed",
  "selected",
  "disabled",
  "loading",
  "success",
  "warning",
  "error"
]) {
  if (!source.includes(`"${state}"`)) {
    throw new Error(`Missing component state ${state}`);
  }
}

console.log("Validated Material One adaptive component foundations.");
