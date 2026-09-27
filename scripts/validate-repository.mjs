import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

function fail(message) {
  throw new Error(message);
}

async function exists(relativePath) {
  await access(path.join(root, relativePath));
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) fail(`Invalid hex color: ${hex}`);
  return [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16) / 255);
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const high = Math.max(luminance(a), luminance(b));
  const low = Math.min(luminance(a), luminance(b));
  return (high + 0.05) / (low + 0.05);
}

const required = [
  "README.md",
  "tokens/material-one.tokens.json",
  "tokens/css/material-one.css",
  "packages/core/src/index.ts",
  "packages/components/src/index.ts",
  "packages/components/css/material-one-components.css",
  "packages/shell/src/index.ts",
  "packages/themes/src/index.ts",
  "packages/icons/src/index.ts",
  "packages/controls/src/index.ts",
  "packages/controls/css/material-one-controls.css",
  "packages/color-coding/src/index.ts",
  "packages/color-coding/css/material-one-color-coding.css",
  "packages/loading/src/index.ts",
  "packages/loading/css/material-one-loading.css",
  "packages/semantic-colors/src/index.ts",
  "packages/semantic-colors/css/material-one-semantic-colors.css",
  "packages/theme-intelligence/src/index.ts",
  "packages/data-visualization/src/index.ts",
  "packages/data-visualization/css/material-one-data-visualization.css",
  "packages/typography/src/index.ts",
  "packages/typography/css/material-one-typography.css",
  "packages/motion/src/index.ts",
  "packages/motion/css/material-one-motion.css",
  "packages/accessibility/src/index.ts",
  "packages/accessibility/css/material-one-accessibility.css",
  "packages/personalization/src/index.ts",
  "packages/device-adaptation/src/index.ts"
];

for (const item of required) await exists(item);

const tokens = JSON.parse(
  await readFile(path.join(root, "tokens/material-one.tokens.json"), "utf8")
);

const contrastPairs = [
  ["primary", tokens.color.primary.base, tokens.color.primary.on],
  ["primary container", tokens.color.primary.container, tokens.color.primary.onContainer],
  ["secondary", tokens.color.secondary.base, tokens.color.secondary.on],
  ["secondary container", tokens.color.secondary.container, tokens.color.secondary.onContainer],
  ["tertiary", tokens.color.tertiary.base, tokens.color.tertiary.on],
  ["tertiary container", tokens.color.tertiary.container, tokens.color.tertiary.onContainer]
];

for (const [name, background, foreground] of contrastPairs) {
  const ratio = contrast(background, foreground);
  if (ratio < 4.5) {
    fail(`${name} contrast is ${ratio.toFixed(2)}:1; expected at least 4.5:1`);
  }
}

const packageRoot = path.join(root, "packages");
const packageDirectories = (
  await readdir(packageRoot, { withFileTypes: true })
).filter((entry) => entry.isDirectory());

const names = new Set();
for (const entry of packageDirectories) {
  const packageJsonPath = path.join(packageRoot, entry.name, "package.json");
  await access(packageJsonPath);
  const manifest = JSON.parse(await readFile(packageJsonPath, "utf8"));

  if (!manifest.name?.startsWith("@material-one/")) {
    fail(`${entry.name} package name must use the @material-one scope`);
  }
  if (names.has(manifest.name)) fail(`Duplicate package name: ${manifest.name}`);
  names.add(manifest.name);

  if (!manifest.exports?.["."]) {
    fail(`${manifest.name} must expose a root export`);
  }
}

const tokenCss = await readFile(
  path.join(root, "tokens/css/material-one.css"),
  "utf8"
);
const componentsCss = await readFile(
  path.join(root, "packages/components/css/material-one-components.css"),
  "utf8"
);
const controlsCss = await readFile(
  path.join(root, "packages/controls/css/material-one-controls.css"),
  "utf8"
);
const shellCss = await readFile(
  path.join(root, "packages/shell/css/material-one-shell.css"),
  "utf8"
);
const accessibilityCss = await readFile(
  path.join(
    root,
    "packages/accessibility/css/material-one-accessibility.css"
  ),
  "utf8"
);

for (const [name, css] of [
  ["tokens", tokenCss],
  ["components", componentsCss],
  ["controls", controlsCss],
  ["shell", shellCss],
  ["accessibility", accessibilityCss]
]) {
  const opens = (css.match(/{/g) ?? []).length;
  const closes = (css.match(/}/g) ?? []).length;
  if (opens !== closes) fail(`${name} CSS has unbalanced braces`);
}

for (const requiredPattern of [
  "[data-mo-theme=\"dark\"]",
  "prefers-reduced-motion",
  "prefers-contrast"
]) {
  if (!tokenCss.includes(requiredPattern)) {
    fail(`Token CSS is missing required adaptive behavior: ${requiredPattern}`);
  }
}

if (!componentsCss.includes('data-mo-state="focused"')) {
  fail("Component CSS must expose canonical data-mo-state behavior");
}

if (!controlsCss.includes("forced-colors: active")) {
  fail("Control CSS must support forced-colors mode");
}

if (!shellCss.includes("max-width: 599px")) {
  fail("Application shell must include a compact layout breakpoint");
}

for (const requiredPattern of [
  "prefers-reduced-motion",
  "prefers-contrast",
  "forced-colors: active",
  ":focus-visible"
]) {
  if (!accessibilityCss.includes(requiredPattern)) {
    fail(
      `Accessibility CSS is missing required adaptive behavior: ${requiredPattern}`
    );
  }
}

console.log(
  `Material One validation passed: ${packageDirectories.length} packages, ${contrastPairs.length} contrast checks, adaptive CSS verified.`
);
