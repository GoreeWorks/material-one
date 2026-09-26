import test from "node:test";
import assert from "node:assert/strict";
import {
  colorCodeForKey,
  colorCodeRequiresRedundancy,
  colorCodeNames
} from "../packages/color-coding/src/index.ts";
import {
  createSkeletonRecipe,
  shouldShowSkeleton
} from "../packages/loading/src/index.ts";

test("color coding is deterministic", () => {
  assert.equal(colorCodeForKey("customer:alpha"), colorCodeForKey("customer:alpha"));
  assert.ok(colorCodeNames.includes(colorCodeForKey("customer:alpha")));
});

test("color coding requires redundant cues", () => {
  assert.equal(colorCodeRequiresRedundancy(), true);
});

test("skeleton loading uses a flash-prevention delay", () => {
  const recipe = createSkeletonRecipe("card");
  assert.equal(recipe.delayMs, 180);
  assert.equal(recipe.minimumVisibleMs, 300);
  assert.equal(shouldShowSkeleton(120, recipe), false);
  assert.equal(shouldShowSkeleton(180, recipe), true);
});

test("reduced motion produces a static skeleton", () => {
  const recipe = createSkeletonRecipe("table-row", true);
  assert.equal(recipe.motion, "static");
});
