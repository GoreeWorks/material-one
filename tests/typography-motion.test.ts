import test from "node:test";
import assert from "node:assert/strict";
import {
  readableLineLength,
  resolveTypographyRole,
  resolveTypographyScale,
  typographyCssVariable,
  typographyRoles,
  typographyStyle
} from "../packages/typography/src/index.ts";
import {
  motionCssVariables,
  motionDuration,
  motionIntents,
  resolveMotionRecipe,
  shouldAnimateMotion
} from "../packages/motion/src/index.ts";

test("typography exposes the complete Material One role scale", () => {
  assert.deepEqual(typographyRoles, [
    "display",
    "largeTitle",
    "sectionHeading",
    "title",
    "body",
    "label",
    "supporting"
  ]);
});

test("display typography adapts to layout while body remains stable", () => {
  const compactDisplay = resolveTypographyRole("display", {
    layout: "compact"
  });
  const workspaceDisplay = resolveTypographyRole("display", {
    layout: "workspace"
  });
  const compactBody = resolveTypographyRole("body", {
    layout: "compact"
  });
  const workspaceBody = resolveTypographyRole("body", {
    layout: "workspace"
  });

  assert.ok(compactDisplay.fontSizeRem < workspaceDisplay.fontSizeRem);
  assert.equal(compactBody.fontSizeRem, workspaceBody.fontSizeRem);
});

test("text scaling is bounded and preserves readable line lengths", () => {
  const largeBody = resolveTypographyRole("body", {
    layout: "expanded",
    textScale: 9
  });

  assert.equal(largeBody.fontSizeRem, 2);
  assert.equal(readableLineLength("body"), 72);
  assert.equal(readableLineLength("display"), 18);
});

test("typography scale and CSS variables are deterministic", () => {
  const scale = resolveTypographyScale({
    layout: "expanded",
    density: "comfortable"
  });

  assert.equal(scale.body.role, "body");
  assert.equal(typographyCssVariable("largeTitle"), "--mo-type-large-title");
  assert.deepEqual(
    typographyStyle("label", { layout: "expanded" }),
    {
      fontSize: "0.875rem",
      lineHeight: "1.3",
      fontWeight: "620",
      letterSpacing: "0.01em",
      maxInlineSize: "42ch"
    }
  );
});

test("motion exposes semantic intents rather than arbitrary durations", () => {
  assert.deepEqual(motionIntents, [
    "instant",
    "feedback",
    "enter",
    "exit",
    "navigation",
    "transform",
    "emphasis",
    "loading"
  ]);

  assert.equal(motionDuration("navigation"), 280);
  assert.equal(motionDuration("transform"), 460);
});

test("reduced motion removes decorative spatial motion", () => {
  const navigation = resolveMotionRecipe("navigation", "reduced");
  const emphasis = resolveMotionRecipe("emphasis", "reduced");

  assert.equal(navigation.durationMs, 0);
  assert.equal(navigation.translatePx, 0);
  assert.equal(navigation.scaleFrom, 1);
  assert.equal(emphasis.durationMs, 0);
  assert.equal(shouldAnimateMotion("navigation", "reduced"), false);
});

test("reduced motion preserves short essential feedback", () => {
  const feedback = resolveMotionRecipe("feedback", "reduced");

  assert.ok(feedback.durationMs > 0);
  assert.ok(feedback.durationMs <= 100);
  assert.equal(feedback.translatePx, 0);
  assert.equal(feedback.scaleFrom, 1);
});

test("none motion preference removes every animation", () => {
  for (const intent of motionIntents) {
    assert.equal(motionDuration(intent, "none"), 0);
    assert.equal(shouldAnimateMotion(intent, "none"), false);
  }
});

test("motion recipes serialize to implementation variables", () => {
  assert.deepEqual(motionCssVariables("enter"), {
    "--mo-motion-duration": "220ms",
    "--mo-motion-easing": "cubic-bezier(0.2, 0, 0, 1)",
    "--mo-motion-translate": "8px",
    "--mo-motion-scale-from": "0.99",
    "--mo-motion-opacity-from": "0"
  });
});
