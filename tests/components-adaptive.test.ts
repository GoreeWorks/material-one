import test from "node:test";
import assert from "node:assert/strict";
import { createMaterialOneContext } from "../packages/core/src/index.ts";
import {
  componentStates,
  createComponentContract,
  resolveComponentDensity
} from "../packages/components/src/index.ts";

const context = createMaterialOneContext(
  {
    theme: "system",
    density: "spacious",
    motion: "reduced",
    experienceMode: "professional",
    accessibility: {
      contrast: "high",
      textScale: 1.25,
      reducedTransparency: false
    }
  },
  {
    width: 390,
    height: 844,
    input: "touch",
    orientation: "portrait"
  }
);

test("components expose the canonical Material One state contract", () => {
  assert.deepEqual(componentStates, [
    "default",
    "hovered",
    "focused",
    "pressed",
    "selected",
    "disabled",
    "loading",
    "success",
    "warning",
    "error"
  ]);
});

test("adaptive component contracts inherit live Material One context", () => {
  const contract = createComponentContract("button", context);

  assert.equal(contract.state, "default");
  assert.equal(contract.context.layout, "compact");
  assert.equal(contract.context.density, "comfortable");
  assert.equal(contract.context.input, "touch");
  assert.equal(contract.context.motion, "reduced");
  assert.equal(contract.context.highContrast, true);
  assert.equal(contract.context.textScale, 1.25);
  assert.equal(contract.context.interactionTarget, 48);
  assert.equal(contract.semanticColorRole, "surface-container");
  assert.equal(contract.typographyRole, "body");
  assert.equal(contract.motionIntent, "feedback");
});

test("component contracts support semantic overrides without changing context", () => {
  const contract = createComponentContract("field", context, {
    state: "error",
    semanticColorRole: "error-container",
    typographyRole: "label",
    motionIntent: "instant"
  });

  assert.equal(contract.state, "error");
  assert.equal(contract.semanticColorRole, "error-container");
  assert.equal(contract.typographyRole, "label");
  assert.equal(contract.motionIntent, "instant");
  assert.equal(contract.context.layout, "compact");
});

test("spacious density collapses only when compact layout requires it", () => {
  assert.equal(resolveComponentDensity("spacious", "compact"), "comfortable");
  assert.equal(resolveComponentDensity("spacious", "workspace"), "spacious");
});
