import test from "node:test";
import assert from "node:assert/strict";
import {
  createColorIntelligencePresentation,
  resolveColorIntelligence
} from "../packages/color-intelligence/src/index.ts";

test("semantic intent stays in the semantic color system", () => {
  const resolution = resolveColorIntelligence({
    kind: "semantic",
    role: "surfaceContainer",
    scheme: "dark"
  });

  assert.equal(resolution.kind, "semantic");
  assert.equal(resolution.source, "semantic-colors");
  assert.equal(resolution.role, "surfaceContainer");
  assert.equal(
    resolution.cssVariable,
    "--mo-sem-surface-container"
  );
  assert.equal(resolution.requiresNonColorCue, false);
});

test("status intent uses semantic status pairs and requires redundancy", () => {
  const resolution = resolveColorIntelligence({
    kind: "status",
    status: "warning",
    scheme: "light"
  });

  assert.equal(resolution.kind, "status");
  assert.equal(resolution.source, "semantic-colors");
  assert.equal(resolution.pair.background, "#8A5200");
  assert.equal(
    resolution.cssVariables.container,
    "--mo-sem-warning-container"
  );
  assert.equal(resolution.requiresNonColorCue, true);
});

test("categorical intent stays out of status semantics", () => {
  const resolution = resolveColorIntelligence({
    kind: "category",
    key: "project:aurora",
    label: "Aurora",
    usage: "workflow",
    cue: "outline"
  });

  assert.equal(resolution.kind, "category");
  assert.equal(resolution.source, "color-coding");
  assert.equal(resolution.usage, "workflow");
  assert.equal(resolution.cue, "outline");
  assert.match(
    resolution.cssVariables.base,
    /^--mo-code-/
  );
  assert.equal(resolution.requiresTextCue, true);
});

test("GoreeWorks priority intent uses the six-level priority vocabulary", () => {
  const horizon = resolveColorIntelligence({
    kind: "priority",
    priority: "horizon"
  });
  const apex = resolveColorIntelligence({
    kind: "priority",
    priority: "apex"
  });

  assert.equal(horizon.kind, "priority");
  assert.equal(horizon.code, "teal");
  assert.equal(apex.code, "rose");
  assert.notEqual(horizon.code, apex.code);
});

test("presentation exposes source, intent, code, and redundancy metadata", () => {
  const presentation = createColorIntelligencePresentation({
    kind: "priority",
    priority: "beacon",
    cue: "bar"
  });

  assert.equal(
    presentation.attributes["data-mo-color-intent"],
    "priority"
  );
  assert.equal(
    presentation.attributes["data-mo-color-source"],
    "color-coding"
  );
  assert.equal(
    presentation.attributes["data-mo-color-label"],
    "Beacon"
  );
  assert.equal(
    presentation.attributes["data-mo-color-redundancy"],
    "required"
  );
  assert.match(
    presentation.style["--mo-intelligent-color"],
    /^var\(--mo-code-/
  );
});
