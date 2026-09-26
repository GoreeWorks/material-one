import test from "node:test";
import assert from "node:assert/strict";
import { resolveAdaptiveDecision } from "../packages/core/src/adaptive.ts";

test("adaptive runtime expands touch targets", () => {
  const decision = resolveAdaptiveDecision({
    width: 390,
    height: 844,
    input: "touch"
  });

  assert.equal(decision.interactionTarget, 48);
  assert.equal(decision.density, "spacious");
});

test("adaptive runtime respects reduced motion", () => {
  const decision = resolveAdaptiveDecision({
    width: 1440,
    height: 900,
    input: "mouse",
    reducedMotion: true
  });

  assert.equal(decision.motion, "reduced");
});
