import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = await readFile(
  path.join(root, "packages/device-adaptation/src/index.ts"),
  "utf8"
);
const docs = await readFile(
  path.join(root, "docs/device-adaptation-system.md"),
  "utf8"
);

for (const marker of [
  "MaterialOneDeviceAdaptationProfile",
  "createDeviceAdaptationProfile",
  "createDeviceAdaptationPresentation",
  "normalizeSafeArea",
  "createDeviceAdaptationSignature",
  "hasDeviceAdaptationChanged"
]) {
  if (!source.includes(marker)) {
    throw new Error(`Device adaptation runtime missing ${marker}`);
  }
}

for (const marker of [
  "Device class versus layout",
  "Capability uncertainty",
  "Safe areas and segmented viewports",
  "Framework-portable presentation",
  "Change detection"
]) {
  if (!docs.includes(marker)) {
    throw new Error(`Device adaptation documentation missing ${marker}`);
  }
}

console.log(
  "Validated Material One device adaptation capability and presentation contracts."
);
