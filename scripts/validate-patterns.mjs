import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const runtime = await readFile(
  path.join(
    root,
    "packages/patterns/src/index.ts"
  ),
  "utf8"
);
const styles = await readFile(
  path.join(
    root,
    "packages/patterns/css/material-one-patterns.css"
  ),
  "utf8"
);
const layouts = await readFile(
  path.join(
    root,
    "packages/patterns/css/layouts.css"
  ),
  "utf8"
);
const page = await readFile(
  path.join(
    root,
    "packages/patterns/css/page.css"
  ),
  "utf8"
);
const catalog = await readFile(
  path.join(
    root,
    "packages/patterns/css/catalog.css"
  ),
  "utf8"
);
const docs = await readFile(
  path.join(
    root,
    "docs/product-pattern-system.md"
  ),
  "utf8"
);

for (const marker of [
  "ProductPatternKind",
  "createPagePattern",
  "createGridPattern",
  "createMasterDetailPattern",
  "createSettingsPattern",
  "createCatalogPattern",
  "createProductPatternPresentation"
]) {
  if (!runtime.includes(marker)) {
    throw new Error(
      `Pattern runtime missing ${marker}`
    );
  }
}

for (const marker of [
  "./page.css",
  "./layouts.css",
  "./catalog.css",
  "./responsive.css"
]) {
  if (!styles.includes(marker)) {
    throw new Error(
      `Pattern stylesheet missing ${marker}`
    );
  }
}

for (const marker of [
  "data-mo-pattern-presentation",
  "--mo-pattern-master-width",
  "--mo-pattern-settings-nav-width"
]) {
  if (!layouts.includes(marker)) {
    throw new Error(
      `Pattern layout CSS missing ${marker}`
    );
  }
}

for (const marker of [
  "data-mo-pattern-presentation",
  "--mo-pattern-page-max"
]) {
  if (!page.includes(marker)) {
    throw new Error(
      `Page pattern CSS missing ${marker}`
    );
  }
}

for (const marker of [
  "data-mo-pattern-presentation",
  "data-mo-filter-presentation",
  "--mo-pattern-card-min"
]) {
  if (!catalog.includes(marker)) {
    throw new Error(
      `Catalog pattern CSS missing ${marker}`
    );
  }
}

for (const marker of [
  "Contract boundary",
  "Page pattern",
  "Grid pattern",
  "Master/detail pattern",
  "Settings pattern",
  "Catalog pattern",
  "Framework-portable presentation"
]) {
  if (!docs.includes(marker)) {
    throw new Error(
      `Pattern documentation missing ${marker}`
    );
  }
}

console.log(
  "Validated Material One typed product pattern contracts, CSS presentation hooks, and documentation."
);
