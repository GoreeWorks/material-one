import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const tokens = JSON.parse(
  await readFile(path.join(root, "tokens/material-one.tokens.json"), "utf8")
);

const typography = tokens.typography;
const motion = tokens.motion;

if (!typography) throw new Error("Missing typography token contract.");
if (!motion) throw new Error("Missing motion token contract.");

const requiredTypeRoles = [
  "display",
  "largeTitle",
  "sectionHeading",
  "title",
  "body",
  "label",
  "supporting"
];

for (const role of requiredTypeRoles) {
  if (!(role in typography)) {
    throw new Error(`Typography is missing semantic role: ${role}`);
  }
}

if (typography.lineHeight.body < 1.4) {
  throw new Error("Body line height must preserve readable text spacing.");
}

if (typography.textScale.minimum !== 0.8) {
  throw new Error("Typography minimum text scale must align with Accessibility at 80%.");
}

if (typography.textScale.maximum < 2) {
  throw new Error("Typography must support at least 200% text scaling.");
}

if (typography.maxLineLength.body !== "72ch") {
  throw new Error("Body text must retain the Material One readable line-length contract.");
}

const requiredMotionIntents = [
  "instant",
  "feedback",
  "enter",
  "exit",
  "navigation",
  "transform",
  "emphasis",
  "loading"
];

for (const intent of requiredMotionIntents) {
  if (!motion.intents.includes(intent)) {
    throw new Error(`Motion is missing semantic intent: ${intent}`);
  }
}

if (motion.reducedMotion.decorativeDuration !== "0ms") {
  throw new Error("Reduced motion must remove decorative motion.");
}

if (motion.reducedMotion.removesSpatialTranslation !== true) {
  throw new Error("Reduced motion must remove spatial translation.");
}

if (motion.reducedMotion.preservesStateCommunication !== true) {
  throw new Error("Reduced motion must preserve state communication.");
}

const typographyCss = await readFile(
  path.join(root, "packages/typography/css/material-one-typography.css"),
  "utf8"
);
const motionCss = await readFile(
  path.join(root, "packages/motion/css/material-one-motion.css"),
  "utf8"
);

for (const marker of [
  "mo-type-display",
  "mo-type-body",
  "mo-type-supporting",
  "data-mo-text-scale",
  "prefers-contrast"
]) {
  if (!typographyCss.includes(marker)) {
    throw new Error(`Typography CSS is missing ${marker}`);
  }
}

for (const marker of [
  "data-mo-motion-intent",
  "mo-motion-enter",
  "mo-motion-feedback",
  "prefers-reduced-motion",
  'data-mo-motion="none"',
  "view-transition"
]) {
  if (!motionCss.includes(marker)) {
    throw new Error(`Motion CSS is missing ${marker}`);
  }
}

const report = {
  tokenVersion: tokens.version,
  typography: {
    roles: requiredTypeRoles,
    maximumTextScale: typography.textScale.maximum,
    bodyLineHeight: typography.lineHeight.body,
    bodyLineLength: typography.maxLineLength.body,
    layoutScale: typography.adaptive
  },
  motion: {
    intents: requiredMotionIntents,
    reducedMotion: motion.reducedMotion,
    none: motion.none
  }
};

await mkdir(path.join(root, "build"), { recursive: true });
await writeFile(
  path.join(root, "build/typography-motion-report.json"),
  JSON.stringify(report, null, 2) + "\n"
);

console.log(
  "Validated Material One adaptive typography, readable text contracts, semantic motion, and reduced-motion behavior."
);
