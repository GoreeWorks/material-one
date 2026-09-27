import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const source = await readFile(
  path.join(root, "packages/shell/src/index.ts"),
  "utf8"
);
const css = await readFile(
  path.join(root, "packages/shell/css/material-one-shell.css"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/application-shell-system.md"),
  "utf8"
);

for (const marker of [
  "ApplicationShellPresentation",
  "OverlayPresentation",
  "createApplicationShellPresentation",
  "createOverlayPresentation",
  "resolveApplicationShell",
  "resolveOverlay"
]) {
  if (!source.includes(marker)) {
    throw new Error(
      `Application shell runtime missing ${marker}`
    );
  }
}

for (const marker of [
  'data-mo-shell-navigation="sidebar"',
  'data-mo-shell-navigation="rail"',
  'data-mo-shell-navigation="bottom"',
  'data-mo-shell-context="none"',
  'data-mo-overlay-presentation="sheet"',
  'data-mo-overlay-presentation="fullscreen"',
  "--mo-overlay-max-width"
]) {
  if (!css.includes(marker)) {
    throw new Error(
      `Application shell CSS missing ${marker}`
    );
  }
}

const opens = (css.match(/{/g) ?? []).length;
const closes = (css.match(/}/g) ?? []).length;
if (opens !== closes) {
  throw new Error(
    "Application shell CSS has unbalanced braces"
  );
}

for (const marker of [
  "Contract boundary",
  "Shell navigation",
  "Context pane",
  "Command surface",
  "Shell presentation",
  "Overlay model",
  "Overlay presentation",
  "CSS integration"
]) {
  if (!docs.includes(marker)) {
    throw new Error(
      `Application shell documentation missing ${marker}`
    );
  }
}

console.log(
  "Validated Material One application-shell navigation, context, command, overlay, presentation, CSS, and documentation contracts."
);
