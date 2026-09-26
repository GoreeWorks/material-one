import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const packageRoot = path.join(root, "packages");
const outputRoot = path.join(root, "build");

const packageDirectories = (
  await readdir(packageRoot, { withFileTypes: true })
)
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const packages = [];
for (const directory of packageDirectories) {
  const manifest = JSON.parse(
    await readFile(path.join(packageRoot, directory, "package.json"), "utf8")
  );
  packages.push({
    directory,
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    exports: manifest.exports
  });
}

const tokens = JSON.parse(
  await readFile(path.join(root, "tokens/material-one.tokens.json"), "utf8")
);

const manifest = {
  name: "Material One",
  generatedAt: new Date().toISOString(),
  tokenVersion: tokens.version,
  packages,
  capabilities: [
    "adaptive-context",
    "semantic-tokens",
    "components",
    "application-shell",
    "themes",
    "icons",
    "controls",
    "color-coding",
    "skeleton-loading",
    "accessibility"
  ]
};

await mkdir(outputRoot, { recursive: true });
await writeFile(
  path.join(outputRoot, "material-one-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);

console.log(
  `Generated Material One manifest with ${packages.length} packages at build/material-one-manifest.json`
);
