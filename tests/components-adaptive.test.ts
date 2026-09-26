import test from "node:test";
import assert from "node:assert/strict";
import {
  componentStates,
  createComponentContract,
  resolveComponentDensity
} from "../packages/components/src/index.ts";

test("components expose the shared Material One state contract", () => {
  assert.deepEqual(componentStates, [
    "default",
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

test("components inherit semantic foundations", () => {
  const contract = createComponentContract("button");

  assert.equal(contract.semanticColorRole, "surface-container");
  assert.equal(contract.typographyRole, "body");
  assert.equal(contract.motionIntent, "feedback");
});

test("density adapts to compact layouts", () => {
  assert.equal(resolveComponentDensity("expanded", "compact"), "comfortable");
  assert.equal(resolveComponentDensity("expanded", "workspace"), "expanded");
});
