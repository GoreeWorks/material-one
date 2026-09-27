import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  createTokenManifest,
  findMaterialOneTokens,
  flattenMaterialOneTokens,
  inferTokenKind,
  readMaterialOneToken,
  tokenCssVariable,
  validateMaterialOneTokens,
  type MaterialOneTokenDocument
} from "../packages/tokens/src/index.ts";

const document = JSON.parse(
  await readFile(
    new URL(
      "../tokens/material-one.tokens.json",
      import.meta.url
    ),
    "utf8"
  )
) as MaterialOneTokenDocument;

test("canonical token document validates through the typed token system", () => {
  const result = validateMaterialOneTokens(document);

  assert.equal(result.valid, true);
  assert.deepEqual(result.issues, []);
  assert.ok((result.manifest?.totalTokens ?? 0) > 150);
  assert.ok((result.manifest?.groups.color ?? 0) > 80);
});

test("token manifest inventories every required token group", () => {
  const manifest = createTokenManifest(document);

  assert.equal(manifest.name, "Material One Tokens");
  assert.equal(manifest.version, "0.6.0");
  assert.ok(manifest.groups.typography > 20);
  assert.ok(manifest.groups.motion > 20);
  assert.ok(manifest.groups.spacing >= 6);
  assert.ok(manifest.groups.shape >= 6);
  assert.ok(manifest.totalTokens > 150);
});

test("tokens can be read by canonical dotted path without duplicating values", () => {
  assert.equal(
    readMaterialOneToken(document, "spacing.md"),
    "1rem"
  );
  assert.equal(
    readMaterialOneToken(
      document,
      "shape.extraLarge"
    ),
    "32px"
  );
  assert.equal(
    readMaterialOneToken(
      document,
      "interaction.targetTouch"
    ),
    "48px"
  );
});

test("token entries infer useful primitive kinds", () => {
  assert.equal(
    inferTokenKind(
      "color.semantic.light.primary",
      "#4F5FD7"
    ),
    "color"
  );
  assert.equal(
    inferTokenKind("spacing.md", "1rem"),
    "dimension"
  );
  assert.equal(
    inferTokenKind("motion.standard", "280ms"),
    "duration"
  );
  assert.equal(
    inferTokenKind(
      "motion.easingStandard",
      "cubic-bezier(0.2, 0, 0, 1)"
    ),
    "easing"
  );
});

test("canonical token paths expose their CSS variables when one exists", () => {
  assert.equal(
    tokenCssVariable("spacing.md"),
    "--mo-space-md"
  );
  assert.equal(
    tokenCssVariable("shape.extraLarge"),
    "--mo-shape-extra-large"
  );
  assert.equal(
    tokenCssVariable(
      "interaction.targetTouch"
    ),
    "--mo-target-touch"
  );
  assert.equal(
    tokenCssVariable(
      "color.semantic.dark.onSurfaceMuted"
    ),
    "--mo-sem-on-surface-muted"
  );
  assert.equal(
    tokenCssVariable(
      "color.coding.rose.onContainer"
    ),
    "--mo-code-rose-on-container"
  );
});

test("token search spans paths and values", () => {
  const results = findMaterialOneTokens(
    document,
    "target"
  );

  assert.ok(
    results.some(
      (entry) =>
        entry.path ===
        "interaction.targetComfortable"
    )
  );
});

test("flattened registry is deterministic and contains canonical values", () => {
  const entries = flattenMaterialOneTokens(document);
  const paths = entries.map((entry) => entry.path);

  assert.deepEqual(
    paths,
    [...paths].sort((a, b) =>
      a.localeCompare(b)
    )
  );

  assert.ok(
    entries.some(
      (entry) =>
        entry.path ===
          "elevation.level3" &&
        entry.value ===
          "0 12px 32px rgba(20, 20, 30, 0.14)"
    )
  );
});
