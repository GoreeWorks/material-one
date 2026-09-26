import test from "node:test";
import assert from "node:assert/strict";
import {
  colorCodeForKey,
  colorCodeRequiresRedundancy,
  colorCodeNames,
  createColorCodeRegistry,
  priorityColorCode
} from "../packages/color-coding/src/index.ts";
import {
  createSkeletonBlueprint,
  createSkeletonRecipe,
  loadingRegionAria,
  minimumSkeletonHideAt,
  resolveLoadingPresentation,
  shouldShowSkeleton
} from "../packages/loading/src/index.ts";

test("color coding is deterministic", () => {
  assert.equal(colorCodeForKey("customer:alpha"), colorCodeForKey("customer:alpha"));
  assert.ok(colorCodeNames.includes(colorCodeForKey("customer:alpha")));
});

test("color coding requires redundant cues", () => {
  assert.equal(colorCodeRequiresRedundancy(), true);
});

test("color registry spreads the first palette-sized category set", () => {
  const entries = Array.from({ length: colorCodeNames.length }, (_, index) => ({
    key: `category-${index}`,
    label: `Category ${index}`
  }));
  const registry = createColorCodeRegistry(entries);
  assert.equal(new Set(registry.map(({ code }) => code)).size, colorCodeNames.length);
  assert.ok(registry.every(({ requiresNonColorCue }) => requiresNonColorCue));
});

test("priority uses categorical color without consuming status semantics", () => {
  assert.equal(priorityColorCode("low"), "teal");
  assert.equal(priorityColorCode("normal"), "blue");
  assert.equal(priorityColorCode("high"), "amber");
  assert.equal(priorityColorCode("urgent"), "rose");
});

test("skeleton loading uses a flash-prevention delay", () => {
  const recipe = createSkeletonRecipe("card");
  assert.equal(recipe.delayMs, 180);
  assert.equal(recipe.minimumVisibleMs, 300);
  assert.equal(recipe.preserveLayout, true);
  assert.equal(shouldShowSkeleton(120, recipe), false);
  assert.equal(shouldShowSkeleton(180, recipe), true);
  assert.equal(minimumSkeletonHideAt(200, recipe), 500);
});

test("reduced motion produces a static skeleton", () => {
  const recipe = createSkeletonRecipe("table-row", true);
  assert.equal(recipe.motion, "static");
});

test("loading presentation chooses the least disruptive treatment", () => {
  assert.equal(
    resolveLoadingPresentation({
      expectedLatencyMs: 90,
      geometryKnown: true,
      intent: "content"
    }),
    "none"
  );
  assert.equal(
    resolveLoadingPresentation({
      expectedLatencyMs: 600,
      geometryKnown: true,
      intent: "content"
    }),
    "skeleton"
  );
  assert.equal(
    resolveLoadingPresentation({
      expectedLatencyMs: 600,
      geometryKnown: false,
      intent: "action"
    }),
    "progress"
  );
  assert.equal(
    resolveLoadingPresentation({
      expectedLatencyMs: 600,
      geometryKnown: true,
      intent: "refresh",
      staleContentAvailable: true
    }),
    "stale"
  );
});

test("skeleton blueprints preserve different content geometries", () => {
  const compactTable = createSkeletonBlueprint("table", "compact");
  const spaciousList = createSkeletonBlueprint("list", "spacious");
  assert.equal(compactTable.rows, 6);
  assert.equal(compactTable.linesPerRow, 3);
  assert.equal(spaciousList.rows, 3);
  assert.equal(spaciousList.hasAvatar, true);
});

test("loading regions expose busy state without exposing skeleton shapes", () => {
  assert.deepEqual(loadingRegionAria(true), {
    "aria-busy": "true",
    "aria-live": "polite"
  });
  assert.deepEqual(loadingRegionAria(false), {
    "aria-busy": "false",
    "aria-live": "polite"
  });
});
