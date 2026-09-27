import test from "node:test";
import assert from "node:assert/strict";
import {
  createMaterialOneContext
} from "../packages/core/src/index.ts";
import {
  createAccessibilityPolicy
} from "../packages/accessibility/src/index.ts";
import {
  clampTypographyTextScale,
  createTypographyPolicy,
  createTypographyPresentation,
  resolveAdaptiveTypographyRole,
  typographyTextScaleRange
} from "../packages/typography/src/index.ts";

function context(
  options: {
    width?: number;
    layoutPreference?:
      | "automatic"
      | "compact"
      | "expanded"
      | "workspace";
    density?:
      | "compact"
      | "comfortable"
      | "spacious";
    textScale?: number;
  } = {}
) {
  return createMaterialOneContext(
    {
      theme: "system",
      density:
        options.density ??
        "comfortable",
      motion: "full",
      experienceMode:
        "professional",
      layoutPreference:
        options.layoutPreference ??
        "automatic",
      accessibility: {
        contrast: "standard",
        textScale:
          options.textScale ??
          1,
        reducedTransparency:
          false
      }
    },
    {
      width:
        options.width ?? 900,
      height: 900,
      input: "mixed",
      orientation: "landscape"
    }
  );
}

test("typography text-scale range matches Accessibility effective range", () => {
  assert.deepEqual(
    typographyTextScaleRange,
    {
      minimum: 0.8,
      maximum: 2
    }
  );
  assert.equal(
    clampTypographyTextScale(
      0.4
    ),
    0.8
  );
  assert.equal(
    clampTypographyTextScale(
      3
    ),
    2
  );
});

test("typography policy distinguishes requested and effective text scale", () => {
  const ctx = context({
    textScale: 0.4
  });
  const accessibility =
    createAccessibilityPolicy(ctx);
  const policy =
    createTypographyPolicy(
      ctx,
      accessibility
    );

  assert.equal(
    policy.requestedTextScale,
    0.4
  );
  assert.equal(
    policy.effectiveTextScale,
    0.8
  );
  assert.equal(
    policy.constrainedByAccessibility,
    true
  );
});

test("adaptive typography uses Accessibility effective text scale", () => {
  const ctx = context({
    textScale: 0.4
  });
  const accessibility =
    createAccessibilityPolicy(ctx);
  const body =
    resolveAdaptiveTypographyRole(
      ctx,
      accessibility,
      "body"
    );

  assert.equal(
    body.fontSizeRem,
    0.8
  );
  assert.equal(
    body.maxLineLengthCh,
    72
  );
});

test("explicit Material One layout preference controls adaptive typography independently of viewport width", () => {
  const compact = context({
    width: 390,
    layoutPreference: "compact"
  });
  const workspace = context({
    width: 390,
    layoutPreference: "workspace"
  });
  const compactA11y =
    createAccessibilityPolicy(
      compact
    );
  const workspaceA11y =
    createAccessibilityPolicy(
      workspace
    );

  const compactDisplay =
    resolveAdaptiveTypographyRole(
      compact,
      compactA11y,
      "display"
    );
  const workspaceDisplay =
    resolveAdaptiveTypographyRole(
      workspace,
      workspaceA11y,
      "display"
    );

  assert.ok(
    workspaceDisplay.fontSizeRem >
      compactDisplay.fontSizeRem
  );
});

test("adaptive typography presentation emits portable policy and implementation values", () => {
  const ctx = context({
    density: "spacious",
    textScale: 1.25
  });
  const accessibility =
    createAccessibilityPolicy(ctx);
  const presentation =
    createTypographyPresentation(
      ctx,
      accessibility,
      "sectionHeading"
    );

  assert.equal(
    presentation.attributes[
      "data-mo-type-role"
    ],
    "sectionHeading"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-density"
    ],
    "spacious"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-text-scale"
    ],
    "1.25"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-text-scale-constrained"
    ],
    "false"
  );
  assert.match(
    presentation.style[
      "--mo-type-effective-size"
    ],
    /rem$/
  );
  assert.equal(
    presentation.style[
      "--mo-type-effective-max-line"
    ],
    "34ch"
  );
});
