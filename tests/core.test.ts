import test from "node:test";
import assert from "node:assert/strict";
import {
  createMaterialOneContext,
  resolveInteractionTarget,
  resolveLayout
} from "../packages/core/src/index.ts";

const desktop = {
  width: 1440,
  height: 900,
  input: "mouse" as const,
  orientation: "landscape" as const
};

const preferences = {
  theme: "system" as const,
  density: "comfortable" as const,
  motion: "full" as const,
  experienceMode: "professional" as const
};

test("layout resolves compact, expanded, and workspace", () => {
  assert.equal(resolveLayout({ ...desktop, width: 390 }), "compact");
  assert.equal(resolveLayout({ ...desktop, width: 900 }), "expanded");
  assert.equal(resolveLayout(desktop), "workspace");
});

test("explicit layout preference overrides width", () => {
  assert.equal(
    resolveLayout(desktop, { ...preferences, layoutPreference: "compact" }),
    "compact"
  );
});

test("interaction target adapts to touch and accessibility mode", () => {
  assert.equal(resolveInteractionTarget(preferences, desktop), 44);
  assert.equal(
    resolveInteractionTarget(preferences, { ...desktop, input: "touch" }),
    48
  );
  assert.equal(
    resolveInteractionTarget(
      { ...preferences, experienceMode: "accessibility" },
      desktop
    ),
    48
  );
});

test("context normalizes accessibility defaults", () => {
  const context = createMaterialOneContext(preferences, desktop);
  assert.equal(context.layout, "workspace");
  assert.equal(context.preferences.accessibility.textScale, 1);
  assert.equal(context.interactionTarget, 44);
});
