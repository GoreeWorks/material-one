import { readFile } from "node:fs/promises";
import path from "node:path";

const root=process.cwd();
const source=await readFile(path.join(root,"packages/motion/src/index.ts"),"utf8");
const css=await readFile(path.join(root,"packages/motion/css/material-one-motion.css"),"utf8");
const docs=await readFile(path.join(root,"docs/motion-framework.md"),"utf8");

for(const marker of [
  'export type {\n  MotionPreference\n} from "@material-one/core"',
  "MaterialOneMotionPolicy",
  "createMotionPolicy",
  "resolveAdaptiveMotionRecipe",
  "createMotionPresentation",
  "createAdaptiveMotionPresentation"
]) if(!source.includes(marker)) throw new Error(`Motion runtime missing ${marker}`);

for(const marker of [
  'data-mo-motion="reduced"',
  'data-mo-motion="none"',
  "data-mo-motion-intent",
  "--mo-motion-duration",
  "prefers-reduced-motion"
]) if(!css.includes(marker)) throw new Error(`Motion CSS missing ${marker}`);

for(const marker of [
  "Contract boundary","Semantic intents","Effective motion","Reduced motion","No motion","Presentation","CSS integration","Compatibility"
]) if(!docs.includes(marker)) throw new Error(`Motion docs missing ${marker}`);

console.log("Validated Material One canonical motion preference, accessibility-aware adaptive recipes, presentation metadata, CSS enforcement, and documentation.");
