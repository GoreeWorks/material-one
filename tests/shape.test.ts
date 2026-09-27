import test from "node:test";
import assert from "node:assert/strict";
import {
  createMaterialOneContext
} from "../packages/core/src/index.ts";
import {
  createShapePolicy,
  createShapePresentation,
  resolveShapeStyle,
  resolveShapeToken,
  shapeCssVariable,
  shapeRoleCssVariable,
  shapeRoles,
  shapeTokens
} from "../packages/shape/src/index.ts";

const desktop = {
  width: 1440,
  height: 900,
  input: "mouse" as const,
  orientation: "landscape" as const
};

function context(
  experienceMode:
    | "minimal"
    | "expressive"
    | "professional"
    | "creative"
    | "focused"
    | "accessibility",
  width = 1440
) {
  return createMaterialOneContext(
    {
      theme: "system",
      density: "comfortable",
      motion: "full",
      experienceMode
    },
    { ...desktop, width }
  );
}

test("shape framework exposes the canonical token and semantic role vocabularies", () => {
  assert.deepEqual(shapeTokens, [
    "extra-small",
    "small",
    "medium",
    "large",
    "extra-large",
    "pill"
  ]);
  assert.deepEqual(shapeRoles, [
    "control",
    "field",
    "surface",
    "card",
    "navigation",
    "floating",
    "iconButton",
    "chip"
  ]);
});

test("experience modes resolve to stable shape styles", () => {
  assert.equal(resolveShapeStyle("minimal"), "minimal");
  assert.equal(resolveShapeStyle("expressive"), "expressive");
  assert.equal(resolveShapeStyle("creative"), "expressive");
  assert.equal(resolveShapeStyle("professional"), "balanced");
  assert.equal(resolveShapeStyle("focused"), "balanced");
  assert.equal(resolveShapeStyle("accessibility"), "balanced");
});

test("semantic shape roles adapt without changing raw token meaning", () => {
  assert.equal(
    resolveShapeToken("card", context("minimal")),
    "small"
  );
  assert.equal(
    resolveShapeToken("card", context("professional")),
    "large"
  );
  assert.equal(
    resolveShapeToken("card", context("expressive")),
    "extra-large"
  );
  assert.equal(
    resolveShapeToken("iconButton", context("minimal")),
    "pill"
  );
});

test("compact layout strengthens navigation enclosure independently of experience style", () => {
  const minimal = createShapePolicy(context("minimal", 390));
  const balanced = createShapePolicy(
    context("professional", 390)
  );
  const expressive = createShapePolicy(
    context("expressive", 390)
  );

  assert.equal(minimal.roles.navigation, "large");
  assert.equal(balanced.roles.navigation, "large");
  assert.equal(expressive.roles.navigation, "extra-large");
});

test("shape helpers expose canonical CSS variable names", () => {
  assert.equal(
    shapeCssVariable("extra-large"),
    "--mo-shape-extra-large"
  );
  assert.equal(
    shapeRoleCssVariable("iconButton"),
    "--mo-shape-icon-button"
  );
  assert.equal(
    shapeRoleCssVariable("surface"),
    "--mo-shape-surface"
  );
});

test("shape presentation emits portable style metadata and semantic aliases", () => {
  const presentation = createShapePresentation(
    context("expressive")
  );

  assert.equal(
    presentation.attributes["data-mo-shape-style"],
    "expressive"
  );
  assert.equal(
    presentation.style["--mo-shape-card"],
    "var(--mo-shape-extra-large)"
  );
  assert.equal(
    presentation.style["--mo-shape-control"],
    "var(--mo-shape-medium)"
  );
  assert.equal(
    presentation.style["--mo-shape-chip"],
    "var(--mo-shape-pill)"
  );
});
