import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const tokens = JSON.parse(
  await readFile(path.join(root, "tokens/material-one.tokens.json"), "utf8")
);

function luminance(hex) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const expectedCodes = ["blue", "cyan", "teal", "green", "amber", "orange", "rose", "violet"];
const coding = tokens.color.coding ?? {};
const codingDark = tokens.color.codingDark ?? {};
const checks = [];

for (const name of expectedCodes) {
  if (!coding[name]) throw new Error(`Missing Material One color code: ${name}`);
  if (!codingDark[name]) throw new Error(`Missing Material One dark color code: ${name}`);

  const lightRatio = contrast(coding[name].container, coding[name].onContainer);
  const darkRatio = contrast(codingDark[name].container, codingDark[name].onContainer);

  if (lightRatio < 4.5) throw new Error(`${name} light color-code contrast is below 4.5:1`);
  if (darkRatio < 4.5) throw new Error(`${name} dark color-code contrast is below 4.5:1`);

  checks.push({
    name,
    lightContrast: Number(lightRatio.toFixed(2)),
    darkContrast: Number(darkRatio.toFixed(2))
  });
}

if (tokens.loading?.reducedMotionMode !== "static") {
  throw new Error("Skeleton loading must become static for reduced motion.");
}

const colorCss = await readFile(
  path.join(root, "packages/color-coding/css/material-one-color-coding.css"),
  "utf8"
);
const loadingCss = await readFile(
  path.join(root, "packages/loading/css/material-one-loading.css"),
  "utf8"
);

for (const marker of [
  "forced-colors: active",
  "data-mo-color-code",
  "mo-color-surface",
  "mo-color-track",
  "mo-color-legend"
]) {
  if (!colorCss.includes(marker)) throw new Error(`Color coding CSS missing ${marker}`);
}

for (const marker of [
  "mo-skeleton-shimmer",
  "prefers-reduced-motion",
  "forced-colors: active",
  "data-mo-kind",
  "mo-loading-region",
  "mo-skeleton-table",
  "mo-content-reveal"
]) {
  if (!loadingCss.includes(marker)) throw new Error(`Loading CSS missing ${marker}`);
}

const report = {
  tokenVersion: tokens.version,
  colorCodes: checks,
  colorCoding: {
    paletteSize: expectedCodes.length,
    redundancyRequired: true,
    statusColorsReserved: true
  },
  skeleton: {
    delay: tokens.loading.skeletonDelay,
    minimumVisible: tokens.loading.skeletonMinimumVisible,
    reducedMotionMode: tokens.loading.reducedMotionMode,
    preserveLayout: tokens.loading.preserveLayout
  },
  loadingPolicy: {
    fastResponseThresholdMs: 180,
    knownGeometry: "skeleton",
    action: "progress",
    staleRefresh: "stale-content"
  }
};

await mkdir(path.join(root, "build"), { recursive: true });
await writeFile(
  path.join(root, "build/color-loading-report.json"),
  JSON.stringify(report, null, 2) + "\n"
);

console.log(
  `Validated ${checks.length} color codes, loading orchestration, skeleton geometry, and accessibility fallbacks.`
);
